### React 好客租房(上)

----

#### 001 - 轮播图结构布局

1.  打开官方文档，找到[走马灯组件](https://mobile.ant.design/components/carousel-cn/#components-carousel-demo-basic)
2.  点击代码图标，显示源码，根据源码，导入组件
3.  复制数据、方法以及结构实现布局即可
4.  分析组件的属性(属性详见官方文档说明)

```jsx
import React from 'react'

// 导入组件
import { Carousel } from 'antd-mobile'

export default class Index extends React.Component {

  state = {
    // 轮播图数据
    data: ['1', '2', '3'],
    // 轮播图高度
    imgHeight: 176
  }

  componentDidMount() {
    // 具体代码略
  }

  render() {
    return (
      <div>
        {/* 轮播图 */}
        <Carousel>
            {/* 具体代码略 */}
        </Carousel>
      </div>
    )
  }
}

```



#### 002 - 请求轮播图数据并渲染结构

> <p style="color: red; font-weight: bold">注意：Ant Design Mobile 轮播图在使用时存在坑，解决方案见 005 - 轮播图 bug 修改</p>

1.   首先安装 `axios`

   ```jsx
   cnpm i axios --save
   
   // or
   
   yarn add axios
   ```

2.   在 `Index -- index.jsx` 文件中导入 `axios`

   ```jsx
   // 导入 axios
   import axios from 'axios'
   ```

3.   声明请求数据的方法 `getSwipers`， 请求数据，并赋值

   -  在方法中使用 `axios` 请求数据
   -  在钩子函数 `componentDidMount` 中进行调用
   -  在 `state` 中声明 `swipers` 变量
   -  对 `swipers` 进行赋值

   ```jsx
   componentDidMount() {
     // 调用获取轮播图数据的方法
     this.getSwipers()
   }
   
   // 获取轮播图数据的方法
   async getSwipers () {
     const { data: res } = await axios.get(`http://118.190.160.53:8009/home/swiper`)
   
     if (res.status !== 200) {
       return
     }
   
     this.setState(() => {
       return {
         swipers: res.body
       }
     })
   }
   ```

4.  使用请求回来的数据对 `UI` 结构进行遍历

   -  首先将 map 方法 中的 val 替换为 item
   -  更改 key 的值为 `item.id`
   -  更改 `img` 的图片地址 `item.imgSrc`，同时需要在地址前面加上域名
   -  删除多余的冗余代码

   ```jsx
   {/* 轮播图 */}
   <Carousel
     autoplay={false}
     infinite
   >
     {this.state.swipers.map(item => (
       <a
         key={item.id}
         style={{ display: 'inline-block', width: '100%', height: '212px' }}
       >
         <img
           src={`http://118.190.160.53:8009${item.imgSrc}`}
           alt={item.alt}
           style={{ width: '100%', verticalAlign: 'top' }}
         />
       </a>
     ))}
   </Carousel>
   ```
   
   ```jsx
   // 渲染轮播图结构的方法
   renderSwiper() {
     return this.state.swipers.map(item => (
       <a
         key={item.id}
         href="true"
         style={{ display: 'inline-block', width: '100%', height: '212px' }}
       >
         <img
           src={`https://api-haoke-web.itheima.net${item.imgSrc}`}
           alt=""
           style={{ width: '100%', verticalAlign: 'top' }}
         />
       </a>
     ))
   }
   ```



​	



#### 003 - 导航菜单

1.  从素材中复制 `img`  到 `assets` 文件夹中

2.   从官方文档中导入 `Flex` 布局

   ```jsx
   import { Carousel, Flex } from 'antd-mobile'
   ```

3.  使用官方给提供的结构实现布局

   ```jsx
   <Flex>
       <Flex.Item><PlaceHolder /></Flex.Item>
       <Flex.Item><PlaceHolder /></Flex.Item>
       <Flex.Item><PlaceHolder /></Flex.Item>
       <Flex.Item><PlaceHolder /></Flex.Item>
   </Flex>
   ```

4.  导入图片，实现布局

   ```jsx
   // 引入图片
   
   import Nav1 from '../../assets/images/nav-1.png'
   import Nav2 from '../../assets/images/nav-2.png'
   import Nav3 from '../../assets/images/nav-3.png'
   import Nav4 from '../../assets/images/nav-4.png'
   ```

   ```jsx
   // 实现布局
   
   {/* 导航区域 */}
   <Flex className="nav">
     <Flex.Item>
       <img src={Nav1} alt="" />
       <h2>整租</h2>
     </Flex.Item>
   
     <Flex.Item>
       <img src={Nav2} alt="" />
       <h2>合租</h2>
     </Flex.Item>
   
     <Flex.Item>
       <img src={Nav3} alt="" />
       <h2>地图找房</h2>
     </Flex.Item>
   
     <Flex.Item>
       <img src={Nav4} alt="" />
       <h2>去出租</h2>
     </Flex.Item>
   </Flex>
   ```

5. 样式美化

   ```jsx
   .nav {
     padding: 10px 0;
   }
   .nav .am-flexbox-item {
     text-align: center;
   }
   .nav img {
     width: 48px;
   }
   .nav h2 {
     margin-top: 7px;
     font-size: 13px;
     font-weight: normal;
   }
   ```

   

#### 004 - 导航菜单重构

1.  准备导航菜单数据

   ```js
   const navs = [
     {
       id: 1,
       img: Nav1,
       title: '整租',
       path: '/home/list'
     },
     {
       id: 2,
       img: Nav2,
       title: '合租',
       path: '/home/list'
     },
     {
       id: 3,
       img: Nav3,
       title: '地图找房',
       path: '/map'
     },
     {
       id: 4,
       img: Nav4,
       title: '去出租',
       path: '/rent/add'
     }
   ]
   ```

2.  和 `render` 同级创建 `renderNavs` 方法，对数据进行遍历，并渲染 `UI` 结构

   ```jsx
   // 渲染导航菜单
   renderNavs () {
     return navs.map(item => (
       <Flex.Item key={item.id} onClick={ () => this.props.history.push(item.path) }>
         <img src={item.img} alt="" />
         <h2>{item.title}</h2>
       </Flex.Item>
     ))
   }
   ```

3.  在 `<Flex>` 中调用封装好的 `renderNavs` 方法

   ```jsx
   {/* 导航菜单 */}
   <Flex className="nav">
     { this.renderNavs() }
   </Flex>
   ```

   

#### 005 - 轮播图 bug 修复

1.  存在的坑： 轮播图首屏图片需要滑动一次才能自动播放，第一张图片只加载一半卡住。

   -  原因分析： 

     - 官网案例没问题，因为官方数据是写死的
  - 但是我们项目数据是服务器返回的，存在异步问题
   
  - 轮播图数据是动态加载的，加载完成前后轮播图数量不一致
   
     
   
-  解决方案：  
   
     -  使用更新阶段的钩子函数 `componentDidUpdate`
     -  使用 `this.setState()`第二个回调函数
     -  还是使用 `this.setState()`
   
   ```jsx
   // 解决方案 1
   
   state = {
       swipers: [],
       // 1. 声明一个变量，初始值为 false
       IndexFlag: false
   }
   
   componentDidUpdate() {
       // 判断如果IndexFlag如果是 true，则阻止代码往下运行
       // 如果不判断，会造成死循环
       if (this.state.IndexFlag === true) {
         return
       }
   
       // 如果 swipers 轮播图有数据
       // 则将 IndexFlag 设置为 true
       if (this.state.swipers.length !== 0) {
         this.setState({
           IndexFlag: true
         })
       }
   }
   
   // ....
// 在页面中使用声明的 IndexFlag 数据
   <Carousel infinite  autoplay={this.state.IndexFlag}>
   </Carousel>
   // ...
   ```
   
   ```jsx
   // 解决方案 2
   
   async getSwipers() {
   	const { data: res } = await axios.get(`http://118.190.160.53:8009/home/swiper`)
   
       if (res.status !== 200) {
         return
       }
   
       // 使用 `this.setState()`第二个回调函数
       this.setState(() => {
         return {
           swipers: res.body
         }
       }, () => {
         this.setState({
        IndexFlag: true
         })
       })
   }
   ```
   
   ```jsx
   // 解决方案 3
   // ① 在 state 数据中声明一个变量 IndexFlag
   // ② 在 this.setState 中对 IndexFlag 进行赋值
   // ③ 判断 IndexFlag 是 true 还是 false ，就是是否展示轮播图
   
   state = {
       // 轮播图状态数据
       swipers: [],
       IndexFlag: false
   }
   
   // 获取轮播图数据的方法
   async getSwipers() {
       const res = await axios.get('http://localhost:8080/home/swiper')
       this.setState({
         swipers: res.data.body,
         IndexFlag: true
       })
   }
   
   // 其他代码略……
   {/* 轮播图 */}
   <div className="swiper">
     {this.state.IndexFlag ? (
       <Carousel autoplay infinite autoplayInterval={5000}>
         {this.renderSwipers()}
       </Carousel>
     ) : (
       ''
     )}
   </div>
   ```



#### 006 - `TabBar` 菜单高亮 `Bug` 分析和修复

1.  问题： 点击首页导航菜单，导航到 找房列表 页面时，找房菜单没有高亮

2.  原因： 原来我们实现该功能的时候，只考虑了 点击 以及 第一次加载 Home 组件的情况，没有考虑不重新加载 Home 组件时的路由切换，因为，这种情况下，我们的代码没有覆盖到

3.  方案： 在钩子函数 `componentDidUpdate` 中判断两次 props 接收的 location 是否一直，如果不一致的情况下，将最新的复制给  `selectedTab`

   ```js
   // home.jsx
   
   componentDidUpdate (prevProps) {
     if (prevProps.location.pathname !== this.props.location.pathname) {
       this.setState({
         selectedTab: this.props.location.pathname
       })
     }
}
   ```
   
   



#### 007 - 在脚手架中使用 `sass`

>  在安装 node-sass 的过程中，可能会报错，如果报错，将 node-sass 切换到低版本



1.  安装包 `node-sass`

   ```js
   yarn add node-sass
   
   // or
   
   cnpm i node-sass@4.14.1 -D
   ```

2.  新建以 `.scss` 或者 `.sass` 结尾的样式文件

   -  `Index  --> index.scss`

3.  在新建的样式文件使用就可以使用 sass 语法进行写 `css` 即可

   ```scss
   .nav {
     padding: 10px 0;
   
     .am-flexbox-item {
       text-align: center;
     }
   
     img {
       width: 48px;
     }
   
     h2 {
       margin-top: 7px;
       font-size: 13px;
       font-weight: normal;
     }  
   }
   ```

   

#### 008 - 租房小组数据渲染

1.  声明 `getGroups`方法，发送请求租房小组数据

   - 声明 `getGroups`方法，并在 `componentDidMount` 中调用方法， 获取租房小组数据
   - 在 `state` 中声明 `groups` 私有数据
   - 将结果赋值给 `groups`

   ```jsx
   componentDidMount() {
       // 调用获取轮播图数据的方法
       this.getSwipers()
       // 调用获取租房小组数据的方法
       this.getGroups()
   }
   
   // 获取租房小组数据的方法
   async getGroups() {
     const res = await axios.get('http://8.131.91.46:8009/home/groups', {
       params: {
         area: 'AREA%7C88cff55c-aaa4-e2e0'
       }
     })
   
     this.setState({
       groups: res.data.body
     })
   }
   ```
   
   

2.  渲染租房小组 UI 结构

```html
{/* 租房小组 */}
<div className="group">
  <h3 className="group-title">
    租房小组 <span className="more">更多</span>
  </h3>

  {/* 宫格组件 */}
  <Grid
    data={this.state.groups}
    columnNum={2}
    square={false}
    hasLine={false}
    renderItem={item => (
      <Flex className="group-item" justify="around" key={item.id}>
        <div className="desc">
          <p className="title">{item.title}</p>
          <span className="info">{item.desc}</span>
        </div>
        <img src={'http://8.131.91.46:8009' + item.imgSrc} alt="" />
      </Flex>
    )}
  />
</div>
```



3. UI 结构布局

```css
// 租房小组样式：
.group {
  background-color: #f6f5f6;
  overflow: hidden;
  padding: 0 10px;

  .group-title {
    position: relative;
    margin: 15px 0px 15px 10px;
    font-size: 15px;
    .more {
      color: #787d82;
      position: absolute;
      right: 0;
      font-size: 14px;
      font-weight: normal;
    }
  }

  // 覆盖默认背景色
  .am-grid .am-flexbox {
    background-color: inherit;

    .am-flexbox-item .am-grid-item-content {
      padding: 0;
      padding-bottom: 10px;
    }
  }

  .group-item {
    height: 75px;

    .desc {
      .title {
        font-weight: bold;
        font-size: 13px;
        margin-bottom: 5px;
      }
      .info {
        font-size: 12px;
        color: #999;
      }
    }
    img {
      width: 55px;
    }
  }

  .am-flexbox-align-stretch {
    margin-bottom: 10px;

    .am-grid-item {
      background-color: #fff;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
```



####  009 - 资讯列表

> 拷贝即可



1. 请求数据

   ```js
   // 获取最新资讯
   async getNews() {
     const res = await axios.get('http://8.131.91.46:8009/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
   
     this.setState({
       news: res.data.body
     })
   }
   ```

   

2. UI 结构

   ```html
   // 渲染最新资讯
   renderNews() {
     return this.state.news.map(item => (
       <div className="news-item" key={item.id}>
         <div className="imgwrap">
           <img
             className="img"
             src={'http://8.131.91.46:8009' + item.imgSrc}
             alt=""
           />
         </div>
         <Flex className="content" direction="column" justify="between">
           <h3 className="title">{item.title}</h3>
           <Flex className="info" justify="between">
             <span>{item.from}</span>
             <span>{item.date}</span>
           </Flex>
         </Flex>
       </div>
     ))
   }
   ```

   ```html
   {/* 最新资讯 */}
   <div className="news">
     <h3 className="group-title">最新资讯</h3>
     <WingBlank size="md">{this.renderNews()}</WingBlank>
   </div>
   ```

   

3. 样式美化

   ```css
   // 最新资讯：
   .news {
     padding: 10px;
     background-color: #fff;
     overflow: hidden;
   
     .group-title {
       margin: 10px 0 5px 10px;
       font-size: 15px;
     }
   
     .news-item {
       height: 120px;
       padding: 15px 10px 15px 0;
       border-bottom: 1px solid #e5e5e5;
     }
   
     .news-item:last-child {
       border: 0;
     }
   
     .imgwrap {
       float: left;
       height: 90px;
       width: 120px;
     }
   
     .img {
       height: 90px;
       width: 120px;
     }
   
     .content {
       overflow: hidden;
       height: 100%;
       padding-left: 12px;
     }
   
     .title {
       margin-bottom: 15px;
       font-size: 14px;
     }
   
     .info {
       width: 100%;
       color: #9c9fa1;
       font-size: 12px;
     }
   
     .message-title {
       margin-bottom: 48px;
     }
   }
   
   ```

   



#### 010 - 顶部导航

> 拷贝即可



1. UI 结构

   ```html
   {/* 搜索框 */}
   <Flex className="search-box">
     {/* 左侧白色区域 */}
     <Flex className="search">
       {/* 位置 */}
       <div
         className="location"
         onClick={() => this.props.history.push('/citylist')}
       >
         <span className="name">上海</span>
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
   ```

   

2.  样式美化

   ```css
   .swiper {
     position: relative;
     height: 212px;
   
     // 顶部导航
     .search-box {
       position: absolute;
       top: 25px;
       width: 100%;
       padding: 0 10px;
   
       // 左侧白色区域
       .search {
         flex: 1;
         height: 34px;
         margin: 0 10px;
         padding: 5px 5px 5px 8px;
         border-radius: 3px;
         background-color: #fff;
   
         // 位置
         .location {
           .icon-arrow {
             margin-left: 2px;
             font-size: 12px;
             color: #7f7f80;
           }
         }
   
         // 搜索表单
         .form {
           border-left: solid 1px #e5e5e5;
           margin-left: 12px;
           line-height: 16px;
   
           .icon-seach {
             vertical-align: middle;
             padding: 0 2px 0 12px;
             color: #9c9fa1;
             font-size: 15px;
           }
   
           .text {
             padding-left: 4px;
             font-size: 13px;
             color: #9c9fa1;
           }
         }
       }
   
       // 右侧地图图标
       .icon-map {
         font-size: 25px;
         color: #fff;
       }
     }
   }
   ```

   



####  011 - `H5` 中的地理位置 `API` (了解)

1.  应用场景： 根据当前地理位置，获取当前所在城市的地址位置信息

2.  作用：在 Web 应用程序中获取到地理定位：[API](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation/Using_geolocation)

3.  使用方式：地理位置 `API` 通过`navigator.geolocation` 对象提供，通过 `getCurrentPosition` 方法获取

4.  注意：获取到的地理位置跟 `GPS`、`IP地址`、`WIFI` 和 `蓝牙的MAC地址`、`GSM/CDMS` 的 `ID` 有关

5.  比如：手机优先使用 `GPS` 定位，笔记本等最准确的定位是 `WIFI` ,
   注意： 使用 `wifi` ，也就是 `ip 地址`，定位极大的概率获取失败

   ```js
   navigator.geolocation.getCurrentPosition(position => {
   	// position对象表示当前位置信息
   	// 常用： latitude 纬度
       // 		 longitude 经度
   
   	// 知道： accuracy 经纬度的精度 
       //       altitude 海拔高度
       // 		 altitudeAccuracy 海拔高度的精度
       //		 heading 设备行进方向
       //		 speed 速度
   })
   ```

   

#### 012 - 百度地图 `API`（1介绍）

1.  `H5` 的地理位置 `API` 只能获取到经纬度信息
2.  实际开发中，会使用 百度地图 / 高德地图 / 腾讯地图 来完成地理位置的相关功能
3.  租房项目中，通过百度地图 `API` 实现地理定位和地图找房功能
4.  [百度地图文档首页]([http://lbsyun.baidu.com/index.php?title=%E9%A6%96%E9%A1%B5](http://lbsyun.baidu.com/index.php?title=首页)) -- [Javascript API](http://lbsyun.baidu.com/index.php?title=jspopular3.0)
5.  注意：使用前，需要先申请 百度账号和 `ak` ，获取到的 `ak`，[详细文档](http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/getkey)



#### 013 - 百度地图基础使用

1.   引用百度地图 `API` 文件， 替换成自己的密钥

   ```html
   <script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=您的密钥"></script>
   ```

2.  在全局样式文件 `index.css` 中设置容器样式

   ```css
   html,
   body,
   #root,
   .App {
     height: 100%;
   }
   body {
     margin: 0px;
     padding: 0px;
   }
   
   ```

3.  创建 `Map` 组件，同时初始化组件结构，给跟元素添加类名 `.map` ，同时需要在 `App.js` 中创建路由出口

   ```jsx
   import React from 'react'
   
   export default class Map extends React.Component {
     render () {
       return (
         <div className="map">
         </div>
       )
     }
   }
   
   ```

   ```jsx
   import Map from './pages/Map/index.jsx'
   
   <Route path="/map" component={Map}></Route>
   ```

4. 在 `Map` 组件中创建地图容器元素，同时设置样式文件并导入

   ```jsx
   import React from 'react'
   
   import './index.scss'
   
   export default class Map extends React.Component {
     render () {
       return (
         <div className="map">
            <div id="container"></div> 
         </div>
       )
     }
   }
   ```

   ```css
   // 设置样式
   .map,
   #container {
     height: 100%;
   }
   
   ```

5.  在创建阶段的钩子函数 `componentDidMount` 中创建地图实例

   ```jsx
   componentDidMount () {
     // 初始化实例
     const map = new window.BMap.Map("container")
   }
   ```

6.  在创建阶段的钩子函数 `componentDidMount` 中设置中心点坐标

   ```jsx
   componentDidMount () {
     // 初始化实例
     const map = new window.BMap.Map("container")
     
     // 初始化中心点
     const point = new window.BMap.Point(116.404, 39.915)
   }
   ```

7.  在创建阶段的钩子函数 `componentDidMount` 中地图初始化，同时设置地图展示级别

   ```jsx
   componentDidMount () {
     // 初始化实例
     const map = new window.BMap.Map("container")
     
     // 初始化中心点
     const point = new window.BMap.Point(116.404, 39.915)
     
     // 地图初始化，同时设置地图展示级别
     map.centerAndZoom(point, 15)
   }
   ```

   

#### 014 - 获取顶部导航城市信息

1.  打开百度地图文档，找到 [定位](http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/geolocation) 位置，查看 `IP` 定位的使用方式

   ```jsx
   const myCity = new BMap.LocalCity()
   myCity.get((res) => {})
   ```

   

2.  复制方法到 `Index -- index.jsx` 中的 钩子函数 `componentDidMount` 中进行调用，调用之后，会返回当前城市的相关信息，包括城市名字

   ```jsx
   var myCity = new window.BMap.LocalCity()
   myCity.get(async (res) => {
     console.log(res.name)
   })
   ```

3.  根据返回的城市名字，使用 `axios`发送请求，同时传递城市的名字，最后将返回值赋值给 `state` 中的变量

   -  使用 `axios`发送请求，同时传递城市的名字
   -  最后将返回值赋值给 `state` 中的变量 `curCityName`

   ```jsx
   state = {
       // ... 其他数据略
       curCityName: ''
     }
   
   const myCity = new window.BMap.LocalCity()
   myCity.get(async (res) => {
     const cityName = res.name
     const { data: areares } = await axios.get(`http://8.131.91.46:8009/area/info?name=${cityName}`)
   
     console.log(areares)
     this.setState(() => {
       return {
         curCityName: areares.body.label
       }
     })
   })
   ```

4.  将 `curCityName` 和顶部导航进行绑定

   ```jsx
   <span className="name">{this.state.curCityName}</span>
   ```












