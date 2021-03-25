import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

// props 是对象，通过结构得到titleSelectedStatus
export default function FilterTitle({ titleSelectedStatus, onClick }) {
  return (
    <Flex align="center" className={styles.root}>
      {
        titleList.map(item => {
          const isSelected = titleSelectedStatus[item.type]
          return < Flex.Item key={item.type} onClick={() => onClick(item.type)}>
            {/* 选中类名： selected */}
            <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')} >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item >
        })
      }
    </Flex >
  )
}
