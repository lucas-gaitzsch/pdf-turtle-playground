<template>
  <div class="layout-wrapper" @keydown.ctrl.s.prevent.stop="saveBundle()" @keydown.ctrl.o.prevent.stop="loadBundle()">
    <q-splitter v-model="splitterModel" class="full-height" :horizontal="$q.screen.lt.md">
      <template #before>
        <div class="options-with-code-container">
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
                  <q-item clickable @click="loadBundle()">
                    <q-item-section avatar>
                      <q-icon :name="mdiFolderOutline" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Open bundle</q-item-label>
                      <q-item-label caption>
                        Ctrl+O
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="saveBundle()">
                    <q-item-section avatar>
                      <q-icon :name="mdiContentSaveOutline" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Save as bundle</q-item-label>
                      <q-item-label caption>
                        Ctrl+S
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable @click="loadEmptyData()">
                    <q-item-section avatar>
                      <q-icon :name="mdiBroom" />
                    </q-item-section>
                    <q-item-section>Clean bundle data</q-item-section>
                  </q-item>

                  <q-item clickable @click="loadSampleData()">
                    <q-item-section avatar>
                      <q-icon :name="mdiImageAutoAdjust" />
                    </q-item-section>
                    <q-item-section>Load sample data</q-item-section>
                  </q-item>
                </q-menu>
              </q-btn>

              <q-btn label="Assets" :icon="mdiFileImagePlusOutline" flat no-caps>
                <q-menu class="q-pa-sm">
                  <assets v-model="renderTemplateData.assets" />
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

                  <q-toggle
                    v-model="renderTemplateData.options.landscape"
                    label="Landscape"
                    dense
                    class="q-px-sm q-py-md"
                  />
                </q-menu>
              </q-btn>

              <q-btn label="Margins" :icon="mdiBorderNoneVariant" flat no-caps>
                <q-menu>
                  <margins v-model="renderTemplateData.options.margins" />
                </q-menu>
              </q-btn>
            </q-card-section>

            <q-card-section class="right-container">
              <div v-if="requestTimeInMs" class="runtime-container">
                {{ (requestTimeInMs / 1000).toFixed(1) }}s
              </div>

              <q-btn round flat dense :icon="mdiCogOutline" title="Settings">
                <q-menu class="q-pa-md">
                  <q-input
                    v-model="settings.serverUrl"
                    label="Custom server url"
                    placeholder="https://pdfturtle.gaitzsch.dev"
                  />
                  <q-input v-model="settings.secret" label="Secret" placeholder="3539bf53858d4e1e37616b" />
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
        </div>
      </template>
      <template #after>
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
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { EnumRenderOptionsPageFormat, EnumRenderTemplateDataTemplateEngine } from "@/swagger-client"
import HtmlEditor from "@/components/editors/HtmlEditor.vue"
import JsonEditor from "@/components/editors/JsonEditor.vue"
import Margins from "@/components/option-inputs/Margins.vue"
import Assets from "./option-inputs/Assets.vue"

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
  mdiImageAutoAdjust,
  mdiBroom,
} from "@quasar/extras/mdi-v6"

import { useBundleHandling } from "./composables/bundle-handling"
import { usePdfRendering } from "./composables/pdf-rendering"
import { readonly, ref } from "vue"
import { getBaseRenderData } from "@/models/render-data-base"
import { QFile } from "quasar"

const splitterModel = ref(50)

const pageSizes = Object.values(EnumRenderOptionsPageFormat)
const templateEngines = Object.values(EnumRenderTemplateDataTemplateEngine)

const editorTabDefinitions = readonly({
  body: "body",
  header: "header",
  footer: "footer",
  model: "model",
})
const editorTab = ref(editorTabDefinitions.body)

const { renderTemplateData, settings, isLoading, hasError, errMsg, requestTimeInMs, pdfResponseDataUrl, requestPdf } =
  usePdfRendering()

const { bundleFileInputModel, saveBundle } = useBundleHandling(renderTemplateData)

const uploadBundle = ref<QFile>()
function loadBundle() {
  uploadBundle.value?.$el.click()
}

function loadEmptyData() {
  Object.assign(renderTemplateData, getBaseRenderData(true))
}

function loadSampleData() {
  Object.assign(renderTemplateData, getBaseRenderData())
}

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

  @media only screen and (max-width: 1400px) {
    .q-btn .on-left {
      margin-right: 4px;
    }
  }

  .options-with-code-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .options-container {
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
    flex: 1;
    margin-left: 2px;

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
    height: 100%;
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
