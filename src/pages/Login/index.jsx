import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import { API } from '../../utils/api.js'
import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '', // 账号用户名
    password: '' // 密码
  }

  // 获取用户名
  getUsername = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  // 获取密码
  getPassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  // 登录提交
  handleSubmit = async (e) => {
    // 阻止表单提交默认行为
    e.preventDefault()
    const { username, password } = this.state
    const { data: res } = await API.post('/user/login', { username, password })

    if (res.status !== 200) {
      return Toast.info('登陆失败，请检查用户名密码')
    }
    Toast.info('登录成功')
    localStorage.setItem('hkzf_token', res.body.token)
    // 返回上一页
    this.props.history.go(-1)
  }
  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={username}
                onChange={this.getUsername}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                value={password}
                onChange={this.getPassword}
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
