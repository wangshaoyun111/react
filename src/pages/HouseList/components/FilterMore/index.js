import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: [] // 当前选中的值
  }
  // 点击每个 tag 标签，决定是否选中当前 tag

  tagHandle = (value) => {
    const { selectedValues } = this.state
    // 为了不对原数据产生影响 ， 映射·一个新的数组
    const newSelectedValues = [...selectedValues]

    if (newSelectedValues.indexOf(value) === -1) {
      // 判断不包含，将当前项添加
      newSelectedValues.push(value)
    } else {
      const index = newSelectedValues.findIndex(item => item === value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return (
      data.map(item => {
        const { selectedValues } = this.state
        // 判断 selectedValues 中是否包含 item的某一项
        // 大于-1 包含，高亮
        const isSelected = selectedValues.indexOf(item.value) > -1
        return (
          <span
            key={item.value}
            className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
            onClick={() => { this.tagHandle(item.value) }}
          >
            {item.label}
          </span>
        )
      })
    )
  }

  onCancel = () => {
    this.setState({
      selectedValues: []
    })

  }
  render() {
    const { data: { roomType, oriented, floor, characteristic }, onSave, type, onCancel } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => { onCancel(type) }} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          cancelText='清除'
          className={styles.footer}
          onCancel={() => { this.onCancel() }}
          onOk={() => onSave(type, selectedValues)} />
      </div>
    )
  }
}
