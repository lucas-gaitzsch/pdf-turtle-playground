<template>
  <div ref="editorDomRef" />
</template>

<script setup lang="ts">
import { watch } from "vue"
import { editor } from "monaco-editor"

import { EditorBaseProps, useEditorBase } from "../composables/editor-base"

const props = defineProps({
  ...EditorBaseProps,
  handlebars: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue"])

const createModel = (value: string) => editor.createModel(value, props.handlebars ? "handlebars" : "html")
const { editorDomRef, recreateModel } = useEditorBase(props, emit, createModel)

watch(
  () => props.handlebars,
  () => recreateModel()
)
</script>

<style lang="scss">
.monaco-editor {
  position: absolute !important;
}
</style>
