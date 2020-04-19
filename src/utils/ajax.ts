import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios'

export interface AjaxError extends AxiosError {
  httpCode?: number
  reason?: string
  $response?: any
  $request?: any
}

function onFulfilledInterceptor(response: AxiosResponse): any {
  return response.data
}

function onRejectedInterceptor(error: AjaxError): void {
  if (error.response) {
    const { data = {}, status } = error.response

    error.reason = data.message || data.error || data.details
    error.httpCode = status
    error.code = data.code || data.error_code || error.code
    error.$response = error.response
  } else if (error.request) {
    error.code = '-1'
    error.$request = error.request
    error.reason = 'no response'
  }

  throw error
}

export interface AjaxInstance extends AxiosInstance {
  request<T = any>(config: AxiosRequestConfig): Promise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>
}

const ajax = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create(config)
  instance.interceptors.response.use(
    onFulfilledInterceptor,
    onRejectedInterceptor,
  )
  return instance as AjaxInstance
}

export default ajax
