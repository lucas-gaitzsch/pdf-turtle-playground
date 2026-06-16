import { getBaseRenderData, RenderTemplateDataViewModel } from "@/models/render-data-base"
import { RequestError } from "@/models/request-error"
import { postApiPdfFromHtmlBundleRender } from "@/swagger-client"
import { createDebounce } from "@/utils/debounce"
import { AxiosError, CanceledError } from "axios"
import { reactive, ref, watch, computed } from "vue"
import { packBundle } from "./bundle-handling"

export interface RenderLogEntry {
  source: string
  level: string
  text: string
  timestamp?: string
  url?: string
  line?: number
  column?: number
}

const renderLogHeaderName = "x-pdf-turtle-render-log"
const renderLogTruncatedHeaderName = "x-pdf-turtle-render-log-truncated"

export function usePdfRendering() {
  const renderTemplateData = reactive<RenderTemplateDataViewModel>(getBaseRenderData())

  const settings = reactive({
    serverUrl: "",
    secret: "",
  })

  const settingsLocalStorageKey = "settings"

  // save and load settings from local storage
  watch(settings, () => localStorage.setItem(settingsLocalStorageKey, JSON.stringify(settings)))
  Object.assign(settings, JSON.parse(localStorage.getItem(settingsLocalStorageKey) ?? "{}"))

  const loadingCounter = ref(0)
  const isLoading = computed(() => loadingCounter.value > 0)

  const hasError = computed(() => errMsg.value !== null)
  const errMsg = ref<RequestError | null>(null)

  const pdfResponseDataUrl = ref("")

  const requestTimeInMs = ref(0)
  const renderLog = ref<RenderLogEntry[]>([])
  const renderLogTruncated = ref(false)

  let abortController = new AbortController()

  const requestPdf = async () => {
    abortController.abort()
    abortController = new AbortController()

    try {
      loadingCounter.value++
      errMsg.value = null
      renderLog.value = []
      renderLogTruncated.value = false

      const zipBlob = await packBundle({
        ...renderTemplateData,
        options: {
          ...renderTemplateData.options,
          includeRenderLog: true,
        },
      })

      const startTime = new Date().getTime()

      const res = await postApiPdfFromHtmlBundleRender({
        body: {
          bundle: zipBlob,
          model: renderTemplateData.modelStr,
          templateEngine: renderTemplateData.templateEngine,
        },
        throwOnError: true,
        signal: abortController.signal,
        ...(settings.serverUrl ? { baseURL: settings.serverUrl } : {}),
        ...(settings.secret ? { headers: { Authorization: `Bearer ${settings.secret}` } } : {}),
      })

      requestTimeInMs.value = new Date().getTime() - startTime
      renderLog.value = parseRenderLogHeader(getHeader(res.headers, renderLogHeaderName))
      renderLogTruncated.value = getHeader(res.headers, renderLogTruncatedHeaderName) === "true"

      pdfResponseDataUrl.value = URL.createObjectURL(res.data)
    } catch (e) {
      if (e instanceof CanceledError) {
        console.log("request was canceled")
      } else {
        if (e instanceof AxiosError) {
          try {
            const responseText: string = await e.response?.data.text()
            errMsg.value = JSON.parse(responseText) as RequestError
          } catch {
            errMsg.value = { msg: e.message, err: " - ", requestId: " - " }
          }
        } else {
          errMsg.value = { msg: e as string, err: " - ", requestId: " - " }
        }
        console.warn("request err", e)
      }
    } finally {
      loadingCounter.value--
    }
  }

  // initial rendering and watch
  const debounce = createDebounce()
  watch(renderTemplateData, () => debounce(() => requestPdf(), 1000))
  watch(settings, () => debounce(() => requestPdf(), 1000))

  return {
    renderTemplateData,
    settings,
    loadingCounter,
    isLoading,
    hasError,
    errMsg,
    requestTimeInMs,
    renderLog,
    renderLogTruncated,
    pdfResponseDataUrl,
    requestPdf,
  }
}

function getHeader(headers: unknown, name: string): string | undefined {
  if (!headers) {
    return undefined
  }

  const headersWithGetter = headers as { get?: unknown }
  if (typeof headersWithGetter.get === "function") {
    const value = headersWithGetter.get(name)
    return typeof value === "string" ? value : undefined
  }

  const value = (headers as Record<string, unknown>)[name]
  return typeof value === "string" ? value : undefined
}

function parseRenderLogHeader(encodedHeader?: string): RenderLogEntry[] {
  if (!encodedHeader) {
    return []
  }

  try {
    const bytes = Uint8Array.from(atob(encodedHeader), (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as RenderLogEntry[]
  } catch (e) {
    console.warn("cant parse render log header", e)
    return []
  }
}
