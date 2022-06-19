import * as monaco from "monaco-editor"
import { inject, onMounted, Ref, ref, watch } from "vue"

export const EditorBaseProps = {
  modelValue: {
    type: String,
    default: "",
  },
}

const getTheme = (isDark: boolean) => (isDark ? "vs-dark" : "vs")

export type EditorBaseEmits = { (event: "update:modelValue", value: string): void }

export function useEditorBase(
  props: { modelValue: string },
  emit: EditorBaseEmits,
  createModel: (value: string) => monaco.editor.ITextModel
) {
  const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)

  const createModelIntern = () => {
    const m = createModel(props.modelValue)
    m.onDidChangeContent(() => emit("update:modelValue", m.getValue()))
    m.updateOptions({
      tabSize: 2,
      insertSpaces: false,
      indentSize: 2,
    })
    return m
  }

  let model = createModelIntern()

  watch(
    () => props.modelValue,
    (val) => {
      if (model.getValue().length !== val.length) {
        model.setValue(val)
      }
    }
  )

  const themeIsDark = inject<Ref<boolean>>("themeIsDark", ref(false))

  watch(themeIsDark, (isDark) => {
    if (editor.value) {
      monaco.editor.setTheme(getTheme(isDark))
    }
  })

  const editorDomRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (editorDomRef.value) {
      editor.value = monaco.editor.create(editorDomRef.value, {
        model,
        automaticLayout: true,
        autoIndent: "full",
        useTabStops: true,
        tabSize: 2,
        theme: getTheme(themeIsDark.value),
      })
    } else {
      console.error("cant bind editor")
    }
  })

  const recreateModel = () => {
    model = createModelIntern()
    editor.value?.setModel(model)
  }

  return {
    editorDomRef,
    editor,
    model,
    recreateModel,
  }
}
