### React 第九天笔记

---

#### 一、 根据定位展示当前城市

1.  获取当前定位城市

   ```jsx
   componentDidMount() {
     // 获取当前定位城市
     const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
   }
   ```

   

2.  使用地址解析器解析当前城市坐标

   ```jsx
   componentDidMount() {
       // 获取当前定位城市
       const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
       // 初始化实例
       const map = new BMap.Map("container")
   
       // 创建地址解析器实例     
       const myGeo = new BMap.Geocoder()
   
       // 将地址解析结果显示在地图上，并调整地图视野    
       myGeo.getPoint(label, function (point) {
         if (point) {
           // 地图初始化，同时设置地图展示级别
           map.centerAndZoom(point, 11)
           map.addOverlay(new BMap.Marker(point))
         }
       }, label)
     }
   ```

   

3.  调用 `centerAndZoom()` 方法在地图中展示当前城市，并设置缩放级别为 11

   ```jsx
   // 代码同上
   ```

   

4.  在地图中展示该城市，并添加比例尺和平移缩放控件

   ```jsx
   componentDidMount() {
       // 获取当前定位城市
       const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
       
       // 初始化实例
       const map = new BMap.Map("container")
       
       // 初始化中心点
       // const point = new BMap.Point(116.404, 39.915)
       
       // 创建地址解析器实例     
       const myGeo = new BMap.Geocoder()
       // 将地址解析结果显示在地图上，并调整地图视野    
       myGeo.getPoint(label, function (point) {
         if (point) {
           // 地图初始化，同时设置地图展示级别
           map.centerAndZoom(point, 11)
           // map.addOverlay(new BMap.Marker(point))
   
           // 添加控件
           map.addControl(new BMap.NavigationControl())
           map.addControl(new BMap.ScaleControl())
         }
       }, label)
     }
   ```

   

#### 二 、创建文本覆盖物

<img src="./images/002 - 文本覆盖物.png" style="zoom:100%; border: 1px solid #ccc" />



1.  打开百度地图[添加文字标签文档](http://lbsyun.baidu.com/jsdemo.htm#c1_14)

2.  创建 `Label` 实例对象

3.  调用 `setStyle()` 方法设置样式

4.  在 map 对象上调动 `addOverlay()` 方法，将文本覆盖物添加到地图上]

   ```jsx
   const opts = {
     position: point,    // 指定文本标注所在的地理位置
     offset: new BMap.Size(30, -30)    //设置文本偏移量
   }
   
   // 创建文本标注对象
   const label = new BMap.Label("这是一个简单的文本标注哦~", opts)
   
   // 设置样式
   label.setStyle({
     color: "red",
     fontSize: "12px",
     height: "20px",
     lineHeight: "20px",
     fontFamily: "微软雅黑"
   })
   
   // 将覆盖物添加到地图中
   map.addOverlay(label)
   ```






#### 三、 绘制房源覆盖物



<img src="./images/002 - 房源覆盖物.png" style="zoom:100%; border: 1px solid #ccc" />



1.  调用 `Label` 的 `setContent()` 方法，传入 `HTML` 结构，修改 `HTML` 内容的样式

   ```jsx
   // 设置 setContent 后，第一个参数的内容就会失效，因此清空即可
   const label = new BMap.Label("文本覆盖物~", opts)
   
   label.setContent(`
     <div class="${styles.bubble}">
       <p class="${styles.name}">航头镇</p>
       <p>100套</p>
     </div>
   `)
   ```

   

2.  调用 `setStyle()` 修改覆盖物样式

   ```scss
   // 覆盖物样式
   const labelStyle = {
     cursor: 'pointer',
     border: '0px solid rgb(255, 0, 0)',
     padding: '0px',
     whiteSpace: 'nowrap',
     fontSize: '12px',
     color: 'rgb(255, 255, 255)',
     textAlign: 'center'
   }
   ```

   ```jsx
   // 设置样式
   label.setStyle(labelStyle)
   ```

   

3.  给文本覆盖物添加单击事件

   ```jsx
   // 添加单击事件
   label.addEventListener('click', () => {
     console.log('房源覆盖物被点击了')
   })
   ```




4.  设置样式

   ```css
   /* 覆盖物样式： */
   .bubble {
     width: 70px;
     height: 70px;
     line-height: 1;
     display: inline-block;
     position: absolute;
     border-radius: 100%;
     background: rgba(12, 181, 106, 0.9);
     color: #fff;
     border: 2px solid rgba(255, 255, 255, 0.8);
     text-align: center;
     cursor: pointer;
   }
   
   .name {
     padding: 18px 0 6px 0;
   }
   ```

   





#### 四、地图找房功能介绍

1.  获取房源数据，渲染覆盖物。
2.  单击覆盖物后：1 放大地图 2 获取数据，渲染下一级覆盖物（重复第一步）。
3.  区、镇：单击事件中，清除现有覆盖物，创建新的覆盖物。
4.  小区：不清除覆盖物。移动地图，展示该小区下面的房源列表





#### 五、渲染所有区的房源覆盖物

1.  获取房源数据

   ```jsx
   const { data: res } = await axios.get(`http://8.131.91.46:8009/area/map?id=${value}`)
   ```

   

2.  遍历数据，创建覆盖物，给每个覆盖物添加唯一标识(后面要用)

   ```jsx
   // 将地址解析结果显示在地图上，并调整地图视野    
   myGeo.getPoint(label, async point => {
     if (point) {
       // 地图初始化，同时设置地图展示级别
       map.centerAndZoom(point, 11)
       // map.addOverlay(new BMap.Marker(point))
   
       // 添加控件
       map.addControl(new BMap.NavigationControl())
       map.addControl(new BMap.ScaleControl())
   
       const { data: res } = await axios.get(`http://8.131.91.46:8009/area/map?id=${value}`)
       // console.log(res)
   
       res.body.forEach(item => {
         // 为每一条数据创建覆盖物
         const {
           coord: { longitude, latitude },
           label: areaName,
           count,
           value
         } = item
   
         // 创建覆盖物
         const areaPoint = new BMap.Point(longitude, latitude)
   
         const opts = {
           position: areaPoint,    // 指定文本标注所在的地理位置
           offset: new BMap.Size(-35, -35)    //设置文本偏移量
         }
   
         // 创建文本标注对象
         // 说明：设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
         const label = new BMap.Label('', opts)
   
         // 给 label 对象添加一个唯一标识
         label.id = value
   
         label.setContent(`
           <div class="${styles.bubble}">
             <p class="${styles.name}">${areaName}</p>
             <p>${count}套</p>
           </div>
         `)
   
         // 设置样式
         label.setStyle(labelStyle)
   
         // 添加单击事件
         label.addEventListener('click', () => {
           console.log('房源覆盖物被点击了')
         })
   
         // 将覆盖物添加到地图中
         map.addOverlay(label)
       })
     }
   }, label)
   ```

   

3.  给覆盖物添加单击事件

4.  在单击事件中，获取到当前单击项的唯一标识

   ```jsx
   // 将地址解析结果显示在地图上，并调整地图视野    
   myGeo.getPoint(label, async point => {
     if (point) {
       // 代码略
   
       res.body.forEach(item => {
         // 代码略……
           
         // 添加单击事件
         label.addEventListener('click', () => {
           console.log('房源覆盖物被点击了', label.id)
         })
   
         // 将覆盖物添加到地图中
         map.addOverlay(label)
       })
     }
   }, label)
   ```

   

5.  放大地图(级别为 13)，调用 `clearOverlays()` 方法清除当前覆盖物

   ```jsx
   // 添加单击事件
   label.addEventListener('click', () => {
     console.log('房源覆盖物被点击了', label.id)
   
     // 放大地图，以当前点击的覆盖物为中心放大地图
     // 第一个参数：坐标对象
     // 第二个参数：放大级别
     map.centerAndZoom(areaPoint, 13)
   
     // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
     setTimeout(() => {
       // 清除当前覆盖物信息
       map.clearOverlays()
     }, 0)
   })
   ```

   

#### 六、地图找房功能的封装流程

1.  `renderOverlays()` 作为入口

   - 接收区域 `id` 参数，获取该区域下的房源数据
   -  获取覆盖物类型以及下级地图缩放级别
2.  `createOverlays()` 方法： 根据传入的类型，调用对应方法，创建覆盖物
3.  `createCircle()` 方法：根据传入的数据创建覆盖物，绑定事件(放大地图、清除覆盖物、渲染下级房源数据)
4.  `createRect()` 方法： 根据传入的数据创建覆盖物，绑定事件(移动地图、渲染房源列表)



<img src="./images/001 -地图找房封装流程.png" alt="地图找房封装流程" style="zoom:80%;  border: 1px solid #ccc" />



```jsx
// 渲染覆盖物方法
renderOverlays() {  }

// 计算要绘制的覆盖物类型和下一个缩放级别
getTypeAndZoom() {  }

// 创建覆盖物
createOverlays() { }

// 创建区、镇覆盖物
createCircle() { }

// 创建小区覆盖物
createRect() { }
```





#### 七、`renderOverlays()` 渲染覆盖物方法封装

1.  接收区域 `id` 参数，根据该参数获取房源数据

   ```jsx
   // 渲染覆盖物方法
   async renderOverlays() {
     const { data: res } = await axios.get(`http://8.131.91.46:8009/area/map?id=${value}`)
   
     const data = res.body
   
     data.forEach(item => {
       // 创建覆盖物
       this.createOverlays(item)
     })
   }
   ```

   

2.  调用 `getTypeAndZoom` 方法获取地图缩放级别、覆盖物类别（根据缩放级别来得到）

   ```jsx
   // 渲染覆盖物方法
   async renderOverlays() {
     const { data: res } = await axios.get(`http://8.131.91.46:8009/area/map?id=${value}`)
   
     const data = res.body
   
     // 调用 getTypeAndZoom 方法获取级别和类型
     const { nextZoom, type } = this.getTypeAndZoom()
   
     data.forEach(item => {
       // 创建覆盖物
       this.createOverlays(item, nextZoom, type)
     })
   }
   
   // 计算要绘制的覆盖物类型和下一个缩放级别
   // 区 --> 11 ，范围 >= 10 < 12
   // 镇 --> 13 , 范围 >= 12 < 14
   // 小区 --> 15，范围 >= 14 < 16
   getTypeAndZoom() {
     // 调用地图的 getZoom() 方法，来获取当前缩放级别
     const zoom = this.map.getZoom()
     let nextZoom, type
   
     // console.log('当前地图缩放级别：', zoom)
     if (zoom >= 10 && zoom < 12) {
       // 区
       // 下一个缩放级别
       nextZoom = 13
       // circle 表示绘制圆形覆盖物（区、镇）
       type = 'circle'
     } else if (zoom >= 12 && zoom < 14) {
       // 镇
       nextZoom = 15
       type = 'circle'
     } else if (zoom >= 14 && zoom < 16) {
       // 小区
       type = 'rect'
     }
   
     return {
       nextZoom,
       type
     }
   }
   ```

   

#### 八、 `createOverlays()` 创建覆盖物方法的封装

1.  根据传入的类型等数据，调用相应的创建覆盖物，并提供参数

   ```jsx
   // 创建覆盖物
   createOverlays(data, zoom, type) {
     const {
       coord: { longitude, latitude },
       label: areaName,
       count,
       value
     } = data
   
     // 创建覆盖物
     const areaPoint = new BMap.Point(longitude, latitude)
   
     if (type === 'circle') {
       // 区或镇
       this.createCircle(areaPoint, areaName, count, value, zoom)
     } else {
       // 小区
       this.createRect(areaPoint, areaName, count, value)
     }
   }
   ```

   

#### 九、`createCircle()` 创建区、镇覆盖物方法的封装

1.  复用之前创建覆盖物的代码逻辑

2.  在覆盖物的单击事件中，调用 `renderOverlays(id)` 方法，重新渲染该区域的房屋数据

   ```jsx
   // 创建区、镇覆盖物
   createCircle(point, name, count, id, zoom) {
     // 创建覆盖物
     const label = new BMap.Label('', {
       position: point,
       offset: new BMap.Size(-35, -35)
     })
   
     // 给 label 对象添加一个唯一标识
     label.id = id
   
     // 设置房源覆盖物内容
     label.setContent(`
       <div class="${styles.bubble}">
         <p class="${styles.name}">${name}</p>
         <p>${count}套</p>
       </div>
     `)
   
     // 设置样式
     label.setStyle(labelStyle)
   
     // 添加单击事件
     label.addEventListener('click', () => {
       // 调用 renderOverlays 方法，获取该区域下的房源数据
       this.renderOverlays(id)
   
       // 放大地图，以当前点击的覆盖物为中心放大地图
       this.map.centerAndZoom(point, zoom)
   
       // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
       setTimeout(() => {
         // 清除当前覆盖物信息
         this.map.clearOverlays()
       }, 0)
     })
   
     // 添加覆盖物到地图中
     this.map.addOverlay(label)
   }
   ```

   

#### 十、`createRect()` 创建小区覆盖物方法的封装

1.  创建 `Label` 、设置样式、设置 `HTML` 内容，绑定单击事件

   ```jsx
   // 创建小区覆盖物
   createRect(point, name, count, id) {
     // 创建覆盖物
     const label = new BMap.Label('', {
       position: point,
       offset: new BMap.Size(-50, -28)
     })
   
     // 给 label 对象添加一个唯一标识
     label.id = id
   
     // 设置房源覆盖物内容
     label.setContent(`
       <div class="${styles.rect}">
         <span class="${styles.housename}">${name}</span>
         <span class="${styles.housenum}">${count}套</span>
         <i class="${styles.arrow}"></i>
       </div>
     `)
   
     // 设置样式
     label.setStyle(labelStyle)
   
     // 添加单击事件
     label.addEventListener('click', () => {
       console.log('小区被点击了')
     })
   
     // 添加覆盖物到地图中
     this.map.addOverlay(label)
   }
   ```




#### 十一、获取并展示小区房源数据

1.  在单击事件中，获取该小区的房源数据

    ```jsx
    // 创建小区覆盖物
    createRect(point, name, count, id) {
      // coding……
        
      // 添加单击事件
      label.addEventListener('click', () => {
        // console.log('小区被点击了')
        this.getHousesList(id)
      })
    
      // 添加覆盖物到地图中
      this.map.addOverlay(label)
    }
    
    // 获取小区房源数据
    async getHousesList(id) {
      const res = await axios.get(`http://8.131.91.46:8009/houses?cityId=${id}`)
      this.setState({
        housesList: res.data.body.list,
        isShowList: true // 展示房源列表
      })
    }
    ```

    

2.  展示房源列表

    ```jsx
    <div className={styles.houseItems}>
      {/* 房屋结构 */}
      {this.state.housesList.map(item => (
        <div className={styles.house} key={item.houseCode}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://8.131.91.46:8009${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.desc}>{item.desc}</div>
            <div>
              {item.tags.map(tag => (
                <span
                  className={[styles.tag, styles.tag1].join(' ')}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{item.price}</span> 元/月
            </div>
          </div>
        </div>
      ))}
    </div>
    ```






#### 十二、获取并展示小区房源数据(优化)

1.  渲染获取到的房源数据(优化房源数据的渲染)

    - 将 `UI` 结构提取成一个方法

    - 对 `tag` 进行优化

    ```jsx
    // 封装渲染房屋列表的方法
    renderHousesList() {
      return this.state.housesList.map(item => (
        <div className={styles.house} key={item.houseCode}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://8.131.91.46:8009${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            <div className={styles.desc}>{item.desc}</div>
            <div>
              {/* ['近地铁', '随时看房'] */}
              {item.tags.map((tag, index) => {
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
              <span className={styles.priceNum}>{item.price}</span> 元/月
            </div>
          </div>
        </div>
      ))
    }
    ```

    ```jsx
    <div
      className={[
        styles.houseList,
        this.state.isShowList ? styles.show : ''
      ].join(' ')}
    >
      <div className={styles.titleWrap}>
        <h1 className={styles.listTitle}>房屋列表</h1>
        <Link className={styles.titleMore} to="/home/list">
          更多房源
        </Link>
      </div>
    
      <div className={styles.houseItems}>
        {/* 房屋结构 */}
        {this.renderHousesList()}
      </div>
    </div>
    ```

    

2.  调用地图 `panBy()` 方法，移动地图到中间位置

    -  调用地图 `panBy()` 方法

    - 垂直位移：`(window.innerHeight - 330) / 2 - target.clientY`
    - 水平平移：`window.innerWidth / 2 - target.clientX`

    ```jsx
    // 添加单击事件
    label.addEventListener('click', (e) => {
      // console.log('小区被点击了')
      this.getHousesList(id)
    
      // 获取当前被点击的小区坐标
      const target = e.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 300) / 2 - target.clientY
      )
    })
    ```

    

3.  监听地图 `movestart` 事件，在地图移动时隐藏房源列表

    ```jsx
    initMap() {
      // coding……
    
      map.addEventListener('movestart', () => {
        if (this.state.isShowList) {
          this.setState({
            isShowList: false
          })
        }
      })
    }
    ```

    

#### 十三、添加loading优化体验

1.  导入 `Toast` 组件

    ```jsx
    import { Toast } from 'antd-mobile'
    ```

    

2.   在发送请求的时候添加 `loading`，请求完成后隐藏 `loading`

    ```jsx
    // 开启loading
    Toast.loading('加载中...', 0, null, false)
    const res = await axios.get(`http://8.131.91.46:8009/houses?cityId=${id}`)
    
    // 关闭 loading
    Toast.hide()
    
    this.setState({
      housesList: res.data.body.list,
      isShowList: true // 展示房源列表
    })
    ```

    

3.   为了让程序健壮，对请求使用 `try .. catch` 捕获错误

    ```jsx
    // 渲染覆盖物方法
    async renderOverlays(id) {
      try {
        // 开启loading
        Toast.loading('加载中...', 0, null, false)
        const { data: res } = await axios.get(`http://8.131.91.46:8009/area/map?id=${id}`)
        // 关闭 loading
        Toast.hide()
    
        const data = res.body
        // 调用 getTypeAndZoom 方法获取级别和类型
        const { nextZoom, type } = this.getTypeAndZoom()
    
        data.forEach(item => {
          // 创建覆盖物
          this.createOverlays(item, nextZoom, type)
        })
      } catch (e) {
        // 关闭 loading
        Toast.hide()
      }
    }
    ```

    



















