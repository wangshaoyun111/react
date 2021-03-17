import React from 'react'
import NavHeader from '../../components/NavHeader/index'
import styles from './index.module.css'
import axios from 'axios'
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
export default class Profile extends React.Component {

    componentDidMount() {
        // 初始化地图实例
        const map = new window.BMap.Map("container")
        this.map = map
        // 获取到当前城市定位信息
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 调用百度地图解析器,生成解析器实例
        const myGeo = new window.BMap.Geocoder()

        // 根据地址定位当前地图展示信息
        myGeo.getPoint(label, async (point) => {
            if (point) {
                // centerAndZoom 方法 调整地图的缩放级别
                map.centerAndZoom(point, 11)
                map.addControl(new window.BMap.ScaleControl())
                map.addControl(new window.BMap.NavigationControl())

                this.renderOverlays(value)
            }
        }, label)
    }

    // 声明入口方法
    // 接收id获取房源数据
    // 需要获取覆盖物类型，获取缩放级别
    async renderOverlays(id) {
        // 调用接口
        const { data: res } = await axios.get(`https://api-haoke-web.itheima.net/area/map?id=${id}`)
        if (res.status !== 200) return
        res.body.forEach(item => {
            this.createOverlays(item, nextZoom, type)
        })
        // 调用 getTypeAndZoom 方法获取级别和类型
        const { nextZoom, type } = this.getTypeAndZoom()
    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    getTypeAndZoom() {
        // 返回下一个缩放级别类型和等级
        let nextZoom, type
        // 调用地图的 getZoom() 方法，来获取当前缩放级别
        const zoom = this.map.getZoom()
        if (zoom >= 10 && zoom < 12) {
            // 说明当前是区，下一个缩放级别是13，代表是镇
            nextZoom = 13
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            // 说明当前是镇，下一个缩放级别是15，代表是小区
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // 说明当前是小区，不需要缩放只需要设置覆盖物类型为 rect
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
        // 根据获取的精度维度 通过方法，生产地理位置
        const areaPoint = new window.BMap.Point(longitude, latitude)
        if (type === 'circle') {
            // 说明渲染区和镇
            this.createCircle()
        } else {
            // 小区
            this.createRect()
        }
        // 调用接口获取房源数据
        const { data: res } = await axios.get(`https://api-haoke-web.itheima.net/area/map?id=${value}`)
        if (res.status !== 200) return
        res.body.forEach(item => {
            console.log(item);
            const opts = {
                position: areaPoint,    // 指定文本标注所在的地理位置
                offset: new window.BMap.Size(20, 20)    //设置文本偏移量
            }
            // 创建label 方法，绘制文本覆盖物,
            // 第一个参数是需要添加文本
            // 第二个参数为文本覆盖物的定位
            const label = new window.BMap.Label("", opts)
            label.id = value
            label.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">${areaName}</p>
                    <p>${count}</p>
                </div>
            `)
            // 设置样式
            label.setStyle(labelStyle)

            // 给房源覆盖物绑定点击事件
            label.addEventListener('click', () => {
                map.centerAndZoom(point, 13)
                // 需要将清空覆盖物代码放到定时器中，在清除覆盖物的时候
                // 地图会重新初始化放大级别，如果直接进行清除会报错
                // 需要将地图初始化以后在进行移除
                setTimeout(() => {
                    map.clearOverlays()
                }, 0)
            })
            // 将覆盖物添加到地图中
            map.addOverlay(label)
        })
    }

    // 渲染区、镇覆盖物
    // 根据传入数据和缩放级别
    createCircle() { }

    // 创建小区覆盖物
    createRect() { }

    render() {
        return (
            <div className={styles.map_container}>
                {/* 顶部导航栏功能 */}
                <div className={styles.my_navbar}>
                    <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>
                </div>

                {/* 地图容器元素 */}
                <div id="container" className={styles.container}></div>
            </div>
        )
    }
}