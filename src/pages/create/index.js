var app = getApp() //获取应用实例
import tool from '../../utils/tool'
import login from '../../utils/login'
import setWatcher from '../../utils/watch'
import shareApp from '../../utils/shareApp'

Page({
	data: {
		global: app.globalData,
		photo: wx.getStorageSync('userInfo').userInfo ? wx.getStorageSync('userInfo').userInfo.avatarUrl : '',
		inputs: { // 表单可输入项
			company: {
				val: '',
				key: 'company',
				focus: false,
				label: '企业名称',
				holder: '请填写企业名称'
			},
			linkman: {
				val: '',
				key: 'linkman',
				focus: false,
				label: '联系人',
				holder: '请填写联系人姓名'
			}
		},
		phone: '', // 手机号码
		site: '', // 选中地区名称（用于页面显示）
		selected: null, // 选中地区数据
		disabled: true, // 控制提交按钮可用性
		loading: false, // 按钮是否为加载状态
	},
	onLoad: function () {
		setWatcher(this, this.watch) // 设置监听器
		this.setData({
			phone: wx.getStorageSync('user').mobile || ''
		})
	},
	onShareAppMessage: shareApp,
	watch: {
		['data.phone']: function(v) {
			setTimeout(() => {
				this.isDisabled()
			}, 60)
		},
		['data.site']: function(v) {
			setTimeout(() => {
				this.isDisabled()
			}, 60)
		}
	},

	isDisabled: function() { // 计算提交按钮是否可用
		const dat = this.data
		let bool = true
		if (dat.phone && dat.inputs.company.val && dat.inputs.linkman.val && dat.site) {
			bool = false
		}
		this.setData({
			disabled: bool
		})
	},

	input: function(e) { // 实时获取输入内容
		let key = e.detail.target.dataset.item.key
		let val = e.detail.detail.value
		this.setData({
			[`inputs.${key}.val`]: val
		})
		this.isDisabled() // 表单内容发生变化时即更新提交按钮的可用状态
	},
	focus: function(e) { // 输入框获取焦点
		let key = e.detail.target.dataset.item.key
		this.setData({
			[`inputs.${key}.focus`]: true
		})
	},
	blur: function(e) { // 输入框失去焦点
		let key = e.detail.target.dataset.item.key
		this.setData({
			[`inputs.${key}.focus`]: false
		})
	},
	clean: function(e) { // 清空输入内容
		let key = e.detail.target.dataset.item.key
		this.setData({
			[`inputs.${key}.val`]: ''
		})
	},

	phoneTap: function(e) { // 获取手机号码并进行解密
		console.log(e)
		if (e.detail.errMsg != 'getPhoneNumber:ok') { return } // 拒绝获取手机号
		const dat = e.detail
		app.http.post(app.api.getMobile, {
			encryptedData: dat.encryptedData,
			ivStr: dat.iv
		}).then(res => {
			if (res.code == 1) {
				this.setData({
					phone: res.data.phoneNumber
				})
			} else {
				tool.showToast(res.message)
			}
		})
	},
	enter: function(e) { // 点击地区选择的确定按钮
		const v = e.detail
		this.setData({
			selected: v,
			site: v[0].itemName + v[1].itemName + v[2].itemName
		})
	},
	cancel: function(e) { // 点击地区选择的取消按钮
	},
	submit: function (e) { // 提交
		this.setData({ loading: true })
		const inputs = this.data.inputs
		const site = this.data.selected
		app.http.post(app.api.createCompany, {
			regNo: login.uuid(),
			corpName: inputs.company.val,
			contactName: inputs.linkman.val,
			telephone: this.data.phone,
			province: site[0].itemName,
			city: site[1].itemName,
			area: site[2].itemName
		}).then(res => {
			if (res.code == 1) {
				this.showModal()
			} else {
				tool.showToast(res.message)
			}
			this.setData({ loading: false })
		})
	},
	showModal: function(txt) { // 显示对话框
		wx.showModal({
			title: '企业创建成功',
			content: '请在电脑端打开网址：www.xiaodashi.com，绑定授权公众号后，即可在小程序端使用。',
			showCancel: false,
			confirmText: '知道了',
			confirmColor: '#177ee5',
			complete: function(e) {
				tool.go(tool.path.company)
			}
		})
	}
});
