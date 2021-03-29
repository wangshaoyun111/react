import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { API } from '../../../../utils/api'
import styles from './index.module.css'

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
// 获取当前定位城市id
export default class Filter extends Component {
  state = {
    titleSelectedStatus, // 控制高亮
    selectedValues,
    openType: '', // 控制组件展开和合并
    filtersData: []
  }
  // 调用获取筛选数据方法
  componentDidMount() {
    this.getFiltersData()
    console.log(this.state.filtersData);
  }
  onTitleClick = (type) => {
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
      } else if (item === 'more') {

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
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { data: res } = await API.get(`/houses/condition?id=${value}`)
    console.log(res);
    this.setState({
      filtersData: res.body
    })
  }
  // 取消按钮，和点击隐藏整个筛选框的方法
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  // 确定按钮
  onSave = (type, value) => {
    console.log(type, value);
    this.setState({
      openType: '',
      selectedValues: { ...this.state.selectedValues, [type]: value }
    })
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
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {
          openType === 'area' || openType === 'mode' || openType === 'price' ? (
            <div className={styles.mask} />
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
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
