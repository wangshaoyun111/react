import React from 'react'

import './index.css'
export default class Profile extends React.Component {
    
    componentDidMount() {
        // 初始化地图实例
        const map = new window.BMap.Map("container")
        
        // 设置中心坐标点
        const point = new window.BMap.Point(116.404, 39.915)

        // 初始化地图
        map.centerAndZoom(point, 15)
    }
    render() {
        return (
            <div className='map-container'>
                <div id="container"></div>
            </div>
        )
    }
}