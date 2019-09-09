import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp();
Page({
	data: {
		list: [],
		collapse: [],
		dataLoading: false,
		loading: false,
		value: [],
		routeQuery: {},
		isVisible: false,
		isIPX: app.globalData.isIPX
	},
	onLoad(options) {
		options.appAccountId = Number(options.appAccountId)
		this.getTagsByAppAccountId(options)
		this.setData({
			routeQuery: options,
			value: JSON.parse(options.tagIds)
		})
	},
	onShareAppMessage: shareApp,
	onCollapseChange(event) {
		this.setData({
			collapse: event.detail
		})
	},
	toggle(event) {
		const { name, value } = event.detail
		const { groupid, type } = event.currentTarget.dataset
		let valueList = this.data.value.slice()
		let list = this.data.list
		let curGroup = list.find(item => (item.id === groupid))
		let curGroupTagIds = curGroup.fansWxTagDtos.map(item => item.tagId)
		if (value) {
			// 添加 type 1单选 2多选
			if (type === 1) {
				valueList = valueList.filter(item => !curGroupTagIds.includes(item))
			}
			if (valueList.length >= 20) {
				wx.showToast({
					title: '最多添加20个',
					icon: 'none'
				})
				return
			}
			valueList = [...valueList, name]
		} else {
			// 移除
			valueList = valueList.filter(item => item !== name)
		}
		this.setData({
			value: valueList
		})
	},
	async getTagsByAppAccountId(params) {
		params = {
			appAccountIds: [params.appAccountId]
		}
		wx.showLoading({
			title: '数据加载中',
			mask: true
		})
		this.setData({
			dataLoading: false
		})
		const result = await wxRequest.post(
			'/mp/fans/getTagsByAppAccountId',
			params
		)
		await nextTick(600)
		wx.hideLoading()
		let { code, data } = result
		data = this.formatData(data)
		if (code === 1) {
			let collapse = []
			if (data.length) {
				for(let i = data.length - 1; i > -1; i--) {
					collapse = [i, ...collapse]
				}
			}
			this.setData({
				list: data,
				dataLoading: true,
				collapse:collapse
			})
		}
	},
	formatData: function(data) {
		return data.list[0].fansGroupAndTagDtos
			.filter(item => item.fansWxTagDtos)
			.sort((a, b) => a.groupOrder - b.groupOrder)
			.map(item => {
				if (item.specialGroup == 1) {
					item.name = `${item.name}(单选)`
				}
				return item
			})
	},
	changeParentData: function() {
		var pages = getCurrentPages() //当前页面栈
		if (pages.length > 1) {
			var beforePage = pages[pages.length - 2] //获取上一个页面实例对象
			beforePage.changeData() //触发父页面中的方法
		}
	},
	async save() {
		const params = {
			id: this.data.routeQuery.id,
			appAccountId: this.data.routeQuery.appAccountId,
			tagIds: this.data.value
		}
		this.setData({
			loading: true
		})
		const result = await wxRequest.post(
			'/mp/fans/updateBatchSetFansUserTagSingle',
			params
		)
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
