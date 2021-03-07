import React from 'react'
import axios from 'axios'
import { NavBar } from 'antd-mobile'

import './index.scss'

// 格式化城市数据
const formatCityData = (list) => {
    const cityList = {}
    // 遍历数据
    list.forEach(item => {
        const cityFirstName = item.short.substr(0, 1)
        // 判断是不是有数据
        if (cityList[cityFirstName]) {
            // 如果有数据直接push
            cityList[cityFirstName].push(item)
        } else {
            // 没有新建一个数组
            cityList[cityFirstName] = [item]
        }
    })
    // 城市索引字段
    const cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}
export default class CityList extends React.Component {
    componentDidMount() {
        // 调用获取城市数据方法
        this.getCityList()
    }
    // 获取城市列表数据方法
    async getCityList () {
        const { data: res } = await axios.get('http://api-haoke-web.itheima.net/area/city?level=1')
        if (res.status !== 200) return
        // 获取数据以后处理数据格式获取想要格式
        const { cityList, cityIndex } = formatCityData(res.body)

        const { data:result } =  await axios.get('http://api-haoke-web.itheima.net/area/hot')
        cityList['hot'] = result.body
        cityIndex.unshift('hot')
        console.log(cityList);
        console.log(cityIndex);
        console.log(result);
    }
    render() {
        return (
            // 顶部导航
            <div className='ciyilist-container'>
                <NavBar
                    className='navBar'
                    mode="light"
                    icon={<i className='iconfont icon-back'></i>}
                    onLeftClick={() => this.props.history.go(-1)}>
                    城市选择
                </NavBar>
            </div>
        )
    }
}