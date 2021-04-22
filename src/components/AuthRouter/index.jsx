import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth.js'

const AuthRouter = ({ component: Component, ...rest }) => {
    // 给 Route 添加 render 方法 ，方法中指定需要渲染的 UI 结构
    return <Route {...rest} render={props => {
        // 获取用户登录状态
        const isLogin = isAuth()
        if (isLogin) {
            return <Component {...props} />
        } else {
            return <Redirect to={{
                pathname: '/login',
                // 指定登录成功后需要跳转的路径
                state: {
                    from: props.location
                }
            }} />
        }
    }}></Route>
}

export default AuthRouter