<template>
  <div class="layout-wrapper">
    <!-- ### Options-Container ### -->

    <q-card flat bordered class="options-container">
      <q-card-section class="row">
        <q-select
          v-model="renderTemplateData.templateEngine"
          :options="templateEngines"
          label="Template engine"
          dense
          outlined
          class="option-select"
        />

        <q-file v-show="false" ref="uploadBundle" v-model="bundleFileInputModel" />
        <q-btn label="Bundle" :icon="mdiPackageVariant" flat no-caps>
          <q-menu auto-close>
            <q-item clickable @click="() => ($refs.uploadBundle as any).$el.click()">
              <q-item-section avatar>
                <q-icon :name="mdiFolderOutline" />
              </q-item-section>
              <q-item-section>Open bundle</q-item-section>
            </q-item>

            <q-item clickable @click="saveBundle()">
              <q-item-section avatar>
                <q-icon :name="mdiContentSaveOutline" />
              </q-item-section>
              <q-item-section>Save as bundle</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>

        <q-btn label="Layout" :icon="mdiFileDocumentOutline" flat no-caps>
          <q-menu class="q-pa-sm">
            <q-select
              v-model="renderTemplateData.options.pageFormat"
              :options="pageSizes"
              label="Page size"
              dense
              outlined
              class="option-select"
            />

            <q-toggle v-model="renderTemplateData.options.landscape" label="Landscape" dense class="q-px-sm q-py-md" />
          </q-menu>
        </q-btn>

        <q-btn label="Margins" :icon="mdiBorderNoneVariant" flat no-caps>
          <q-menu>
            <margins v-model="renderTemplateData.options.margins" />
          </q-menu>
        </q-btn>

        <q-btn label="Assets" :icon="mdiFileImagePlusOutline" flat no-caps>
          <q-menu class="q-pa-sm">
            <assets v-model="renderTemplateData.assets" />
          </q-menu>
        </q-btn>
      </q-card-section>

      <q-card-section class="right-container">
        <div v-if="requestTimeInMs" class="runtime-container">
          {{ requestTimeInMs }} ms
        </div>

        <q-btn round flat dense :icon="mdiCogOutline" title="Settings">
          <q-menu class="q-pa-md">
            <q-input v-model="serverUrl" label="Custom server url" placeholder="https://pdfturtle.gaitzsch.dev" />
            <q-input v-model="secret" label="Secret" placeholder="3539bf53858d4e1e37616b" />
          </q-menu>
        </q-btn>
      </q-card-section>
    </q-card>

    <!-- ### Code-Container ### -->

    <div class="code-container">
      <q-card flat>
        <q-tabs v-model="editorTab" dense no-caps inline-label align="left">
          <q-tab :name="editorTabDefinitions.body" label="Body" />
          <q-tab :name="editorTabDefinitions.header" label="Header" />
          <q-tab :name="editorTabDefinitions.footer" label="Footer" />
          <q-tab :name="editorTabDefinitions.model" label="Model" />
        </q-tabs>
      </q-card>
      <q-separator />
      <q-tab-panels v-model="editorTab" keep-alive>
        <q-tab-panel :name="editorTabDefinitions.body">
          <html-editor v-model="renderTemplateData.htmlTemplate" class="editor" />
        </q-tab-panel>

        <q-tab-panel :name="editorTabDefinitions.header">
          <html-editor v-model="renderTemplateData.headerHtmlTemplate" class="editor" />
        </q-tab-panel>

        <q-tab-panel :name="editorTabDefinitions.footer">
          <html-editor v-model="renderTemplateData.footerHtmlTemplate" class="editor" />
        </q-tab-panel>

        <q-tab-panel :name="editorTabDefinitions.model">
          <json-editor v-model="renderTemplateData.modelStr" class="editor" />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- ### PDF-Container ### -->

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

      <object v-if="pdfResponseDataUrl" type="application/pdf" :data="pdfResponseDataUrl" class="pdf-viewer">
        <div class="ma-8" style="box-sizing: border-box">
          <p class="pb-4">Your browser do not support embedded pdf visualization.</p>

          <q-btn :href="pdfResponseDataUrl" target="_blank" size="lg" :icon="mdiOpenInNew">Open external</q-btn>
        </div>
      </object>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EnumRenderOptionsPageFormat, EnumRenderTemplateDataTemplateEngine } from "@/swagger-client"
import HtmlEditor from "@/components/editors/HtmlEditor.vue"
import JsonEditor from "@/components/editors/JsonEditor.vue"
import Margins from "@/components/option-inputs/Margins.vue"

import {
  mdiTurtle,
  mdiOpenInNew,
  mdiCogOutline,
  mdiFileDocumentOutline,
  mdiFileImagePlusOutline,
  mdiBorderNoneVariant,
  mdiPackageVariant,
  mdiFolderOutline,
  mdiContentSaveOutline,
} from "@quasar/extras/mdi-v6"

import { useBundleHandling } from "./composables/bundle-handling"
import { usePdfRendering } from "./composables/pdf-rendering"
import Assets from "./option-inputs/Assets.vue"
import { readonly, ref } from "vue"

const pageSizes = Object.values(EnumRenderOptionsPageFormat)
const templateEngines = Object.values(EnumRenderTemplateDataTemplateEngine)

const editorTabDefinitions = readonly({
  body: "body",
  header: "header",
  footer: "footer",
  model: "model",
})
const editorTab = ref(editorTabDefinitions.body)

const {
  renderTemplateData,
  serverUrl,
  secret,
  isLoading,
  hasError,
  errMsg,
  requestTimeInMs,
  pdfResponseDataUrl,
  requestPdf,
} = usePdfRendering()

const { bundleFileInputModel, saveBundle } = useBundleHandling(renderTemplateData)

requestPdf()
</script>

<style lang="scss">
.banner {
  background-color: rgba(129, 129, 129, 0.125) !important;
}

.layout-wrapper {
  min-height: inherit;
  height: 100%;
  background-color: #a1a1a147;

  display: grid;
  gap: 4px;
  grid-template-columns: 10fr 8fr;
  grid-template-rows: min-content 1fr;

  grid-template-areas:
    "options  pdf"
    "code pdf";

  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-rows: min-content 400px 300px 500px;
    grid-template-areas:
      "options"
      "code"
      "pdf";

    padding-right: 2px;

    .q-btn .on-left {
      margin-right: 4px;
    }

    .runtime-container {
      display: none;
    }
  }

  .options-container {
    grid-area: options;

    display: flex;

    margin-left: 2px;
    margin-top: 2px;

    * {
      gap: 4px;
    }

    .option-select {
      min-width: 140px;
    }

    button {
      svg {
        opacity: 0.7;
      }
    }

    .right-container {
      display: flex;
      margin-left: auto;
      align-items: center;

      .runtime-container {
        text-align: right;
      }
    }
  }

  .code-container {
    margin-left: 2px;

    grid-area: code;

    display: flex;
    flex-direction: column;

    > .q-card {
      border-radius: $generic-border-radius $generic-border-radius 0 0;
    }

    > .q-tab-panels {
      flex: 1;

      .q-tab-panel {
        padding: 0;
      }
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

        > div {
          max-width: 80%;
        }
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
