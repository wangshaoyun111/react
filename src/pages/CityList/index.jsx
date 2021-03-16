import React from 'react'
import axios from 'axios'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader/index'

// 导入react-virtualized List组件
import { List, AutoSizer } from 'react-virtualized'
import './index.scss'

// 导入封装获取城市信息方法
import { getCurrentCityName } from '../../utils/getCityName.js'
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
// 处理城市列表索引项字母
const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}
// 索引 (A,B等级)高度
const TITLE_HEIGHT = 36
const CITYNAME_HEIGHT = 50
// 当前包含城市房源信息的数组
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
export default class CityList extends React.Component {
    constructor() {
        super()
        this.state = {
            cityList: {}, // 城市列表
            cityIndex: [], // 城市索引
            activeIndex: 0  // 控制右侧索引高亮
        }

        // 获取dom元素
        this.cityListComponent = React.createRef()
    }
    async componentDidMount() {
        // 调用获取城市数据方法
        await this.getCityList()

        // 调用list组件方法让列表点击精度
        this.cityListComponent.current.measureAllRows()
    }

    // 获取城市列表数据方法
    async getCityList() {
        const { data: res } = await axios.get('http://api-haoke-web.itheima.net/area/city?level=1')
        if (res.status !== 200) return
        // 获取数据以后处理数据格式获取想要格式
        const { cityList, cityIndex } = formatCityData(res.body)

        const { data: result } = await axios.get('http://api-haoke-web.itheima.net/area/hot')
        cityList['hot'] = result.body
        cityIndex.unshift('hot')
        // 调用获取当前城市定位的方法
        const currentCity = await getCurrentCityName()
        console.log(currentCity);

        cityList['#'] = [currentCity]
        cityIndex.unshift('#')
        this.setState({
            cityList,
            cityIndex
        })
    }

    // 渲染城市列表索引方法
    renderCityIndex() {
        // 获取数据
        // 生成结构
        const { cityIndex, activeIndex } = this.state
        return cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => {
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>
        ))
    }

    // rowRenderer list组件 渲染方法
    // 页面内容 渲染函数
    rowRenderer = ({
        key, // 确保渲染元素的唯一性
        index, // 索引号
        isScrolling, // 当前渲染这一项是否正在滚动中
        isVisible, // 当前渲染这一项是否还在可视区渲染
        style, // 重要   必须的  是给渲染出来的每一行添加定位信息，指定每一行位置
    }) => {
        // 从state取出数据
        const { cityList, cityIndex } = this.state
        // 从cityIndex 取出对应索引值
        const letter = cityIndex[index]
        return (
            <div key={key} style={style} className='city-list'>
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item => (
                        <div className='name' key={item.value} onClick={() => {
                            this.changeCity(item)
                        }}>
                            {item.label}
                        </div>
                    ))
                }
            </div>
        );
    }

    // 切换城市
    changeCity = ({ label, value }) => {
        // console.log(cityInfo)
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.info('该城市暂无房源数据', 2, null, false)
        }
    }
    // 滑动城市列表 让城市高亮
    onRowsRendered = ({ startIndex }) => {
        // startIndex 就是list 当前可视区域渲染时最顶部一行的索引
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
        console.log(startIndex);
    }

    // 动态创建索引高度方法
    getRowHeight = ({ index }) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * CITYNAME_HEIGHT
    }
    render() {
        return (
            // 顶部导航
            <div className='ciyilist-container'>
                <div className='my-navbar'>
                    <NavHeader>城市选择</NavHeader>
                </div>

                {/* 城市列表区域 */}
                <AutoSizer>
                    {
                        ({ height, width }) => (
                            <List
                                ref={this.cityListComponent}
                                scrollToAlignment='start'
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                            />
                        )
                    }
                </AutoSizer>
                {/* 城市列表索引区域 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}