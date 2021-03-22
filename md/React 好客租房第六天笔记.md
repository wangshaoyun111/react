### React 第十天笔记

---

#### 一、`axios` 优化和环境变量

##### 001 - 项目中存在的问题

1.  在使用 `axios` 发送请求的时候，接口地址每次都要写固定域名，太繁琐

   ```jsx
   // 解决方式：通过 axios 配置，统一处理 baseURL
   baseURL: 'http://localhost:8080/'
   ```

   

2.  接口域名、图片域名，分为开发环境和生产环境，直接写在代码中，项目发布时，很难替换

   ```jsx
   // 解决方式：通过脚手架提供的 环境变量 来解决
   
   在开发环境变量文件 .env.development 中，
   配置 REACT_APP_URL=http://localhost:8080/
   ```

   ```jsx
   // 解决方式：通过脚手架提供的 环境变量 来解决
   
   在生产环境变量文件 .env.production 中，
   配置 REACT_APP_URL=线上接口地址
   ```

   

##### 002 - 配置环境变量

1.  在项目根目录创建文件 `.env.development`

2.  在该文件中添加环境变量 `REACT_APP_URL`（注意：环境变量约定以 `REACT_APP_` 开头）

3.  设置 `REACT_APP_URL` 的值为：`http://8.131.91.46:8009/`

   ```jsx
   REACT_APP_URL = http://8.131.91.46:8009
   ```

4.  在 `utils/url.js` 文件中，创建 `BASE_URL` 变量，设置其值为 `process.env.REACT_APP_URL`

   ```jsx
   // 获取环境变量中配置的 URL 地址
   const BASE_URL = process.env.REACT_APP_URL
   ```

   

5.  导出 `BASE_URL`

   ```jsx
   // 获取环境变量中配置的 URL 地址
   export const BASE_URL = process.env.REACT_APP_URL
   ```

   

6.  使用 `BASE_URL` 修改图片地址

   ```jsx
   // 导入 BASE_URL
   import { BASE_URL } from '../../utils/url.js'
   
   // 替换图片地址
   src={BASE_URL + item.houseImg}
   ```

   

7.  重新启动脚手架





##### 003 - 手动创建 `axios` 实例

1.  在 `utils/api.js` 文件中，导入 `axios` 和 `BASE_URL`

   ```jsx
   import axios from 'axios'
   import { BASE_URL } from './url'
   ```

   

2.  调用 `axios.create()` 方法创建一个 `axios` 实例

   ```jsx
   // 创建axios示例
   const API = axios.create()
   ```

   

3.  给 `create()` 方法，添加配置 `baseURL`，值为：`BASE_URL`

   ```jsx
   // 创建axios示例
   const API = axios.create({
     baseURL: BASE_URL
   })
   ```

   

4.  导出 `API` 对象

   ```jsx
   export { API }
   ```

   

5.  导入 `API`，使用 `API` 代替 `axios`，去掉接口地址中的 `http://8.131.91.46:8009/`

   ```jsx
   // 导入axios
   
   import { API } from '../../utils/api.js'
   
   // 替换地址
   const { data: res } = await API.get('/area/city?level=1')
   ```








#### 二、列表找房模块功能分析

业务：根据查询条件筛选房源列表

功能：

1. 搜索导航栏组件封装
2.  条件筛选栏组件封装
3.  条件筛选栏吸顶功能
4.  房屋列表

难点： 条件筛选组件的封装、房屋列表处理



#### 三、封装首页搜索导航栏

##### 001 - 封装首页搜索导航栏

1.  在 `components` 目录中创建组件 `SearchHeader/index.js`

2.  在该组件中，复用首页中已经实现的结构、样式来封装组件

   -  复用首页中的结构
   -  复用首页中的样式
   -  处理外界传入的数据
   -  添加校验规则

   ```jsx
   import React from 'react'
   
   import { withRouter } from 'react-router-dom'
   
   import PropTypes from 'prop-types'
   
   // 导入样式文件
   import './index.scss'
   
   // 导入antd
   import { Flex } from 'antd-mobile'
   
   function SearchHeader({ cityName, history }) {
     return (
       <Flex className="search-box">
         {/* 左侧白色区域 */}
         <Flex className="search">
           {/* 位置 */}
           <div className="location" onClick={() => history.push('/citylist')}>
             <span className="name">{cityName}</span>
             <i className="iconfont icon-arrow" />
           </div>
   
           {/* 搜索表单 */}
           <div className="form" onClick={() => history.push('/search')}>
             <i className="iconfont icon-seach" />
             <span className="text">请输入小区或地址</span>
           </div>
         </Flex>
   
         {/* 右侧地图图标 */}
         <i className="iconfont icon-map" onClick={() => history.push('/map')} />
       </Flex>
     )
   }
   
   // 添加属性校验
   SearchHeader.propTypes = {
     cityName: PropTypes.string.isRequired,
     className: PropTypes.string
   }
   
   export default withRouter(SearchHeader)
   
   ```






##### 002 - 找房页面搜索导航栏结构和样式

1.  在找房页面 `SearchHeader` 组件基础上，调整结构（添加返回 `icon` 等）

   ```jsx
   export default class CityList extends React.Component {
     render () {
       return (
         <div>
           <Flex className={styles.header}>
             <i className="iconfont icon-back" onClick={ () => this.props.history.go(-1) } />
             <SearchHeader cityName={label} className={styles.searchHeader} />
           </Flex>
         </div>
       )
     }
   }
   ```

   

2.  给 `SearchHeader` 组件传递  `className` 属性，来调整组件样式，让其适应找房页面效果

   ```jsx
   function SearchHeader({ cityName, history, className }) {
     return (
       <Flex className={['search-box', className || ''].join(' ')}>
         {/* coding…… */}
       </Flex>
     )
   }
   
   // 添加属性校验
   SearchHeader.propTypes = {
     cityName: PropTypes.string.isRequired,
     className: PropTypes.string
   }
   
   export default withRouter(SearchHeader)
   
   ```

   ```css
   /* 顶部导航栏样式 */
   .header {
     height: 45px;
     padding: 0 10px;
     background-color: #f6f5f6;
   }
   
   .header :global(.icon-back) {
     font-size: 16px;
     color: #999;
   }
   
   /* 覆盖 SearchHeader 组件的样式： */
   .searchHeader {
     position: relative;
     top: 0;
     padding: 0;
   }
   
   .searchHeader :global(.icon-map) {
     color: #00ae66;
   }
   
   .searchHeader :global(.search) {
     height: 30px;
   }
   
   ```

   

#### 五、条件筛选栏组件结构分析

1.  父组件：`Filter`

2.  子组件：`FilterTitle` 标题菜单组件

3.  子组件：`FilterPicker` 前三个菜单对应的内容组件

4.  子组件：`FilterMore` 最后一个菜单对应的内容组件

5.  `FilterPicker` 内容组件中，使用 `antd-mobile` 组件库的 `PickerView` 选择器组件

6.  `<></>` 语法是 `<React.Fragment>` 的简化语法，作用：不添加额外元素，返回多个节点

   ```jsx
   <React.Fragment>
     <span>Some text. </span> <h2>A heading</h2>
   </React.Fragment>
   
   // 或者简化语法：
   <>
     <span>Some text. </span> <h2>A heading</h2>
   </>
   ```

   

#### 六、条件筛选栏组件的功能分析

1.  点击 `FilterTitle` 组件菜单，展开该条件筛选对话框，被点击的标题高亮

2.  点击取消按钮或空白区域，隐藏对话框，取消标题高亮

3.  选择筛选条件后，点击确定按钮，隐藏对话框，当前标题高亮

4.  打开对话框时，如果已经选择了筛选条件，就默认选中已选择的条件

5.  对话框的展示和隐藏都有动画效果

6.  吸顶功能

7.  注意：`Filter` 组件不仅要实现自身功能，还要提供获取房源列表数据的筛选条件

   





#### 七、`FilterTitle` 组件实现

##### 001 - 思路分析

1.  功能一：根据标题菜单数据，渲染标题列表

2.  功能二：标题可点击（绑定事件）

3.  功能三：标题高亮

4.  标题高亮：

   - 点击时
   - 有筛选条件选中时

5.   标题高亮状态： 提升至父组件 Filter 中(状态提升)，由父组件提供高亮状态，子组件通过 props 接收状态类实现高亮

6.  原则： 单一数据源，也就是说： 状态只应该有一个组件提供并且提供操作状态的方法，其他组件直接使用该组件中的状态和操作状态的方法即可

   





##### 002 - 高亮逻辑与点击菜单实现高亮的实现

1.  通过 `props` 接收，高亮状态对象 `titleSelectedStatus`

   ```jsx
   // 标题高亮状态
   // true 表示高亮； false 表示不高亮
   const titleSelectedStatus = {
     area: true,
     mode: false,
     price: false,
     more: false
   }
   
   export default class Filter extends Component {
     state = {
       titleSelectedStatus
     }
   
     render() {
       const { titleSelectedStatus } = this.state
       return (
         <div className={styles.root}>
           <div className={styles.content}>
             {/* 标题栏 */}
             <FilterTitle titleSelectedStatus={titleSelectedStatus} />
           </div>
         </div>
       )
     }
   }
   
   ```

   ```jsx
   // FilterTitle
   
   export default function FilterTitle({ titleSelectedStatus }) {}
   ```

   

2.  遍历 `titleList` 数组，渲染标题列表

   ```jsx
   // FilterTitle
   
   // 条件筛选栏标题数组：
   const titleList = [
     { title: '区域', type: 'area' },
     { title: '方式', type: 'mode' },
     { title: '租金', type: 'price' },
     { title: '筛选', type: 'more' }
   ]
   
   export default function FilterTitle({ titleSelectedStatus }) {
     return (
       <Flex align="center" className={styles.root}>
         {
           titleList.map(item => {
             return (
               <Flex.Item>
                 {/* 选中类名： selected */}
                 <span className={[styles.dropdown, styles.selected ].join(' ')}>
                   <span>区域</span>
                   <i className="iconfont icon-arrow" />
                 </span>
               </Flex.Item>
             )
           })
         }
       </Flex>
     )
   }
   
   ```

   

3.  判断高亮对象中当前标题是否高亮，如果是，就添加高亮类

   ```jsx
   // FilterTitle
   
   export default function FilterTitle({ titleSelectedStatus }) {
     return (
       <Flex align="center" className={styles.root}>
         {
           titleList.map(item => {
             const isSelectd = titleSelectedStatus[item.type]
   
             return (
               <Flex.Item key={item.type}>
                 {/* 选中类名： selected */}
                 <span className={[styles.dropdown, isSelectd ? styles.selected : ''].join(' ')}>
                   <span>{item.title}</span>
                   <i className="iconfont icon-arrow" />
                 </span>
               </Flex.Item>
             )
           })
         }
       </Flex>
     )
   }
   
   ```

   

4.  给标题项绑定单击事件，在事件中调用父组件传过来的方法 `onClick`

5.  将当前标题 `type`，通过 `onClick` 的参数，传递给父组件

   ```jsx
   <Flex.Item key={item.type} onClick = { () => onClick(item.type) }></Flex.Item>
   ```

   

6.  父组件中接收到当前 `type`，修改该标题的选中状态为 `true`

   ```jsx
   // 点击标题菜单实现高亮
   onTitleClick = (type) => {
     // console.log(type)
     this.setState(prevState => {
       return {
         titleSelectedStatus: {
           ...prevState.titleSelectedStatus,
           [type]: true
         }
       }
     })
   }
   
   render() {
       const { titleSelectedStatus } = this.state
       return (
         <div className={styles.root}>
           <div className={styles.content}>
             {/* 标题栏 */}
             <FilterTitle
               titleSelectedStatus={titleSelectedStatus}
               onClick={this.onTitleClick}
             />
           </div>
         </div>
       )
     }
   ```






#### 九、`FilterPicker` 组件实现

##### 001 - 思路分析

1.  功能一：点击前三个标题展示该组件，点击取消按钮或空白区域隐藏该组件

2.  功能二：使用 `PickerView `组件展示筛选条件数据

3.  功能三：获取到 `PickerView` 组件中，选中的筛选条件值

4.  功能四：点击确定按钮，隐藏该组件，将获取到的筛选条件值传递给父组件

5.  展示或隐藏对话框的状态：由父组件提供（状态提升），通过 `props` 传递给子组件

6.  筛选条件数据：由父组件提供（因为所有筛选条件是通过一个接口来获取的），通过 `props` 传递
   给子组件

    

##### 002 - 控制组件的展示和隐藏

1. 在 `Filter` 组件中，提供组件展示或隐藏的状态： `openType`（表示展示的对话框类型）

   ```jsx
   state = {
     titleSelectedStatus,
     // 展示或隐藏的状态
     openType: ''
   }
   ```

   

2.  在 `render` 中判断 `openType` 值为 `area/mode/price` 时，就展示 `FilterPicker` 组件，以及遮罩层

   ```jsx
   {/* 前三个菜单的遮罩层 */}
   {
     openType === 'area' || openType === 'mode' || openType === 'price' ? (
       <div className={styles.mask} />
     ) : null
   }
   
   {/* 前三个菜单对应的内容： */}
   {
     openType === 'area' || openType === 'mode' || openType === 'price' ? (
       <FilterPicker />
     ) : null
   }
   ```

   

3.  在 `onTitleClick` 方法中，修改状态 `openType` 为当前 `type`，展示对话框

   ```jsx
   // 点击标题菜单实现高亮
   onTitleClick = (type) => {
     // console.log(type)
     this.setState(prevState => {
       return {
         // 展示对话框
         openType: type
       }
     })
   }
   ```

   

4.  在 `Filter` 组件中，提供 `onCancel` 方法（作为取消按钮和遮罩层的事件处理程序）

   ```jsx
   // 取消或隐藏遮罩层
   onCancel = () => {}
   ```

   

5.  在 `onCancel` 方法中，修改状态 `openType` 为空，隐藏对话框

   ```jsx
   // 取消或隐藏遮罩层
   onCancel = () => {
     this.setState(() => {
       return {
         openType: ''
       }
     })
   }
   ```

   

6.  将 `onCancel` 通过 props 传递给 `FilterPicker` 组件，在取消按钮的单击事件中调用该方法

   ```jsx
   // Filter 组件
   
   <FilterPicker onCancel={this.onCancel} />
   ```

   ```jsx
   // FilterPicker 组件
   
   export default class FilterPicker extends Component {
     render() {
       const { onCancel } = this.props
       return (
         <>
           {/* 选择器组件： */}
           <PickerView data={province} value={null} cols={3} />
   
           {/* 底部按钮 */}
           <FilterFooter onCancel={ () => onCancel() } />
         </>
       )
     }
   }
   ```

   

7.  在 `Filter` 组件中，提供 `onSave` 方法，作为确定按钮的事件处理程序，逻辑同上

   ```jsx
   // Filter 组件
   
   // 点确定按钮取消或隐藏遮罩层
   onSave = () => {
     this.setState(() => {
       return {
         openType: ''
       }
     })
   }
   
   <FilterPicker onCancel={this.onCancel} onSave={ () => this.onSave() } />
   ```

   ```jsx
   // FilterPicker 组件
   
   {/* 底部按钮 */}
   <FilterFooter onCancel={ () => onCancel() } onOk={ () => onSave() } />
   ```

   

##### 003 - 获取当前筛选条件的数据

1.  在 `Filter` 组件中，发送请求，获取所有筛选条件数据

   ```jsx
   
   componentDidMount() {
     this.getFiltersData()
   }
   
   // 封装获取所有筛选条件的方法
   async getFiltersData() {
     // 获取当前定位城市id
     const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
     const { data: res } = await API.get(`/houses/condition?id=${value}`)
   
     this.setState({
       filtersData: res.body
     })
   }
   ```

   

2.  将数据保存为状态：`filtersData`

   ```jsx
   state = {
     // 所有筛选条件数据
     filtersData: {}
   }
   ```

   

3.  封装方法 `renderFilterPicker` 来渲染 `FilterPicker` 组件

   ```jsx
   // 渲染 FilterPicker 组件的方法
   renderFilterPicker() {
     const { openType } = this.state
   
     if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
       return null
     }
   
     return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
   }
   ```

   

4.  在方法中，根据 `openType` 的类型，从 `filtersData` 中获取到需要的数据

   ```jsx
   // 渲染 FilterPicker 组件的方法
   renderFilterPicker() {
     const {
       openType,
       filtersData: { area, subway, rentType, price }
     } = this.state
   
     if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
       return null
     }
   
     // 根据 openType 来拿到当前筛选条件数据
     let data = []
     let cols = 3
   
     switch (openType) {
       case 'area':
         // 获取到区域数据
         data = [area, subway]
         cols = 3
         console.log(data)
         break
       case 'mode':
         data = rentType
         cols = 1
         break
       case 'price':
         data = price
         cols = 1
         break
       default:
         break
     }
   }
   ```

   

5.  将数据通过 `props` 传递给 `FilterPicker` 组件

   ```jsx
   // 渲染 FilterPicker 组件的方法
   renderFilterPicker() {
     // coding……
   
     return (
       <FilterPicker
         onCancel={this.onCancel}
         onSave={this.onSave}
         data={data}
         cols={cols}
       />
     )
   }
   ```

   

6.  `FilterPicker` 组件接收到数据后，将其作为 `PickerView` 组件的 `data` （数据源）

   ```jsx
   export default class FilterPicker extends Component {
     render() {
       const { onCancel, onSave, data, cols } = this.props
       return (
         <>
           {/* 选择器组件： */}
           <PickerView data={data} value={null} cols={cols} />
   
           {/* 底部按钮 */}
           <FilterFooter onCancel={() => onCancel()} onOk={() => onSave()} />
         </>
       )
     }
   }
   ```

   

##### 004 - 获取默认值

1. 在 `FilterPicker` 组件中，添加状态 `value`（用于获取 `PickerView` 组件的选中值）

   ```jsx
   state = {
     // PickerView 组件的选中值
     value: ''
   }
   ```

   

2.  给 `PickerView` 组件添加配置项 `onChange`，通过参数获取到选中值，并更新状态 `value`

   ```jsx
   {/* 选择器组件： */}
   <PickerView data={data} value={value} cols={cols} onChange={val => {
     this.setState({
       value: val
     })
   }} />
   ```

3.  将 `type` 值使用 `props` 传递到  `FilterPicker` 组件中

   ```jsx
   <FilterPicker
     onCancel={this.onCancel}
     onSave={this.onSave}
     data={data}
     cols={cols}
     type={openType}
   />
   ```

   

4.  在确定按钮的事件处理程序中，将 `type` 和 `value` 作为参数传递给父组件

   ```jsx
   render() {
     const { onCancel, onSave, data, cols, type } = this.props
     const { value } = this.state
   
     return (
       <>
         {/* 选择器组件： */}
         <PickerView data={data} value={value} cols={cols} onChange={ this.selectHandle } />
   
         {/* 底部按钮 */}
      <FilterFooter onCancel={() => onCancel()} onOk={() => onSave(type, value)} />
       </>
     )
   }
   ```
   
   
   
   ```jsx
   // 点确定按钮取消或隐藏遮罩层
   onSave = (type, value) => {
     console.log(type, value)
     this.setState(() => {
       return {
         openType: ''
       }
     })
   }
   ```
   
   

##### 005 - 设置默认选中值

1. 在 Filter 组件中，提供 `FilterPicker` 组件的选中值状态对象：`selectedValues`

   ```jsx
   // FilterPicker 和 FilterMore 组件的选中值
   const selectedValues = {
     area: ['area', 'null'],
     mode: ['null'],
     price: ['null'],
     more: []
   }
   
   
   export default class Filter extends Component {
     state = {
       // 筛选条件的选中值
       selectedValues
     }
   }
   ```

   

2.  根据 `openType` 获取到当前类型的选中值（`defaultValue`），通过 props 传递给 `FilterPicker` 组件

   ```jsx
   const {
     openType,
     filtersData: { area, subway, rentType, price },
     selectedValues
   } = this.state
   
   let defaultValue = selectedValues[openType]
   
   switch (openType) {
     // coding……   
   }
   
   return (
     <FilterPicker
       onCancel={this.onCancel}
       onSave={this.onSave}
       data={data}
       cols={cols}
       type={openType}
       defaultValue={defaultValue}
     />
   )
   ```

   

3.  在 `FilterPicker` 组件中，将 `defaultValue` 设置为状态 `value` 的默认值

   ```jsx
   state = {
     // PickerView 组件的选中值
     value: this.props.defaultValue
   }
   ```

   

4.  父组件中更新当前 `type` 对应的 `selectedValues` 状态值

   ```jsx
   // 点确定按钮取消或隐藏遮罩层
   onSave = (type, value) => {
     console.log(type, value)
     this.setState(() => {
       return {
         openType: '',
         selectedValues: {
           ...this.state.selectedValues,
           [type]: value
         }
       }
     })
   }
   ```

   

##### 006 - 设置默认选中值bug修复

1.  在前面三个标签之间来回切换时候，默认选中值不会生效，当点击确定，重新打开 `FilterPicker` 组件时候，才会生效
2.  分析：两种操作方式的区别在于有没有重新创建 `FilterPicker` 组件，重新创建的时候，会生效，不重新创建，不会生效

3.  原因：不重新创建 `FilterPicker` 组件时，不会再次执行 `state` 初始化，也就拿不到最新的`props`

4.  解决方式：给 `FilterPicker` 组件添加 `key ` 值为 `openType`，这样，在不同标题之间切换时候，`key` 值都不相同，`React` 内部会在 `key` 不同时候，重新创建该组件

   ```jsx
   return (
     <FilterPicker
       key={openType}
       onCancel={this.onCancel}
       onSave={this.onSave}
       data={data}
       cols={cols}
       type={openType}
       defaultValue={defaultValue}
     />
   )
   ```

   















