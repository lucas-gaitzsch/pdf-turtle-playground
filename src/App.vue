<template>
  <q-layout view="hHh lpR fFf" class="fit-in-view-height">
    <q-drawer
      :model-value="true"
      side="left"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="250"
      :mini-width="70"
      :breakpoint="200"
      bordered
      class="drawer"
    >
      <q-list padding>
        <q-item class="header">
          <q-item-section avatar class="icon">
            <q-icon :name="mdiTortoise" color="primary" size="38px" />
          </q-item-section>
          <q-item-section class="title text-primary">
            PdfTurtle
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple :to="playgroundRoute" class="item" active-class="item-selected">
          <q-item-section avatar>
            <q-icon :name="mdiApplicationBracketsOutline" />
          </q-item-section>
          <q-item-section>Playground</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="aboutRoute" class="item" active-class="item-selected">
          <q-item-section avatar>
            <q-icon :name="mdiInformationOutline" />
          </q-item-section>
          <q-item-section>About</q-item-section>
        </q-item>
      </q-list>

      <q-list>
        <q-item class="item" href="https://github.com/lucas-gaitzsch/pdf-turtle" target="_blank">
          <q-item-section avatar>
            <q-icon :name="mdiGithub" />
          </q-item-section>
          <q-item-section>Github</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="item" @click="toggleTheme()">
          <q-item-section avatar>
            <q-icon v-if="!themeIsDark" :name="mdiWeatherSunny" />
            <q-icon v-else :name="mdiWeatherNight" />
          </q-item-section>
          <q-item-section>
            <template v-if="themeIsDark">
              Enable light theme
            </template>
            <template v-else>
              Enable dark theme
            </template>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="fit-in-view-height">
      <q-page class="fit-in-view-height">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.fit-in-view-height {
  height: 100vh;
}

.drawer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;

  .header {
    justify-content: start !important;
    padding: 0;

    .icon {
      padding-left: 10px !important;
      padding-right: 23px;
    }

    .title {
      font-weight: bold;
      font-size: 1.4em;
    }
  }

  .item {
    margin: 16px 0;
    border-radius: 64px;

    &.item-selected {
      background-color: #88888835;
    }
  }
}
</style>

<script lang="ts">
import { computed, provide, watch } from "vue"
import { defineComponent, ref, Ref } from "vue"
import { routeNames } from "./router"
import { useQuasar } from "quasar"

import {
  mdiApplicationBracketsOutline,
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiInformationOutline,
  mdiTortoise,
  mdiGithub,
} from "@quasar/extras/mdi-v6"

const localStorageIsDarkThemeKey = "isDarkMode"

export default defineComponent({
  name: "App",

  setup() {
    const $q = useQuasar()

    // Theming
    const browserDarkMode = window.matchMedia("(prefers-color-scheme: dark)")?.matches || false
    const getStoredUserSelectedDark = () => {
      const dark = localStorage.getItem(localStorageIsDarkThemeKey)
      if (dark === null) {
        return null
      } else {
        return dark.toLowerCase() === "true"
      }
    }
    const userSelectedDark: Ref<null | boolean> = ref(getStoredUserSelectedDark())
    const themeIsDark = computed(() => (userSelectedDark.value === null ? browserDarkMode : userSelectedDark.value))

    watch(themeIsDark, (isDark) => $q.dark.set(isDark))
    $q.dark.set(themeIsDark.value)

    const toggleTheme = () => {
      userSelectedDark.value = !themeIsDark.value
      localStorage.setItem(localStorageIsDarkThemeKey, themeIsDark.value ? "true" : "false")
    }

    provide("themeIsDark", themeIsDark)

    const miniState = ref(true)

    return {
      themeIsDark,
      userSelectedDark,
      toggleTheme,
      playgroundRoute: { name: routeNames.Playground },
      aboutRoute: { name: routeNames.About },
      miniState,
      mdiApplicationBracketsOutline,
      mdiWeatherSunny,
      mdiWeatherNight,
      mdiInformationOutline,
      mdiTortoise,
      mdiGithub,
    }
  },
})
</script>
