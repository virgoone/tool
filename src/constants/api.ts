import pickEnv from 'penv.macro'

export const URL_API_BASE = pickEnv({
  production: 'https://moss-api.marryto.me/v1',
  develop: 'https://moss-api.marryto.me/v1',
  local: 'http://localhost:8008/api/v1',
})
