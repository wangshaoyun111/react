import React from 'react'

// 导入 antd-mobile 组件
import { Flex } from 'antd-mobile'

// 导入封装的顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'

// 导入组件

import Filter from './components/Filter/index'

import { API } from '../../utils/api.js'
import styles from './index.module.css'
// 获取本地存储的城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
    // 获取filter组件传递的数据
    onFilter = (value) => {
        // 接收子组件传递的筛选条件，挂在到this
        this.filters = value

        this.searchHouseList()
    }
    // 获取房源列表信息
    searchHouseList = async () => {
        // 获取当前城市ID
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
        const params = {
            cityId: value,
            ...this.filters,
            start: 1,
            end: 10
        }
        // 发起筛选请求
        const { data: res } = await API.get('/houses', { params })
        console.log(res);
    }

    render() {
        return (
            <div className="house_list">
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
                    <SearchHeader className={styles.searchHeader} currentCityName={label}></SearchHeader>
                </Flex>

                {/* 调用条件筛选栏 */}
                <Filter onFilter={this.onFilter}></Filter>
            </div>
        )
    }
}