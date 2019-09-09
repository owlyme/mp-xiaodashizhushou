import api from './api/index.js'
import {updateConnectConfig} from './api/im.js'
import http from './utils/request.js'
import Socket from './utils/socket'
import login from './utils/login.js'

App({
	globalData: {
		userInfo: null, // 用户信息
		capsule: null, // 胶囊大小及位置信息
		topHeight: 0,
		statusBarHeight: null, // 状态栏高度
		systemInfo: null, // 系统信息
		voicePath: null, // 语音路径
		appPagehiddenType: 'APP', // 页面隐藏方式
		inChatPageHidden: false,
		imageAndVideoList: [], // preview
		preOnlineStatus: 'OFF_LINE',
		onlineStatus: 'OFF_LINE',
		msgCountToday: 0, // 今天已强制聊天次数
		isIPX: false,
		messageCache: {}, // 根据会话id缓存数据
		chatListPageOnShow: false,
		companyId: null, // 从公众号跳转小程序时的id
		lastConvrChat: {},
		msgRemindVoiceOpen: true
	},
	SOCKET: Socket,
	api: api,
	http: http, // 将post,get方法绑定到this.http
	// 小程序初始化
	onLaunch: function (query) {
		this.getTopInfo()
	},
	// 小程序启动或切前台
	onShow: function(query) {
		// 检测storage中是否有sessionId，没有则生成
		const sessionId = wx.getStorageSync('sessionId')
		if (!sessionId) { login.setSessionId() }
		// 保存参数
		if (query.path.includes("pages/chatList/chatList")) { // chatList/chatList页面
			if (query.corpId || query.corpId === 0) { // 从公众号跳转小程序时的id
				wx.showModal({
					title: query.corpId + 'xy',
					duration: 6000
				})
				this.globalData.companyId = query.corpId
			} else { // 单纯后台切换行为
				this.globalData.chatListPageOnShow = true
			}
		}

		if (wx.getStorageSync('socket_connect_status') === "connect") {

			updateConnectConfig({status: "ON_LINE"})
		}
		setTimeout(() => {
			this.globalData.appPagehiddenType = "APP"
		}, 1000)
	},
	// 小程序切后台
	onHide: function() {
		if(this.globalData.appPagehiddenType === 'APP') {
			updateConnectConfig({status: "OFF_LINE"})
		}
		this.globalData.inChatPageHidden = true
		this.cleanMessageCache()
	},
	// 获取状态栏及胶囊尺寸信息
	getTopInfo: function () {
		const that = this
		const capsule = wx.getMenuButtonBoundingClientRect() // 胶囊信息
		that.globalData.capsule = capsule
		wx.getSystemInfo({ // 系统信息
			success: function (res) {
				that.globalData.systemInfo = res
				that.globalData.statusBarHeight = res.statusBarHeight
				that.globalData.topHeight =  capsule.height + 2 * (capsule.top - res.statusBarHeight) // 顶部高度
				if (res.model.search('iPhone X') != -1) {
          that.globalData.isIPX = true
        }
			}
		})
	},
	cleanMessageCache() {
		this.messageCache = null
		this.messageCache = {}
	}
})
