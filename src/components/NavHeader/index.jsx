import React from 'react'

import { NavBar } from 'antd-mobile'
import './index.scss'
function NavHeader(props) {
    console.log(props)
    // 通过组件调用者来传递方法不能直接使用props.history

    // 定义返回上一页函数，组件使用者没有传入onLeftClick，点击会报错
    // 自定义一个事件实现返回
    const defaultBack = () => props.history.go(-1)
    return (
        <div>
            <NavBar
                className='navBar'
                mode="light"
                icon={<i className='iconfont icon-back'></i>}
                onLeftClick={props.onLeftClick || defaultBack}>
                {props.children}
            </NavBar>
        </div>
    )
}
export default NavHeader