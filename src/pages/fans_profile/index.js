import WxValidate from '../../utils/Wxvalidate'
import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp()
Page({
	data: {
		loading: false,
		form: {
			name: '',
			phone: '',
			locationArea: [],
			locationDetail: '',
			weChat: '',
			qq: '',
			email: '',
			age: '',
			remark: ''
		},
		initLocationArea: [],
		valid: {
			name: true,
			phone: true,
			email: true,
			weChat: true,
			qq: true,
			age: true,
			remark: true
		},
		routeQuery: {},
		canAction: false,
		isVisible: false,
		areaPickerVisible: false,
		isIPX: app.globalData.isIPX
	},
	onLoad: function(options) {
		options.appAccountId = Number(options.appAccountId)
		this.setData({
			routeQuery: options
		})
		this.initValidate()
		this.getFansDetail(options)
	},
	onShareAppMessage: shareApp,
	async getFansDetail(params) {
		wx.showLoading({
			title: '数据加载中',
			mask: true
		})
		const result = await wxRequest.post('/mp/fans/getFansDetail', params)
		await nextTick(600)
		wx.hideLoading()
		let { code, data } = result
		if (code === 1) {
			data = this.formatData(data)
			this.handleAuth(result.data)
			this.setData({
				form: data
			})
		}
	},
	initValidate() {
		// 验证字段的规则
		const rules = {
			name: {
				maxlength: 30
			},
			phone: {
				tel: true
			},
			email: {
				email: true
			},
			weChat: {
				wechat: true
			},
			qq: {
				rangelength: [6, 12],
				numLetter: true
			},
			age: {
				range: [1, 100]
			},
			remark: {
				maxlength: 100
			}
		}

		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			name: {
				maxlength: '姓名不超过30个字符'
			},
			phone: {
				tel: '手机号格式不正确'
			},
			email: {
				email: '邮箱格式不正确'
			},
			weChat: {
				maxlength: '微信号格式不正确'
			},
			qq: {
				rangelength: 'QQ格式不正确'
			},
			age: {
				range: '年龄不正确'
			},
			remark: {
				maxlength: '备注不超过100个字符'
			}
		}
		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages)
		this.WxValidate.addMethod(
			'wechat',
			(value, param) => {
				return this.WxValidate.optional(value) || /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(value)
			},
			'格式不正确'
		)
		this.WxValidate.addMethod(
			'numLetter',
			(value, param) => {
				return this.WxValidate.optional(value) || /[0-9a-zA-Z]/.test(value)
			},
			'格式不正确'
		)
	},
	formatData: function(data) {
		const kfSetArea = data.kfSetArea || data.wxSetArea;
		const area = kfSetArea ? kfSetArea.split(',') : ''
		data = {
			name: data.name,
			phone: data.phone,
			weChat: data.weChat,
			qq: data.qq,
			email: data.email,
			age: data.age,
			remark: data.remark
		}
		if (area.length && area[0] === '中国') {
			data.locationArea = area.slice(0, 3)
			data.locationDetail = area[3]
		} else {
			data.locationArea = []
			data.locationDetail = ''
		}
		this.setData({
			initLocationArea: data.locationArea
		})
		return data
	},
	onFieldChange: function(event) {
		const field = event.currentTarget.dataset.field
		const formField = `form.${field}`
		this.setData({
			[formField]: event.detail
		})
	},
	onFieldBlur: function(event) {
		const field = event.currentTarget.dataset.field
		const value = event.detail.value
		const valid = this.WxValidate.checkForm({ [field]: value })
		this.setData({
			[`valid.${field}`]: valid
		})
	},
	onPickChange: function(event) {
		let value = []
		const region = event.detail
		console.log(region)
		if (region) {
			value = region.map(item => item.itemName)
		}
		this.setData({
			'form.locationArea': value
		})
		// const region = event.detail.value
		// this.setData({
		// 	'form.locationArea': region
		// })
	},
	changeParentData: function() {
		var pages = getCurrentPages() //当前页面栈
		if (pages.length > 1) {
			var beforePage = pages[pages.length - 2] //获取上一个页面实例对象
			beforePage.changeData() //触发父页面中的方法
		}
	},
	async submitForm() {
		let params = this.data.form
		const { locationArea, locationDetail, ...rest } = params
		if (locationArea.length) {
			rest.kfSetArea = [...locationArea, locationDetail].join(',')
		}
		params = {
			...rest,
			appAccountId: this.data.routeQuery.appAccountId,
			fansId: this.data.routeQuery.id
		}
		const valid = this.WxValidate.checkForm(rest)
		if (!valid) {
			const error = this.WxValidate.errorList[0]
			wx.showToast({ title: error.msg, icon: 'none' })
			return false
		}
		this.setData({
			loading: true
		})
		const result = await wxRequest.post('/mp/fans/updateFansExtInfo', params)
		this.setData({
			loading: false
		})
		const { code } = result
		if (code === 1) {
			wx.showToast({
				title: '保存成功'
			})
			await nextTick(1500)
			this.changeParentData()
			wx.hideToast()
			wx.navigateBack({ delta: 1 })
		} else {
			wx.showModal({
				content: result.message,
				showCancel: false,
				confirmText: '知道了',
				confirmColor: '#177ee5',
				success: function(res) {
					if (res.confirm) {
						// console.log('用户点击确定')
					}
				}
			})
		}
	},
	handleAuth(data) {
		const seatInfo = app.globalData.store.data.chatList.seatInfo
		const { seatId, createUserId, userId } = seatInfo // 坐席id和创建人id及用户人id
		console.log(
			seatInfo,
			data,
			createUserId === userId || data.kfSeatId === seatId,
			'seatInfo'
		)
		if (createUserId === userId || data.kfSeatId === seatId) {
			this.setData({
				canAction: true
			})
		}
	},
	onPageScroll(e) {
		this.handleIsVisibleTitle()
	},
	handleIsVisibleTitle() {
		const systemInfo = wx.getSystemInfoSync() // screenHeight
		let query = wx.createSelectorQuery()
		query.select('#app_title').boundingClientRect()
		query.exec(res => {
			if (res[0].top < systemInfo.windowHeight && res[0].top > 32) {
				this.setData({
					isVisible: false
				})
			} else {
				this.setData({
					isVisible: true
				})
			}
		})
	},
	sureBack() {
		if (this.data.canAction) {
			wx.showModal({
				content: '确定要放弃此次编辑',
				confirmColor: '#177ee6',
				success(res) {
					if (res.confirm) {
						wx.navigateBack({
							delta: 1
						})
					}
				}
			})
		} else {
			wx.navigateBack({
				delta: 1
			})
		}
	},
	areaPickerChange(e) {
		this.setData({
			areaPickerVisible	: e.detail
		})
	}
})
