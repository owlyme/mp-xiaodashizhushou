import create from '../../utils/omix/create'
import store from '../../store/index'
import {filterChatListData} from '../chatList/filtersData'
import tool from '../../utils/tool'
import shareApp from '../../utils/shareApp'
import Actions from './action'
import chatListActions from "../chatList/action"
import {
	getConvMessageListByConvId,
	getForcedChatMsgCountToDay
} from "../../api/chatList"
import wxRequest from '../../utils/request'
import setWatcher from '../../utils/watch'
import {getLast20, addSendMsgToStore, setFansInfo, getFansInfo} from '../../utils/messageCache'
let {calcMark, guid} = require('../../utils/util')

const App = getApp()
const Socket  = App.SOCKET

create(store, {
	data: {
		lAnimate: '',
		showFansInfo: true,
		inputPanel: false,
		messages: [],
		lastMessageId: 'none',
		loading: false,
		prePositionStatu: false,
		requestHistoryCount: 0,
		isMore: true,
		forceStatus: false, // 超过四十八小时，强制发送
		cancelFocus: false, // 粉丝取消关注
		listParam: {
			offset: 0,
			limit: 20,
			sort: null,
			order: null,
			conversationId: null
		},
		fansInfo: {
			nickName: '',
			gender: '',
			appAccountName: '',
			fansSource: '',
			fansId: '',
			appAccountId: '',
			status: ''
		},
		markClass: '',
		sendedMsgStatus: {},
		errMsg: '',
		msgCountToday: 0,
		chatCount: 0,
		chatPartHeight: App.globalData.systemInfo.windowHeight,
		downLocked: false // 向下滚动锁定
	},
	onShareAppMessage: shareApp,
	onLoad() {
		if (!wx.getStorageSync('chat_page_loaded') ) {
			setWatcher(this, this.watch)
			wx.setStorageSync('chat_page_loaded', true)
		}
		this.initThisPage()
		this.addSocketTask()
	},
	onShow(){
		this.setData({
			chatCount: this.options.chatCount
		})
		this.popover = this.selectComponent('#popover')
		this.scroll = this.selectComponent('#scroll')
		if (App.globalData.inChatPageHidden) {
			this.onReady()
			App.globalData.inChatPageHidden = false
		}
	},
	onReady() {
		if(App.globalData.appPagehiddenType === "APP") {
			this.init()
			this.setData({messages: []})
		}
		App.globalData.appPagehiddenType = "APP"
	},
	onUnload() {
		this.pageOnUload = true
		this.getMessageCache()
		this.store.data.chatList.messages = []
		this.setData({messages: []})
		this.offSocketTask()
	},
	getMessageCache() {
		let convrId = this.userInfo.convrId
		let curMsg = this.data.messages
		getLast20(App, convrId, curMsg, this.store.data.chatList.messages)
		addSendMsgToStore(this.store, curMsg)
		setFansInfo(App, convrId, this.data.fansInfo)
	},
	watch: {
		"data.store.sendedMsg"(data) {
			this.setData({
				sendedMsgStatus: data
			})
		}
	},
	async init() {
			this.store.data.seatContinueSpeakCount = 0
			this.calcMark()
			this.isOut48Hours()
			this.getForcedChatMsgCountToDay()
			this.store.data.chatList.messages = []
			this.setData({
				requestHistoryCount: 0
			})
			wx.showLoading({	title: '加载中'	})
			await this.getConvMessageListByConvId()
			wx.hideLoading()
			this.setToBottom()
	},
	calcMark() {
		let seatId = this.data.store.chatList.seatInfo.seatId
		let item = this.data.store.chatList.currentChatObj
		let markClass = calcMark(item, seatId)
		this.setData({
			markClass: markClass
		})
	},
	initThisPage() {
		// 定义本页面的相关参数
		this.userInfo = Object.assign({},
			wx.getStorageSync('userInfo').userInfo || {},
			this.store.data.chatList.currentChatObj,
			this.store.data.chatList.seatInfo)
		this.userInfo.touser = 	this.userInfo.convrId.replace(/(\d+_){2}/, '')
		// console.log(this.userInfo)
		this.getFansDetail()
	},
	addSocketTask() {
		Socket.on({type:'convrMsg', eventId: '002'}, (data) => {
			this.store.data.seatContinueSpeakCount = 0
			let seatInfo = this.data.store.chatList.seatInfo
			if (App.globalData.msgRemindVoiceOpen) {
				chatListActions.SET_ALLSOCKETMSG({
					list: data,
					noticeList: seatInfo.acItemValueByKfSystem
				})
			}

			if (this.data.store.chatList.currentChatObj.convrId === data.convrId) {
				Actions.SET_SOCKETMSG(this, data)
				this.resetFocesStatus(data)
			}
		})

		Socket.on({type:'convrEvent', eventId: '003'},  (data) =>  {
			if (this.data.store.chatList.currentChatObj.convrId === data.convrId
				&& data.event === 'CONVR_MSG_SEND_FAIL') { // 发送失败的消息
					Actions.SET_ERR_MESSAGE(this, data)
			}
    })
	},
	offSocketTask() {
		Socket.off({type:'convrMsg', eventId: '002'})
		Socket.off({type:'convrEvent', eventId: '003'})
	},
	resetFocesStatus(data) {
		if(data.messageBody.msgType === 'WX_KF_MSG') {
			this.setData({forceStatus: false})
			// let currentChat = this.store.data.chatList.chatListData.find(item => item.convrId === this.userInfo.convrId)
			// let date = new Date()
			// currentChat.fansLastVisitDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		}
	},
	sendmsg: function(e) {
		let data = e.detail
		if (!data.data)  return
		this.isOut48Hours()
		let uuid = guid(10)
		let newMsg = this.createUserMessage(data, uuid)
		if (newMsg) {
			const sendingMessages = this.store.data.sendingMessages
			sendingMessages[uuid] = newMsg
			this.updateMessages(newMsg)
		}
	},
	createUserMessage(msg, uuid) {
		let chatSeatAppAccountList = this.userInfo.chatSeatAppAccountList || []
    let item = chatSeatAppAccountList.find(item => {
      return item.appAccountId === this.userInfo.appAccountId
		})
		if (!item) {
			wx.showModal({
				title: "",
				content: '该公众号取消分配给您，无法发送消息',
				confirmText: "知道了",
				confirmColor: "#177ee6",
				showCancel: false,
				success() {
					wx.navigateBack({delta: 1})
				}
			})
      return
    }
		return {
			userInfo: this.userInfo,
			uuid,
			file: msg.data,
			readed: false, // 本地已读
			source: 0, // 1: 收到的语音消息 0: 自己发送出去的语音消息
			status: 1, // 1成功 0 失败
			errorInfo: '',
			messageBody: {
				msgBodyType: msg.type,
				"msgId": 'A'+Date.now(),
				"name": item.seatName,
				"head": item.seatImgUrl,
				createId: this.userInfo.seatId,
				"msgType": "",
				"msgTypeCode": null,
				"createTime": Date.now(),
				"status": null,
				content: msg.data,
				"contextMap": {}
			}
		}
	},
	updateMessages(message) {
		const messages = this.data.messages
		messages.push(message)
    // 需要先更新 messagess 数据后再设置滚动位置，否则不能生效
    var lastMessageId = messages.length
      ? 'A' + messages[messages.length - 1].messageBody.msgId
      : 'none'
    this.setData({ lastMessageId, messages })
	},
	// 查看更多
	async lookMore() {
		if (!this.lookMoreClick) {
			this.lookMoreClick = true
			setTimeout(() => { // 人为延迟
				this.getConvMessageListByConvId()
				this.lookMoreClick = false
			}, 1000)
		}
	},
	// 滚动置顶
	async scrolltoupper() {
		if (!this.reachTop && !this.data.loading) {
			this.reachTop = true
			this.setData({loading: true})
			setTimeout(() => { // 人为延迟
				this.getConvMessageListByConvId()
				this.reachTop = false
			}, 1000)
		}
	},
	// 拖动中
	moving(e){
		this.switchFanInfo(e.detail)
	},
	createShowInfoAninmate(height = 0) {
		let option = {
      duration: 400, // 动画执行时间
      timingFunction: 'liner' // 动画执行效果
    };
		let lanimation = wx.createAnimation(option);
		lanimation.height(`${height}rpx`).step();
		this.setData({
			lAnimate:  lanimation.export()
		})
	},
	showInfo() {
		this.setData({
			showFansInfo: true
		})
		this.createShowInfoAninmate(150)
	},
	switchFanInfo(data) {
		if (data.type === 'up') {
				this.setData({
					showFansInfo: false
				})
			this.createShowInfoAninmate()
		}
	},
	isOut48Hours(){
		let lastTime = this.store.data.chatList.currentChatObj.fansLastVisitDate
		if (typeof lastTime === 'string') {
			lastTime = lastTime.replace(/-/g,'/')
			lastTime = new Date(lastTime).getTime()
		}
		this.setData({
			forceStatus: Date.now() - lastTime > 48 * 60 * 60 * 1000
		})
	},
	async getFansDetail() {
		const savedFansInfo = getFansInfo(App, this.userInfo.convrId)
		// console.log(savedFansInfo)
		if (savedFansInfo.fansId) {
			savedFansInfo.status =  this.userInfo.status
			this.setData({
				fansInfo: savedFansInfo
			})
		}
		let params = { id : this.userInfo.touser, appAccountId : this.userInfo.appAccountId };
		const result = await wxRequest.post('/mp/fans/getFansDetail', params);
		let { code, data } = result
		if (code === 1) {
			if (!savedFansInfo.fansId) {
				this.setData({
					fansInfo: {
						specificSourceName: data.specificSourceName,
						nickName: data.nickName,
						gender: data.sex,
						appAccountName: data.accountName,
						subscribeScene: data.subscribeScene,
						fansId: data.fansId,
						appAccountId: data.appAccountId,
						status: this.userInfo.status
					}
				})
			}
			this.setData({
				cancelFocus: !data.subscribe
			})
		} else {
			wx.showLoading({
				title: '获取粉丝详情失败！',
			})
		}
	},
	async getConvMessageListByConvId() {
		if (!this.data.isMore) {
			return
		}
		let convrId = this.userInfo.convrId
		let count = this.data.requestHistoryCount
		this.setData({ requestHistoryCount: ++count })
		let chatList = this.store.data.chatList

		if (count <= 1 && App.globalData.messageCache[convrId] && App.globalData.messageCache[convrId].length > 0 && !App.globalData.inChatPageHidden) {
			chatList.messages = App.globalData.messageCache[convrId]
			return
		}
		this.newMsgLength = 0
		this.setData({downLocked: true}) // 锁定下拉

		let params = this.data.listParam
		params.offset = chatList.messages.length
		params.conversationId = convrId
		let res = await getConvMessageListByConvId(params)
		// 结果 messages
		if (res.code === 1) {
			let len = this.newMsgLength = (res.data.records && res.data.records.length) || 0
			if (len > 0) {
				let records = res.data.records.map(Actions.tranformMsg)
				let messages = chatList.messages || []
				records = filterChatListData(records).reverse() // 第二个参数是按时间从小到大排序 // 第三个参数是过滤显示时间的类型
				if (App.globalData.inChatPageHidden) {
					messages = records
				} else {
					messages = [...messages, ...records]
				}
				chatList.messages = messages || []
			}
		}
		if (this.newMsgLength <= 0) {
			this.setData({
				downLocked: false,// 解锁下拉
				loading: false
			})
		}
		return res
	},
	closeInputPanel() {
		this.setData({
			inputPanel: !this.data.inputPanel
		})
	},
	getRect (id) {
		return new Promise(resolve => {
			wx.createSelectorQuery().select('#'+ id).boundingClientRect(rect => {
				if (rect) {
					resolve(rect)
				} else {
					resolve({bottom : 0})
				}
			}).exec()
		})
	},
	localMsgReaded(index, size) {
		const	messages = this.store.data.chatList.messages
		if (size) {
			messages[index].readed = true
		}
	},
	msgComponentReady(e) {
		let size = e.detail
		this.localMsgReaded(e.currentTarget.dataset.index, size)
		// 每当渲染成功一条消息后，减少一个技计数
		if ((--this.newMsgLength || 0) <= 0) {
			this.setData({
				downLocked: false,// 解锁下拉
				loading: false
			})
		}
	},
	sendMsgComponentReady(e) {
		let index = e.currentTarget.dataset.index
		let messages = this.data.messages
		messages[index].readed = true
	},
	touchAvatarFn() {
		App.globalData.appPagehiddenType = "fansPage"
		tool.go('/pages/fans_index/index', {
			id: this.data.fansInfo.fansId,
			appAccountId: this.data.fansInfo.appAccountId,
			status: this.data.markClass
		})
	},
	popoverEvent(e) {
		let rect = e.detail.rect
		if (rect === "hidden"){
			this.popover.onHide();
		} else {
			this.setData({
				errMsg: rect.errmsg.CONVR_ERR_MSG
			})
			this.popover.onDisplay(rect)
		}
	},
	// 置底部
	setToBottom() {
		this.scroll.setToBottom()
	},
	// 置顶
	setToTop() {
		this.scroll.setToTop()
	},
	// 获取强制发送次数
	getForcedChatMsgCountToDay() {
		getForcedChatMsgCountToDay({
			appAccountId: this.userInfo.appAccountId,
			seatId: this.userInfo.seatId
		}).then(res => {
			if (res.code === 1)	{
				App.globalData.msgCountToday = res.data.msgCountToday
				this.setData({
					msgCountToday: res.data.msgCountToday
				})
			}
		})
	},
	keyboardheightchange(e) {
		// that.globalData.systemInfo
		// console.log(that.globalData.systemInfo)
		// console.log(e)
		// let h =  App.globalData.systemInfo.windowHeight
		// if (e.detail.height > 100) {
		// 	h -= e.detail.height
		// }
		// this.setData({
		// 	chatPartHeight: h
		// })
	}
})
