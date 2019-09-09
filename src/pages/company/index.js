//获取应用实例
var app = getApp()
import login from '../../utils/login'
import tool from '../../utils/tool.js'
import api from '../../api/index.js'
import shareApp from '../../utils/shareApp'
const Socket  = app.SOCKET

Page({
	data: {
		photo: null, // 用户头像
		load: true, // 是否隐藏加载动画
		query: null, // 页面参数
		list: null, // 公司列表
		status: {
			'ACTIVE': '正常',
			'DISABLED': '停用',
			'EXPIRE': '已过期',
			'EDLETE': '标记删除',
			'DOING': '新创建'
		},
		info: { // 对话框信息
			'DOING': {
				title: '新创建企业',
				cont: '当前企业为新创建企业，请先在电脑端操作后使用'
			},
			'3562': {
				title: '企业已过期',
				cont: '该企业已过期，请续费后再使用。'
			},
			'3560': {
				title: '企业已停用',
				cont: '该企业已被停用，如有问题请联系企业管理员或咨询销大师客服人员。'
			},
			'3561': {
				title: '企业已禁用',
				cont: '该企业已被禁用，如有问题请联系企业管理员或咨询销大师客服人员。'
			},
			'3529': {
				title: '未绑定公众号',
				cont: '当前企业未绑定公众号，请在电脑端打开网址：www.xiaodashi.com，绑定授权公众号后，即可在小程序端使用。'
			},
			// mpPower: {
			// 	title: '无聊天权限',
			// 	cont: '当前企业暂无小程序端聊天权限，请升级套餐。'
			// },
			// uMpPower: {
			// 	title: '无聊天权限',
			// 	cont: '您暂无小程序端聊天权限，请联系企业管理员。'
			// },
			'5046': {
				title: '无客服权限',
				cont: '您暂无客服权限，请联系企业管理员。'
			},
			'5045': {
				title: '客服权限异常',
				cont: '您的客服权限被停用或禁用，请联系企业管理员。'
			},
			'6045': {
				title: '公众号未认证',
				cont: '当前绑定的公众号未认证，请先认证。'
			},
			'6046': {
				title: '公众号状态异常',
				cont: '当前绑定的公众号状态异常，请联系管理员处理。'
			}
		}
	},
	onLoad: function (option) {
		this.setData({
			query: option,
			photo: wx.getStorageSync('userInfo').userInfo ? wx.getStorageSync('userInfo').userInfo.avatarUrl : ''
		})
		wx.setStorageSync('companyId', null)
		if (!option.type) { // 有公司
			this.getCompanys()
		}
	},
	onShareAppMessage: shareApp,
	showModal: function(v, cb) { // 弹窗函数
		wx.showModal({
      title: v.title,
			content: v.cont,
			showCancel: false,
			confirmText: '知道了',
			confirmColor: '#177ee5',
			success(res) {
				// if (res.confirm) {
				// 	if (cb) { cb() }
				// } else if (res.cancel) {
				// }
			}
		})
	},
	getCompanys: function() { // 获取企业列表
		app.http.post(api.getCompanys).then(res => {
			if (res.code == 1) {
				this.setData({
					list: res.data
				})
			} else {
				login.companyStatus(res)
			}
		})
	},
	enterCompany: function(company) { // 进入企业
		app.http.post(api.enterCompany, {
			corpId: company.applyId,
			platformType: 'WX_MP_CHAT'
		}).then(res => {
			this.cutLoad(true)
			if (res.code == 1) {
				wx.setStorageSync('company', company)
				wx.setStorageSync('user', res.data.user)
				wx.setStorageSync('companyId', res.data.currCompanyId);
				// 页面切换
				wx.switchTab({
					url: tool.path.chatList
				})
			} else {
				const info = this.data.info[res.code + '']
				if (info) {
					this.showModal(info)
				} else {
					tool.showToast(res.message)
				}
			}
		})
	},
	checkCompany: function(e) { // 点击选择企业
		app.globalData.appPagehiddenType = "APP"
		const dex = e.currentTarget.dataset.dex
		const company = this.data.list[dex] // 选中公司信息
		// if (company.packStatus == 'DOING') {
		// 	tool.showToast('DOING')
		// 	return
		// }
		this.cutLoad(false)
		// 验证session有效性
		app.http.post(api.getSession).then(res => {
			Socket.resetSocket()
			if (res.code == 1) {
				this.enterCompany(company)	// 进入企业
			} else {
				tool.go(tool.path.login)
				// tool.showToast(res.message)
			}
		})
	},
	cutLoad: function(bool) { // 切换load状态
		this.setData({
			load: bool
		})
	},
	toCreate: function() { // 跳转至创建企业页面
		tool.go(tool.path.creat)
	}
});
