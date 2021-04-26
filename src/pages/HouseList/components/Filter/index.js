import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API } from '../../../../utils/api'
import styles from './index.module.css'
import { getCurrentCityName } from '../../../../utils/getCityName'
// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
// 选中的值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus, // 控制高亮
    selectedValues,
    openType: '', // 控制组件展开和合并
    filtersData: [],
    id: ''
  }
  // 调用获取筛选数据方法
  async componentDidMount() {
    this.body = document.body
    // 获取当前定位城市id
    const { value } = await getCurrentCityName()
    this.setState((state) => {
      return {
        id: value
      }
    }, () => {
      this.getFiltersData()
    })
  }
  onTitleClick = (type) => {
    this.body.className = 'body-fixed'
    // console.log(type)
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 使用object.keys 遍历选中状态对象
    // 判断是否是当前标题，没有：高亮，不是：取消高亮
    Object.keys(titleSelectedStatus).forEach(item => {
      if (item === type) {
        newTitleSelectedStatus[type] = true
        return
      }

      // 处理其他标题与默认值是否一致
      const selectedVal = selectedValues[item]
      // 判断长度是否等于2，或者判断第一项是不是area ，不是，代表是subway 显示高亮
      if (item === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[item] = true
      } else if (item === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[item] = true
      } else if (item === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[item] = true
      } else if (item === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[item] = true
      } else {
        newTitleSelectedStatus[item] = false
      }
    })
    // 点击条件筛选 切换高亮
    this.setState((state) => {
      return {
        titleSelectedStatus: newTitleSelectedStatus,
        openType: type
      }
    })
  }
  // 获取筛选条件的方法
  async getFiltersData() {
    const { data: res } = await API.get(`/houses/condition?id=${this.state.id}`)
    console.log(res);
    this.setState({
      filtersData: res.body
    })
  }
  // 取消按钮，和点击隐藏整个筛选框的方法
  onCancel = (type) => {
    this.body.className = ''
    console.log(type);
    const { titleSelectedStatus, selectedValues } = this.state
    const selectedVal = selectedValues[type]
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 确定按钮
  onSave = (type, value) => {
    this.body.className = ''
    // 获取默认高亮效果
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const newSelectedValues = { ...selectedValues, [type]: value }
    const selectedVal = value
    // 获取到高亮的状态
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState((state) => {
      return {
        openType: '',
        selectedValues: newSelectedValues,
        titleSelectedStatus: newTitleSelectedStatus
      }
    })

    // 根据筛选添加，组装参数
    // 定义组装参数的对象

    const houseParams = {}

    // 结构区域参数
    const { area, mode, price, more } = newSelectedValues
    // 获取area中的第一个参数确认是区域还是地铁
    const areaKey = area[0]
    // 获取area中的最后一项，如果是null获取第二项
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    // 处理好以后添加到houseParams
    houseParams[areaKey] = areaValue
    // 将方式添加到houseParams
    houseParams.mode = mode[0]
    // 将价格添加到houseParams
    houseParams.price = price[0]
    // 将筛选条件转化成，分隔的字符串
    houseParams.more = more.join(',')

    this.props.onFilter(houseParams)
  }
  // 渲染组件数据的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    // 获取到当前选中的值

    const defaultValue = selectedValues[openType]
    let data = [] // 根据openType 决定需要渲染的数据
    let cols = 3 // 选择器列数
    // 判断
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        data={data}
        cols={cols}
        onSave={this.onSave}
        type={openType}
        defaultValue={defaultValue}
      />)
  }
  // 渲染 FilterMore 组件方法
  renderFilterMore() {
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic },
      selectedValues
    } = this.state
    if (openType !== 'more') return
    const data = {
      roomType, oriented, floor, characteristic
    }

    // 获取到选中以后的值
    const defaultValue = selectedValues.more

    return <FilterMore
      data={data}
      onCancel={this.onCancel}
      onSave={this.onSave}
      type={openType}
      defaultValue={defaultValue}
    />
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {
          openType === 'area' || openType === 'mode' || openType === 'price' ? (
            <div className={styles.mask} onClick={this.onCancel} />
          ) : null
        }
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }
          {/*  */}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
