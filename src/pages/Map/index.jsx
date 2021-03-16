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

        // 获取到当前城市定位信息
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 调用百度地图解析器,生成解析器实例
        const myGeo = new window.BMap.Geocoder()

        // 根据地址定位当前地图展示信息
        myGeo.getPoint(label, async function(point) {
            if (point) {
                // centerAndZoom 方法 调整地图的缩放级别
                map.centerAndZoom(point, 11)
                map.addControl(new window.BMap.ScaleControl())
                map.addControl(new window.BMap.NavigationControl())

                // 调用接口获取房源数据
                const { data: res } = await axios.get(`https://api-haoke-web.itheima.net/area/map?id=${value}`)
                if (res.status !== 200) return
                res.body.forEach(item => {
                    const {
                        coord: { latitude, longitude },
                        label: areaName,
                        count,
                        value
                    } = item
                    // 根据获取的精度维度 通过方法，生产地理位置
                    const areaPoint = new window.BMap.Point(longitude, latitude)
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
                        console.log(label.id);
                    })
                    // 将覆盖物添加到地图中
                    map.addOverlay(label)
                })
            }
        }, label)
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