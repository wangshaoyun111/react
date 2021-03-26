import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus, // 控制高亮
    openType: '', // 控制组件展开和合并
  }
  onTitleClick = (type) => {
    // console.log(type)
    // 点击条件筛选 切换高亮
    this.setState((state) => {
      return {
        titleSelectedStatus: { ...state.titleSelectedStatus, [type]: true },
        openType: type
      }
    })
  }
  // 取消按钮，和点击隐藏整个筛选框的方法
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  // 确定按钮
  onSave = () => {
    this.setState({
      openType: ''
    })
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
            openType === 'area' || openType === 'mode' || openType === 'price' ? (
              <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
            ) : null
          }
          {/*  */}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
