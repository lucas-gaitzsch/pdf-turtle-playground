import { getBaseRenderData, RenderTemplateDataViewModel } from "@/models/render-data-base"
import { RequestError } from "@/models/request-error"
import { RenderHtmlBundleService } from "@/swagger-client"
import { createDebounce } from "@/utils/debounce"
import { AxiosError, CanceledError } from "axios"
import { reactive, ref, watch, computed } from "vue"
import { packBundle } from "./bundle-handling"

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

  let abortController = new AbortController()

  const requestPdf = async () => {
    abortController.abort()
    abortController = new AbortController()

    try {
      loadingCounter.value++
      errMsg.value = null

      const zipBlob = await packBundle(renderTemplateData)

      const startTime = new Date().getTime()

      const res = await RenderHtmlBundleService.render(
        {
          bundle: zipBlob,
          model: renderTemplateData.modelStr,
          templateEngine: renderTemplateData.templateEngine,
        },
        {
          loading: false,
          responseType: "blob",
          signal: abortController.signal,
          baseURL: settings.serverUrl || undefined,
          headers: !settings.secret ? undefined : { Authorization: `Bearer ${settings.secret}` },
        }
      )

      requestTimeInMs.value = new Date().getTime() - startTime

      pdfResponseDataUrl.value = URL.createObjectURL(res)
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
    pdfResponseDataUrl,
    requestPdf,
  }
}
