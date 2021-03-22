import axios from 'axios'
import { BASE_URL } from './url'

// 创建axios实例
// 可以使用自定义配置新建一个 axios 实例

const API = axios.create({
    baseURL: BASE_URL
})

export { API }