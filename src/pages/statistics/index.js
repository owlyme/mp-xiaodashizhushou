import api from '../../api/index.js'
import shareApp from '../../utils/shareApp'
var app = getApp() // 获取应用实例

Page({
	data: {
		today: null, // 今日数据
		total: null, // 累计数据
		order: [ // 统计数据显示与排序依据
			{
				key: 'msgCount',
				txt: '会话消息条数'
			},
			{
				key: 'converCount',
				txt: '会话消息人数'
			},
			{
				key: 'massPreviewCount',
				txt: '强制发送次数'
			},
			{
				key: 'seatQdCount',
				txt: '抢单次数'
			}
		]
	},
	onLoad: function () {
		this.init()
	},
	onShareAppMessage: shareApp,
	onShow: function () {
		app.globalData.appPagehiddenType = 'statisticsPage'
		wx.setStorageSync('statistics_page_loaded', true)
		this.getData()
	},

	init: function () { // 设置初始数据
		let arr = []
		this.data.order.forEach(v => {
			arr.push({
				txt: v.txt,
				val: 0
			})
		})
		this.setData({
			today: arr,
			total: arr
		})
	},
	getData: function () { // 获取统计数据
		app.http.post(api.statistics).then(res => {
			const dat1 = res.data.repSeatConvrToday
			const dat2 = res.data.repSeatConvrStatistics
			this.setData({
				today: this.preproccess(dat1),
				total: this.preproccess(dat2)
			})
		})
	},
	preproccess: function(dat) { // 统计数据预处理
		let arr = []
		this.data.order.forEach(v => {
			arr.push({
				txt: v.txt,
				val: dat[v.key]
			})
		})
		return arr
	}
});
