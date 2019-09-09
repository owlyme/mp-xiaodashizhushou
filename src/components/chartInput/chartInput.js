import create from '../../utils/omix/create'
let {deepClone} = require('../../utils/util')
const App = getApp()

create({
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
		inputPanel: {
			type: Boolean,
			value: false,
			observer(nv, od){
				this.hiddenAll()
			}
		},
		forceStatus: { // 保存初始状态
			type: Boolean,
			value: false,
			observer(nv, od){
				this.setData({
					forceChat: nv
				})
			}
		},
		cancelFocus: { // 取消关注
			type: Boolean,
			value: true,
			observer(nv, od){	}
		},
		sendedMsgStatus: {
			type: Object,
			value: {},
			observer(nv){
				if(nv.msg) {
					if (typeof nv.msg === 'object') nv.msg = JSON.stringify(nv.msg)
					this.showModal(nv.msg)
				}
			}
		},
		msgCountToday: {
			type: Number,
			value: {},
			observer(nv){
				this.setData({
					forceChatCount: App.globalData.store.data.chatList.seatInfo.corpPack.forcedToChatNum - nv
				})
			}
		}
  },
  data: {
		focus: false,
		showHiddenPanel: false,
		showEmoji: false,
		text: '',
		maxText: 600,
		recording: false,
		showRecordingBtn: false,
		forceChat: false,
		forceChatCount: 0,
		disable: false,
		phoneX: false, // iphone 10以上
		keyboardHeight: 0,
		textareaHeight: 50 / 1.656
	},
	ready() {
		this.isPhoneX()
		this.setData({
			text: this.readAndWrite(),
			forceChatCount: App.globalData.store.data.chatList.seatInfo.corpPack.forcedToChatNum - this.data.msgCountToday
		})
	},
  methods: {
		lineChange(e) {
			console.log(e)
			let count = e.detail.lineCount || 1
			this.setData({
				textareaHeight: (count <= 4 ? count : 4 ) * 50 / 1.656
			})
		},
		inputFocus(e){
			this.setData({
				focus: true,
				showHiddenPanel: false,
				showEmoji: false
			})
			this.inputTouch()
		},
		inputblur(e) {
			this.setData({
				focus: false,
				text: e.detail.value.trim()
			})
		},
		closePanel() {
			this.setData({
				focus: true,
				showHiddenPanel: false,
				showEmoji: false,
				showRecordingBtn: false
			})
		},
		getText(e) {
			this.setData({
				text: e.detail.value,
			});
			this.readAndWrite(e.detail.value, true)
			if (this.data.text.trim().length >= this.data.maxText) {
				wx.showToast({
					title: '文案不能超过600字',
					icon: 'none'
				})
			}
		},
		send(type, data) {
			wx.hideToast()
			this.hiddenAll()
			if (App.globalData.store.data.seatContinueSpeakCount < 20) {
				this.triggerEvent('send', {
					type,
					data
				});
			} else {
				wx.showToast({
					title: '您发送消息过于频繁，请等待粉丝回复后方可再次发送消息',
					icon: 'none'
				})
			}
		},
		sendText(e) {
			if (this.data.text.trim()) {
				this.send('TEXT', {
					text: this.data.text,
					forceChat: this.data.forceStatus
				})
				setTimeout(() => {
					this.setData({
						focus: false,
						showHiddenPanel: false,
						showEmoji: false,
						text: ''
					})
				}, 100)
				this.readAndWrite('', true)
			} else {
				wx.showToast({
					title: '不能发送空白消息',
					icon: 'none'
				})
			}
		},
		// 强制
		forceChatFn() {
			if (this.data.forceChatCount <= 0 ) {
				wx.showToast({
					title: '您的强制发送次数已用完！',
					icon: 'none'
				})
			} else{
				this.setData({
					forceChat: false,
					disable: true
				})
			}
		},
		// 表情
		openEmoji() {
			if (this.data.disable) return
			this.setData({
				showEmoji: true,
				showHiddenPanel: true,
				showRecordingBtn: false
			});
		},
		selectedEmoji(e) {
			let data = e.detail
			this.setData({
				text: this.data.text + `[${data.title}]`
			})
			this.readAndWrite(this.data.text, true)
		},
		// 图片
		selectedMedia() {
			if (this.data.disable) return
			if (this.data.showHiddenPanel && this.data.showEmoji) {
				this.setData({
					showEmoji: false
				})
			} else if (this.data.showHiddenPanel && !this.data.showEmoji) {
				this.hiddenAll()
			} else {
				this.setData({
					showHiddenPanel: true,
					showEmoji: false
				})
			}
		},
		uploadImage() {
			App.globalData.appPagehiddenType = "chooseImage"
			wx.chooseImage({
				count: 6,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					res.tempFiles.forEach(file => {
						this.send('IMAGE', file)
					})
				}
			})
		},
		// 语音
		showRecording() {
			// 强制发送不允许语音
			if (this.data.forceStatus) return
			this.setData({
				showRecordingBtn: true,
				showHiddenPanel: false
			})
		},
		startRecord(e) {
			this.setData({
				showHiddenPanel: false,
				showEmoji: false,
				recording: true
			})
		},
		stopRecord(e){
			this.setData({
				recording: false
			})
			if (e.detail.data) {
				this.send('VOICE', e.detail.data)
			}
		},
		hiddenAll() {
			this.setData({
				showHiddenPanel: false,
				showEmoji: false,
				recording: false
			})
		},
		//
		showModal(data) {
			let title="发送失败！"
			let content = data
			wx.showModal({
				title,
				content,
				confirmColor: "#177ee6",
				confirmText: '知道了',
				showCancel: false,
				success (res) {
						wx.navigateBack({delta:1})
				}
			})
		},
		isPhoneX() {
			const res = wx.getSystemInfoSync()
			if (res.model.includes('iPhone X')) {
				this.setData({phoneX: true})
			}
		},
		readAndWrite(text, bool) { // 草稿
			if (!this.data.store.chatList.currentChatObj) return
			let convrId = this.data.store.chatList.currentChatObj.convrId
			if (bool) { // write
				let drafts = deepClone(this.data.store.drafts)
				drafts[convrId] = text
				this.data.store.drafts = drafts
			} else { // read
				return this.data.store.drafts[convrId] || ''
			}
		},
		inputTouch(){
			this.triggerEvent('inputTouch')
		},
		// 获取强制发送次数
		getForcedChatMsgCountToDay() {
			getForcedChatMsgCountToDay({
				appAccountId: this.userInfo.appAccountId,
				seatId: this.userInfo.seatId
			}).then(res => {
				console.log(res)
				if (res.code === 0)	App.globalData.msgCountToday = res.data.msgCountToday
			})
		},
		keyboardheightchange(event) {
			// event.detail = {height: height, duration: duration}
			this.setData({
				showHiddenPanel: false,
				showEmoji: false
			})
			if(App.globalData.systemInfo.model.includes('iPhone')) {
				this.setData({ keyboardHeight: event.detail.height })
			}
			// con
			// if App.globalData.systemInfo.mode
			//
			// this.triggerEvent('keyboardheightchange', event.detail)
		}
  }
})
