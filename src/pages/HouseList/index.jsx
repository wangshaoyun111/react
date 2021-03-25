import React from 'react'

// 导入 antd-mobile 组件
import { Flex } from 'antd-mobile'

// 导入封装的顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'

// 导入组件

import Filter from './components/Filter/index'
import styles from './index.module.css'
// 获取本地存储的城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
    render() {
        return (
            <div className="house_list">
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
                    <SearchHeader className={styles.searchHeader} currentCityName={label}></SearchHeader>
                </Flex>

                {/* 调用条件筛选栏 */}
                <Filter></Filter>
            </div>
        )
    }
}