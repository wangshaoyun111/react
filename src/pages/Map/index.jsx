import React from 'react'
import NavHeader from '../../components/NavHeader/index'
import styles from './index.module.css'
export default class Profile extends React.Component {

    componentDidMount() {
        // 初始化地图实例
        const map = new window.BMap.Map("container")

        // 获取到当前城市定位信息
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 调用百度地图解析器,生成解析器实例
        const myGeo = new window.BMap.Geocoder()

        // 根据地址定位当前地图展示信息
        myGeo.getPoint(label, function(point) {
            if (point) {
                // centerAndZoom 方法 调整地图的缩放级别
                map.centerAndZoom(point, 11)
                map.addControl(new window.BMap.ScaleControl())
                map.addControl(new window.BMap.NavigationControl())
                const opts = {
                    position: point,    // 指定文本标注所在的地理位置
                    offset: new window.BMap.Size(20, 20)    //设置文本偏移量
                }
                // 创建label 方法，绘制文本覆盖物,
                // 第一个参数是需要添加文本
                // 第二个参数为文本覆盖物的定位
                const label = new window.BMap.Label("文本信息~", opts)
                // 设置样式
                label.setStyle({
                    color: "red",
                    fontSize: "12px",
                    height: "20px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                })
                // 将覆盖物添加到地图中
                map.addOverlay(label)
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