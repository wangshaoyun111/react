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
        const { nextZoom, type } = this.getTypeAndZoom()
        // 调用接口
        const { data: res } = await axios.get(`https://api-haoke-web.itheima.net/area/map?id=${id}`)
        if (res.status !== 200) return
        res.body.forEach(item => {
            this.createOverlays(item, nextZoom, type)
        })
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
        const areaPoint = new window.BMap.Point(longitude, latitude)

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
            position: point,    // 指定文本标注所在的地理位置
            offset: new window.BMap.Size(20, 20)    //设置文本偏移量
        }
        // 创建label 方法，绘制文本覆盖物,
        // 第一个参数是需要添加文本
        // 第二个参数为文本覆盖物的定位
        const label = new window.BMap.Label('', opts)

        label.id = id

        // setContent 方法创建覆盖物的结构
        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${areaName}</p>
            <p>${count}套</p>
          </div>
        `)
        // 设置样式
        label.setStyle(labelStyle)

        // // 给房源覆盖物绑定点击事件
        label.addEventListener('click', () => {
            this.renderOverlays(label.id)
            // 设置下一次的缩放级别，并设置覆盖物
            this.map.centerAndZoom(point, nextZoom)
            // // 需要将清空覆盖物代码放到定时器中，在清除覆盖物的时候
            // // 地图会重新初始化放大级别，如果直接进行清除会报错
            // // 需要将地图初始化以后在进行移除
            setTimeout(() => {
                this.map.clearOverlays()
            }, 0)
        })
        // 将覆盖物添加到地图中
        this.map.addOverlay(label)
    }

    // 创建小区覆盖物
    c// 创建小区覆盖物
    createRect(point, name, count, id) {
        // 创建覆盖物
        const label = new window.BMap.Label('', {
            position: point,
            offset: new window.BMap.Size(-50, -28)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
        <div class="${styles.rect}">
            <span class="${styles.housename}">${name}</span>
            <span class="${styles.housenum}">${count}套</span>
            <i class="${styles.arrow}"></i>
        </div>
        `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            console.log('小区被点击了')
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
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
            </div>
        )
    }
}