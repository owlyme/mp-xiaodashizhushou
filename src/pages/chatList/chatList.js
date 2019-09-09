import create from '../../utils/omix/create'
import store from '../../store/index'
import Actions from './action'
import login from '../../utils/login'
import { filterChatListData } from './filtersData';
import shareApp from '../../utils/shareApp'
import { getCorpItemValueByCorpSystem } from '../../api/config'
let tool = require('../../utils/tool')
let {calcMark, calcChatCount} = require("../../utils/util.js")
var app = getApp()
var netSatus = {
	prev: null,
	curr: null
}
const Socket  = app.SOCKET
// wx.setEnableDebug({
// 	enableDebug: true
//   })
create(store, {
	data: {
		showCount: 0,
		loadingStatu: 1,
		deleteStatu: 1,
		onLineStatusList: ['在线', '离线'],
		loadingStatuScramble: 1,
		clickLoadstatu: 1,
		chatListLength: 0,
		chattingListData: [], // 正在会话中的数据
		chatListData: [] // 除了正在会话中 其他类型的数据
	},
	onShareAppMessage: shareApp,
	async onLoad(){
		this.networkChange()
		await Actions.queryQcCloudUrlRequestName()
		this.init()
		this.initSocket()
		this.addSocketTask()
	},
	async onShow() {
		if (this.data.showCount >= 1) {
			login.checkStatus().then(() => {
			})
		}
		if (wx.getStorageSync('chat_page_loaded')) {
			let isChattingList = this.store.data.chatList.chatType === 'chattingList'
			let chatArr = isChattingList ?  this.data.chattingListData : this.data.chatListData
			let currentChatObj = this.store.data.chatList.currentChatObj
			let index = chatArr.findIndex(_item => {
				return _item.convrId === currentChatObj.convrId;
			});
			if (index >= 0) {
				chatArr[index] = {
					...chatArr[index],
					...currentChatObj
				};
			}
			this.setData({
				[isChattingList? 'chattingListData': 'chatListData']: filterChatListData(chatArr, 'max')
			})
		}
		if (app.globalData.chatListPageOnShow && this.data.showCount >= 1) {
			this.appOnShow()
		} else {
			this.setData({ showCount: ++this.data.showCount	});
			// 从‘我的’页面过来
			if (app.globalData.appPagehiddenType === 'minePage' && app.globalData.onlineStatus === "ON_LINE" ) {
				Socket.createSocket()
			};
			if (this.data.showCount >= 1
				&& !wx.getStorageSync('chat_page_loaded')
				&& !wx.getStorageSync('fans_page_loaded')
				&& !wx.getStorageSync('scramble_page_loaded')
				&& !wx.getStorageSync('statistics_page_loaded')
				) {
					this.secondInit()
			}
		}
		this.afterShow()
		this.hasNotify()
	},
	hasNotify() { // 判断是否开启了消息通知
		getCorpItemValueByCorpSystem({
			key: 'XDS_SESSION_SETING'
		}).then(res => {
			console.log(res)
			if (res.code === 1) {
				const list = res.data
				if (!list || !list.length) return
				list.forEach(v => {
					if (v.key === 'XDS_CORP_SESSION_MSG') {
						if (v.value === '0') {
							wx.showModal({
								title: '会话未开启',
								content: '当前企业未开启会话消息，无法接收粉丝消息，请前往企业管理系统>设置>会话消息中开启',
								showCancel: false,
								confirmText: '知道了',
								success: () => { }
							})
						}
					}
				})
			}
		})
	},
	afterShow() {
		wx.setStorageSync('chat_page_loaded', false)
		wx.setStorageSync('fans_page_loaded', false)
		wx.setStorageSync('scramble_page_loaded', false)
		wx.setStorageSync('statistics_page_loaded', false)
		app.globalData.chatListPageOnShow = false
		app.globalData.appPagehiddenType = "APP"
	},
	initGlobalData() {
		app.globalData.appPagehiddenType = "APP";
		app.globalData.imageAndVideoList = []
	},
	init() {
		login.checkStatus().then(res => { // 验证登录状态并进行相应跳转
			wx.hideLoading()
			return Actions.getChatSeatInfo(this)
		}).then(async res => {
			Actions.setInitChatList(this)
			Actions.getConversationListCount(this)
			Actions.getScrambleOrderList(this)
			if (!Socket.socket) Socket.createSocket()
		}).catch(err => {
			wx.hideLoading()
		})
	},
	secondInit() {
		this.store.data.chatList.scramble = []
		this.setData({
			loadingStatuScramble: 1
		})
		Actions.getChatSeatInfo(this).then(res => {
			Actions.setInitChatList(this)
			Actions.getConversationListCount(this)
			Actions.getScrambleOrderList(this)
			if (!Socket.socket) Socket.createSocket()
		}).catch(err => {
		})
	},
	getFansDetail(e) {
		let item = e.detail
		if (this.data.clickLoadstatu === 2) {
			return
		}
		this.setData({
			clickLoadstatu: 2
		})
		Actions.checkSeatFansBind(this, item).then(code => {
			let seatId = this.data.store.chatList.seatInfo.seatId
			let markClass = calcMark(item, seatId)
			this.store.data.chatList.seatContinueSpeakCount = item.seatContinueSpeakCount
			this.store.data.chatList.currentChatObj = {...this.store.data.chatList.currentChatObj, ...item}
			wx.navigateTo({
				url: `/pages/fans_index/index?id=${item.convrId.replace(/(\d+_){2}(.+)/, '$2')}&appAccountId=${item.appAccountId}&status=${markClass}`,
				complete: () => {
					setTimeout(() => {
						this.setData({
							clickLoadstatu: 1
						})
					}, 1000)
				}
			})
		}).catch(() => {
			this.setData({
				clickLoadstatu: 1
			})
		})
	},
	getChatMessage(e) {
		let item = e.detail
		if (this.data.clickLoadstatu === 2) {
			return
		}
		this.setData({
			clickLoadstatu: 2
		})
		Actions.checkSeatFansBind(this, item).then(code => {
			this.store.data.chatList.currentChatObj = {...this.store.data.chatList.currentChatObj, ...item}
			this.store.data.chatList.seatContinueSpeakCount = item.seatContinueSpeakCount
			if (item.unreadNum > 0) {
				Actions.setIncrUnRead(this, item)
			}
			let chatCount = calcChatCount(this.store.data.chatList, null, this.data.chattingListData, this.data.chatListData)
			wx.navigateTo({
				url: `/pages/chat/chat?chatCount=${chatCount}`,
				complete: () => {
					setTimeout(() => {
						this.setData({
							clickLoadstatu: 1
						})
					}, 1000)
				}
			})
		}).catch(() => {
			this.setData({
				clickLoadstatu: 1
			})
		})
	},
	onPullDownRefresh() {
		Actions.setRefreshChatList(this)
  },
	onReachBottom() {
		Actions.setScrollData(this)
	},
	chatListComponentReady () {
		if ((--this.data.chatListLength || 0) <= 0) {
		}
	},
	stopPullDownRefresh() {
    wx.stopPullDownRefresh({
      complete(res) {
      }
    })
	},
	// 会话类型的变化刷新列表
	async watchChatType() {
		await Actions.setInitChatList(this)
		this.data.store.chatList.watchChatTypeStatu = 1
	},
	getConversationListCount() {
		Actions.getConversationListCount(this)
	},
	closeConversating(e) {
		let item = e.detail.item
		let instance = e.detail.instance
		Actions.closeConversating(this, item, instance)
	},
	async changeChatType(type) {
		// 相同type不动作
		if (type.detail === this.data.store.chatList.chatType) return
		this.data.store.chatList.watchChatTypeStatu = 2
		this.setData({
			chatListData: []
		})
		this.data.store.chatList.chatType = type.detail
	},
	changeActiveLabelType(e) {
		this.store.data.chatList.activeLabelType = e.detail
	},
	back: function(e) { // 点击顶部返回按钮
		let _this = this
		wx.showActionSheet({
			itemList: this.data.onLineStatusList,
			success: (res) => {
				if (res.tapIndex === 0) {
					Actions.updateChatStateByType(_this, 'ON_LINE')
					Socket.createSocket()
				} else {
					tool.showModal({
						title: '确认切换为“离开”？',
						content: '离开状态无法接受粉丝消息',
						showCancel: true,
						cancelText: '取消',
						cancelColor: '#000000',
						confirmText: '确认',
						confirmColor: '#177ee5',
						success (res) {
							if (res.confirm) {
								Actions.updateChatStateByType(_this, 'OFF_LINE')
							} else if (res.cancel) {

							}
						}
					})
				}
			},
			fail (res) {
			}
		})
	},
	initSocket() {
		// 掉线提示
		Socket.disconnectHook = () => {
			this.disconnect = true
		};
		// 重连后重新加载列表
		Socket.connectHook = () => {
			// this.disconnect && this.secondInit()
			this.disconnect = false
		}
	},
	addSocketTask() {
		Socket.on({type:'convrMsg', eventId: '000'},  (data) => {
			let seatInfo = this.data.store.chatList.seatInfo
			// 提示音
			Actions.SET_ALLSOCKETMSG({
				list: data,
				noticeList: seatInfo.acItemValueByKfSystem
			})
			if (data.listType === 'CONV_QDC_LIST') {
				Actions.SET_SOCKET_SCRAMBLE(this, data)
			} else {
				if (this.store.data.chatList.chatType === 'chattingList' || this.store.data.chatList.chatType === 'recentContacts') {
					Actions.SET_SOCKET_CHATLIST(this, data, app)
				}
			}
		})

		Socket.on({type: 'convrEvent', eventId: '001'},  (data) =>  {
      switch (data.event) {
        case 'SCRAMBLE_ORDER_SUCCESS_ROMOVE': // 关闭抢单池
					Actions.DELETE_OTHER_SCRALER(this, {
						convrId: data.convrId
					})
          break;
				case 'CLOSE_CONVR_ASSIS_SEAT': // 关闭协作
					if (this.store.data.chatList.chatType === 'recentContacts') {
						Actions.setRefreshChatList(this)
					} else if (this.store.data.chatList.chatType === 'chattingList') {
						Actions.DEL_CHAT_INFO(this, {
							convrId: data.convrId
						})
					}
          break;
          case 'CONVR_MSG_SEND_FAIL': // 错误消息
          break;
        default:
          break;
			}
		})
	},
	async appOnShow() {
		// 单纯后台切换行为
		if (app.globalData.chatListPageOnShow) {
			console.error('app on show')
			this.init()
			app.globalData.chatListPageOnShow = false
			return
		}
		// 从公众号跳转小程序
		let corpId = this.globalData.companyId
		if (corpId || corpId === 0) {
		let res = await	app.http.post(api.enterCompany, {
				corpId,
				platformType: 'WX_MP_CHAT'
			})
			if (res.code == 1) {
				// wx.setStorageSync('company', company)
				wx.setStorageSync('user', res.data.user)
				wx.setStorageSync('companyId', res.data.currCompanyId);
			}
		}
	},
	async networkChange() {
		wx.onNetworkStatusChange(async res =>  {
			netSatus.prev = netSatus.curr
			netSatus.curr = res.isConnected
			if (res.isConnected && netSatus.prev === false) {
				await Actions.queryQcCloudUrlRequestName()
				this.init()
				this.initSocket();
				this.addSocketTask()
				this.onShow()
			}
			if (!res.isConnected) {
				tool.showToast('当请网络不可用')
				this.store.data.chatList.seatInfo.onLineStatus = 'OFF_LINE'
			}
		})
	}
})