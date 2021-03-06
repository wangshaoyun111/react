import React from 'react'
// 按需导入
import { Button } from 'antd-mobile'

// 导入组件
import Home from './pages/Home/index'
import CityList from './pages/CityList/index'
// 导入路由配置文件
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        <p>我是跟组件</p>
        <Button>Start</Button>

        <ul>
          {/* 配置路由入口 */}
          <li><Link to='/home'>去 Home 页面</Link></li>
          <li><Link to='/cityList'>去 City List 页面</Link></li>
        </ul>

        {/* 配置路由规则 */}
        <Route path='/home' component={ Home } ></Route>
        <Route path='/cityList' component={ CityList } ></Route>
      </div>
    </Router>
  )
}

export default App
