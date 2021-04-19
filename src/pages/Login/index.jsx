import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import { API } from '../../utils/api.js'
import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 导入 withFormik
import { withFormik } from 'formik'
// 导入 表单验证 Yup
import * as Yup from 'yup'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '', // 账号用户名
    password: '' // 密码
  }

  render() {
    // const { username, password } = this.state

    // 通过this.props 获取到 withFormik 高阶组件提供的属性
    const { values, handleSubmit, handleChange, handleBlur, errors, touched } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && touched.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && touched.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
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

// 使用withFormik将Login组件金星报告
// 为 Login 组件提供属性和方法
export default withFormik({
  // 声明需要 获取到对应表单值
  mapPropsToValues: () => ({ username: '', password: '' }),
  validationSchema: Yup.object().shape({
    // REG_UNAME 校验规则，如果不通过，提示后面消息
    username: Yup.string().required('账号必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')

  }),
  // 表单提交事件
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    const { data: res } = await API.post('/user/login', { username, password })

    if (res.status !== 200) {
      return Toast.info('登陆失败，请检查用户名密码')
    }
    Toast.info('登录成功')
    localStorage.setItem('hkzf_token', res.body.token)
    // 返回上一页
    props.history.go(-1)
  }
})(Login)
