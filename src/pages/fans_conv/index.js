import dayjs from '../../utils/dayjs.min'
import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
Page({
	data: {
		data: {},
		dataLoading: false
	},
	onLoad: function(options) {
		const convrId = `1_${options.appAccountId}_${options.id}`
		this.getInteractiveStatistics({ convrId })
	},
	onShareAppMessage: shareApp,
	async getInteractiveStatistics(params) {
		wx.showLoading({
			title: '数据加载中',
			mask: true
		})
		this.setData({
			dataLoading: false
		})
		const result = await wxRequest.post(
			'/mp/fans/getInteractiveStatistics',
			params
		)
		await nextTick(600)
		wx.hideLoading()
		let { code, data } = result
		data = this.formatData(data)
		if (code === 1) {
			this.setData({
				data: data,
				dataLoading: true
			})
		}
	},
	formatData: function(data) {
		const tranformKey = [
			'firstVisitTime',
			'lastVisitTime',
			'firstTalkTime',
			'lastTalkTime'
		]
		tranformKey.forEach(item => {
			data[item] = data[item] ? dayjs(data[item]).format('YYYY-MM-DD HH:mm') : '--'
		})
		return data
	}
})
