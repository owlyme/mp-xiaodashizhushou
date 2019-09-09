import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp();
Page({
	data: {
		list: [],
		curGroup: {},
		dataLoading: false,
		loading: false,
		routeQuery: {},
		isVisible: false,
		isIPX: app.globalData.isIPX
	},
	onLoad: function(options) {
		options.appAccountId = Number(options.appAccountId)
		options.groupId = Number(options.groupId)
		this.getKfFansGroupList()
		this.setData({
			routeQuery: options,
			curGroup: { fsGroupId: options.groupId }
		})
	},
	onShareAppMessage: shareApp,
	async getKfFansGroupList(params) {
		wx.showLoading({
			title: '数据加载中',
			mask: true
		})
		this.setData({
			dataLoading: false
		})
		const result = await wxRequest.post('/mp/fans/getKfFansGroupList', params)
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
	changeParentData: function () {
		var pages = getCurrentPages();//当前页面栈
		if (pages.length >1) {
			var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
			beforePage.changeData();//触发父页面中的方法
		}
	},
	formatData: function(data) {
		data = data.groupInfoList
		const first = data.filter(item => item.name === '未分组')
		let rest = data.filter(item => item.name !== '未分组')
		rest = rest.sort((a, b) => {
			return a.groupOrder - b.groupOrder
		})
		return [...first, ...rest]
	},
	selectGroup: function(event) {
		this.setData({ curGroup: event.target.dataset.group })
	},
	async saveGroup() {
		const params = {
			fansIds: [
				{
					fansId: this.data.routeQuery.id,
					appAccountId: this.data.routeQuery.appAccountId
				}
			],
			targetId: this.data.curGroup.fsGroupId
		}
		this.setData({
			loading: true
		})
		const result = await wxRequest.post('/mp/fans/updateWxGroupByMove', params)
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
				success: function (res) {
						if (res.confirm) {
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
