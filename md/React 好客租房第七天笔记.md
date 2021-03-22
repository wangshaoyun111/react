### React 第十一天笔记

---

#### 一、完善 `FilterTitle` 高亮功能

###### 001 - 实现思路

1.  点击标题时，遍历标题高亮数据

2.  如果是当前标题，直接设置为高亮

3.  分别判断每个标题对应的筛选条件有没有选中值，(判断每个筛选条件的选中值与默认值是否相同，相同
   表示没有选中值；不同，表示选中了值)

4.  如果有，就让该标题保持高亮

5.  如果没有，就让该标题去掉高亮

   

###### 002 - 实现步骤

1.  在标题点击事件 `onTitleClick` 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象

   ```jsx
   // 点击标题菜单实现高亮
   onTitleClick = (type) => {
     // 标题选中状态对象和筛选条件的选中值对象
     const { titleSelectedStatus, selectedValues } = this.state
   }
   ```

   

2.  根据当前标题选中状态对象，获取到一个新的标题选中状态对象(`newTitleSelectedStatus`)

   ```jsx
   // 点击标题菜单实现高亮
   onTitleClick = (type) => {
     // 标题选中状态对象和筛选条件的选中值对象
     const { titleSelectedStatus, selectedValues } = this.state
   
     // 创建新的标题选中状态对象
     const newTitleSelectedStatus = { ...titleSelectedStatus }
   }
   ```

   

3.  使用 `Object.keys()` 方法，遍历标题选中状态对象

   ```jsx
   Object.keys(titleSelectedStatus).forEach(key => {})
   ```

   

4.  先判断是否为当前标题，如果是，直接让该标题选中状态为 `true`（高亮）

   ```jsx
   // 遍历标题选中状态对象
   
   Object.keys(titleSelectedStatus).forEach(key => {
     // key 表示数组中的每一项，此处，就是每个标题的 type 值。
     if (key === type) {
       // 当前标题
       newTitleSelectedStatus[type] = true
       return
     }
   })
   ```

   

5.  否则，分别判断每个标题的选中值是否与默认值相同

6.  如果不同，则设置该标题的选中状态为 `true`

7.  如果相同，则设置该标题的选中状态为 `false`

   ```jsx
   // 遍历标题选中状态对象
   
   Object.keys(titleSelectedStatus).forEach(key => {
     // key 表示数组中的每一项，此处，就是每个标题的 type 值。
     if (key === type) {
       // 当前标题
       newTitleSelectedStatus[type] = true
       return
     }
   
     // 其他标题：
     const selectedVal = selectedValues[key]
     if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
       // 高亮
       newTitleSelectedStatus[key] = true
     } else if (key === 'mode' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[key] = true
     } else if (key === 'price' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[key] = true
     } else if (key === 'more') {
       // 更多选择项 FilterMore 组件
     } else {
       newTitleSelectedStatus[key] = false
     }
   })
   ```

   

8.  更新状态 `titleSelectedStatus` 的值为：`newTitleSelectedStatus`

   ```jsx
   this.setState({
     // 展示对话框
     openType: type,
     // 使用新的标题选中状态对象来更新
     titleSelectedStatus: newTitleSelectedStatus
   })
   ```

   

#### 二、`FilterMore` 组件的实现

###### 001 - 渲染组件数据

1.  封装 `renderFilterMore` 方法，渲染 `FilterMore` 组件

   ```jsx
   // 渲染 FilterMore 组件的方法
   renderFilterMore() {
     return <FilterMore />
   }
   ```

   

2.  从 `filtersData` 中，获取数据（`roomType`, `oriented`,  `floor`, `characteristic`），通过 `props` 传递
   给 `FilterMore` 组件

   ```jsx
   // 渲染 FilterMore 组件的方法
   renderFilterMore() {
     const {
       openType,
       filtersData: { roomType, oriented, floor, characteristic }
     } = this.state
   
     if (openType !== 'more') {
       return null
     }
   
     const data = {
       roomType,
       oriented,
       floor,
       characteristic
     }
   
     return <FilterMore />
   }
   ```

   

3.  `FilterMore` 组件中，通过 `props` 获取到数据，分别将数据传递给 `renderFilters` 方法

   ```jsx
   // 渲染 FilterMore 组件的方法
   renderFilterMore() {
     // coding……
   
     return <FilterMore data={data} />
   }
   ```

   

4.  在 `renderFilters` 方法中，通过参数接收数据，遍历数据，渲染标签

   ```jsx
   export default class FilterMore extends Component {
     // 渲染标签
     renderFilters(data) {
       // 高亮类名： styles.tagActive
       return data.map(item => {
         return (
           <span
             key={item.value}
             className={[styles.tag, styles.tagActive].join(' ')}
           >{item.label}</span>
         )
       })
     }
   
     render() {
       const { data: { roomType, oriented, floor, characteristic } } = this.props
   
       return (
         <div className={styles.root}>
           {/* 遮罩层 */}
           <div className={styles.mask} />
   
           {/* 条件内容 */}
           <div className={styles.tags}>
             <dl className={styles.dl}>
               <dt className={styles.dt}>户型</dt>
               <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>
   
               <dt className={styles.dt}>朝向</dt>
               <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>
   
               <dt className={styles.dt}>楼层</dt>
               <dd className={styles.dd}>{this.renderFilters(floor)}</dd>
   
               <dt className={styles.dt}>房屋亮点</dt>
               <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
             </dl>
           </div>
   
           {/* 底部按钮 */}
           <FilterFooter className={styles.footer} />
         </div>
       )
     }
   }
   ```

   

###### 002 - 获取选中值以及设置高亮

1.  在 `state` 中添加状态 `selectedValues`（表示选中项的值）

   ```jsx
   state = {
     selectedValues: []
   }
   ```

   

2.  给标签绑定单击事件，通过参数获取到当前项的 `value`

   ```jsx
   onTagClick(value) {
     console.log(value)
   }
   
   // 渲染标签
   renderFilters(data) {
     // 高亮类名： styles.tagActive
     return data.map(item => {
       return (
         <span
           key={item.value}
           className={[styles.tag].join(' ')}
           onClick={() => this.onTagClick(item.value)}
         >{item.label}</span>
       )
     })
   }
   ```

   

3.  判断 `selectedValues` 中是否包含当前项的 `value` 值

4.  如果不包含，就将当前项的 `value` 添加到 `selectedValues` 数组中

5.  如果包含，就从 `selectedValues` 数组中移除（使用数组的 `splice` 方法，根据索引号删除）

   ```jsx
   onTagClick(value) {
     const { selectedValues } = this.state
   
     // 创建数组
     const newSelectedValues = [...selectedValues]
   
     if (selectedValues.indexOf(value) <= -1) {
       // 没有当前项的值
       newSelectedValues.push(value)
     } else {
       const index = newSelectedValues.findIndex(item => item === value)
      	// 使用数组的 splice 方法，根据索引号删除
       newSelectedValues.splice(index, 1)
     }
   
     this.setState({
       selectedValues: newSelectedValues
     })
   }
   ```

   

6.  在渲染标签时，判断 `selectedValues` 数组中，是否包含当前项的 `value`，包含，就添加高亮类

   ```jsx
   // 渲染标签
   renderFilters(data) {
     // 高亮类名： styles.tagActive
     return data.map(item => {
       const { selectedValues } = this.state
       const isSelected = selectedValues.indexOf(item.value) > -1
       return (
         <span
           key={item.value}
           className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
           onClick={() => this.onTagClick(item.value)}
         >{item.label}</span>
       )
     })
   }
   ```

   

###### 003 - 清除和确定按钮的逻辑处理

1. 设置 `FilterFooter` 组件的取消按钮文字为：清除

   ```jsx
   {/* 底部按钮 */}
   <FilterFooter
     className={styles.footer}
     cancelText="清除"
   />
   ```

   

2.  点击取消按钮时，清空所有选中项的值（`selectedValues: []`）

   ```jsx
   {/* 底部按钮 */}
   <FilterFooter
     className={styles.footer}
     cancelText="清除"
     onCancel={this.onCancel}
   />
   ```

   ```jsx
   onCancel = () => {
     this.setState({
       selectedValues: []
     })
   }
   ```

   

3.  点击确定按钮时，将当前选中项的值和 `type`，传递给 `Filter` 父组件

   -  在 `FilterMore` 组件中获取不到 `type` 值，需要在 `Filter` 中传递

   ```jsx
   // FilterMore
   
   <FilterMore data={data} type={openType} onSave={this.onSave} />
   ```

   ```jsx
   onOk = () => {
     const {type, onSave} = this.props
   
     onSave(type, this.state.selectedValues)
   }
   ```

   ```jsx
   {/* 底部按钮 */}
   <FilterFooter
     className={styles.footer}
     cancelText="清除"
     onCancel={this.onCancel}
     onOk={this.onOk}
   />
   ```

   

4.  在 Filter 组件中的 `onSave` 方法中，接收传递过来的选中值，更新状态 `selectedValues`

   ```jsx
   // 点确定按钮取消或隐藏遮罩层
   onSave = (type, value) => {
     console.log(type, value)
     this.setState({
       openType: '',
       selectedValues: {
         ...this.state.selectedValues,
         [type]: value
       }
     })
   }
   ```






###### 004 - 设置默认选中值

1.  在渲染 `FilterMore` 组件时，从 `selectedValues` 中，获取到当前选中值 `more`

   ```jsx
   // 渲染 FilterMore 组件的方法
   renderFilterMore() {
     const {
       openType,
       selectedValues,
       filtersData: { roomType, oriented, floor, characteristic }
     } = this.state
   
     // coding……
   
     const defaultValue = selectedValues.more
   
     return <FilterMore data={data} type={openType} onSave={this.onSave} />
   }
   ```

   

2.  通过 `props` 将选中值传递给 `FilterMore` 组件

   ```jsx
   // 渲染 FilterMore 组件的方法
   renderFilterMore() {
     const {
       openType,
       selectedValues,
       filtersData: { roomType, oriented, floor, characteristic }
     } = this.state
   
     // coding……
   
     const defaultValue = selectedValues.more
   
     return <FilterMore
              data={data}
              type={openType}
              onSave={this.onSave}
              defaultValue={defaultValue}
             />
   }
   ```

   

3.  在 `FilterMore` 组件中，将获取到的选中值，设置为子组件状态 `selectedValues` 的默认值

   ```jsx
   state = {
     selectedValues: this.props.defaultValue
   }
   ```

   

4.  给遮罩层绑定单击事件

   - 在 `Filter` 组件中传入 `onCancel` 方法

   ```jsx
    <FilterMore onCancel={this.onCancel} />
   ```

   -  在 `FilterMore` 组件中组件绑定单击事件

   ```jsx
   <div className={styles.mask} onClick={} />
   ```

   

5.  在单击事件中，调用父组件的方法 `onCancel` 关闭 `FilterMore` 组件

   - 接收传入的 `onCancel`

   ```jsx
   const { data: { roomType, oriented, floor, characteristic }, onCancel } = this.props
   ```

   -  点击遮罩层，调用父组件的方法 `onCancel` 

   ```jsx
   <div className={styles.mask} onClick={onCancel} />
   ```

   

#### 三、完成 `FilterTitle`高亮功能

1.  在 Filter 组件的 `onTitleClick` 方法中，添加 `type` 为 `more` 的判断条件

2.  当选中值数组长度不为 0 时，表示 `FilterMore` 组件中有选中项，此时，设置选中状态高亮

   ```jsx
   else if (key === 'more' && selectedVal.length !== 0) {
     // 更多选择项 FilterMore 组件
     newTitleSelectedStatus[key] = true
   }
   ```

   

3.  在点击确定按钮时，根据参数 `type` 和 `value`，判断当前菜单是否高亮

   ```jsx
   // 点确定按钮取消或隐藏遮罩层
   onSave = (type, value) => {
     console.log(type, value)
     const { titleSelectedStatus } = this.state
     // 创建新的标题选中状态对象
     const newTitleSelectedStatus = { ...titleSelectedStatus }
   
     // 菜单高亮逻辑处理
     const selectedVal = value
     if (
       type === 'area' &&
       (selectedVal.length !== 2 || selectedVal[0] !== 'area')
     ) {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'mode' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'price' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'more' && selectedVal.length !== 0) {
       // 更多选择项 FilterMore 组件
       newTitleSelectedStatus[type] = true
     } else {
       newTitleSelectedStatus[type] = false
     }
   
     this.setState({
       openType: '',
       // 更新菜单高亮状态数据
       titleSelectedStatus: newTitleSelectedStatus,
       selectedValues: {
         ...this.state.selectedValues,
         [type]: value
       }
     })
   }
   ```

   

4.  在关闭对话框时（`onCance`l），根据 type 和当前type的选中值，判断当前菜单是否高亮

   ```jsx
   // 取消或隐藏遮罩层
   onCancel = (type) => {
     const { titleSelectedStatus, selectedValues } = this.state
     // 创建新的标题选中状态对象
     const newTitleSelectedStatus = { ...titleSelectedStatus }
   
     // 菜单高亮逻辑处理
     const selectedVal = selectedValues[type]
     if (
       type === 'area' &&
       (selectedVal.length !== 2 || selectedVal[0] !== 'area')
     ) {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'mode' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'price' && selectedVal[0] !== 'null') {
       // 高亮
       newTitleSelectedStatus[type] = true
     } else if (type === 'more' && selectedVal.length !== 0) {
       // 更多选择项 FilterMore 组件
       newTitleSelectedStatus[type] = true
     } else {
       newTitleSelectedStatus[type] = false
     }
     this.setState(() => {
       return {
         openType: '',
         // 更新菜单高亮状态数据
         titleSelectedStatus: newTitleSelectedStatus
       }
     })
   }
   ```

   

#### 四、房屋列表功能

###### 001 - 组件筛选条件

1.  在 `Filter` 组件的 `onSave` 方法中，根据最新 `selectedValues` 组装筛选条件数据 `filters`

   ```jsx
   onSave = (type, value) => {
     const newSelectedValues = {
       ...this.state.selectedValues,
       [type]: value
     }
   
     this.setState({
       openType: '',
       // 更新菜单高亮状态数据
       titleSelectedStatus: newTitleSelectedStatus,
       selectedValues: newSelectedValues
     })
   }
   ```

   

2.  获取区域数据的参数名： `area` 或 `subway`（选中值数组的第一个元素）

   ```jsx
   onSave = (type, value) => {
     // coding……
     
     // 筛选条件数据
     const filters = {}
     // 解构筛选数据
     const { area } = newSelectedValues
     // 取到区域关键字
     const areaKey = arr[0]
     // 区域的值
     let areaValue = 'null'
     
     // coding……
   }
   ```

   

3.  获取区域数据的值（以最后一个 `value` 为准）

   ```jsx
   onSave = (type, value) => {
     // coding……
     
     // 筛选条件数据
     const filters = {}
     // 解构筛选数据
     const { area } = newSelectedValues
     // 取到区域关键字
     const areaKey = arr[0]
     // 区域的值
     let areaValue = 'null'
     // 处理区域的取值
     if (area.length === 3) {
       areaValue = area[2] !== 'null' ? area[2] : area[1]
     }
     // 将处理好的区域数据添加到 filter 中
     filters[areaKey] = areaValue
     
     // coding……
   }
   ```

   

4.  获取方式和租金的值（选中值的第一个元素）

   ```jsx
   // 解构筛选数据
   const { area, mode, price } = newSelectedValues
   ```

   ```jsx
   // 方式和租金
   filters.mode = mode[0]
   filters.price = price[0]
   ```

   

5.  获取筛选（`more`）的值（将选中值数组转化为以逗号分隔的字符串）

   ```jsx
   // 更多筛选条件 more
   filters.more = more.join(',')
   ```

   

###### 002 - 获取房屋列表数据

1.  将筛选条件数据 `filters` 传递给父组件 `HouseList`

    ```jsx
    this.props.onFilter(filters)
    ```

    

2.  `HouseList` 组件中，创建方法 `onFilter`，通过参数接收 `filters` 数据，并存储到 `this` 中

   ```jsx
   export default class CityList extends React.Component {
     onFilter = (filters) => {
       this.filters = filters
       console.log(this.filters)
     }
     
     render () {
       return (
         <div>
           {/* coding…… */}
   
           {/* 条件筛选栏 */}
           <Filter onFilter={ this.onFilter } />
         </div>
       )
     }
   }
   ```

   

3.  创建方法 `searchHouseList`（用来获取房屋列表数据）

   ```jsx
   searchHouseList() {}
   ```

   

4.  根据接口，获取当前定位城市 `id` 参数

   ```jsx
   searchHouseList() {
     // 获取当前定位城市id
     const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
   }
   ```

   

5.  将筛选条件数据与分页数据合并后，作为接口的参数，发送请求，获取房屋数据

   ```jsx
   // 用来获取房屋列表数据
   async searchHouseList() {
     // 获取当前定位城市id
     const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
     const { data: res } = await API.get('/houses', {
       params: {
         cityId: value,
         ...this.filters,
         start: 1,
         end: 20
       }
     })
   }
   ```

   ```jsx
   onFilter = (filters) => {
     this.filters = filters
     this.searchHouseList()
   }
   ```

   

###### 003 - 进入页面时获取数据

1.  在 `componentDidMount` 钩子函数中，调用 `searchHouseList`，来获取房屋列表数据

   ```jsx
   componentDidMount() {
     // 调用 searchHouseList，来获取房屋列表数据
     this.searchHouseList()
   }
   ```

   

2.  给 `HouseList` 组件添加属性 `filters`，值为对象

   ```jsx
   // 初始化实例属性
   filters = {}
   ```

   

3.  添加两个状态：`list` 和 `count`（存储房屋列表数据和总条数）

   ```jsx
   state = {
     // 列表数据
     list: [],
     // 总条数
     count: 0
   }
   ```

   

4.  将获取到的房屋数据，存储到 `state` 中

   ```jsx
   // 用来获取房屋列表数据
   async searchHouseList() {
     // 获取当前定位城市id
     const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
     const { data: res } = await API.get('/houses', {
       params: {
         cityId: value,
         ...this.filters,
         start: 1,
         end: 20
       }
     })
   
     const { list, count } = res.body
     // 将获取到的房屋数据，存储到 state 中
     this.setState({
       list,
       count
     })
   }
   ```

   

###### 004 - 使用 List 组件渲染数据

1.  封装 `HouseItem` 组件，实现 `Map` 和 `HouseList` 页面中，房屋列表项的复用

   ```jsx
   import React from 'react'
   
   import PropTypes from 'prop-types'
   
   import styles from './index.module.css'
   
   function HouseItem({ src, title, desc, tags, price, onClick }) {
     return (
       <div className={styles.house} onClick={onClick}>
         <div className={styles.imgWrap}>
           <img className={styles.img} src={src} alt="" />
         </div>
         <div className={styles.content}>
           <h3 className={styles.title}>{title}</h3>
           <div className={styles.desc}>{desc}</div>
           <div>
             {/* ['近地铁', '随时看房'] */}
             {tags.map((tag, index) => {
               const tagClass = 'tag' + (index + 1)
               return (
                 <span
                   className={[styles.tag, styles[tagClass]].join(' ')}
                   key={tag}
                 >
                   {tag}
                 </span>
               )
             })}
           </div>
           <div className={styles.price}>
             <span className={styles.priceNum}>{price}</span> 元/月
           </div>
         </div>
       </div>
     )
   }
   
   HouseItem.propTypes = {
     src: PropTypes.string,
     title: PropTypes.string,
     desc: PropTypes.string,
     tags: PropTypes.array.isRequired,
     price: PropTypes.number,
     onClick: PropTypes.func
   }
   
   export default HouseItem
   
   ```

   

2.  使用 `HouseItem` 组件改造 `Map` 组件的房屋列表项

   ```jsx
   return this.state.housesList.map(item => (
     <HouseItem
       key={item.houseCode}
       src={BASE_URL + item.houseImg}
       title={item.title}
       desc={item.desc}
       tags={item.tags}
       price={item.price}
     />
   ))
   ```

   

3.  使用 `react-virtualized` 的 `List` 组件渲染房屋列表（参考 `CityList` 组件的使用）

   ```jsx
   import React from 'react'
   
   import { List } from 'react-virtualized'
   
   import { API } from '../../utils/api'
   import { BASE_URL } from '../../utils/url'
   
   import HouseItem from '../../components/HouseItem'
   
   export default class HouseList extends React.Component {
   	
     // coding……
       
     renderHouseList = ({ key, index, style }) => {
       // 根据索引号来获取当前这一行的房屋数据
       const { list } = this.state
       const house = list[index]
   
       return (
         <HouseItem
           key={key}
           style={style}
           src={BASE_URL + house.houseImg}
           title={house.title}
           desc={house.desc}
           tags={house.tags}
           price={house.price}
         />
       )
     }
   
     render() {
       return (
         <div>
           {/* coding…… */}
   
           {/* 房屋列表 */}
           <div className={styles.houseItems}>
             <List
               width={300}
               height={300}
               rowCount={this.state.count} // List列表项的行数
               rowHeight={120} // 每一行的高度
               rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
             />
           </div>
         </div>
       )
     }
   }
   
   ```

   

###### 005 - 使用`WindowScroller` 让 `List`跟随页面滚动

1.  默认，List 组件只让组件自身出现滚动条，无法让整个页面滚动，也就无法实现标题栏吸顶功能

2.  解决方式：使用 `WindowScroller` 高阶组件，让 `List` 组件跟随页面滚动（为 List 组件提供状态，同
   时还需设置 `List` 组件的 `autoHeight` 属性）

   ```jsx
   import { List, AutoSizer, WindowScroller } from 'react-virtualized'
   ```

   

3.  注意：`WindowScroller` 高阶组件只能提供 `height`，无法提供 `width`

4.  解决方式：在 `WindowScroller` 组件中使用 `AutoSizer` 高阶组件来为 `List` 组件提供 `width`

   ```jsx
   {/* 房屋列表 */}
   <div className={styles.houseItems}>
     <WindowScroller>
       {({ height, isScrolling, scrollTop }) => (
         <AutoSizer>
           {({ width }) => (
             <List
               autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
               width={width} // 视口的宽度
               height={height} // 视口的高度
               rowCount={this.state.count} // List列表项的行数
               rowHeight={120} // 每一行的高度
               rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
               isScrolling={isScrolling}
               scrollTop={scrollTop}
             />
           )}
         </AutoSizer>
       )}
     </WindowScroller>
   </div>
   ```

   

###### 006 - `InfiniteLoader`组件的说明和基本使用

1.  需求：滚动房屋列表时，动态加载更多房屋数据

2.  解决方式：使用 `InfiniteLoader` 组件，来实现无限滚动列表，从而加载更多房屋数据

   ```jsx
   import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
   ```

   

3.  根据 `InfiniteLoader` 组件文档 示例，在项目使用该组件

   ```jsx
   {/* 房屋列表 */}
   <div className={styles.houseItems}>
     <InfiniteLoader
       isRowLoaded={this.isRowLoaded}
       loadMoreRows={this.loadMoreRows}
       rowCount={count}
     >
       {({ onRowsRendered, registerChild }) => (
         <WindowScroller>
           {({ height, isScrolling, scrollTop }) => (
             <AutoSizer>
               {({ width }) => (
                 <List
                   onRowsRendered={onRowsRendered}
                   ref={registerChild}
                   autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                   width={width} // 视口的宽度
                   height={height} // 视口的高度
                   rowCount={count} // List列表项的行数
                   rowHeight={120} // 每一行的高度
                   rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                   isScrolling={isScrolling}
                   scrollTop={scrollTop}
                 />
               )}
             </AutoSizer>
           )}
         </WindowScroller>
       )}
     </InfiniteLoader>
   </div>
   ```

   

###### 007 - 加载更多房源列表数据

1.  在 `loadMoreRows` 方法中，根据起始索引和结束索引，发送请求，获取更多房屋数据

   ```jsx
   loadMoreRows = ({ startIndex, stopIndex }) => {
     console.log(startIndex, stopIndex)
   
     return new Promise(resolve => {
       API.get('/houses', {
         params: {
           cityId: value,
           ...this.filters,
           start: startIndex,
           end: stopIndex
         }
       }).then(res => {})
     })
   }
   ```

   

2.  获取到最新的数据后，与当前 `list` 中的数据合并，再更新 `state`，并调用 `Promise` 的 `resolve()`

   ```jsx
   loadMoreRows = ({ startIndex, stopIndex }) => {
     console.log(startIndex, stopIndex)
   
     return new Promise(resolve => {
       API.get('/houses', {
         params: {
           cityId: value,
           ...this.filters,
           start: startIndex,
           end: stopIndex
         }
       }).then(res => {
         // console.log('loadMoreRows：', res)
         this.setState({
           list: [...this.state.list, ...res.data.body.list]
         })
   
         // 数据加载完成时，调用 resolve 即可
         resolve()
       })
     })
   }
   ```

   

3.  在 `renderHouseList` 方法中，判断 `house` 是否存在

4.  不存在的时候，就渲染一个 `loading` 元素（防止拿不到数据时报错）

5.  存在的时候，再渲染 `HouseItem` 组件

   ```jsx
   renderHouseList = ({ key, index, style }) => {
     // 根据索引号来获取当前这一行的房屋数据
     const { list } = this.state
     const house = list[index]
   
     // 判断 house 是否存在
     // 如果不存在，就渲染 loading 元素占位
     if (!house) {
       return (
         <div key={key} style={style}>
           <p className={styles.loading} />
         </div>
       )
     }
   
     return (
       <HouseItem
         key={key}
         style={style}
         src={BASE_URL + house.houseImg}
         title={house.title}
         desc={house.desc}
         tags={house.tags}
         price={house.price}
       />
     )
   }
   ```

   





