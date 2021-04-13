import React from 'react'

import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import styles from './index.module.css'
function NavHeader(props) {
    console.log(props)
    // 通过组件调用者来传递方法不能直接使用props.history

    // 定义返回上一页函数，组件使用者没有传入onLeftClick，点击会报错
    // 自定义一个事件实现返回
    // 这里的props就是withRouter提供的信息就不需要组件使用者传递
    const defaultBack = () => props.history.go(-1)

    const className = props.className
    const rightContent = props.rightContent
    // 封装发现，不能通过 props 获取 history
    // 使用 react-router-dom 路由模块提供的 withRouter方法（高阶组件）
    return (
        <div>
            <NavBar
                className={[styles.navbar, className || ''].join(' ')}
                mode="light"
                icon={<i className='iconfont icon-back'></i>}
                onLeftClick={props.onLeftClick || defaultBack}
                rightContent={rightContent}
            >
                {props.children}
            </NavBar>
        </div>
    )
}
export default withRouter(NavHeader)