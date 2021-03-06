import React from 'react'

// 导入 antd-mobile 组件
import { Flex, Toast } from 'antd-mobile'

// 导入封装的 HouseItem 组件
import HouseItem from '../../components/HouseItem/index.jsx'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
// 导入封装的顶部搜索栏组件
import SearchHeader from '../../components/SearchHeader/index.jsx'
import NoHouses from '../../components/NoHouse/index.js'
// 导入组件

import Filter from './components/Filter/index'

import { API } from '../../utils/api.js'
// 导入 BASE_URL 变量
import { BASE_URL } from '../../utils/url.js'
// 导入获取城市信息的方法
import { getCurrentCityName } from '../../utils/getCityName.js'
import styles from './index.module.css'
// 获取本地存储的城市信息
// const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
    state = {
        list: [], // 列表数据
        count: 0, // 房源数据总条数
        isLoading: false, // 数据是否正在请求
        cityName: '' // 当前城市的名字
    }
    async componentDidMount() {
        const { label } = await getCurrentCityName()
        this.setState({
            cityName: label
        })
        // 刚进入页面获取房源列表数据
        this.searchHouseList()
    }
    // 给当前组件添加静态属性
    filters = {}
    // 获取filter组件传递的数据
    onFilter = (value) => {
        // 接收子组件传递的筛选条件，挂在到this
        this.filters = value
        // 当筛选条件改变时，页面回到顶部
        window.scrollTo(0, 0)
        this.searchHouseList()
    }
    // 获取房源列表信息
    searchHouseList = async () => {
        // 获取当前城市ID
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))

        this.setState({
            isLoading: true
        })
        Toast.loading('加载中')
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

        Toast.hide()
        this.setState({
            list: res.body.list,
            count: res.body.count,
            isLoading: false
        })
        if (this.state.count !== 0) {
            Toast.info(`共找到${this.state.count}套房源`, 1, null, false)
        }
    }

    renderHouseList = ({
        key,
        index,
        style
    }) => {
        const { list } = this.state
        // 根据索引获取到每一项的数据
        const item = list[index]

        if (!item) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}></p>
                </div>
            )
        }

        return (
            <HouseItem
                style={style}
                key={key}
                houseImg={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
                onClick={() => { this.props.history.push(`/detail/${item.houseCode}`) }}
            />
        )
    }
    renderList = () => {
        const { count, isLoading } = this.state
        if (count === 0 && !isLoading) {
            return <NoHouses>没有找到房源，请您换个搜索条件吧</NoHouses>
        }
        return (
            // {/* rowCount 列表数据总条数 */}
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={this.state.count}
            >
                {
                    ({ onRowsRendered, registerChild }) => (
                        <WindowScroller>
                            {
                                // // height：视口高度
                                // isScrolling：表示是否滚动中，用来覆盖List组件自身的滚动状态
                                // scrollTop：页面滚动的距离，用来同步 List 组件的滚动距离
                                ({ height, isScrolling, scrollTop }) => (
                                    <AutoSizer>
                                        {
                                            ({ width }) => (
                                                <List
                                                    onRowsRendered={onRowsRendered}
                                                    ref={registerChild}
                                                    autoHeight
                                                    width={width}
                                                    height={height}
                                                    rowCount={this.state.count}
                                                    rowHeight={120}
                                                    isScrolling={isScrolling}
                                                    scrollTop={scrollTop}
                                                    rowRenderer={this.renderHouseList}
                                                />
                                            )
                                        }
                                    </AutoSizer>
                                )
                            }
                        </WindowScroller>
                    )
                }
            </InfiniteLoader>
        )
    }
    // isRowLoaded 表示每一行数据是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index]
    }
    // loadMoreRows 加载更多数据的方法，在需要加载更多数据时，会调用该方法
    // startIndex -- 开始索引
    // stopIndex -- 结束索引
    loadMoreRows = async ({ startIndex, stopIndex }) => {
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
            list: [...this.state.list, ...res.body.list],
        })
    }
    render() {
        return (
            <div className="house_list">
                <div className={styles.sticky}>
                    <Flex className={styles.header}>
                        <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
                        <SearchHeader className={styles.searchHeader} currentCityName={this.state.cityName}></SearchHeader>
                    </Flex>
                    {/* 调用条件筛选栏 */}
                    <Filter onFilter={this.onFilter}></Filter>
                </div>
                {/* 房源列表 */}
                <div className={styles.houseItems}>
                    {this.renderList()}
                </div>
            </div >
        )
    }
}