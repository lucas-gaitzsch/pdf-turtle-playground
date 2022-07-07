<template>
  <div class="layout-wrapper">
    <q-card flat bordered class="options-container">
      <q-card-section class="row">
        <q-select
          v-model="renderTemplateData.options!.pageFormat"
          :options="pageSizes"
          label="Page size"
          dense
          outlined
          style="min-width: 120px"
        />
        <q-select
          v-model="renderTemplateData.templateEngine"
          :options="templateEngines"
          label="Template engine"
          dense
          outlined
          style="min-width: 120px"
        />

        <q-btn label="Margins" flat>
          <q-menu>
            <margins v-model="marginsProxy" />
          </q-menu>
        </q-btn>

        <q-toggle v-model="renderTemplateData.options!.landscape" label="Landscape" />
      </q-card-section>

      <q-card-section v-if="requestTimeInMs" class="runtime-container">
        <span>{{ requestTimeInMs }} ms</span>

        <q-btn :icon="mdiCogOutline" round flat>
          <q-menu class="q-pa-md">
            <q-input v-model="serverUrl" label="Custom server url" placeholder="https://pdfturtle.gaitzsch.dev" />
            <q-input v-model="secret" label="Secret" placeholder="3539bf53858d4e1e37616b" />
          </q-menu>
        </q-btn>
      </q-card-section>
    </q-card>

    <div class="code-container template">
      <html-editor v-model="renderTemplateData.htmlTemplate" class="editor" :no-handlebars="true" />
    </div>
    <div class="code-container model">
      <json-editor v-model="renderTemplateData.modelStr" class="editor" />
    </div>

    <div class="pdf-container">
      <div v-if="isLoading || hasError" class="loading-wrapper">
        <q-circular-progress v-if="isLoading" indeterminate size="xl" />
        <div v-else-if="hasError" style="text-align: center">
          <q-icon :name="mdiTurtle" size="xl" />
          <h4 style="margin-top: 20px">
            Error :'[
          </h4>
          <div>{{ errMsg?.msg }}</div>
          <div>{{ errMsg?.err }}</div>
          <div>{{ errMsg?.requestId }}</div>
        </div>
      </div>

      <object v-if="pdfDataUrl" type="application/pdf" :data="pdfDataUrl" class="pdf-viewer">
        <div class="ma-8" style="box-sizing: border-box">
          <p class="pb-4">Your browser do not support embedded pdf visualization.</p>

          <q-btn :href="pdfDataUrl" target="_blank" size="lg" :icon="mdiOpenInNew">Open external</q-btn>
        </div>
      </object>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue"
import {
  EnumRenderOptionsPageFormat,
  EnumRenderTemplateDataTemplateEngine,
  RenderHtmlTemplateService,
  RenderTemplateData,
} from "@/swagger-client"
import HtmlEditor from "@/components/base-editors/HtmlEditor.vue"
import JsonEditor from "@/components/base-editors/JsonEditor.vue"
import Margins from "@/components/option-inputs/Margins.vue"
import { RequestError } from "@/models/request-error"

import { AxiosError, CanceledError } from "axios"
import { model, template } from "@/assets/prefill"

import { mdiTurtle, mdiOpenInNew, mdiCogOutline } from "@quasar/extras/mdi-v6"

const renderTemplateData = reactive<RenderTemplateData & { modelStr: string }>({
  templateEngine: EnumRenderTemplateDataTemplateEngine.golang,
  htmlTemplate: template,
  modelStr: JSON.stringify(model, null, 2),
  options: {
    landscape: false,
    pageFormat: EnumRenderOptionsPageFormat.A4,
    margins: {
      top: 25,
      right: 25,
      bottom: 20,
      left: 25,
    },
  },
})

const marginsProxy = computed(() => renderTemplateData.options?.margins ?? {})

const pageSizes = Object.values(EnumRenderOptionsPageFormat)
const templateEngines = Object.values(EnumRenderTemplateDataTemplateEngine)

const serverUrl = ref("")
const secret = ref("")

const pdfDataUrl = ref("")

const isLoading = ref(0)
const hasError = computed(() => errMsg.value !== null)
const errMsg = ref<RequestError | null>(null)

const requestTimeInMs = ref(0)

let abortController = new AbortController()

const requestPdf = async () => {
  abortController.abort()
  abortController = new AbortController()

  try {
    isLoading.value++
    errMsg.value = null

    const d: RenderTemplateData = {
      ...renderTemplateData,
      model: JSON.parse(renderTemplateData.modelStr || "null"),
    }

    const startTime = new Date().getTime()

    const res = await RenderHtmlTemplateService.render(
      { renderTemplateData: d },
      {
        responseType: "blob",
        signal: abortController.signal,
        baseURL: serverUrl.value || undefined,
        headers: secret.value === "" ? undefined : { Authorization: `Bearer ${secret.value}` },
      }
    )

    requestTimeInMs.value = new Date().getTime() - startTime

    pdfDataUrl.value = URL.createObjectURL(res)
  } catch (e) {
    if (e instanceof CanceledError) {
      console.log("request was canceled")
    } else {
      if (e instanceof AxiosError) {
        const responseText: string = await e.response?.data.text()
        errMsg.value = JSON.parse(responseText) as RequestError
      }
      console.warn("request err", e)
      errMsg.value = { msg: <string>e, err: " - ", requestId: " - " }
    }
  } finally {
    isLoading.value--
  }
}

const createDebounce = () => {
  let timeout: number | null = null
  return (func: () => unknown, delayMs: number | null = null) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func()
    }, delayMs || 500)
  }
}

// initial rendering and watch
requestPdf()
const debounce = createDebounce()
watch(renderTemplateData, () => debounce(() => requestPdf(), 1000))
</script>

<style lang="scss">
.layout-wrapper {
  min-height: inherit;
  height: 100%;
  background-color: #a1a1a147;

  display: grid;
  grid-template-columns: 10fr 8fr;
  // grid-auto-rows: minmax(100px, auto);
  grid-template-rows: min-content 4fr 3fr;

  grid-template-areas:
    "options  pdf"
    "template pdf"
    "model    pdf";

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  // @media only screen and (max-width: 1000px) {
  //   // height: auto;
  //   grid-template-columns: 1fr;
  //   grid-template-rows: min-content 400px 300px 500px;
  //   grid-template-areas:
  //     "options"
  //     "template"
  //     "model"
  //     "pdf";
  // }

  gap: 4px;

  .options-container {
    grid-area: options;

    display: flex;

    margin-left: 2px;
    margin-top: 2px;

    * {
      gap: 4px;
    }

    .runtime-container {
      display: flex;
      margin-left: auto;
      align-items: center;

      span {
        text-align: right;
      }
    }
  }

  .code-container {
    &.template {
      grid-area: template;
    }
    &.model {
      grid-area: model;
    }
  }

  .pdf-container {
    grid-area: pdf;
    position: relative;

    > * {
      position: absolute;
      height: 100%;
      width: 100%;

      &.loading-wrapper {
        z-index: 2;
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #878787b2;
        backdrop-filter: blur(4px);
      }

      &.pdf-viewer {
        z-index: 1;
        margin-bottom: -6px;
      }
    }
  }
}

.editor {
  height: 100%;
  width: 100%;
}
</style>
