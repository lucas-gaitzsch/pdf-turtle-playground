<template>
  <div class="wrapper">
    <div><q-input v-model.number="marginProxy.top" label="top" /></div>
    <div>
      <q-input v-model.number="marginProxy.left" label="left" />
      <q-input v-model.number="marginProxy.right" label="right" />
    </div>
    <div><q-input v-model.number="marginProxy.bottom" label="bottom" /></div>
  </div>
</template>

<script setup lang="ts">
import { RenderOptionsMargins } from "@/swagger-client"
import { ref } from "vue"

const props = defineProps<{
  modelValue: RenderOptionsMargins
}>()

// const emit = defineEmits<{
//   (event: 'update:modelValue', margins: RenderOptionsMargins): void
// }>()

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
