import React from 'react'
import ReactDOM from 'react-dom'

// 引入antd-mobile 组件库
import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标库的样式文件
import './assets/fonts/iconfont.css'
// 导入的全局样式文件要在 antd-mobile 组件库样式下面
import './index.css'
import App from './App'

ReactDOM.render(<App />,document.getElementById('root'))
