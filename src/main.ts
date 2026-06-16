import { createApp } from "vue"
import { Quasar, QuasarPluginOptions } from "quasar"
import quasarIconSet from "quasar/icon-set/svg-mdi-v6"

import { router } from "./router"

import "quasar/src/css/index.sass"

import App from "./App.vue"

import "./worker/editorWorker"
import { client } from "./swagger-client/client.gen"
import { serverBaseUrl } from "./config/server"

client.setConfig({
  baseURL: serverBaseUrl,
  timeout: 30000,
})

createApp(App)
  .use(Quasar, <QuasarPluginOptions>{
    iconSet: quasarIconSet,
    plugins: {},
    config: {},
  })
  .use(router)
  .mount("#app")
