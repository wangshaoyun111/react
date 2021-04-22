import React from 'react'

// 导入组件
import Home from './pages/Home/index'
import CityList from './pages/CityList/index'
import Map from './pages/Map/index'
import HouseDetail from './pages/HouseDetail'
// 登录 注册
import Login from './pages/Login/index.jsx'
import Registe from './pages/Registe/index.jsx'
// 导入路由配置文件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入 鉴权组件 
import AuthRouter from './components/AuthRouter/index.jsx'
function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由规则 */}
        {/* 匹配默认路由的时候，使用重定向，重定向到首页 */}
        {/* render 属性对应是函数 函数内部使用Redirect重定向组件 */}
        {/* Redirect组件有to属性 */}
        {/* render={ () => <Redirect to="/home" /> } */}
        <Route path='/' exact render={() => <Redirect to="/home" />}></Route>
        <Route path='/home' component={Home} ></Route>
        <Route path='/map' component={Map} ></Route>
        <Route path='/cityList' component={CityList} ></Route>
        <AuthRouter path="/detail/:id" component={HouseDetail} />
        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />
      </div>
    </Router>
  )
}

export default App
