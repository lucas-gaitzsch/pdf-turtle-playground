<template>
  <div ref="editorDomRef" />
</template>

<script setup lang="ts">
import { watch } from "vue"
import * as monaco from "monaco-editor"

import { EditorBaseProps, useEditorBase } from "./editor-base"

const props = defineProps({
  ...EditorBaseProps,
  noHandlebars: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue"])

const createModel = (value: string) => monaco.editor.createModel(value, props.noHandlebars ? "html" : "handlebars")
const { editorDomRef, recreateModel } = useEditorBase(props, emit, createModel)

watch(
  () => props.noHandlebars,
  () => recreateModel()
)
</script>

<style lang="scss"></style>
