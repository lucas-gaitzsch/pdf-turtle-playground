import { createApp } from "vue"
import { Quasar, QuasarPluginOptions } from "quasar"
import quasarIconSet from "quasar/icon-set/svg-mdi-v6"

import { router } from "./router"

import "quasar/src/css/index.sass"

import App from "./App.vue"

import "./worker/editorWorker"
import { serviceOptions } from "./swagger-client/serviceOptions"
import { serverBaseUrl } from "./config/server"
import axios from "axios"

serviceOptions.axios = axios.create({
  baseURL: serverBaseUrl,
  timeout: 10000,
})

createApp(App)
  .use(Quasar, <QuasarPluginOptions>{
    iconSet: quasarIconSet,
    plugins: {},
    config: {},
  })
  .use(router)
  .mount("#app")
