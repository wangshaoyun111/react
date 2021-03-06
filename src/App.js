import React from 'react'

// 导入组件
import Home from './pages/Home/index'
import CityList from './pages/CityList/index'
// 导入路由配置文件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由规则 */}
        {/* 匹配默认路由的时候，使用重定向，重定向到首页 */}
        {/* render 属性对应是函数 函数内部使用Redirect重定向组件 */}
        {/* Redirect组件有to属性 */}
        {/* render={ () => <Redirect to="/home" /> } */}
        <Route path='/' render={ () => <Redirect to="/home" /> }></Route>
        <Route path='/home' component={ Home } ></Route>
        <Route path='/cityList' component={ CityList } ></Route>
      </div>
    </Router>
  )
}

export default App
