import { ref, watch } from "vue"

import JsZip from "jszip"
import FileSaver from "file-saver"
import { getBaseOptions, getBaseRenderData, RenderTemplateDataViewModel } from "@/models/render-data-base"
import { Asset, BundleAssetsFolder } from "@/models/asset"

type IncludedFiles = {
  index?: boolean
  header?: boolean
  footer?: boolean
  options?: boolean
  assets?: boolean
  exampleModel?: boolean
}

const includedFilesAll: IncludedFiles = {
  index: true,
  header: true,
  footer: true,
  options: true,
  assets: true,
  exampleModel: true,
}

export function packBundle(data: RenderTemplateDataViewModel, includedFiles = includedFilesAll): Promise<Blob> {
  const zip = new JsZip()

  if (includedFiles.index) {
    zip.file("index.html", data.htmlTemplate ?? "")
  }
  if (includedFiles.header && data.headerHtmlTemplate) {
    zip.file("header.html", data.headerHtmlTemplate)
  }
  if (includedFiles.footer && data.footerHtmlTemplate) {
    zip.file("footer.html", data.footerHtmlTemplate)
  }
  if (includedFiles.options) {
    zip.file("options.json", JSON.stringify(data.options))
  }
  if (includedFiles.exampleModel) {
    zip.file("example-model.json", JSON.stringify(JSON.parse(data.modelStr)))
  }

  if (includedFiles.assets) {
    for (const a of data.assets) {
      zip.file(`assets/${a.name}`, a.blob)
    }
  }

  return zip.generateAsync({ type: "blob" })
}

export function useBundleHandling(reactiveRenderTemplateDataViewModel: RenderTemplateDataViewModel) {
  const loadBundle = async (
    bundleBufferSrc: ArrayBuffer,
    target: RenderTemplateDataViewModel = getBaseRenderData()
  ): Promise<RenderTemplateDataViewModel> => {
    const zip = await JsZip.loadAsync(bundleBufferSrc)

    const emptyStringPromise = Promise.resolve("")

    const indexStr = await (zip.files["index.html"]?.async("string") ?? emptyStringPromise)
    const headerStr = await (zip.files["header.html"]?.async("string") ?? emptyStringPromise)
    const footerStr = await (zip.files["footer.html"]?.async("string") ?? emptyStringPromise)
    const optionsStr = await (zip.files["options.json"]?.async("string") ?? emptyStringPromise)
    const exampleModelStr = await (zip.files["example-model.json"]?.async("string") ?? emptyStringPromise)

    const assetFolderPath = BundleAssetsFolder + "/"
    const assets: Asset[] = []
    for (const fKey in zip.files) {
      if (fKey.startsWith(assetFolderPath) && fKey !== assetFolderPath) {
        assets.push({
          name: fKey.substring(assetFolderPath.length),
          blob: await zip.files[fKey].async("blob"),
        })
      }
    }

    if (indexStr) {
      target.htmlTemplate = indexStr
    }
    if (headerStr) {
      target.headerHtmlTemplate = headerStr
    }
    if (footerStr) {
      target.footerHtmlTemplate = footerStr
    }
    if (optionsStr) {
      target.options = { ...getBaseOptions(), ...JSON.parse(optionsStr) }
    }
    if (exampleModelStr) {
      const model = JSON.parse(exampleModelStr)
      target.model = model
      target.modelStr = JSON.stringify(model, null, 2)
    }

    if (assets.length > 0) {
      target.assets = assets
    }

    return target
  }

  const saveBundle = async (
    only?: "documentWithoutHeaderAndFooter" | "onlyBody" | "onlyHeader" | "onlyFooter" | "onlyOptions" | "onlyAssets"
  ) => {
    const includedFiles = ((): IncludedFiles | undefined => {
      switch (only) {
        case "documentWithoutHeaderAndFooter":
          return { index: true, options: true, assets: true }
        case "onlyBody":
          return { index: true }
        case "onlyHeader":
          return { header: true }
        case "onlyFooter":
          return { footer: true }
        case "onlyOptions":
          return { options: true }
        case "onlyAssets":
          return { assets: true }
        case undefined:
          return undefined
      }
    })()

    const zip = await packBundle(reactiveRenderTemplateDataViewModel, includedFiles)

    FileSaver.saveAs(zip, "pdf-turtle-bundle.zip")
  }

  const bundleFileInputModel = ref<File | null>(null)
  watch(bundleFileInputModel, async (b) => {
    if (b) {
      await loadBundle(await b.arrayBuffer(), reactiveRenderTemplateDataViewModel)
    }

    bundleFileInputModel.value = null
  })

  return {
    packBundle,
    loadBundle,
    saveBundle,
    bundleFileInputModel,
  }
}
