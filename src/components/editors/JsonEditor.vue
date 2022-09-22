<template>
  <div ref="editorDomRef" />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor"
import { EditorBaseProps, useEditorBase } from "../composables/editor-base"
import { v4 as uuid } from "uuid"

const props = defineProps({
  ...EditorBaseProps,
  schemas: { type: Array, default: () => [] },
})

const emit = defineEmits(["update:modelValue"])

const schemaId = uuid()

const createModel = (value: string) => {
  const modelUri = monaco.Uri.parse("scheme:json/" + schemaId)
  const model = monaco.editor.createModel(value, "json", modelUri)

  // configure the JSON language support with schemas and schema associations
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: props.schemas.map((schema) => ({
      uri: "scheme:json/" + schemaId,
      fileMatch: [modelUri.toString()],
      schema,
    })),
  })

  return model
}

const { editorDomRef } = useEditorBase(props, emit, createModel)
</script>

<style lang="scss"></style>
