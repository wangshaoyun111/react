import React from 'react'

// 导入 antd-mobile 组件
import { Flex } from 'antd-mobile'

import './index.scss'
// 如果是函数组件需要导入 withRouter 组件，获取路由对象
// 因为是类组件，直接能获取路由信息 ，history可以直接使用
export default class SearchHeader extends React.Component {
    render() {
        return (
            <Flex className={['search-box', this.props.className || ''].join(' ')}>
                {/* 左侧白色区域 */}
                <Flex className="search">
                    {/* 位置 */}
                    <div
                        className="location"
                        onClick={() => this.props.history.push('/citylist')}
                    >
                        <span className="name">{this.props.currentCityName}</span>
                        <i className="iconfont icon-arrow" />
                    </div>

                    {/* 搜索表单 */}
                    <div
                        className="form"
                        onClick={() => this.props.history.push('/search')}
                    >
                        <i className="iconfont icon-seach" />
                        <span className="text">请输入小区或地址</span>
                    </div>
                </Flex>
                {/* 右侧地图图标 */}
                <i
                    className="iconfont icon-map"
                    onClick={() => this.props.history.push('/map')}
                />
            </Flex>
        )
    }
}