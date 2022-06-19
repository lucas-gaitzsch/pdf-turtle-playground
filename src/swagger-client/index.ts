/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

import { IRequestOptions, IRequestConfig, getConfigs, axios } from "./serviceOptions"
export const basePath = "/api"

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[]
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[]
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number
  items?: T[]
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number
  items?: T[]
}

// customer definition
// empty

export class RenderHtmlTemplateService {
  /**
   * Render PDF from HTML template
   */
  static render(
    params: {
      /** Render Data */
      renderTemplateData: RenderTemplateData
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/pdf/from/html-template/render"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params["renderTemplateData"]

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class TestHtmlTemplateService {
  /**
   * Test HTML template matching model
   */
  static test(
    params: {
      /** Render Data */
      renderTemplateData: RenderTemplateData
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TemplateTestResult> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/pdf/from/html-template/test"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params["renderTemplateData"]

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class RenderHtmlService {
  /**
   * Render PDF from HTML
   */
  static render(
    params: {
      /** Render Data */
      renderData: RenderData
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/pdf/from/html/render"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params["renderData"]

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export interface PageSize {
  /** in mm */
  height?: number

  /** in mm */
  width?: number
}

export interface RenderData {
  /** Optional html for footer. If empty, the footer html will be parsed from main html (<PdfFooter></PdfFooter>). */
  footerHtml?: string

  /** Optional html for header. If empty, the header html will be parsed from main html (<PdfHeader></PdfHeader>). */
  headerHtml?: string

  /**  */
  html?: string

  /**  */
  options?: RenderOptions
}

export interface RenderOptions {
  /**  */
  excludeBuiltinStyles?: boolean

  /**  */
  landscape?: boolean

  /** margins in mm; fallback to default if null */
  margins?: RenderOptionsMargins

  /**  */
  pageFormat?: EnumRenderOptionsPageFormat

  /** page size in mm; overrides page format */
  pageSize?: PageSize
}

export interface RenderOptionsMargins {
  /** margin bottom in mm */
  bottom?: number

  /** margin left in mm */
  left?: number

  /** margin right in mm */
  right?: number

  /** margin top in mm */
  top?: number
}

export interface RenderTemplateData {
  /** Optional template for footer. If empty, the footer template will be parsed from main template (<PdfFooter></PdfFooter>). */
  footerHtmlTemplate?: string

  /** Optional model for footer. If empty or null model was used. */
  footerModel?: any

  /** Optional template for header. If empty, the header template will be parsed from main template (<PdfHeader></PdfHeader>). */
  headerHtmlTemplate?: string

  /** Optional model for header. If empty or null model was used. */
  headerModel?: any

  /**  */
  htmlTemplate?: string

  /**  */
  model?: any

  /**  */
  options?: RenderOptions

  /**  */
  templateEngine?: EnumRenderTemplateDataTemplateEngine
}

export interface TemplateTestResult {
  /**  */
  bodyTemplateError?: string

  /**  */
  footerTemplateError?: string

  /**  */
  headerTemplateError?: string

  /**  */
  isValid?: boolean
}
export enum EnumRenderOptionsPageFormat {
  "A0" = "A0",
  "A1" = "A1",
  "A2" = "A2",
  "A3" = "A3",
  "A4" = "A4",
  "A5" = "A5",
  "A6" = "A6",
  "Letter" = "Letter",
  "Legal" = "Legal",
}
export enum EnumRenderTemplateDataTemplateEngine {
  "golang" = "golang",
  "handlebars" = "handlebars",
  "django" = "django",
}
