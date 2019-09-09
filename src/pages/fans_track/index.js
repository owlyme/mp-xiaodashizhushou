import dayjs from "../../utils/dayjs.min"
import wxRequest from "../../utils/request"
import msgUtil from "../../utils/msg-format"
import util from "../../utils/util"
import shareApp from "../../utils/shareApp"
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp()
Page({
	data: {
		originList: [],
		list: [],
		page: 1,
		pageSize: 20,
		loading: false,
		noMore: false,
		convrId: "",
		isVisible: false,
		noData: false,
		topHeight: app.globalData.statusBarHeight + app.globalData.topHeight,
		dropDownStatus: false,
		dropDownText: "全部轨迹",
		downDownType: "all"
	},
	onLoad: function(options) {
		const convrId = `1_${options.appAccountId}_${options.id}`
		this.getConversationMessageByGroup({ convrId })
		this.setData({
			convrId: convrId
		})
	},
	onShareAppMessage: shareApp,
	onReachBottom: function() {
		// wx.showLoading({
		// 	title: '加载更多'
		// })
		this.getConversationMessageByGroup({ convrId: this.data.convrId })
	},
	async getConversationMessageByGroup(params) {
		if (this.data.noMore) return
		if (this.data.loading) return
		const seatInfo = app.globalData.store.data.chatList.seatInfo
		params = {
			limit: this.data.pageSize,
			offset: (this.data.page - 1) * this.data.pageSize,
			...params,
			seatId: seatInfo.seatId
		}
		this.setData({
			loading: true
		})
		this.data.page === 1 &&
			wx.showLoading({
				title: "数据加载中",
				mask: true
			})
		const result = await wxRequest.post(
			"/mp/fans/getConversationMessageByGroup",
			params
		)
		this.setData({
			loading: false
		})
		this.data.page === 1 && (await nextTick(600))
		this.data.page === 1 && wx.hideLoading()
		let { code, data } = result
		if (code === 1) {
			if (this.data.page === 1 && !result.data.records.length) {
				this.setData({
					noData: true
				})
			}
			// 根据类型筛选data
			let newdata = this.formatData(data, this.data.downDownType)
			this.setData({
				originList: [...this.data.originList, ...result.data.records],
				list: newdata,
				page: this.data.page + 1,
				noMore: result.data.records.length < this.data.pageSize
			})
		}
		if (this.data.page === 1 && code !== 1) {
			this.setData({
				noData: true
			})
		}
	},
	formatData: function(data, type) {
		let records = [...this.data.originList, ...data.records]
		records = JSON.parse(JSON.stringify(records))
		// 根据类型筛选 all, wechat, web
		console.log(records)
		records = records.filter((item) => {
			let msgCode = item.msgType
			if (type=== 'web') {
				return msgCode >= 500
			} else if (type=== 'wechat') {
				return msgCode < 500
			}
			return true
		})
		console.log(records)
		records = records.map(item => {
			let content = JSON.parse(item.content) || {}
			item.msgType = msgUtil.messageCodeAndKey[item.msgType].type
			item.msgBodyType = msgUtil.msgBodyTypeTransfrom[item.bodyType]
			item.createTime = item.createTime
			item.createMonth = dayjs(item.createTime).format("YY年MM月")
			item.createDay = dayjs(item.createTime).date()
			item.createHour = dayjs(item.createTime).format("HH:mm:ss")
			item.code = content.code
			item.contextMap = content.contextMap
			if (content.contextMap && content.contextMap.EVENT_LOCATION) {
				let locatinArr = content.contextMap.EVENT_LOCATION.split(",")
				item.contextMap.locationTitle = locatinArr[locatinArr.length - 1]
				item.contextMap.locationDetail = content.contextMap.EVENT_LOCATION.replace(
					/,/g,
					""
				)
			}
			return { ...item }
		})
		records = util.groupBy(records, function(item) {
			return [item.createMonth]
		})
		return records
	},
	onPageScroll(e) {
		this.handleIsVisibleTitle()
	},
	handleIsVisibleTitle() {
		let query = wx.createSelectorQuery()
		query.select("#app_title").boundingClientRect()
		query.exec(res => {
			if (res[0].top > 32) {
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
	goBigMap(e) {
		let track = e.currentTarget.dataset.track
		wx.openLocation({
			latitude: parseFloat(track.contextMap.EVENT_LOCATION_LATITUDE),
			longitude: parseFloat(track.contextMap.EVENT_LOCATION_LONGITUDE),
			scale: 18
		})
	},
	onDropdown() {
		this.setData({
			dropDownStatus: !this.data.dropDownStatus
		})
	},
	onFilterTrack(e) {
		const filterText = {
			all: "全部轨迹",
			wechat: "公众号端",
			web: "网页端"
		}
		let type = e.currentTarget.dataset.type
		let newdata = this.formatData({records: []}, type)
		this.setData({
			dropDownText: filterText[type],
			downDownType: type,
			dropDownStatus: !this.data.dropDownStatus,
			list: newdata
		})
	},
	onFilterMore() {
		this.getConversationMessageByGroup({ convrId: this.data.convrId })
	}
	// handleIsVisibleTitle() {
	// 	let query = wx.createSelectorQuery()
	// 	query.select('#app_title').boundingClientRect()
	// 	query.selectAll('.track-wrapper-list').boundingClientRect()
	// 	query.exec(res => {
	// 		console.log(res)
	// 		if(res[0].top > 10) {
	// 			this.setData({
	// 				title: ''
	// 			})
	// 		} else {
	// 			for (let i = 0; i < res[1].length; i++) {
	// 				if (res[1][i].top > 64 - res[1][i].height) {
	// 					this.setData({
	// 						title: res[1][i].dataset.title
	// 					})
	// 					break
	// 				}
	// 			}
	// 		}
	// 	})
	// },
})
