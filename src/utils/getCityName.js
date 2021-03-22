/**
 * 封装获取当前城市位置的方法和后台交换 获取带ID 的城市对象
 */

import { API } from './api.js'

// 1、创建获取当前城市位置的发生
export const getCurrentCityName = () => {
    // 2、判断本地是否有定位城市信息
    const localCity = JSON.parse(localStorage.getItem('hkzf_city')) || []
    // 3、加入本地没有城市信息，需要调用百度地图定位API 获取城市信息
    //       与后台进行交互，获取带 id 的城市信息，并返回
    if (localCity.length === 0) {
        // 获取地理位置信息
        return new Promise((resolve, reject) => {
            try {
                var myCity = new window.BMap.LocalCity()
                myCity.get(async result => {
                    console.log(result.name)
                    const cityName = result.name
                    const { data: res } = await API.get(`/area/info?name=${cityName}`)
                    console.log(res)
                    if (res.status !== 200) return
                    // 获取成功存储到本地
                    localStorage.setItem('hkzf_city', JSON.stringify(res.body))
                    // 如果成功返回了城市地理信息，返回数据给方法调用者
                    resolve(res.body)
                })
            } catch (error) {
                reject(error)
            }
        })
    }
    // 因为在if中使用的promise 将成功组件结果返回，
    // 为了组件通用性，本地存储的数据也是用Promise来返回
    return Promise.resolve(localCity)
}