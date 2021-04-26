import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'
import { API } from '../../../utils/api.js'
import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    const { state } = props.location
    const community = {
      name: '',
      id: ''
    }
    if (state) {
      community.name = state.name
      community.id = state.id
    }
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: community,
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 获取表单数据
  getValue = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // 获取房屋数据配置
  handleSupporting = (seclected) => {
    this.setState({
      supporting: seclected.join('|')
    })
    console.log(this.state.supporting);
  }

  // 获取房屋图片
  handleHouseImg = (files, type, index) => {
    this.setState({
      tempSlides: files
    })
  }

  // 发布房源
  addHouse = async () => {
    const {
      tempSlides,
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      title,
      supporting,
      size
    } = this.state
    let houseImg = ''
    if (tempSlides.length > 0) {
      const form = new FormData()
      tempSlides.forEach(item => {
        form.append('file', item.file)
      })

      const { data: res } = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.status !== 200) return
      houseImg = res.body.join('|')
    }

    // 发布房源接口
    const { data: res } = await API.post('/user/houses', {
      community: community.id,
      price,
      roomType,
      floor,
      oriented,
      description,
      title,
      houseImg,
      supporting,
      size
    })
    if (res.status !== 200) return Toast.info('服务器偷懒了,请稍后再试', 2, null, false)
    Toast.info('发布成功', 2, null, false)
    this.props.history.push('/rent')
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" value={price} onChange={(value) => this.getValue('price', value)}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" value={size} onChange={(value) => this.getValue('size', value)}>
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1} onChange={(value) => this.getValue('roomType', value[0])}>
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1} onChange={(value) => this.getValue('floor', value[0])}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1} onChange={(value) => this.getValue('oriented', value[0])}>
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(value) => this.getValue('title', value)}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={this.handleHouseImg}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select onSelect={this.handleSupporting} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(value) => this.getValue('description', value)}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
