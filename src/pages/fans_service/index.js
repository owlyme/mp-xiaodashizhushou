import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp();
Page({
	data: {
		list: [],
		curSeat: {},
		dataLoading: false,
		loading: false,
		routeQuery: {},
		isVisible: false,
		isIPX: app.globalData.isIPX
	},
	onLoad: function(options) {
		options.appAccountId = Number(options.appAccountId)
		options.kfSeatId = Number(options.kfSeatId)
		this.getSeatList(options)
		this.setData({
			routeQuery: options,
			curSeat: { id: options.kfSeatId }
		})
	},
	onShareAppMessage: shareApp,
	async getSeatList(params) {
		params = {
			limit: 99,
			offset: 0,
			status: "ACTIVE",
			appAccountId: params.appAccountId
		}
		wx.showLoading({
			title: '数据加载中',
			mask: true
		})
		this.setData({
			dataLoading: false
		})
		const result = await wxRequest.post('/mp/fans/getSeatList', params)
		await nextTick(600)
		wx.hideLoading()
		let { code, data } = result
		data = this.formatData(data)
		if (code === 1) {
			this.setData({
				list: data,
				dataLoading: true
			})
		}
	},
	formatData: function(data) {
		data = data.records
		return data
	},
	select: function(event) {
		if (this.data.curSeat.id === event.target.dataset.group.id ) {
			this.setData({ curSeat: {} })
		} else {
			this.setData({ curSeat: event.target.dataset.group })
		}

	},
	changeParentData: function () {
		var pages = getCurrentPages();//当前页面栈
		if (pages.length >1) {
			var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
			beforePage.changeData();//触发父页面中的方法
		}
	},
	async save() {
		const params = {
			fansId: this.data.routeQuery.id,
			appAccountId: this.data.routeQuery.appAccountId,
			targetId: this.data.curSeat.id
		}
		this.setData({
			loading: true
		})
		const result = await wxRequest.post('/mp/fans/updateKfSeat', params)
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
			let title = '坐席异常'
			let content = '当前坐席状态异常，请重新选择客服'
			if (code === 6042 || code === 6041) {
				title = '公众号状态异常'
				content = '当前公众号状态异常，无法设置'
			}
			if (code === 5035 || code === 3587) {
				title = '客服分配异常'
				content = '当前客服未分配公众号请重新选择客服'
			}
			wx.showModal({
				title: title,
				content: content,
				showCancel: false,
				confirmText: '知道了',
				confirmColor: '#177ee5',
				success: function (res) {
						if (res.confirm) {
								// console.log('用户点击确定')
						}
				}
			});
		}
	},
	onPageScroll(e) {
		this.handleIsVisibleTitle()
	},
	handleIsVisibleTitle() {
		const systemInfo = wx.getSystemInfoSync()  // screenHeight
		let query = wx.createSelectorQuery();
		query.select('#app_title').boundingClientRect()
		query.exec((res) =>{
			if(res[0].top < systemInfo.windowHeight && res[0].top > 32 ) {
				this.setData({
					isVisible: false
				})
			} else {
				this.setData({
					isVisible: true
				})
			}
		})
	}
})