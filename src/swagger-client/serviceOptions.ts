/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from "axios"

export interface IRequestOptions extends AxiosRequestConfig {}

export interface IRequestConfig {
  method?: any
  headers?: any
  url?: any
  data?: any
  params?: any
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance
}

// Add default options
export const serviceOptions: ServiceOptions = {}

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  } else {
    throw new Error("please inject yourself instance like axios  ")
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = { ...options, method, url }
  configs.headers = {
    ...options.headers,
    "Content-Type": contentType,
  }
  return configs
}
