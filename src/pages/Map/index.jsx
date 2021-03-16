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