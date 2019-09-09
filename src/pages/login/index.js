//获取应用实例
var app = getApp()
import api from '../../api/index'
import tool from '../../utils/tool'
import login from '../../utils/login'
import shareApp from '../../utils/shareApp'
Page({
	data: {
		code: null,
		userInfo: null,
		load: false, // 是否显示加载状态
	},
	onLoad: function () {
		wx.hideLoading() // 关闭会话列表页可能遗留的加载状态
	},
	onShareAppMessage: shareApp,

	// 获取公司列表（判断用户当前状态）
	getCompanys: function () {
		app.http.post(api.getCompanys).then(res => {
			this.setData({
				load: false
			})
			console.log('获取公司列表成功')
			login.companyStatus(res)
		})
	},
	// 更新用户session信息（登录）
	setUserInfo: function() {
		const userInfo = this.data.userInfo
		console.log(userInfo)
		if (!userInfo) {
			setTimeout(() => {
				this.setUserInfo()
			}, 500)
			return
		}
		app.http.post(api.updateSession, {
			rawData: userInfo.rawData,
			signature: userInfo.signature,
			encryptedData: userInfo.encryptedData,
			iv: userInfo.iv
		}).then(res => {
			// console.log(res)
			if (res.code == 1) {
				console.log('更新用户信息成功')
				wx.setStorageSync('user', res.data.user || '')
			}
			if (res.code == 1 || res.code == 7411) {
				// 获取公司列表
				this.getCompanys()
			} else {
				this.setData({
					load: false
				})
				tool.showToast(res.message)
			}
		})
	},
	// 绑定sessionId
	bindsession: function(code) {
		const that = this
		app.http.post(api.bindSession, {
			code: code,
			platformType: 'WX_MP_CHAT'
		}).then(res => {
			// console.log(res)
			if (res.code == 1) {
				console.log('绑定sission成功')
				that.setUserInfo()
				// 登录成功，调企业列表接口，判断用户状况
			} else {
				this.setData({
					load: false
				})
				tool.showToast(res.message || '登录失败，请重新授权')
			}
		})
	},
	// 点击登录按钮
	loginTap: function (e) {
		console.log(e)
		if (e.detail.errMsg == 'getUserInfo:ok') { // 同意授权
			this.setData({
				userInfo: e.detail,
				load: true
			})
			wx.setStorageSync('userInfo', e.detail);
			wx.login({ // 获取临时登录凭证code
				success: res => {
					console.log(res)
					this.bindsession(res.code)
				}
			})
		} else { // 拒绝授权
			tool.showToast('登录失败，请重新授权')
		}
	},
});
