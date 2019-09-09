
const App = getApp()

module.exports = Behavior({
	properties: {
		msgBody: {
			type: Object,
			value: {
				bodyType: "",
				source: 1, // 1: 收到的语音消息 0: 自己发送出去的语音消息
				file: null,
				messageBody: {
					"className": null,
					"msgId": null,
					"name": null,
					"head": null,
					"msgType": null,
					"msgTypeCode": null,
					"createTime": null,
					"createId": null,
					"status": null,
					"content": null,
					"contextMap": {},
				}
			}
		}
	},
	data: {
		imageAndVideoList: []
	},
  methods: {
		afterSendMsg(res) {
			if(res.code === 1) {
				this.setData({
					sendStatus: "success"
				})
				this.sendMsgSuccess(res)
			} else {

				this.setData({
					sendStatus: "fail"
				})
				this.sendMsgFail(res)
			}
		},
		sendMsgSuccess(res) {
			let sendingMessages = App.globalData.store.data.sendingMessages
			let currentMsg = sendingMessages[this.data.msgBody.uuid] || {}
			currentMsg.messageBody.msgId = res.data.msgid
			currentMsg.messageBody.createTime = res.data.createTime

			App.globalData.store.data.seatContinueSpeakCount = res.data.seatContinueSpeakCount
		},
		sendMsgFail(res) {
			App.globalData.store.data.sendedMsg = {
				status: 'fail',
				msg: res.message
			}
		},
		addPreviewImageAndVideo(url) {
			if (url) {
				const imageAndVideoList = App.globalData.imageAndVideoList
				imageAndVideoList.push(url)
				this.setData({
					imageAndVideoList
				})
			}
		},
		popoverFn() {
			this.touched
			if (!this.touched) {
				this.createSelectorQuery().select('#a'+ this.data.msgBody.messageBody.msgId).boundingClientRect(rect => {
					this.triggerEvent('popoverEvent', {rect : {...rect, errmsg: this.data.msgBody.messageBody.contextMap}})
				}).exec()
				this.touched = true
			} else {
				this.touched = false
				this.triggerEvent('popoverEvent', {rect: 'hidden'})
			}
		}
  }
})