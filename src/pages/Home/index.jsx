import React from 'react'

// 导入子组件
import Index from '../Index/index'
import List from '../HouseList/index'
import News from '../News/index'
import Profile from '../Profile/index'

// 导入里有组件
import { Route } from 'react-router-dom'
// 导入TabBar
import { TabBar } from 'antd-mobile';

import './index.css'

// 声明TarBar数组数据
const tabItems = [
    {
      title: '首页',
      icon: 'icon-ind',
      path: '/home'
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
export default class Home extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedTab: props.location.pathname, // 激活的 选项
        // hidden: false, // 控制TabBar的隐藏
        // fullScreen: true, // 是否全屏展示
      }
    }
    // 渲染 方法
    renderTabBarItem() {
        return tabItems.map(item => {
            return (
                <TabBar.Item
                    key={item}
                    icon={<i className={`iconfont ${item.icon}`} />}
                    selectedIcon={<i className={`iconfont ${item.icon}`} />}
                    title={item.title}
                    selected={this.state.selectedTab === item.path }
                    onPress={() => {
                        this.setState({
                        selectedTab: item.path,
                        })
                        this.props.history.push(item.path)
                    }}
                    data-seed="logId1"
                    >
                </TabBar.Item>
            )
        })
    }
    render() {
        return (
            <div>
                {/* 加上exact精准匹配 */}
                <Route exact path='/home' component={Index}></Route>
                <Route path='/home/list' component={List}></Route>
                <Route path='/home/news' component={News}></Route>
                <Route path='/home/profile' component={Profile}></Route>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent= {true}
                    >
                    { this.renderTabBarItem() }
                </TabBar>
            </div>
        )
    }
}