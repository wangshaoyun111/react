import React from 'react'

// 导入组件
import Home from './pages/Home/index'
import CityList from './pages/CityList/index'
// 导入路由配置文件
import { BrowserRouter as Router, Route } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由规则 */}
        <Route path='/home' component={ Home } ></Route>
        <Route path='/cityList' component={ CityList } ></Route>
      </div>
    </Router>
  )
}

export default App
