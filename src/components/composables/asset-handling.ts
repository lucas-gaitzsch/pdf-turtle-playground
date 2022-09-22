import { Asset } from "@/models/asset"
import { RenderTemplateDataViewModel } from "@/models/render-data-base"
import { ref, watch } from "vue"

export function useAssetHandling(reactiveRenderTemplateDataViewModel: RenderTemplateDataViewModel) {
  const assetToAddFileInputModel = ref<File[] | null>(null)

  const removeAsset = (assetToRm: Asset) => {
    reactiveRenderTemplateDataViewModel.assets = reactiveRenderTemplateDataViewModel.assets.filter(
      (a) => a.name !== assetToRm.name
    )
  }

  watch(assetToAddFileInputModel, async (val) => {
    if (val) {
      for (const f of val) {
        const arrayBuffer = await f.arrayBuffer()
        reactiveRenderTemplateDataViewModel.assets.push({
          name: f.name,
          blob: new Blob([arrayBuffer]),
        })
      }
      assetToAddFileInputModel.value = null
    }
  })

  return {
    assetToAddFileInputModel,
    removeAsset,
  }
}
