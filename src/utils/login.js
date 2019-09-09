import api from '../api/index'
import http from './request'
import tool from './tool'
import globalReset from './globalStatus'

const path = {

}
const login = {
	// 创建企业时，用于生成公司注册编号
	uuid: () => {
		var s = []
		var hexDigits = '0123456789abcdef'
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
		}
		s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = '-'

		var uuid = s.join('')
		return uuid
	},
	// 生成随机码
	genUUID: (len) => {
		len = len || 6
		len = parseInt(len, 10)
		len = isNaN(len) ? 6 : len
		var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
		var seedLen = seed.length - 1
		var uuid = ''
		while (len--) {
			uuid += seed[Math.round(Math.random() * seedLen)]
		}
		return uuid + '-'
	},
	// 生成32位的seddionId并存入storage
	setSessionId: () => {
		const sissionId = login.genUUID(32)
		wx.setStorageSync('sessionId', sissionId)
	},
	// 根据获取企业列表接口返回数据判断用户状态并进行相应跳转
	companyStatus: (res) => {
		if (res.code != 1) {
			wx.setStorageSync('companyId', null)
		}
		const path = [
			'/pages/company/index', // 企业列表页
			'/pages/create/index', // 创建企业页
		]
		let dex = 0
		let params = null
		switch(res.code) {
			case 1: // 有公司
				break;
			case 7413: // 无公司，不可创建
				params = { type: 'enpty' }
				break;
			case 7414: // 无公司，加入后又退出，可创建
				params = { type: 'joined' }
				break;
			case 7415: // 无公司，未加入过企业，可创建
			case 3000: // 无公司，可创建（新用户）
				dex = 1
				break;
		}
		tool.go(path[dex], params)
	},
	// 解绑sessionId，退出登录状态，并生成新的sessionId
	logout: (type) => {
		// 初始化一些状态
		console.info('logout');
		globalReset()
		if (type) {
			http.post(api.logoutSession).then(res => {
				login.setSessionId() // 重新生成sessionId
			})
		} else { // 不解绑
			login.setSessionId() // 重新生成sessionId
		}
	},

	// （从微信）获取用户信息
	getUserInfo: function(cb) {
		wx.getUserInfo({ // 获取用户信息
			success: res => {
				wx.setStorageSync('userInfo', res)
				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				if (cb) { cb(res) }
			}
		})
	},
	// 判断用户授权状态 并 获取用户信息
	checkStatus: function () {
		// console.log('验证')
		return new Promise(resolve => {
			wx.getSetting({ // 获取小程序向用户请求过的权限(验证用户是否授权)
				success: res => {
					console.log(res)
					if (res.authSetting['scope.userInfo']) { // 判断用户是否已经授权
						login.getUserInfo()
						// 验证两端的session有效性，a、b分别为微信端和后端验证结果，0：失效，1：有效
						login.checkSession().then(res => {
							const [a, b] = res
							console.log('登录有效性验证结果' + res)
							if (b === 0) {
								login.logout() // 不解绑，生成新的sessionId
								tool.go(tool.path.login)
							} else if (a === 0) {
								login.logout(true) // 解绑，并生成新的sessionId
								tool.go(tool.path.login)
							} else { // 登录状态有效
								const companyId = wx.getStorageSync('companyId');
								if (!companyId && companyId !== 0) {
									// 获取公司列表（对用户企业状态进行判断并跳转到相应页面）
									getApp().http.post(api.getCompanys).then(res => {
										login.companyStatus(res)
										resolve(res)
									})
								}
							}
						})
					} else { // 未授权
						wx.setStorageSync('sessionId', null)
						login.logout() // 不解绑，生成新的sessionId
						tool.go(tool.path.login)
						return
					}
				}
			})
		})
	},
	// wx与后端的登录态验证
	checkSession: () => {
		return new Promise((resolve, rej) => {
			let result = [null, null]

			function finish(i, v, res = result) {
				res[i] = v
				if(res[0] !== null && res[1] !== null) {
					resolve(res)
				}
			}

			wx.checkSession({
				success() { finish(0, 1) },
				fail() { finish(0, 0) }
			})

			http.post(api.getSession).then(res => {
				if (res.code == 1) {
					finish(1, 1)
				} else {
					finish(1, 0)
				}
			})

		})
	}
}
module.exports = login