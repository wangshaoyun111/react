import React, { Suspense } from 'react'

// // 导入组件
// import Home from './pages/Home/index'
// import CityList from './pages/CityList/index'
// import Map from './pages/Map/index'
// import HouseDetail from './pages/HouseDetail'
// // 登录 注册
// import Login from './pages/Login/index.jsx'
// import Registe from './pages/Registe/index.jsx'
// // 导入路由配置文件
// // 导入 鉴权组件 
// import AuthRouter from './components/AuthRouter/index.jsx'
// // 发布房源路由
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'
// 导入路由配置文件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
// 对路由组件进行代码分割
const Home = React.lazy(() => import('./pages/Home/index'))
const CityList = React.lazy(() => import('./pages/CityList/index'))
const Map = React.lazy(() => import('./pages/Map/index'))
const HouseDetail = React.lazy(() => import('./pages/HouseDetail'))
const Login = React.lazy(() => import('./pages/Login/index.jsx'))
const Registe = React.lazy(() => import('./pages/Registe/index.jsx'))
const AuthRouter = React.lazy(() => import('./components/AuthRouter/index.jsx'))
const Rent = React.lazy(() => import('./pages/Rent'))
const RentAdd = React.lazy(() => import('./pages/Rent/Add'))
const RentSearch = React.lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由规则 */}
        {/* 匹配默认路由的时候，使用重定向，重定向到首页 */}
        {/* render 属性对应是函数 函数内部使用Redirect重定向组件 */}
        {/* Redirect组件有to属性 */}
        {/* render={ () => <Redirect to="/home" /> } */}
        <Suspense fallback={<div>Loading...</div>}>
          <Route path='/' exact render={() => <Redirect to="/home" />}></Route>
          <Route path='/home' component={Home} ></Route>
          <Route path='/map' component={Map} ></Route>
          <Route path='/cityList' component={CityList} ></Route>
          <AuthRouter path="/detail/:id" component={HouseDetail} />
          <Route path="/login" component={Login} />
          <Route path="/registe" component={Registe} />

          <AuthRouter exact path='/rent' component={Rent} />
          <AuthRouter path='/rent/add' component={RentAdd} />
          <AuthRouter path='/rent/search' component={RentSearch} />
        </Suspense>

      </div>
    </Router>
  )
}

export default App
