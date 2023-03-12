<template>
  <q-list>
    <q-item v-for="a of props.modelValue" :key="a.name">
      <q-item-section>
        <q-item-label>assets/{{ a.name }}</q-item-label>
      </q-item-section>

      <q-item-section side class="no-wrap" style="flex-direction: row !important">
        <q-btn
          class="gt-xs"
          size="12px"
          flat
          dense
          round
          :icon="mdiClipboardOutline"
          @click="copyPath(a.name)"
          title="Copy asset url to clipboard"
        />
        <q-btn
          class="gt-xs"
          size="12px"
          flat
          dense
          round
          :icon="mdiDeleteOutline"
          @click="removeAsset(a)"
          title="Remove asset"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <q-file outlined dense multiple v-model="assetToAddFileInputModel" label="Add file to assets">
    <template #prepend>
      <q-icon :name="mdiAttachmentPlus" />
    </template>
  </q-file>

  <q-banner rounded dense class="q-mt-sm banner">
    Assets are located under
    <em>assets/*</em>
  </q-banner>
</template>

<script setup lang="ts">
import { mdiAttachmentPlus, mdiClipboardOutline, mdiDeleteOutline } from "@quasar/extras/mdi-v6"
import { Asset } from "@/models/asset"
import { ref, watch } from "vue"
import { useQuasar } from "quasar"

const quasar = useQuasar()

const props = defineProps<{ modelValue: Asset[] }>()
const emit = defineEmits<{ (event: "update:modelValue", modelValue: Asset[]): void }>()

const assetToAddFileInputModel = ref<File[] | null>(null)

const addAssets = async (files: File[]) => {
  const toAdd: Asset[] = []
  for (const f of files) {
    const arrayBuffer = await f.arrayBuffer()
    if (!props.modelValue.some((_) => _.name == f.name)) {
      toAdd.push({
        name: f.name,
        blob: new Blob([arrayBuffer]),
      })
    }
  }

  if (toAdd.length > 0) {
    const newAssets = props.modelValue.concat(toAdd).sort((a, b) => a.name.localeCompare(b.name))

    emit("update:modelValue", newAssets)
  }
}

const removeAsset = (assetToRm: Asset) => {
  const newAssets = props.modelValue.filter((a) => a.name !== assetToRm.name)
  emit("update:modelValue", newAssets)
}

watch(assetToAddFileInputModel, async (files) => {
  if (files) {
    addAssets(files)
    assetToAddFileInputModel.value = null
  }
})

function copyPath(name: string) {
  navigator.clipboard.writeText(`assets/${name}`)
}
</script>
