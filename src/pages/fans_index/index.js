import wxRequest from '../../utils/request'
import shareApp from '../../utils/shareApp'
const nextTick = time =>
	new Promise(resolve => setTimeout(resolve, time || 200))
const app = getApp();
const colors = [
	'#9ad5ff',
	'#f5d787',
	'#ffb2b2',
	'#93eb8c',
	'#88e5d7',
	'#b2b2ff',
	'#ffc3a6',
	'#d4adff',
	'#ffade1'
]
Page({
	data: {
		data: {},
		showPopup: false,
		canAction: false,
		param: '',
		tagIds: '', // 格式化的标签id
		routeQuery: {},
		dataLoading: false,
		status: '',
		groupUrl: '',
		seatUrl: '',
		isIPX: app.globalData.isIPX
	},
	onLoad: function(options) {
		// userId: 12 createUserId: 3 seatId: 23
		options.appAccountId = Number(options.appAccountId)
		const { id , appAccountId , status  } = options;
		this.getFansDetail({ id, appAccountId })
		this.setData({
			routeQuery: options,
			status: status
		})
		wx.setStorageSync('fans_page_loaded', true)
	},
	onShareAppMessage: shareApp,
	changeData() {
		this.getFansDetail({ id: this.data.routeQuery.id, appAccountId: this.data.routeQuery.appAccountId }, true)
	},
	async getFansDetail(params, isBack) {
		!isBack && wx.showLoading({
			title: '数据加载中',
			mask: true
		});
		const result = await wxRequest.post('/mp/fans/getFansDetail', params);
		await nextTick(600)
		!isBack && wx.hideLoading()
		let { code, data } = result
		if (code === 1) {
			data = this.filterFans(data)
			const tagIds = data.fansWxTagDtos ? JSON.stringify(data.fansWxTagDtos.map(item => item.tagId)) : []
			this.setData({
				data: data,
				param: `?id=${data.fansId}&appAccountId=${data.appAccountId}`,
				tagIds: tagIds
			})
		}
	},
	async updateExclusiveSeat(params) {
		const seatInfo = app.globalData.store.data.chatList.seatInfo
		params = { fansId : this.data.routeQuery.id, appAccountId : this.data.routeQuery.appAccountId, seatId : seatInfo.seatId, type : params.type };
		const result = await wxRequest.post('/mp/fans/updateExclusiveSeat', params)
		const { code } = result;
		if (code === 1) {
			this.setData({
				'data.isExclusiveKf': params.type
			})
		} else {
			wx.showToast({
				title: '设置失败'
			})
		}
	},
	filterFans: function(data) {
		const seatInfo = app.globalData.store.data.chatList.seatInfo
		const { seatId, createUserId, userId } = seatInfo // 坐席id和创建人id及用户人id
		let fansTags = data.fansWxTagDtos || []
		let mobile = data.phone
		fansTags = fansTags.map(item => {
			return { ...item, color: colors[Math.floor(Math.random() * 9)] }
		})
		// 格式化手机号
		if (mobile) {
			mobile = mobile.replace(/(\d{3})(\d{4})(\d{4})/g, function(
				$0,
				$1,
				$2,
				$3
			) {
				return $1 + '-' + $2 + '-' + $3
			})
		}
		// 过滤是否有权限操作 创建人 坐席相同
		if (data.kfSeatId === seatId) {
			this.setData({
				canAction: true,
				groupUrl: `/pages/fans_group/index?id=${data.fansId}&appAccountId=${data.appAccountId}&groupId=${data.kfFansGroupId}`,
				seatUrl: `/pages/fans_service/index?id=${data.fansId}&appAccountId=${data.appAccountId}&kfSeatId=${data.kfSeatId}`
			})
		} else if (createUserId === userId) {
			this.setData({
				canAction: true,
				groupUrl: '',
				seatUrl: `/pages/fans_service/index?id=${data.fansId}&appAccountId=${data.appAccountId}&kfSeatId=${data.kfSeatId}`
			})
		} else {
			this.setData({
				canAction: false,
				groupUrl: '',
				seatUrl: ''
			})
		}
		return { ...data, fansWxTagDtos: fansTags, [mobile && 'formatphone']: mobile }
	},
	navagateProfile() {
		wx.navigateTo({
			url: `/pages/fans_profile/index${this.data.param}`
		})
	},
	callPhone(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phone
		})
	},
	toggleBottomPopup() {
		this.setData({
			showPopup: !this.data.showPopup
		})
	},
	sendMsg() {
		wx.navigateTo({ url: '/pages/chat/chat' })
	},
	setZhuanshu(event) {
		const _this = this;
		const { status } = event.currentTarget.dataset
		if (status === '1') {
			wx.showModal({
				title: '设置专属',
				content: '确认将该粉丝设为专属粉丝',
				confirmText: '确认',
				confirmColor: '#177ee6',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						// type 1
						_this.updateExclusiveSeat({type : 1})
					}
				}
			})
		} else {
			wx.showModal({
				title: '取消专属',
				content: '确认将该粉丝取消专属粉丝',
				confirmText: '确认',
				confirmColor: '#177ee6',
				cancelText: '取消',
				success: function(res) {
					if (res.confirm) {
						// type 2
						_this.updateExclusiveSeat({type : 2})
					}
				}
			})
		}
	},
	previewImage(e) {
		wx.previewImage({
			urls: [e.currentTarget.dataset.image]
		})
	}
})
