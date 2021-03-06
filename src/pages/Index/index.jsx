import React from 'react'

// 导图axios
import axios from 'axios'
// 导入轮播图组件
import { Carousel } from 'antd-mobile';
export default class Index extends React.Component {
    state = {
      swipers: [], // 数据
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
            swipers: res.body
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

    render() {
        return (
            <div>
                <Carousel autoplay={true} infinite>
                    {this.renderSwipwe()}
                </Carousel>
            </div>
        )
    }
}