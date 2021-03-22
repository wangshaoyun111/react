### React 好客租房(上)

----

#### 001 - 项目介绍

​	**[好客租房在线预览地址](https://m-haoke-web.itheima.net/home)**

1.  React 核心库：`react`、`react-dom`、`react-router-dom`
2.  脚手架：`create-react-app`
3.  数据请求：`axios`
4.  `UI` 组件库： `antd-mobile`
5.  其他组件库： `react-virtualized`、`formik` + `yup` 、`react-spring` 等
6.  百度地图 `API`





#### 002 - 本地接口部署

**线上地址： https://api-haoke-web.itheima.net/**

**备用地址：http://8.131.91.46:8009**





#### 003 - 项目初始化

1. 初始化项目

   ```shell
   # 使用 npx 创建项目
   npx create-react-app hkzf-mobile
   
   # 或者使用 npm 创建项目
   npm init react-app hkzf-mobile
   
   # 或者使用 yarn 创建项目
   yarn create react-app hkzf-mobile
   ```

   

2.   进入项目文件夹

   ```shell
   # 进入项目目录下
   cd hkzf-mobile
   ```

   

3. 启动项目，在项目根目录执行命令

   ```shell
   # 使用 yarn 运行项目
   yarn start
   
   # 使用 npm 运行项目
   npm start
   ```

4.  分析项目结构

   <img src="./images/004 - projectlist.jpg" style="zoom:70%;" />

   

   

5.  调整项目中 `src` 目录结构如下

   ```jsx
   src/ 		   --- 项目源码，写项目功能代码
     assets/      --- 资源（图片、字体图标等）
     components/  --- 公共组件
     pages/       --- 页面
     utils/       --- 工具
     App.js       --- 根组件（配置路由信息）
     index.css    --- 全局样式
     index.js     --- 项目入口文件（渲染根组件、导入组件库等）
   ```


<img src="./images/005 - projectlist.jpg" style="zoom:70%; box-shadow: 1px 1px 10px #ccc" />







#### 004 - 组件库 `antd-mobile` 的介绍和使用



<img src="./images/006 - ant-design-mobile.jpg" style="zoom:56%; box-shadow: 1px 1px 10px #ccc" />





1.  `antd-mobile`
   
   - 基于 Preact / React / React Native 的移动端 UI 组件库，它有以下特点：4
   
   - - 组件丰富 ，功能全面
   
   - -  一步上手 ，按需加载
   
   - - 体积小巧 ，性能出众
   
   - - 简易定制 ，多种风格
   
   
   
2.   使用步骤

    - 安装：`yarn add antd-mobile`
    - 在 `App.js` 根组件中导入要使用的组件
    - 渲染组件
    - 在 `index.js` 中导入组件库样式

    ```jsx
    import React from 'react'
    // 导入组件
    import { Button } from 'antd-mobile'
    // 导入 antd-mobile 样式
    import 'antd-mobile/dist/antd-mobile.css'
    
    function App() {
      return (
        <div>
          <p>根组件</p>
          {/* 使用 antd-mobile 中的 Button 组件 */}
          <Button type="warning" disabled>warning disabled</Button>
        </div>
      )
    }
    
    export default App
    
    ```




3.  **<span style="color: red;">控制台报警告</span>**

```html
You are using a whole package of antd-mobile, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
```

- 1. 解决方案： 

- - - 配置按需加载即可：https://mobile.ant.design/docs/react/use-with-create-react-app-cn

  - - 安装包的时候推荐使用 cnpm 安装，npm 安装可能会报错





#### 005 - 路由的基础配置

1.  安装路由库 `react-router-dom`

   ```javascript
   cnpm i react-router-dom --save
   
   // or
   
   yarn add react-router-dom
   ```

   

2.  导入路由组件

   ```javascript
   // App.js
   
   // 导入路由组件
   import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
   ```

   

3.  在 pages 目录下创建相应的组件

   - 在 pages 目录右键新建文件夹以及文件 `Home` --> `index.jsx` 、`CityList` --> `index.jsx`

   -  创建组件基础的结构

   ```javascript
   // Citylist/index.jsx
   // Home/index.jsx 代码同，复制一份即可
   
   import React from 'react'
   
   export default class CityList extends React.Component {
     render () {
       return (
         <div>
           我是城市列表
         </div>
       )
     }
   }
   
   ```

   

4.  配置路由的入口和出口

   - 导入创建好的组件

   - 使用 `Router` 包裹住整个应用

   - 使用 `Link`  配置入口

   - 使用 `Route` 配置出口

   ```javascript
   function App() {
     return (
       <Router>
         <div className="App">
           {/* 配置项目的入口 */}
           <ul>
             <li><Link to="/home">首页</Link></li>
             <li><Link to="/citylist">城市列表</Link></li>
           </ul>
   
           {/* 配置项目的出口 */}
           <Route path="/home" component={Home}></Route>
           <Route path="/citylist" component={CityList}></Route>
         </div>
       </Router>
     )
   }
   ```








#### 006 - 全局外观以及样式调整

1.  打开 `public` 目录，找到 `index.html`，对标题进行修改

   ```html
   <!-- index.html -->
   
   <title>好客租房</title>
   ```

   

2.  打开 `src` 目录，找到 `index.css` 文件，对全局的样式进行调整

   ```css
   /* index.css */
   
   * {
     box-sizing: border-box;
     margin: 0;
     padding: 0;
   }
   
   html, body {
     height: 100%;
     font-family: 'Microsoft YaHei';
     color: #333;
     background-color: #fff;
   }
   
   ul, li {
     list-style: none;
   }
   
   ```

   

3.  在 `index.js` 文件中调整 `index.css` 文件引用的顺序

   注意：为了防止自己的样式被组件库样式给覆盖，需要先引入组件样式，后引入自己的样式文件

   ```javascript
   // index.js
   
   // 导入 antd-mobile 样式文件
   import 'antd-mobile/dist/antd-mobile.css'
   
   // 为了防止自己的样式被组件库样式给覆盖，需要先引入组件样式，后引入自己的样式文件
   import './index.css'
   ```








#### 007 - 全局的布局分析

1.  布局 1： 有 `TabBar` -- 首页、找房、资讯、我的

2.  布局 2： 没有 `TabBar`  -- 城市选择等（简单，不需要额外处理）

    

    ​                         <img src="./images/007 - 布局方式1.jpg" style="zoom:70%; box-shadow: 1px 1px 10px #ccc;" /><img src="./images/007 - 布局方式2.jpg" style="zoom:71%; margin-left:50px; box-shadow: 1px 1px 10px #ccc" /> 

    

    

3.   有 `TabBar` 的页面分析

    <img src="./images/008 - 布局方式1 分析.jpg" style="zoom:70%; box-shadow: 1px 1px 10px #ccc" />

    

    

4.  无 TabBar 的页面分析

    <img src="./images/009 - 布局方式2 分析.jpg" style="zoom:70%; box-shadow: 1px 1px 10px #ccc" />

    

    

5.  `TabBar` 使用嵌套路由，也就是在路由内部切换路由

<img src="./images/001-布局分析.png" alt="全部的布局分析" style="zoom:99%; box-shadow: 1px 1px 10px #ccc" />







#### 008 - 嵌套路由的使用

1.  **什么是嵌套路由**

   - 嵌套路由就是路由内部包含路由，也可以理解为在一个路由对应的组件中包裹着另一个路由

   - 用 Home 组件表示父路由的内容
   -  用 News 组件表示子路由的内容

   <img src="./images/002-嵌套路由.png" alt="嵌套路由" style="zoom:99%; box-shadow: 1px 1px 10px #ccc" />

   

   

2.   在 pages 目录下新建资讯组件 `News` --> `index.jsx`，并创建页面结构

   ```javascript
   import React from 'react'
   
   export default class Home extends React.Component {
     render () {
       return (
         <div>
           我是资讯页面
         </div>
       )
     }
   }
   ```

3.   在 `Home.jsx` 文件中导入组件

   ```javascript
   // 1、导入路由
   import { Route } from 'react-router-dom'
   ```

4.   在结构中使用 Route 组件配置出口

   - 导入 News 组件
   - 使用 Route 配置出口

   ```javascript
   // 1、导入路由
   import { Route } from 'react-router-dom'
   // 3、导入子路由对应的组件
   import News from '../News/index.jsx'
   
   export default class Home extends React.Component {
     render () {
       return (
         <div>
           <h4>我是首页</h4>
   
           {/* 2、配置出口 */}
           <Route path="/home/news" component={ News }></Route>
         </div>
       )
     }
   }
   
   ```

   

注意事项：

-  设置嵌套路由的 path，格式以父路由 path 开头
- 只有让父组件展示，那么子组件才会展示







#### 009 - `TabBar` 的基础使用

1.  打开组件库文档，找到 `TabBar` 组件

2.  复制拷贝核心的代码到 `Home --- index.jsx` 中

3.  分析 `state` 中对应参数以及相应方法的含义并调整，保证项目的正常运行

   ```jsx
   export default class Home extends React.Component {
     constructor(props) {
       super(props)
       this.state = {
         // 是否选中，当前选中的 tabBar
         selectedTab: 'redTab',
         // 是否隐藏 tabBar
         hidden: false,
         // 是否全屏展示，也就是是否占据整个屏幕
         fullScreen: false,
       }
     }
   
     // 渲染每个 TabBar.Item 内容方法
     renderContent(pageText) {
       return (
         <div>
           {/* 代码略，自行拷贝 */}  
         </div>
       )
     }
   
     render () {
       return (
         <div>
           <h4>我是首页</h4>
   
           {/* 2、配置出口 */}
           <Route path="/home/news" component={ News }></Route>
   
           <TabBar
             unselectedTintColor="#949494"
             tintColor="#33A3F4"
             barTintColor="white"
             hidden={this.state.hidden}
           >
             <TabBar.Item>
             	{/* 代码略，自行拷贝 */}    
             </TabBar.Item>
             {/* 代码略，自行拷贝 */}  
           </TabBar>
         </div>
       )
     }
   }
   
   ```

   

#### 010 - 修改 `TabBar` 外观样式

> <div style="color: red; font-weight: bold">
>     <p>因为需要更改的内容比较对多，也可以直接从源代码中进行拷贝即可</p>
> 	<p>&nbsp;&nbsp;&nbsp;&nbsp;1. 拷贝结构粘贴后，从素材中拷贝 fonts 文件夹到 assets 目录下</p>
>     <p>&nbsp;&nbsp;&nbsp;&nbsp;2. 在入口文件 index.js 文件中导入字体图标文件</p>
>     <p>&nbsp;&nbsp;&nbsp;&nbsp;3. 在 Home 目录下创建 index.css 文件，复制粘贴样式</p>
> </div>



1. 删除前面路由的演示代码

   - 在 `App.jsx` 文件中删除多余路由演示代码

   - 删除 `Home--index.jsx` 中删除多余路由演示代码

     

2. 修改 `TabBar` 菜单项文字标题
   - 找到每个 `TabBar.Item` 组件，分别将 `title` 进行修改
   
   - 按照顺序依次修改为： 首页 -- 找房 -- 资讯 -- 我的
   
     
   
   <img src="./images/003 - TabBar.png" alt="`TabBar`" style="zoom:110px; box-shadow: 1px 1px 10px #ccc" />
   
   
   
3. 修改 `TabBar` 菜单文字标题颜色（选中和未选中）
   - 找到 `TabBar` 组件，首先将 `tintColor` 修改为 `#21b97a`
   -  删除其他属性即可(保留 `barTintColor` 属性)

   ```jsx
   <TabBar tintColor="#21b97a" barTintColor="white" >
   ```

   
   
4. 使用字体图标，修改 `TabBar` 菜单的图标

   - 从素材中拷贝字体图标到 `assets` 文件夹中
   - 在 `index.js` 入口文件中导入样式

   ```jsx
   // 入口文件 --> index.js 
   
   // 导入字体图标库的样式文件
   import './assets/fonts/iconfont.css'
   ```

   - 在 `Home--index.jsx`  文件中找到  `TabBar.Item` 组件
   - 将其中的 `icon` 以及 `selectedIcon` 全部使用字体图标进行替换

   ```jsx
   <TabBar.Item
       icon={<i className="iconfont icon-my" />}
       selectedIcon={<i className="iconfont icon-my" />}
       // 其他属性略……
   >
   	{this.renderContent('My')}
   </TabBar.Item>
   ```

   ```jsx
   // 首页
   icon={<i className="iconfont icon-ind"></i>}
   selectedIcon={<i className="iconfont icon-ind"></i>}
   
   // 找房
   icon={<i className="iconfont icon-findHouse"></i>}
   selectedIcon={<i className="iconfont icon-findHouse"></i>}
   
   // 资讯
   icon={<i className="iconfont icon-message"></i>}
   selectedIcon={<i className="iconfont icon-message"></i>}
   
   // 我的
   icon={<i className="iconfont icon-my"></i>}
   selectedIcon={<i className="iconfont icon-my"></i>}
   ```

   

5. 修改 `TabBar` 菜单项的图标大小

   - 首先创建一个 `css` 文件， `Home -- index.css` 
   -  给 `Home --index.jsx` 最外层的跟元素添加 `className` 类名为 `home`
   -  在创建的 `css` 文件中开始设置字体图标的大小

   ```jsx
   // Home --> index.jsx
   
   render () {
       return (
           <div className="home">
           	{/* 其他代码略 */}
           </div>
       )
   }
   ```

   ```css
   // home --> index.css
   
   .home .iconfont {
     font-size: 20px;
   }
   ```

   

6. 调整 `TabBar` 菜单的位置，让其固定在最底部

   -  在 `Home -- index.css` 文件中更改 `TabBar` 样式为固定定位

   ```css
   // home --> index.css
   
   .home .am-tab-bar-bar {
     position: fixed;
     bottom: 0;
   }
   ```

   

7. 其他

   - 包裹住 `TabBar` 外层的 `div` 删除
   - 去掉每个`TabBar.Item` 的角标
     -  去掉 `badge` 徽标数
     -  去掉 `dot` 右上角小红点







#### 011 -  `TabBar` 配合路由使用

> 这一小节本身可以理解是做了两个东西
>
> a、路由跳转  b、高亮效果



1. 根据 `TabBar` 组件 文档 设置不渲染任何内容部分，就是说只保留菜单项，而不显示内容

   - 只需要给 `TabBar` 添加 `noRenderContent` 属性即可，同时设置为 `true`

   ```jsx
   <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={ true } ></TabBar>
   ```

   

2.  给 `TabBar.Item` 绑定点击事件

   - 只需要给每个 `TabBar.Item`  绑定一个 `onPress` 即可
   - `onPress`  就是每个 `TabBar.Item`   点击时触发的事件

   ```jsx
   onPress={() => {
     this.setState({
       selectedTab: 'blueTab'
     })
       
     this.props.history.push('/home/index')
   }}
   ```

   

3.  在点击事件中调用 `history.push()` 实现路由切换

   - 这一步就是使用编程式导航实现跳转
   - 首先创建好对应的页面组件并写好基础的结构
   - 在每个 `TabBar.Item` 的 `onPress` 中使用编程式语法实现跳转

   ```jsx
   // 其他略……
   
   this.props.history.push('/home/index')
   this.props.history.push('/home/list')
   this.props.history.push('/home/news')
   this.props.history.push('/home/profile')
   ```

   

4.  创建 `TabBar` 组件菜单项对应的其他 3 个组件，并在 `Home` 组件中配置路由信息

   - `Index -- index.jsx`  `Profile -- index.jsx`  `HouseList -- index.jsx`
   - 然后同时引入组件

   ```jsx
   import Index from '../Index/index.jsx'
   import HouseList from '../HouseList/index.jsx'
   import News from '../News/index.jsx'
   import ProFile from '../Profile/index.jsx'
   ```

   - 最后使用 `Route` 配置出口

   ```jsx
   <Route path="/home/index" component={Index}></Route>
   <Route path="/home/list" component={HouseList}></Route>
   <Route path="/home/news" component={News}></Route>
   <Route path="/home/profile" component={ProFile}></Route>
   ```

   

5.  给菜单项添加 `selected` 属性，设置当前匹配的菜单项高亮。

   - 经过分析，需要给每个 `TabBar.Item` 添加 `selected` 属性，查看是否被选中
     在这里我们可以采用路由对比的方式来完成，即 pathname 是否和设置的 pathname 一致
     如果一致说明被选中，那么就有高亮效果

   ```jsx
   <TabBar.Item
       selected={this.state.selectedTab === '/home/index'}
       {/* 其他属性略 */}
   >
   </TabBar.Item>
   ```

   -  首先在 state 中声明一个 `selectedTab` 属性

   ```jsx
   this.state = {
     // 是否选中，当前选中的 tabBar
     selectedTab: ''
   }
   ```

   - 然后将 `this.props.location.pathname` 赋值给 `selectedTab` 即可

   ```jsx
   this.state = {
     // 是否选中，当前选中的 tabBar
     selectedTab: this.props.location.pathname
   }
   ```

   -  在   `selected`  属性中判断 `selectedTab`是否等于设置的路由名称，如果一致，说明被选中
   
```jsx
   selected={this.state.selectedTab === '/home/index'}
```

-  当点击每个 `TabBar.Item` 的时候
      将每个 `TabBar.Item` 对应的路由路径赋值给 `selectedTab` 即可

```jsx
   onPress={() => {
     this.setState({
       selectedTab: '/home/index'
     })
   
     this.props.history.push('/home/index')
   }}
```








#### 012 - `TabBar.Item` 代码重构

1.  准备提取出来的 `TabBar.item` 数据

   ```javascript
   // TabBar 数据
   const tabItems = [
     {
       title: '首页',
       icon: 'icon-ind',
       path: '/home/index'
     },
     {
       title: '找房',
       icon: 'icon-findHouse',
       path: '/home/list'
     },
     {
       title: '资讯',
       icon: 'icon-infom',
       path: '/home/news'
     },
     {
       title: '我的',
       icon: 'icon-my',
       path: '/home/profile'
     }
   ]
   ```

   

2.  开始创建一个方法，方法中对准备好的数据进行遍历，并返回  `TabBar.item` 

   ```jsx
   renderTabBarItem() {
     return tabItems.map(item => (
       <TabBar.Item
         key={item}
         icon={<i className={`iconfont ${item.icon}`} />}
         selectedIcon={<i className={`iconfont ${item.icon}`} />}
         title={item.title}
         selected={this.state.selectedTab === item.path}
         onPress={() => {
           this.setState({
             selectedTab: item.path,
           })
   
           this.props.history.push(item.path)
         }}
         data-seed="logId1"
       >
       </TabBar.Item>
     ))
   }
   ```

   

3.  在 `TabBar` 中调用 封装好的方法

   ```js
   <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={true}>
     {this.renderTabBarItem()}
   </TabBar>
   ```






#### 013 - 首页路由处理

> 这一小节，主要做两个功能： 
>
> ①  打开 `/home` 路由，显示 `Index` 组件
>
> ②  路由的重定向处理



1.  打开 `Home --> index.jsx` 文件中，找到路由出口的配置

    将 `/home/index` 路由规则，修改为 `/home`

   - 这里主要使用了模糊匹配的原则
   -  当 `pathname` 为 `/home` 是时候，展示 `Index` 组件
   - 这时候，第一个功能就实现了

2.   但是这时候高亮效果消失，需要对 `TabBar.Item` 数据进行修改
      将首页的 `path` 由 `/home/index` 修改为 `/home`

   ```jsx
   <Route path="/home" exact component={Index}></Route>
   ```
   
   ```jsx
   {
       title: '首页',
    icon: 'icon-ind',
         path: '/home'
     }
     ```
     
3.   打开 `App.jsx` ，找到路由出口位置，重新添加一个出口，设置 path 为 `/`，同时去掉对应 `component` 属性

4.   导入 `Redirect`，在 新配置的出口位置使用 `render`属性，属性中返回 `Redirect` 进行重定向，重定向的地
   址是 `/home`

   ```jsx
   import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
   ```

   ```jsx
   <Route path="/" render={ () => <Redirect to="/home" /> }></Route>
   ```

5.  同时还需要对根路由以及配置的 `/home` 路由进行精确的匹配，也就是添加 `exact` 属性，如果不添加，那么
   路由规则将按照模糊的规则进行展示，组件的展示将会乱掉

   ```jsx
   <Route path="/" render={ () => <Redirect to="/home" /> }></Route>
   ```

   ```jsx
   <Route path="/home" exact component={Index}></Route>
   ```

   









