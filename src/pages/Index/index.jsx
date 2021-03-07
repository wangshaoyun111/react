import React from 'react'

// 导图axios
import axios from 'axios'
// 导入轮播图组件,flex组件
import { Carousel, Flex } from 'antd-mobile';

// 导入样式文件
import './index.css'
// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导航数据
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
export default class Index extends React.Component {
    state = {
        swipers: [], // 数据
        IndexFlag: false // 数据完全返回在渲染轮播图，解决bug
    }

    componentDidMount() {
        // 调用获取数据方法
        this.getSwipers()
    }

    // 获取数据的方法
    async getSwipers() {
        const {data: res} = await axios.get('http://api-haoke-web.itheima.net/home/swiper')
        console.log(res)
        if (res.status !== 200) return
        this.setState({
            swipers: res.body,
            IndexFlag: true
        })
    }

    // 渲染轮播图结构方法
    renderSwipwe() {
        return this.state.swipers.map(item => (
            <a
            key={item.id}
            href="true"
            style={{ display: 'inline-block', width: '100%', height: '212px' }}
            >
            <img
                src={`http://api-haoke-web.itheima.net${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
            />
            </a>
        ))
    }

    // 渲染导航结构的方法
    renderNavs () {
        return navs.map(item => (
          <Flex.Item key={item.id} onClick={ () => this.props.history.push(item.path) }>
            <img src={item.img} alt="" />
            <h2>{item.title}</h2>
          </Flex.Item>
        ))
    }

    render() {
        return (
            <div>
                {/* 轮播图组件 */}
                <div>
                    {
                        this.state.IndexFlag ? (
                            <Carousel autoplay={true} infinite>
                                {this.renderSwipwe()}
                            </Carousel>
                        ) : ''
                    }
                </div>
                {/* 导航菜单区域 */}
                <Flex className='nav'>
                    { this.renderNavs() }
                </Flex>
            </div>
        )
    }
}