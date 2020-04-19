import ajax from './api/moss'

export enum Platform {
  UNKNOWN,
  QINIU,
  ALI,
}

export interface GetTokenResponse {
  uploadToken: string
  keyPrefix: string
}

export const getUploadToken = (
  keyPrefix: string,
  type: Platform = Platform.QINIU,
) => {
  return ajax.get<GetTokenResponse>('/upload/token', {
    params: { type, keyPrefix },
  })
}
