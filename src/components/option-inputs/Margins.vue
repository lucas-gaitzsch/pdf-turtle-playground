<template>
  <div class="wrapper">
    <div><q-input v-model.number="marginProxy.top" label="top (mm)" /></div>
    <div style="gap: 42px">
      <q-input v-model.number="marginProxy.left" label="left (mm)" />
      <q-input v-model.number="marginProxy.right" label="right (mm)" />
    </div>
    <div><q-input v-model.number="marginProxy.bottom" label="bottom (mm)" /></div>
  </div>
</template>

<script setup lang="ts">
import { RenderOptionsMargins } from "@/swagger-client"
import { ref } from "vue"

const props = defineProps<{
  modelValue: RenderOptionsMargins
}>()

const marginProxy = ref(props.modelValue)
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px;

  > div {
    padding: 6px;
    display: flex;
    justify-content: space-between;
    gap: 6px;

    &:first-child,
    &:last-child {
      justify-content: center;
    }

    > * {
      width: 5em;
    }
  }
}
</style>
