import ajax from '@/utils/ajax'
import { URL_API_BASE } from '@/constants/index'

export default ajax({ baseURL: URL_API_BASE, withCredentials: true })
