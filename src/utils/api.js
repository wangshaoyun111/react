import axios from 'axios'
import { BASE_URL } from './url'

import { getToken, removeToken } from './auth.js'
// 创建axios实例
// 可以使用自定义配置新建一个 axios 实例

const API = axios.create({
    baseURL: BASE_URL
})

// 添加请求拦截器
API.interceptors.request.use(function(config) {
    const { url } = config
    if (url.startsWith('/user') && !url.startsWith('/user/login')) {
        config.headers.authorization = getToken()
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
API.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    const { status } = response

    if (status === 400) {
        removeToken()
    }

    return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export { API }