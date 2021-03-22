### React 第八天笔记

---

#### 001 - 渲染城市索引列表

1.   准备好结构和布局

   ```html
   <ul className="city-index">
     <li className="city-index-item" key={item}>
       <span className="index-active">#</span>
     </li>
   </ul>
   ```

   ```css
   // 右侧索引
   .city-index {
     position: absolute;
     display: flex;
     flex-direction: column;
     right: 5px;
     z-index: 1;
     height: 90%;
     box-sizing: border-box;
     padding-top: 20px;
     text-align: center;
   
     .city-index-item {
       flex: 1;
     }
   
     .index-active {
       color: #fff;
       background-color: #21b97a;
       border-radius: 100%;
       display: inline-block;
       font-size: 12px;
       width: 15px;
       height: 15px;
       line-height: 15px;
     }
   }
   ```

   

2.  封装 `renderCityIndex` 方法，用来渲染城市索引列表

   ```jsx
   // 封装渲染右侧索引列表的方法
   renderCityIndex() {
     // coding……
   }
   
   render() {
     return (
       // coding……
     )
   }
   ```

   

3.   在方法中，获取到索引数据 `cityIndex`，遍历 `cityIndex`，渲染索引列表

   ```jsx
   // 封装渲染右侧索引列表的方法
   renderCityIndex() {
     const { cityIndex, activeIndex } = this.state
     // 遍历 cityIndex，实现右侧列表的渲染
     return cityIndex.map((item, index) => (
       <li className="city-index-item" key={item}>
         <span className="index-active">#</span>
       </li>
     ))
   }
   ```

   

4.  将索引 `hot` 替换为 `热`

   ```jsx
   // 封装渲染右侧索引列表的方法
   renderCityIndex() {
     const { cityIndex, activeIndex } = this.state
     // 遍历 cityIndex，实现右侧列表的渲染
     return cityIndex.map((item, index) => (
       <li className="city-index-item" key={item}>
         <span className="index-active">
           {item === 'hot' ? '热' : item.toUpperCase()}
         </span>
       </li>
     ))
   }
   ```

   

5.  在 `state` 中添加状态 `activeIndex` ，来指定当前高亮的索引

   ```jsx
   state = {
     cityList: {},
     cityIndex: [],
     // 指定右侧字母索引列表高亮的索引号
     activeIndex: 0
   }
   ```

   

6.  在遍历 `cityIndex` 时，添加当前字母索引是否高亮的判断条件

   ```jsx
   // 封装渲染右侧索引列表的方法
   renderCityIndex() {
     const { cityIndex, activeIndex } = this.state
     // 遍历 cityIndex，实现右侧列表的渲染
     return cityIndex.map((item, index) => (
       <li className="city-index-item" key={item}>
         <span className={ activeIndex === index ? 'index-active' : '' }>
           {item === 'hot' ? '热' : item.toUpperCase()}
         </span>
       </li>
     ))
   }
   ```

   

#### 002 - 滚动城市列表让对应的索引高亮

1.  给 `List` 组件添加 `onRowsRendered` 配置项，用于获取当前列表渲染的行信息

   ```jsx
   <List
     width={width}
     height={height}
     rowCount={this.state.cityIndex.length}
     rowHeight={this.getRowHeight}
     rowRenderer={this.rowRenderer}
     onRowsRendered={this.onRowsRendered}
   />
   ```

   ```jsx
   // 获取 list 列表行的信息
   onRowsRendered = () => {}
   ```

   

2.  通过参数 `startIndex` 获取到起始行索引 -- 也就是城市列表可视区最顶部一行的索引号

   ```jsx
   // 获取 list 列表行的信息
   onRowsRendered = ({ startIndex }) => {
     console.log(startIndex)
   }
   ```

   

3.  判断 `startIndex` 和 `activeIndex` 是否相同 -- 判断的目的为是为了提升性能，避免不必要的 `state` 更新

4.  当 `startIndex` 和 `activeIndex` 不同时，更新状态 `activeIndex` 为 `startIndex` 的值

   ```jsx
   // 获取 list 列表行的信息
   onRowsRendered = ({ startIndex }) => {
     console.log(startIndex)
     if (this.state.activeIndex !== startIndex) {
       this.setState({
         activeIndex: startIndex
       })
     }
   }
   ```

   

#### 003 - 点击索引指定该索引城市

1.  给索引列表项绑定点击事件

2.  在点击事件中，通过 `Index` 获取到当前索引号

   ```jsx
   renderCityIndex() {
     const { cityIndex, activeIndex } = this.state
     return cityIndex.map((item, index) => (
       <li
         className="city-index-item"
         key={item}
         onClick={ () => {
           console.log(index)
         }}>
       </li>
     ))
   }
   ```

   

3.  调用 `List` 组件中的 `scrollToRow` 方法，让 `List` 组件滚动到指定行

   -  在 `constructor` 中，调用 `React.createRef()` 创建 `ref `对象

     ```jsx
     constructor () {
       super()
     
       this.state = {
         cityList: {},
         cityIndex: [],
         // 指定右侧字母索引列表高亮的索引号
         activeIndex: 0
       }
     
       this.cityListComponent = React.createRef()
     }
     ```

     

   -  将创建好的 `ref` 对象，添加为 `List` 组件中的 `ref` 属性

     ```jsx
     <List
       ref={this.cityListComponent}
     />
     ```

     

   -  通过 `ref` 的 `current` 属性，获取到组件实例，在调用组件的 `scrollToRow` 方法

     ```jsx
     renderCityIndex() {
       const { cityIndex, activeIndex } = this.state
       return cityIndex.map((item, index) => (
         <li className="city-index-item" key={item} onClick={() => {
           // 调用组件的 scrollToRow 方法
           this.cityListComponent.current.scrollToRow(index)
         }}>
           // coding……
         </li>
       ))
     }
     ```

     

4.  设置 `List` 组件的 `scrollToAlignment` 配置项为 `start`，保证被点击行出现在页面顶部

   ```jsx
   <List
     scrollToAlignment="start"
   />
   ```

   

5.  对于点击索引无法确定定位的问题，调用 `List` 组件的 `measureAllRows` 方法，提前计算高度来解决

   ```jsx
   async componentDidMount() {
     await this.getCityList()
   
     // 必须等整个索引列表渲染好以后，这个方法才有效果
     // 这个方法会校验每一行的高度，从而实现点击的精度准确
     this.cityListComponent.current.measureAllRows()
}
   ```
   
   

#### 004 - 切换城市

1.  给城市列表项绑定点击事件

   ```jsx
   {cityList[letter].map(item => (
     <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
       {item.label}
     </div>
   ))}
   ```

   

2.  判断当前城市是否有房源数据(注意：在项目中只有北/上/广/深四个城市有数据)

   ```jsx
   // 有房源的城市
   const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
   ```

   

3.  如果有房源数据，则保存当前城市数据到本地缓存中，并返回上一页

4.  如果没有房源数据，则提示用户：该城市暂无房源数据，不执行任何操作

   ```jsx
   // 给城市列表项绑定点击事件。
   changeCity({ label, value }) {
     if (HOUSE_CITY.indexOf(label) > -1) {
       // 如果有房源数据
       localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
       this.props.history.go(-1)
     } else {
       // 没有房源数据
       Toast.info('该城市暂无房源数据', 1, null, false)
     }
   }
   ```



#### 005 - 好客租房项目(上) 总结

1.  项目准备：部署本地接口、脚手架初始化项目、`antd-mobile`、路由等。
2.  项目整体布局：分析两种页面布局，使用嵌套路由实现带 `TabBar` 页面布局等。
3.  首页模块：租房小组结构布局、数据获取、`H5` 地理定位和百度地图地理定位等。
4.  城市选择模块：数据结构处理、长列表性能优化、`react-virtualized`、索引列表等。



#### 006 - 地图找房功能分析

业务：使用百度地图 `API` 实现地图找房

功能：

1. 展示当前定位城市
2.  展示该城市所有区的房源数据
3.  展示某区下所有镇的房源数据
4.  展示某镇下所有小区的房源数据
5.  展示某小区下的房源数据列表

**难点： 百度地图标注、缩放级别、缩放事件等的使用**



#### 007 - 顶部导航栏

1.  封装 `NavHeader` 组件实现城市选择、地图找房页面的复用

2.  在 `component` 目录中创建组件 `NavHeader/index.js` 

3.  在该组件中封装 `antd-mobile` 组件库中的 `NavBar` 组件

   ```jsx
   import React from 'react'
   
   import { NavBar } from 'antd-mobile'
   
   import './index.scss'
   
   function NavHeader({ children }) {
     return (
       <div>
         {/* 顶部导航栏 */}
         <NavBar
           className="navbar"
           mode="light"
           icon={<i className="iconfont icon-back" />}
           onLeftClick={() => this.props.history.go(-1)}
         >
           {children}
         </NavBar>
       </div>
     )
   }
   
   export default NavHeader
   ```

   

4.  在地图找房页面使用封装好的 `NavHeader` 组件实现顶部导航栏功能

5.  使用 `NavHeader` 组件，替换城市选择页面的 `NavBar` 组件

   ```jsx
   import React from 'react'
   
   // 导入顶部导航组件
   import NavHeader from '../../components/NavHeader/index.jsx'
   
   // 导入样式
   import './index.scss'
   
   export default class Map extends React.Component {
     componentDidMount() {
       // coding……
     }
   
     render() {
       return (
         <div className="map">
           {/* 顶部导航栏组件 */}
           <NavHeader>地图找房</NavHeader>
           {/* 地图容器元素 */}
           <div id="container"></div>
         </div>
       )
     }
   }
   
   ```

   

6.  从 `react-router-dom` 中导入 `withRouter` 高阶组件

   ```jsx
   import { withRouter } from 'react-router-dom'
   ```

   

7.  使用 `withRouter` 高阶组件包装 `NavHeader` 组件

   ```jsx
   function NavHeader({ children}) {
     // coding……
   }
   
   export default withRouter(NavHeader) 
   ```

   

8.  从 `props` 中解构出 `history` 对象

9.  调用 `history.go()` 实现返回上一页功能

   ```jsx
   function NavHeader({ children, history}) {
     return (
       <div>
         {/* 顶部导航栏 */}
         <NavBar
           className="navbar"
           mode="light"
           icon={<i className="iconfont icon-back" />}
           onLeftClick={() => history.go(-1)}
         >
           {children}
         </NavBar>
       </div>
     )
   }
   
   export default withRouter(NavHeader) 
   ```

   

10.  从 `props` 中解构出 `onLeftClick`  函数，实现自定义 < 按钮的点击事件

    ```jsx
    function NavHeader({ children, history, onLeftClick }) {
    
      // 默认点击行为
      const defaultHandle = () => history.go(-1)
    
      return (
        <div>
          {/* 顶部导航栏 */}
          <NavBar
            className="navbar"
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandle}
          >
            {children}
          </NavBar>
        </div>
      )
    }
    
    export default withRouter(NavHeader) 
    ```

    ```jsx
    <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>
    ```

    

11.  添加 props 校验

    1.  安装：`yarn add prop-types`

    2.  导入 `PropTypes`

       ```jsx
       import PropTypes from 'prop-types'
       ```

       

    3.  给 `NavHeader` 组件的 `children` 和 `onLeftClick` 属性添加 `props` 校验

       ```jsx
       NavHeader.propTypes = {
         children: PropTypes.string.isRequired,
         onLeftClick: PropTypes.func
       }
       ```

       

#### 008 - 组件间样式覆盖

###### 1.  组件间样式覆盖问题说明

1.  问题： `CityList` 组件的样式，会影响 `Map` 组件的样式

2.  原因： 在配置路由时，`CityList` 和 `Map` 组件都被导入到项目中，那么组件的样式也就被导入到项目中了。如果组件之间样式名称相同，那么一个组件中的样式就会在另一个组件中也生效，从而造成组件之间样式相互覆盖的问题
3.  结论：默认，只要导入了组件，不管组件有没有显示在页面中，组件的样式就会生效
4.  解决方案：
   - 手动处理 （起不同的类名）
   -  `CSS IN JS`



###### 2.  `CSS IN JS`

1. `CSS IN JS`：是使用 `JavaScript` 编写 `CSS` 的统称，用来解决 `CSS` 样式冲突、覆盖等问题
2.  `CSS IN JS` 的具体实现有 50 多种，比如：`CSS Modules`、`styled-components` 等
3.  推荐使用：`CSS Modules` （`React` 脚手架已集成，可直接使用）



###### 3.  `CSS Modules` 的说明

1.  `CSS Modules` 通过对 `CSS` 类名重命名，保证每一个类名的唯一性，从而避免样式冲突的问题

2.  换句话说： 所有类名都具有 “局部作用域”，值在当前组件内部生效

3.   实现方式： `webpack` 中的 `css-loader` 插件

4.  命名采用：`BRM`（Block 块、Element 元素、Modifier 三部分组成）命名规范，比如：.list__item_active

5.  在 React 脚手架中演化成：文件名、类名、hash（随机）三部分，只需要指定类名即可

   ```jsx
   // 类名
   .error {}
   
   // 生成的类名为：
   .Button_error__ax7yz
   ```

   

###### 4.  `CSS Modules` 在项目中的使用

1.  创建名为 `[name].module.css` 的样式文件（`React` 脚手架中的约定，与普通 `CSS` 作区分）

   ```jsx
   index.module.css
   ```

   

2.  组件中导入该样式文件（注意语法）

   ```jsx
   import styles from './index.module.css'
   ```

   

3.  通过 styles 对象访问对象中的样式名来设置样式

   ```jsx
   <div className={styles.test}></div>
   ```

   

###### 5.  使用 `CSS Modules` 修改 `NavHeader` 样式

1.  在 `NavHeader` 目录中创建名为 `index.module.css` 的样式文件

2.  在样式文件中修改当前组件的样式（使用单个类名设置样式，不使用嵌套样式）

   ```css
   // OK
   .navBar {}
   
   // 不推荐嵌套
   .navbar .test {}
   ```

   

3.  对于组件库中已经有的全局样式（比如：`.am-navbar-title`），需要使用 :global() 来指定

   ```jsx
   :global(.am-navbar-title) { color: #333; }
   
   // or 
   
   .root :global(.am-navbar-title) {}
   ```



4.  案例中使用

   ```css
   /* 顶部导航栏 */
   .navbar {
     margin-top: -45px;
     color: #333;
     background-color: #f6f5f6;
   }
   
   :global(.am-navbar-title) {
     color: #333;
   }
   ```

   ```jsx
   import styles from './index.module.css'
   
   <NavBar className={ styles.navbar } />
   ```

   

###### 6.  顶部导航栏样式处理

```css
.map {
  height: 100%;
  padding-top: 45px;
}

.container {
  height: 100%;
}
```

```jsx
import styles from './index.module.css'
```

```jsx
render() {
  return (
    <div className={styles.map}>
      {/* 顶部导航栏组件 */}
      <NavHeader onLeftClick={() => this.props.history.go(-1)}>地图找房</NavHeader>
      {/* 地图容器元素 */}
      <div id="container" className={styles.container}></div>
    </div>
  )
}
```





































