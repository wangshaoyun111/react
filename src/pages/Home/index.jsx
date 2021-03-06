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

export default class Home extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedTab: props.location.pathname, // 激活的 选项
        // hidden: false, // 控制TabBar的隐藏
        // fullScreen: true, // 是否全屏展示
      }
    }
    render() {
        return (
            <div>
                <Route path='/home/index' component={Index}></Route>
                <Route path='/home/list' component={List}></Route>
                <Route path='/home/news' component={News}></Route>
                <Route path='/home/profile' component={Profile}></Route>
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent= {true}
                    >
                    <TabBar.Item
                        title="首页"
                        key="Life"
                        icon={<i className='iconfont icon-ind'></i>}
                        selectedIcon={<i className='iconfont icon-ind'></i>}
                        selected={this.state.selectedTab === '/home/index'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/index',
                            })
                            this.props.history.push('/home/index')
                        }}
                        data-seed="logId"
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={<i className='iconfont icon-findHouse'></i>}
                        selectedIcon={ <i className='iconfont icon-findHouse'></i>}
                        title="找房"
                        key="Koubei"
                        selected={this.state.selectedTab === '/home/list'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/list',
                            })
                            this.props.history.push('/home/list')
                        }}
                        data-seed="logId1"
                    >
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <i className='iconfont icon-message'></i>
                        }
                        selectedIcon={
                            <i className='iconfont icon-message'></i>
                        }
                        title="咨询"
                        key="Friend"
                        selected={this.state.selectedTab === '/home/news'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/news',
                            })
                            this.props.history.push('/home/news')
                        }}
                    >
                    </TabBar.Item>
                    <TabBar.Item
                         icon={
                            <i className='iconfont icon-my'></i>
                        }
                        selectedIcon={
                            <i className='iconfont icon-my'></i>
                        }
                        title="我的"
                        key="my"
                        selected={this.state.selectedTab === '/home/profile'}
                        onPress={() => {
                            this.setState({
                                selectedTab: '/home/profile',
                            })
                            this.props.history.push('/home/profile')
                        }}
                    >
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}