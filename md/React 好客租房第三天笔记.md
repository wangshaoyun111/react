###  React 好客租房(上)

----

#### 001 - 顶部导航栏

1.  打开 `antd-design` 官网，导入 `NavBar` 组件

    ```jsx
    import { NavBar } from 'antd-mobile'
    ```

2.  复制核心代码到页面中实现布局，并梳理结构，去掉不需要的内容

    ```jsx
    render() {
        return (
          <div>
            <NavBar
              mode="light"
              icon={<i className="iconfont icon-back" />}
              onLeftClick={() => console.log('onLeftClick')}
            >城市选择</NavBar>
          </div>
        )
      }
    ```

3.  修改样式

    -  给 `NavBar` 组件添加 `className="navbar"`
    -  给跟元素添加 `className="citylist"`
    -  设置样式

    ```jsx
    render() {
        return (
          <div className="citylist">
            <NavBar
              className="navbar"
              mode="light"
              icon={<i className="iconfont icon-back" />}
              onLeftClick={() => console.log('onLeftClick')}
            >城市选择</NavBar>
          </div>
        )
    }
    ```
    
    ```css
    .citylist {
      // 顶部导航兰
      .navbar {
    	color: #333;
    	background-color: #f6f5f6;
    
       .am-navbar-title {
         color: #333;
       }
      }
    }
       
    ```
    
    



4.    点击向左的箭头，在 onLeftClick 对应的事件处理程序中，实现返回上一页的操作

      ```jsx
      render() {
          return (
            <div className="citylist
              <NavBar
                className="navbar"
                mode="light"
                icon={<i className="iconfont icon-back" />}
                onLeftClick={() => this.props.history.go(-1)}
              >城市选择</NavBar>
            </div>
          )
      }
      ```

      







#### 002 - 获取并处理城市列表数据

1.  导入 `axios` 

    ```jsx
    // 导入 axios
    import axios from 'axios'
    ```

2.  创建获取城市列表的数据的方法 `getCityList`，并发送请求，获取数据

    - 创建`getCityList`，并发送请求
    - 在钩子函数 `componentDidMount` 调用 `getCityList` 方法

    ```jsx
    // 获取城市列表的数据
    async getCityList () {
      const { data: res } = await axios.get(`http://8.131.91.46:8009//area/city?level=1`)
      console.log(res)
    }
    ```



#### 003 - 处理城市列表数据

前置： 后台返回的数据格式并不符合我们的需求，所以需要进行格式化的处理来满足我们的业务需求

```jsx
// 接口返回的数据格式：
[{ "label": "北京", "value": "", "pinyin": "beijing", "short": "bj" }]

// 渲染城市列表的数据格式为：
// 键：是城市的首字母
// 值：是否是以某个字母开头的城市信息
{ a: [{}, {}], b: [{}, ...], c: [{}] }

// 渲染右侧索引的数据格式为：
['a', 'b']
```



1.   在组件外部声明一个方法`formatCityData`，专门用来转换我们的数据格式  ，接收一个参数叫 `list` ，即徐需要格式化的源数据

     ```js
     const formatCityData = (list) => {}
     ```

2.  在 `getCityList` 方法中，调用 `formatCityData` 方法，并传入获取到的城市列表数据

    ```js
    formatCityData(res.data.body)
    ```

3.  根据分析，我们得到，需要返回 两个数据：

    - 城市列表数据
    - 城市列表索引数据

    需要在声明的 `formatCityData` 函数中创建并返回

    在 `getCityList` 方法中解构出返回的值，

    ```jsx
    const formatCityData = (list) => {
      // 城市列表数据
      const cityList = {}
      // 城市索引数组
      const cityIndex = []
      
      return {
          cityList,
          cityIndex
      }
    }
    ```

    ```jsx
    // 获取城市列表的数据
    async getCityList () {
      const { data: res } = await axios.get(`xxxxx`)
      const { cityList, cityIndex } = formatCityData(res.body)
      console.log(cityList)
      console.log(cityIndex)
    }
    ```

4.  开始对传入的数据进行格式化，共分为 5 个小步骤

    - 1 遍历list数组
    - 2 获取每一个城市的首字母
    - 3 判断 `cityList` 中是否有该分类
    - 4 如果有，直接往该分类中push数据
    - 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中

    ```jsx
    // 1 遍历list数组
    list.forEach(item => {
      // 2 获取每一个城市的首字母，也是指分类
      const first = item.short.substr(0, 1)
      // 3 判断 cityList 中是否有该分类
      if (cityList[first]) {
        // 4 如果有，直接往该分类中push数据
        cityList[first].push(item)
      } else {
        // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
        cityList[first] = [item]
      }
    })
    ```

5.   对城市列表索引数据进行处理，经过分析，我们只需要取到 城市列表数据的 `key` 拼接成数据返回给 `cityIndex` 即可，这里可以使用 `Object.keys()` 方法

     ```jsx
     // 城市索引数组
     const cityIndex = Object.keys(cityList).sort()
     ```

6.  完整代码如下

    ```jsx
    // 处理城市列表数据
    const formatCityData = (list) => {
      // 城市列表数据
      const cityList = {}
    
      // 1 遍历list数组
      list.forEach(item => {
        // 2 获取每一个城市的首字母 bj
        const first = item.short.substr(0, 1)
        // 3 判断 cityList 中是否有该分类
        if (cityList[first]) {
          // 4 如果有，直接往该分类中push数据
          cityList[first].push(item)
        } else {
          // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
          cityList[first] = [item]
        }
      })
    
      // 城市索引数组
      const cityIndex = Object.keys(cityList).sort()
      
      return {
        cityList,
        cityIndex
      }
    }
    ```

    ```js
    // 获取城市列表的数据
    async getCityList() {
      const { data: res } = await axios.get(`http://8.131.91.46:8009/area/city?level=1`)
      
      const { cityList, cityIndex } = formatCityData(res.body)
    
      console.log(cityList)
      console.log(cityIndex)
    }
    ```







#### 004 - 热门城市数据

1.  使用 `axios`发送请求， 获取热门城市数据

    ```jsx
    const { data: hotRes } = await axios.get('http://8.131.91.46:8009/area/hot')
    ```

2.  将数据添加到 `cityList` 中

    ```jsx
    cityList['hot'] = hotRes.body
    ```

3. 将索引添加到 `cityIndex` 中

   ```jsx
   cityIndex.unshift('hot')
   ```

4.  完整代码

    ```jsx
    // 获取城市列表的数据
    async getCityList () {
      const { data: res } = await axios.get(`xxx`)
      const { cityList, cityIndex } = formatCityData(res.body)
    
      const { data: hotRes } = await axios.get('xxx')
      
      // 将数据添加到 `cityList` 中
      cityList['hot'] = hotRes.body
        
      // 将索引添加到 `cityIndex` 中
      cityIndex.unshift('hot')
    }
    ```

    

#### 005 - 封装获取城市位置的方法

1.  在 `utils` 目录中，新建 `index.js`，在该文件中封装

2.  创建并导出获取定位城市的函数 `getCurrentCity`

    ```jsx
    // 1. 在 utils 目录中，新建 index.js，在该文件中封装
    // 2. 创建并导出获取定位城市的函数 getCurrentCity
    export const getCurrentCity = () => {}
    ```

3.  判断 `localStorage` 中是否有定位城市

    ```jsx
    // 1. 在 utils 目录中，新建 index.js，在该文件中封装
    // 2. 创建并导出获取定位城市的函数 getCurrentCity
    export const getCurrentCity = () => {
      // 3 判断 localStorage 中是否有定位城市
      const localCity = JSON.parse(localStorage.getItem('hkzf_city')) || []
    }
    ```

4.  如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据

    ```js
    import axios from 'axios'
    
    // 1. 在 utils 目录中，新建 index.js，在该文件中封装
    // 2. 创建并导出获取定位城市的函数 getCurrentCity
    export const getCurrentCity = () => {
      // 3 判断 localStorage 中是否有定位城市
      const localCity = JSON.parse(localStorage.getItem('hkzf_city') || '[]')
      // 4. 如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据
      if (localCity.length === 0) {
        // 因为返回的是异步操作，所以使用 Promise 将结果返回
        return new Promise((resolve, reject) => {
          try {
            // 4.1 如果没有，就使用首页中获取定位城市的代码来获取
            const myCity = new window.BMap.LocalCity()
            myCity.get(async (res) => {
              const cityName = res.name
              const { data: areares } = await axios.get(`xxxx`)
    
              // 4.2 获取到结果只会，并且存储到本地存储中
              localStorage.setItem('hkzf_city', JSON.stringify(areares.body))
              // 4.3 返回该城市数据
              resolve(areares.body)
            })
          } catch (error) {
            reject(error)
          }
        })
      }
    }
    ```

    

5.  如果有，直接返回本地存储中的城市数据

    -  注意：上面处理异步操作，使用了 `Promise`，为了该函数返回值的统一，此处也应该使用 `Promise`
    -  因为此处的 `Promise` 不会失败，所以，此处，只要返回一个成功的 `Promise` 即可

    ```jsx
    import axios from 'axios'
    
    // 1. 在 utils 目录中，新建 index.js，在该文件中封装
    // 2. 创建并导出获取定位城市的函数 getCurrentCity
    export const getCurrentCity = () => {
      // 3 判断 localStorage 中是否有定位城市
      const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
      // 4. 如果没有，就使用首页中获取定位城市的代码来获取，并且存储到本地存储中，然后返回该城市数据
      if (!localCity) {
        // 因为返回的是异步操作，所以使用 Promise 将结果返回
        return new Promise((resolve, reject) => {
          try {
            // 4.1 如果没有，就使用首页中获取定位城市的代码来获取
            const myCity = new window.BMap.LocalCity()
            myCity.get(async (res) => {
              const cityName = res.name
              const { data: areares } = await axios.get(`xxxx`)
    
              // 4.2 获取到结果只会，并且存储到本地存储中
              localStorage.setItem('hkzf_city', JSON.stringify(areares.body))
              // 4.3 返回该城市数据
              resolve(areares.body)
            })
          } catch (error) {
            reject(error)
          }
        })
      }
      // 5. 如果有，直接返回本地存储中的城市数据
      return Promise.resolve(localCity)
    }
    ```

6.  在页面 `Index -- index.js` 以及 `CityList -- index.js` 中使用 封装好的方法

    ```jsx
    // 导入获取城市定位的方法
    
    import { getCurrentCity } from '../../utils/index.js'
    ```

    ```jsx
    // 调用获取当前城市定位的方法
    const curCity = await getCurrentCity()
    
    // 返回结果
    console.log(curCity)
    
    this.setState({
      curCityName: curCity.label
    })
    ```



#### 006 - 添加当前定位数据

1.  将当前定位城市数据添加到 `cityList` 中

   ```jsx
   cityList['#'] = [curCity]
   ```

2.  将当前定位城市的索引添加到 `cityIndex` 中

    ```jsx
    cityIndex.unshift('#')
    ```

    

#### 007 - 长列表性能优化

>  场景： 展示大型列表和表格数据（比如：城市列表、通讯录、微博等） ，会导致页面卡顿、滚动不流畅
>  等性能问题



1.  产生性能问题的原因：大量 DOM 节点的重绘和重排
2.  造成的其他问题：移动设备耗电加快、影响移动设备电池寿命
3.  解决方案： 1. 懒渲染   2. 可视区域渲染







#### 008 - 懒渲染说明

1.  常见的长列表优化方案，常见于移动端
2.  原理：每次只渲染一部分（比如10条数据），等渲染的数据即将滚动完时，再渲染下面部分
3.  优点：每次渲染一部分数据，速度快
4.  缺点：数据量大时，页面中依然存在大量DOM 节点，占用内存过多、降低浏览器渲染性能，导致页面卡顿
5.  使用场景：数据量不大的情况（比如 1000 条，具体还要看每条数据的复杂程度）







#### 009 - 可视区域渲染

1.  原理：只渲染页面可视区域的列表项，非可视区域的数据“完全不渲染”，在滚动列表时动态更新列表项
2.  使用场景：一次性展示大量数据的情况（比如：大表格、微博、聊天应用等）

![可视区域渲染](F:/003-lessonNote/005-react/003-hkzfnote/React 第 07 天笔记/images/virture.png)



#### 010 - `react-virtualized` 概述

1. 在项目中的应用：实现 城市选择 列表页面的渲染。
2. `react-virtualized` 是 `React` 组件，用来高效渲染大型列表和表格数据。
3. `GitHub` 地址：[react-virtualized](https://github.com/bvaughn/react-virtualized)
4. 功能类似的轻量级组件：[react-window](https://github.com/bvaughn/react-window)



#### 011 - `react-virtualized`基本使用

1. 安装  `react-virtualized`

   ```js
   yarn add react-virtualized 
   
   // or 
   
   cnpm i react-virtualized --save
   ```

2.  在项目入口文件 `index.js` 中导入样式文件（只导入一次即可）

    ```jsx
    // 导入 react-virtualized 样式 (必须导入)
    
    import 'react-virtualized/styles.css'
    ```

3.  打开文档，点击 List 组件，进入 List 的文档中

4.  翻到文档最底部，将示例代码拷贝到项目中

5.  分析示例代码。

    ```jsx
    // 导入 List 组件
    import { List } from 'react-virtualized'
    
    // 列表数据的数据源
    const list = Array(100).fill('react-virtualized')
    
    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    function rowRenderer({
      key, // Unique key within array of rows
      index, // 索引号
      isScrolling, // 当前项是否正在滚动中
      isVisible, // 当前项在 List 中是可见的，是否在可视区展示
      style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
    }) {
      return (
        <div key={key} style={style}>
          1232 -{list[index]} {index} {isScrolling + ''}
        </div>
     )
    }
    ```

    ```jsx
    {/* 城市列表 */}
    <List
      width={300}
      height={300}
      rowCount={list.length}
      rowHeight={50}
     rowRenderer={rowRenderer}
    />
    ```







#### 012 - 让 `List` 组件充满屏幕

1.  打开 `AutoSizer` 高阶组件的[文档](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md)

2.  导入 `AutoSizer` 组件

    ```jsx
    // 导入 AutoSizer 组件
    import { List, AutoSizer } from 'react-virtualized'
    ```

3.  通过 `render-props` 模式，获取到 `AutoSizer` 组件暴露的 `width` 和 `heigh t` 属性

    ```jsx
    <AutoSizer>
      {
        (height, width) => (
          <List
            width={300}
            height={300}
            rowCount={list.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
          />
        )
      }
    </AutoSizer>
    ```

    

4.  设置 List 组件的 width 和 height 属性

    ```jsx
    // 代码在 第三个步骤已经设置
    <AutoSizer>
      {
        (height, width) => (
          <List
            width={width}
            height={height}
            rowCount={list.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
          />
        )
      }
    </AutoSizer>
    ```

5.  设置城市选择页面根元素高度 100% ，让 List 组件占满整个页面

    ```css
    .citylist {
      height: 100%;
    }
    ```

6.  调整样式，让页面不要出现全局滚动条，避免顶部导航栏滚动

    ```css
    .citylist {
      height: 100%;
      padding-top: 45px;
    
      // 顶部导航兰
      .navbar {
        margin-top: -45px;
      }
    }
    ```

    

#### 013 - 使用 `List` 组件渲染列表

1. 将获取到的 `cityList` 和 `cityIndex` 添加为组件的状态数据

   -  声明 `state` 并设置两个私有数据，分别是  `cityList` 和 `cityIndex` 
   -  使用 `this.setState()` 对  `cityList` 和 `cityIndex`  进行赋值

   ```jsx
   state = {
     cityList: {},
     cityIndex: []
   }
   ```

   ```jsx
   // 获取城市列表的数据
   async getCityList() {
     
     // 其他代码略... 
     
     this.setState({
       cityList,
       cityIndex
     })
   }
   ```

2.  修改 List 组件的 `rowCount` 为 `cityIndex` 数组的长度

    ```jsx
    <AutoSizer>
      {
        ({height, width}) => (
          <List
            width={width}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
          />
        )
      }
    </AutoSizer>
    ```

3.  将 `rowRenderer` 函数，添加到组件中，以便在函数中获取到状态数据 `cityList` 和 `cityIndex`

    ```jsx
    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    rowRenderer = ({
      key, // Unique key within array of rows
      index, // 索引号
      isScrolling, // 当前项是否正在滚动中
      isVisible, // 当前项在 List 中是可见的，是否在可视区展示
      style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
    }) => {
     const { cityList, cityIndex } = this.state
      return (
        <div key={key} style={style}>
          1232 -{list[index]} {index} {isScrolling + ''}
        </div>
      )
    }
    ```

4.  修改 List 组件的 `rowRenderer` 为组件中的 `rowRenderer` 方法

    ```jsx
    {/* 城市列表 */}
    <AutoSizer>
      {
        ({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={50}
            rowRenderer={this.rowRenderer}
          />
        )
      }
    </AutoSizer>
    ```

5.  修改`rowRenderer`方法中渲染的每行结构和样式

    ```jsx
    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在 List 中是可见的，是否在可视区展示
        style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
    }) => {
        return (
          <div key={key} style={style} className="city">
            <div className="title">S</div>
            <div className="name">上海</div>
          </div>
        )
    }
    ```

6.  修改 List 组件的 `rowHeight` 为函数，动态计算每一行的高度（因为每一行高度都不相同）。

    ```jsx
    后面处理
    ```

    

#### 014 - 展示城市索引

1.   `rowRenderer` 方法中，从 state 中取到 `cityList`, `cityIndex`

     ```jsx
     const { cityList, cityIndex } = this.state
     ```

2.  根据 `rowRenderer` 方法中返回索引，取到索引对应的值

    ```jsx
    const { cityList, cityIndex } = this.state
    // 根据索引号获取到对应的索引值
    const letter = cityIndex[index]
    ```

3.  使用取到的索引值，替换结构中默认的值

    ```jsx
    return (
      <div key={key} style={style} className="city">
        <div className="title">{ letter }</div>
        <div className="name">上海</div>
      </div>
    )
    ```

4.  对热门城市以及当前城市进行单独的处理

    -  在组件外部创建一个方法 `formatCityIndex`
    -  方法内部，传递城市索引值，对 热门城市以及当前城市进行转换

    ```jsx
    // 封装处理字母索引的方法
    const formatCityIndex = letter => {
      switch (letter) {
        case '#':
          return '当前定位'
        case 'hot':
          return '热门城市'
        default:
          return letter.toUpperCase()
      }
    }
    ```

5.   调用封装好的方法，传递需要转换的索引值即可

     ```jsx
     return (
       <div key={key} style={style} className="city">
         <div className="title">{ formatCityIndex(letter) }</div>
         <div className="name">上海</div>
       </div>
     )
     ```

     

#### 015 - 展示索引下的城市以及动态计算每一行的高度

1.  根据索引，渲染索引下的城市

    ```jsx
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item => (
            <div className="name" key={item.value}>
              {item.label}
            </div>
          ))
        }
      </div>
    )
    ```

    

2.  动态计算每一行的高度

    -  根据 `react-virtualized` 文档要求，`rowHeight` 可以是一个数值，也可以是一个函数，经过分析，直接写死一个数据并不能满足我们的需求，所以需要将 ` rowHeight`  定义为一个函数

    -  声明一个函数 `getRowHeight`，在函数中定义逻辑

    -  每个索引下面城市高度的计算方法：索引标题高度 + 城市数量 * 城市名称的高度

       所以需要提前声明好两个变量： `TITLE_HEIGHT` 、`NAME_HEIGHT`

    -  开始计算，并返回高度

    -  同时更改 `List` 组件绑定的值

    ```jsx
    // 索引（A、B等）的高度
    const TITLE_HEIGHT = 36
    // 每个城市名称的高度
    const NAME_HEIGHT = 50
    
    getRowHeight = ({index}) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    ```

    ```jsx
    {/* 城市列表 */}
    <AutoSizer>
      {
        ({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={this.state.cityIndex.length}
            rowHeight={this.getRowHeight}
            rowRenderer={this.rowRenderer}
          />
        )
      }
    </AutoSizer>
    ```

    ```css
    // 城市列表
    .city {
      .title {
        font-size: 14px;
        padding: 10px 15px;
        color: #999;
      }
    
      .name {
        width: 100%;
        height: 50px;
        padding: 0 15px;
        line-height: 50px;
        border-bottom: 1px solid #eeeeee;
        font-size: 16px;
        color: #333;
        background: #fff;
        cursor: pointer;
      }
    }
    ```

    

    







