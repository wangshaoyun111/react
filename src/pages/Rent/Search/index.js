import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { API } from '../../../utils/api.js'

import { getCity } from '../../../utils/city.js'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }
  // 获取搜索关键字
  handleSearchTxt = async (value) => {
    this.setState({
      searchTxt: value
    })
    // 判断输入框是否为空
    if (!value.trim().length === 0) {
      return this.setState({
        searchTxt: '',
        tipsList: []
      })
    }
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      const { data: res } = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })
      if (res.status !== 200) return
      this.setState({
        tipsList: res.body
      })
    }, 500)
  }
  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleSearchTxt}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
