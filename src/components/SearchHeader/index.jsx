import React from 'react'

// 导入 antd-mobile 组件
import { Flex } from 'antd-mobile'

import './index.scss'

// 导入校验 props 的方法
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
// 如果是函数组件需要导入 withRouter 组件，获取路由对象
// 如果是类组件 ，也需要使用 withRouter
class SearchHeader extends React.Component {
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

SearchHeader.propTypes = {
    currentCityName: PropTypes.string.isRequired,
    className: PropTypes.string
}

export default withRouter(SearchHeader)