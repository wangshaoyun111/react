import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{3,12}$/

class Registe extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>注册</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <form>
            <div className={styles.formItem}>
              <label className={styles.label}>用户名</label>
              <input className={styles.input} placeholder="请输入账号" />
            </div>
            <div className={styles.formItem}>
              <label className={styles.label}>密码</label>
              <input
                className={styles.input}
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <div className={styles.formItem}>
              <label className={styles.label}>重复密码</label>
              <input
                className={styles.input}
                type="password"
                placeholder="请重新输入密码"
              />
            </div>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                注册
              </button>
            </div>
          </form>
          <Flex className={styles.backHome} justify="between">
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有账号，去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Registe
