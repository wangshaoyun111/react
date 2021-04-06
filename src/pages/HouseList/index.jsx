import React from 'react'

// 导入 antd-mobile 组件
import { Flex } from 'antd-mobile'

// 导入封装的 HouseItem 组件
import HouseItem from '../../components/HouseItem/index.jsx'
import { List } from 'react-virtualized'
// 导入封装的顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'

// 导入组件

import Filter from './components/Filter/index'

import { API } from '../../utils/api.js'
// 导入 BASE_URL 变量
import { BASE_URL } from '../../utils/url.js'
import styles from './index.module.css'
// 获取本地存储的城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
    state = {
        list: [], // 列表数据
        count: 0 // 房源数据总条数
    }
    componentDidMount() {
        // 刚进入页面获取房源列表数据
        this.searchHouseList()
    }
    // 给当前组件添加静态属性
    filters = {}
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
        // 返回的房源列表赋值
        if (res.status !== 200) return
        this.setState({
            list: res.body.list,
            count: res.body.count
        })
    }

    renderHouseList = ({
        key,
        index,
        styles
    }) => {
        const { list } = this.state
        // 根据索引获取到每一项的数据
        const item = list[index]

        if (item === undefined) return
        return (
            <HouseItem
                key={item.houseCode}
                houseImg={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        )
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

                {/* 房源列表 */}
                <div>
                    <List
                        width={300}
                        height={300}
                        rowCount={this.state.count}
                        rowHeight={300}
                        rowRenderer={this.renderHouseList}
                    />
                </div>
            </div>
        )
    }
}