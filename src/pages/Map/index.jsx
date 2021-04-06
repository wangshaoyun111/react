import React from 'react'
import NavHeader from '../../components/NavHeader/index'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import styles from './index.module.css'
// import axios from 'axios'
import { API } from '../../utils/api.js'
// 导入封装的 HouseItem 组件
import HouseItem from '../../components/HouseItem/index.jsx'
// 导入 BASE_URL 变量
import { BASE_URL } from '../../utils/url.js'
const BMap = window.BMap
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}
export default class Map extends React.Component {
    state = {
        houseList: [], //小区下的房源数据
        isShowFlag: false
    }
    componentDidMount() {
        this.initMap()
    }
    // 百度地图初始化方法
    initMap() {
        // 初始化地图实例
        const map = new BMap.Map("container")
        this.map = map

        // 获取到当前城市的定位信息
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 调用百度地图的地址解析器，生成解析器实例
        const myGeo = new BMap.Geocoder()

        // 根据地址定位当前地图的展示信息
        myGeo.getPoint(label, async (point) => {
            if (point) {
                // centerAndZoom 这个方法是调整地图的缩放级别
                map.centerAndZoom(point, 11)

                map.addControl(new BMap.ScaleControl())
                map.addControl(new BMap.NavigationControl())

                console.log(this)
                this.renderOverlays(value)
            }
        }, label)
        // 地图移动事件，在地图移动过程中，隐藏房源列表
        map.addEventListener('movestart', () => {
            if (this.state.isShowFlag) {
                this.setState({
                    isShowFlag: false
                })
            }

        })
    }
    // 声明入口方法
    // 接收id获取房源数据
    // 需要获取覆盖物类型，获取缩放级别
    async renderOverlays(id) {
        try {
            Toast.loading('加载中...')
            // 调用接口
            const { data: res } = await API.get(`/area/map?id=${id}`)
            Toast.hide()
            if (res.status !== 200) return
            const { nextZoom, type } = this.getTypeAndZoom()

            res.body.forEach(item => {
                this.createOverlays(item, nextZoom, type)
            })
        } catch (error) {
            Toast.hide()
        }

    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    getTypeAndZoom() {
        // getTypeAndZoom 这个方法需要返回下一个缩放级别的类型和等级
        let nextZoom, type
        // 需要根据当前的缩放等级去渲染下一个等级
        const zoom = this.map.getZoom()

        if (zoom >= 10 && zoom < 12) {
            // 说明当前是区，下一个缩放级别是 13，代表是镇
            nextZoom = 13
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            // 说明当前是镇，下一个缩放级别是 15，代表是小区
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // 说明当前点击的是小区，只需要设置覆盖物类型为 rect 即可
            type = 'rect'
        }

        return {
            nextZoom,
            type
        }
    }

    // 创建覆盖物
    // 接收覆盖物类型，根据覆盖物类型渲染区镇还是小区
    createOverlays(item, nextZoom, type) {
        const {
            coord: { latitude, longitude },
            label: areaName,
            count,
            value
        } = item

        // 根据获取的精度、纬度，调用 BMap.Point 方法，生成地理位置
        const areaPoint = new BMap.Point(longitude, latitude)

        if (type === 'circle') {
            // 区和镇
            this.createCircle(areaPoint, value, areaName, count, nextZoom)
        } else {
            // 小区
            this.createRect(areaPoint, value, areaName, count)
        }
    }

    // 渲染区、镇覆盖物
    // 根据传入数据和缩放级别
    createCircle(point, id, areaName, count, nextZoom) {
        const opts = {
            // 目前这个 point 地理位置是固定的，所以在页面上只能看到一个房源信息
            // 需要将每个区镇的精度、纬度传递给 position ，才能够渲染出来对应的区镇
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(20, 20) //设置文本偏移量
        }

        // 创建 Label 实例对象，绘制文本覆盖物
        // 第一个参数，是需要添加覆盖的文本
        // 第二个参数，是文本覆盖物的定位
        const label = new BMap.Label('', opts)

        label.id = id

        // setContent 方法创建覆盖物的结构
        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${areaName}</p>
            <p>${count}套</p>
          </div>
        `)

        // 给添加的文本覆盖物设置样式
        label.setStyle(labelStyle)

        // 给房源覆盖物绑定点击事件
        label.addEventListener('click', () => {
            this.renderOverlays(label.id)
            console.log(label.id);
            console.log(nextZoom);
            // 设置下一个的缩放级别，并设置覆盖物
            this.map.centerAndZoom(point, nextZoom)

            // 清除之前的覆盖物，创建下一个级别的覆盖物
            setTimeout(() => {
                this.map.clearOverlays()
            }, 0)
        })

        // 通过 addOverlay 方法将文本覆盖物添加到地图上
        this.map.addOverlay(label)
    }

    // 创建小区覆盖物
    // 创建小区覆盖物
    createRect(point, id, areaName, count) {
        const opts = {
            // 目前这个 point 地理位置是固定的，所以在页面上只能看到一个房源信息
            // 需要将每个区镇的精度、纬度传递给 position ，才能够渲染出来对应的区镇
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(20, 20) //设置文本偏移量
        }

        // 创建 Label 实例对象，绘制文本覆盖物
        // 第一个参数，是需要添加覆盖的文本
        // 第二个参数，是文本覆盖物的定位
        const label = new BMap.Label('', opts)

        label.id = id

        // setContent 方法创建覆盖物的结构
        // 调整成镇的覆盖物信息
        label.setContent(`
          <div class="${styles.rect}">
            <span class="${styles.housename}">${areaName}</span>
            <span class="${styles.housenum}">${count}套</span>
            <i class="${styles.arrow}"></i>
          </div>
        `)

        // 给添加的文本覆盖物设置样式
        label.setStyle(labelStyle)

        // 给房源覆盖物绑定点击事件
        label.addEventListener('click', (e) => {
            // 调用获取小区房源的方法
            this.getHouseList(label.id)

            // 根据点击的坐标点来调用地图的 panBy 方法来移动
            const target = e.changedTouches[0]
            // 方法接收 x y 两个坐标轴作为参数
            this.map.panBy(
                window.innerWidth / 2 - target.clientX, // X轴
                (window.innerHeight - 300) / 2 - target.clientY // Y轴
            )
        })

        // 通过 addOverlay 方法将文本覆盖物添加到地图上
        this.map.addOverlay(label)
    }

    // 获取小区房源数据的方法
    async getHouseList(id) {
        try {
            Toast.loading('加载中...')
            const { data: res } = await API.get(`/houses?cityId=${id}`)
            Toast.hide()
            if (res.status !== 200) return
            console.log(res.body)
            this.setState({
                houseList: res.body.list,
                isShowFlag: true
            })
        } catch (error) {
            Toast.hide()
        }
    }

    // 渲染小区 ui 结构的方法
    renderHouseList() {
        return this.state.houseList.map(item => (
            <HouseItem
                key={item.houseCode}
                houseImg={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        ))
    }
    render() {
        return (
            <div className={styles.map_container}>
                {/* 顶部导航栏功能 */}
                <div className={styles.my_navbar}>
                    <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>
                </div>

                {/* 地图容器元素 */}
                <div id="container" className={styles.container}></div>
                {/* 小区房源列表数据 */}
                <div
                    className={[
                        styles.houseList,
                        this.state.isShowFlag ? styles.show : ''
                    ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHouseList()}
                    </div>
                </div>
            </div>
        )
    }
}