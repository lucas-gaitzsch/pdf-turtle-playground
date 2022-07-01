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
      </q-card-section>
    </q-card>

    <div class="code-container template">
      <html-editor v-model="renderTemplateData.htmlTemplate" class="editor" :no-handlebars="true" />
    </div>
    <div class="code-container model">
      <json-editor v-model="renderTemplateData.model" class="editor" />
    </div>

    <div class="pdf-container">
      <object v-if="!isLoading && !hasError" type="application/pdf" :data="pdfDataUrl" class="pdf-viewer">
        <div class="ma-8" style="box-sizing: border-box">
          <p class="pb-4">
            FALLBACK TEXT
            <!--TODO:!!-->
          </p>

          <!--TODO:!  <v-btn block color="primary" :href="pdfDataUrl" target="_blank" large>
            <v-icon left>mdi-open-in-new</v-icon>
            Open external
          </v-btn> -->
        </div>
      </object>
      <div v-else class="loading-wrapper">
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

import { mdiTurtle } from "@quasar/extras/mdi-v6"

const renderTemplateData = reactive<RenderTemplateData>({
  templateEngine: EnumRenderTemplateDataTemplateEngine.golang,
  htmlTemplate: template,
  model: JSON.stringify(model, null, 2),
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

const pdfDataUrl = ref("")

const isLoading = ref(0)
const hasError = computed(() => isLoading.value === 0 && pdfDataUrl.value === "")
const errMsg = ref<RequestError | null>(null)

const requestTimeInMs = ref(0)

let abortController = new AbortController()

const requestPdf = async () => {
  abortController.abort()
  abortController = new AbortController()

  const d: RenderTemplateData = {
    ...renderTemplateData,
    model: JSON.parse(renderTemplateData.model || "null"),
    headerModel: JSON.parse(renderTemplateData.headerModel || "null"),
    footerModel: JSON.parse(renderTemplateData.footerModel || "null"),
  }

  try {
    isLoading.value++
    pdfDataUrl.value = ""
    errMsg.value = null

    const startTime = new Date().getTime()

    const res = await RenderHtmlTemplateService.render(
      { renderTemplateData: d },
      {
        responseType: "blob",
        signal: abortController.signal,
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
    }
  } finally {
    isLoading.value--
  }
}

// initial rendering and watch
requestPdf()
watch(renderTemplateData, () => requestPdf())
</script>

<style lang="scss">
.layout-wrapper {
  min-height: inherit;
  height: 100%;
  background-color: #a1a1a147;

  display: grid;
  grid-template-columns: 10fr 8fr;
  // grid-auto-rows: minmax(100px, auto);
  grid-template-rows: min-content 2fr 1fr;

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

    .loading-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.pdf-viewer {
  height: 100%;
  width: 100%;

  margin-bottom: -6px;
}

.editor {
  height: 100%;
  width: 100%;
}
</style>
