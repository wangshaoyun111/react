import React from 'react'

import { NavBar } from 'antd-mobile'

import './index.scss'
export default class CityList extends React.Component {
    render() {
        return (
            // 顶部导航
            <div className='ciyilist-container'>
                <NavBar
                    className='navBar'
                    mode="light"
                    icon={<i className='iconfont icon-back'></i>}
                    onLeftClick={() => this.props.history.go(-1)}>
                    城市选择
                </NavBar>
            </div>
        )
    }
}