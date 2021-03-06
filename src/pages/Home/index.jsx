import React from 'react'


// 导入子组件
import News from '../News/index'

// 导入里有组件
import { Route } from 'react-router-dom'
export default class Home extends React.Component {
    render() {
        return (
            <div>
                <h4>我是Home组件</h4>

                <Route path='/home/news' component={ News }></Route>
            </div>
        )
    }
}