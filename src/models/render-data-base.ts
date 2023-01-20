import { model, templateBody, templateFooter, templateHeader } from "@/assets/prefill"
import {
  EnumRenderOptionsPageFormat,
  EnumRenderTemplateDataTemplateEngine,
  RenderOptions,
  RenderTemplateData,
} from "@/swagger-client"
import { WithRequired } from "@/utils/type-extensions"
import { Asset } from "./asset"

export type RenderOptionsViewModel = WithRequired<
  WithRequired<WithRequired<RenderOptions, "margins">, "landscape">,
  "pageFormat"
>
export type RenderTemplateDataViewModel = WithRequired<RenderTemplateData, "options"> & {
  modelStr: string
  assets: Asset[]
  options: RenderOptionsViewModel
}

export const getBaseOptions = (): RenderOptionsViewModel => ({
  landscape: false,
  pageFormat: EnumRenderOptionsPageFormat.A4,
  margins: {
    top: 25,
    right: 25,
    bottom: 20,
    left: 25,
  },
})

export const getBaseRenderData = (empty = false): RenderTemplateDataViewModel => ({
  templateEngine: EnumRenderTemplateDataTemplateEngine.golang,
  htmlTemplate: empty ? "" : templateBody,
  headerHtmlTemplate: empty ? "" : templateHeader,
  footerHtmlTemplate: empty ? "" : templateFooter,
  modelStr: empty ? "" : JSON.stringify(model, null, 2),
  options: getBaseOptions(),
  assets: [],
})
