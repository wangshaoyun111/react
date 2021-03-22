import React from 'react'

// 导入API
import { API } from '../../utils/api.js'
// 导入轮播图组件,flex组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

// 导入样式文件
import './index.scss'

// 导入 BASE_URL 变量
import { BASE_URL } from '../../utils/url.js'
// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导入获取定位城市方法
import { getCurrentCityName } from '../../utils/getCityName.js'

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
        IndexFlag: false, // 数据完全返回在渲染轮播图，解决bug
        groups: [], // 租房小组数据
        news: [], // 最新资讯
        currentCityName: '' //当前城市名称
    }

    async componentDidMount() {
        // 调用轮播获取数据方法
        this.getSwipers()
        // 租房信息数据
        this.getGroup()
        // 资讯列表数据
        this.getNews()
        // 获取地理位置信息
        const currentCity = await getCurrentCityName()
        this.setState({
            currentCityName: currentCity.label
        })
        // var myCity = new window.BMap.LocalCity()
        // myCity.get(async result => {
        //     console.log(result.name)
        //     const cityName = result.name
        //     const { data: res } = await API.get(`/area/info?name=${cityName}`)
        //     console.log(res)
        //     if (res.status !== 200) return
        //     this.setState({
        //         currentCityName: res.body.label
        //     })
        // })
    }

    // 获取轮播数据的方法
    async getSwipers() {
        const { data: res } = await API.get('/home/swiper')
        console.log(res)
        if (res.status !== 200) return
        this.setState({
            swipers: res.body,
            IndexFlag: true
        })
    }

    // 获取租房小组数据
    async getGroup() {
        const { data: res } = await API.get('/home/groups')
        console.log(res);
        if (res.status !== 200) return
        this.setState({
            groups: res.body
        })
    }

    // 获取最新资讯
    async getNews() {
        const res = await API.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')

        this.setState({
            news: res.data.body
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
                    src={BASE_URL + item.imgSrc}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }

    // 渲染导航结构的方法
    renderNavs() {
        return navs.map(item => (
            <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
                <img src={item.img} alt="" />
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    // 渲染宫格组件
    renderGroups() {
        return (
            <Grid
                data={this.state.groups}
                columnNum={2}
                square={false}
                hasLine={false}
                renderItem={item => (
                    <Flex className="group-item" justify="around" key={item.id}>
                        <div className="desc">
                            <p className="title">{item.title}</p>
                            <span className="info">{item.desc}</span>
                        </div>
                        <img src={BASE_URL + item.imgSrc} alt="" />
                    </Flex>
                )}
            />
        )
    }

    // 渲染最新资讯结构方法
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img
                        className="img"
                        src={BASE_URL + item.imgSrc}
                        alt=""
                    />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }

    render() {
        return (
            <div className='index-container'>
                {/* 轮播图组件 */}
                <div className='swiper'>
                    {
                        this.state.IndexFlag ? (
                            <Carousel autoplay={true} infinite>
                                {this.renderSwipwe()}
                            </Carousel>
                        ) : ''
                    }
                    {/* 搜索框 */}
                    <Flex className="search-box">
                        {/* 左侧白色区域 */}
                        <Flex className="search">
                            {/* 位置 */}
                            <div
                                className="location"
                                onClick={() => this.props.history.push('/citylist')}
                            >
                                <span className="name">{this.state.currentCityName}</span>
                                <i className="iconfont icon-arrow" />
                            </div>

                            {/* 搜索表单 */}
                            <div
                                className="form"
                                onClick={() => this.props.history.push('/search')}
                            >
                                <i className="iconfont icon-seach" />
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        {/* 右侧地图图标 */}
                        <i
                            className="iconfont icon-map"
                            onClick={() => this.props.history.push('/map')}
                        />
                    </Flex>
                </div>

                {/* 导航菜单区域 */}
                <Flex className='nav'>
                    {this.renderNavs()}
                </Flex>

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">
                        租房小组 <span className="more">更多</span>
                    </h3>

                    {/* 宫格组件 */}
                    {this.renderGroups()}
                </div>

                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
            </div>
        )
    }
}