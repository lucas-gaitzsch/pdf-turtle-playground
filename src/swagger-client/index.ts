/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

import { IRequestOptions, IRequestConfig, getConfigs, axios } from "./serviceOptions"
export const basePath = ""

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

export class RenderHtmlBundleService {
  /**
   * Render PDF from bundle including HTML(-Template) with model and assets provided in form-data (keys: bundle, model)
   */
  static render(
    params: {
      /** Bundle Zip-File */
      bundle: any
      /** JSON-Model for template (only required for template) */
      model?: string
      /** Template engine to use for template (only required for template) */
      templateEngine?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/api/pdf/from/html-bundle/render"

      const configs: IRequestConfig = getConfigs("post", "multipart/form-data", url, options)

      let data = null
      data = new FormData()
      if (params["bundle"]) {
        if (Object.prototype.toString.call(params["bundle"]) === "[object Array]") {
          for (const item of params["bundle"]) {
            data.append("bundle", item as any)
          }
        } else {
          data.append("bundle", params["bundle"] as any)
        }
      }

      if (params["model"]) {
        if (Object.prototype.toString.call(params["model"]) === "[object Array]") {
          for (const item of params["model"]) {
            data.append("model", item as any)
          }
        } else {
          data.append("model", params["model"] as any)
        }
      }

      if (params["templateEngine"]) {
        if (Object.prototype.toString.call(params["templateEngine"]) === "[object Array]") {
          for (const item of params["templateEngine"]) {
            data.append("templateEngine", item as any)
          }
        } else {
          data.append("templateEngine", params["templateEngine"] as any)
        }
      }

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

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
      let url = basePath + "/api/pdf/from/html-template/render"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params["renderTemplateData"]

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
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
      let url = basePath + "/api/pdf/from/html-template/test"

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
      let url = basePath + "/api/pdf/from/html/render"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params["renderData"]

      configs.data = data

      axios(configs, resolve, reject)
    })
  }
}

export class InternalsService {
  /**
   * Liveness probe for this service
   */
  static health(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/health"

      const configs: IRequestConfig = getConfigs("get", "multipart/form-data", url, options)

      /** 适配ios13，get请求不允许带body */

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

  /** Optional template for header. If empty, the header template will be parsed from main template (<PdfHeader></PdfHeader>). */
  headerHtmlTemplate?: string

  /**  */
  htmlTemplate?: string

  /** Model with your data matching to the templates */
  model?: object

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
