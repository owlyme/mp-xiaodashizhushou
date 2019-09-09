import {
	getMyNotificationConfigInfo,
	updateMyNotificationConfig,
	getValueByKeyAndPv,
	getValueByKey
} from "../../api/config"
import {
	updateChatStateByType,
	getChatSeatInfo
} from "../../api/chatList"
import shareApp from '../../utils/shareApp'

var app = getApp()
const Socket  = app.SOCKET

Page({
	data: {
		online_status: true,
		XDS_MP_VISIT_NOT_SPEAK: false,
		XDS_MP_FANS_SEND_MSG: false,
		XDS_MP_VOICE_VISIT_NOT_SPEAK: false,
		XDS_MP_VOICE_FANS_SEND_MSG: false,
		XDS_MP_NOTIFICATION_INTERVAL: 20,
		info : {
			nickName: null,
			avatarUrl: null,
			companyName: 'xingke'
		}
	},
	onLoad() {
		this.setData({
			statusBarHeight: app.globalData.statusBarHeight,
			topHeight: app.globalData.topHeight
		})
	},
	onShareAppMessage: shareApp,
	onShow: function () {
		app.globalData.appPagehiddenType = 'minePage'
		app.globalData.onlineStatus = ''
		let userInfo = wx.getStorageSync('userInfo').userInfo
		this.setData({
			info: {
				nickName: userInfo.nickName,
				avatarUrl: userInfo.avatarUrl,
				companyName: wx.getStorageSync('company').corpName
			}
		})
		this.getMyNotificationConfigInfo()
		this.getValueByKey()
		this.getChatSeatInfo()
	},
	// 获取坐席信息
	getChatSeatInfo() {
		getChatSeatInfo().then(data => {
			if (data.code === 1) {
				this.setData({
					online_status: data.data.onLineStatus === 'ON_LINE'
				})
			}
		})
	},
	// 获取初始数据
	getMyNotificationConfigInfo() {
		let param = {
			key: 'XDS_MP_NEW_MESSAGE'
		}
		getMyNotificationConfigInfo(param).then(res => {
			if (res.code === 1) {
				res.data.forEach(item => {
					this.setData({
						[item.key]: item.key.includes('INTERVAL') ?  parseInt(item.value) : !!parseInt(item.value)
					})
				});
				app.globalData.msgRemindVoiceOpen = this.data.XDS_MP_VOICE_VISIT_NOT_SPEAK
			}
		})
	},
	// 切换状态
	switchFn(e) {
		let key = e.currentTarget.dataset.key
		this.setData({
			[key]: !this.data[key]
		})
		this.updateMyNotificationConfig(key, this.data[key] ? 1 : 0 )
	},
	// 切换状态 - 接口
	updateMyNotificationConfig(key, value) {
		updateMyNotificationConfig({
			defineKey: "XDS_MP_NEW_MESSAGE",
			key,
			value
		}).then(res => {
			if (res.code !== 1) {
				this.setData({
					[key]: key.includes('INTERVAL') ?  parseInt(value) : !this.data[key]
				})
				this.showToast()
			} else {
				if(key === 'XDS_MP_NOTIFICATION_INTERVAL') {
					this.setData({
						[key]: parseInt(value)
					})
					this.successToast()
				} else if (key === 'XDS_MP_VOICE_VISIT_NOT_SPEAK') {
					// 声音通知 - 粉丝消息
					app.globalData.msgRemindVoiceOpen = !!value
				}
			}
		})
	},
	// 更新在线状态
	updateStatus() {
		wx.showActionSheet({
			itemList: ['在线', '离线'],
			success: (res) => {
				this.updateChatStateByType(!res.tapIndex)
			},
			fail: (res) =>  {
			}
		})
	},
	// 更新在线状态 - 接口
	updateChatStateByType(bool) {
		if (bool === this.data.online_status) return
		// ON_LINE, // 在线 OFF_LINE; // 离开
		let type = bool ? "ON_LINE" : "OFF_LINE"
		if (bool) {
			this.afterUpdateChatStateByType(type, bool)
		} else {
			wx.showModal({
				title: '确认切换为“离开”？',
				content: '离开状态无法接受粉丝消息',
				confirmColor: "#177ee6",
				success: (res) => {
					if (res.confirm) {
						this.afterUpdateChatStateByType(type, bool)
					} else {

					}
				}
			})
		}
	},
	afterUpdateChatStateByType(type, bool) {
		updateChatStateByType({type}).then(res => {
			if (res.code === 1) {
				this.setData({
					online_status: bool,
				})
				this.successToast("切换成功")
				// Socket.onLineStatus = type
				app.globalData.onlineStatus = type
				if (type === 'ON_LINE') {
					// Socket.createSocket()
				}
			} else {
				this.showToast()
			}
		})
	},
	// 更新通知时间
	selectedTime(){
		let itemList = this.itemList.map(item => item.itemName+ "分钟") || ['5分钟', '10分钟', '20分钟', '30分钟']
		wx.showActionSheet({
			itemList,
			success: (res) => {
				this.setInterval(res.tapIndex)
			},
			fail: (res) =>  {
			}
		})
	},
	// 更新通知时间 - 接口
	setInterval(index) {
	 this.updateMyNotificationConfig("XDS_MP_NOTIFICATION_INTERVAL", this.itemList[index].itemValue)
	},
	getValueByKey() {
		getValueByKey({itemKey: "XDS_MP_NOTIFICATION_INTERVAL"}).then(res => {
			if (res.code === 1) {
				this.itemList = res.data
				this.itemList.sort((a, b) => a.itemIdx > b.itemIdx ? 1 : -1)
			}
		})
	},
	showToast() {
		wx.showToast({
			title: '操作失败, 请重新操作！',
			icon: 'none',
			duration: 1000
		})
	},
	successToast(title = '保存成功') {
		wx.showToast({
			title,
			icon: 'success',
			duration: 1000
		})
	}
});
