import {addTags} from "../../../utils/textHtmlChange.js"
import filters from "../../../utils/filters.js"
import {
	sendText,
	forceSendText
} from '../../../api/chatList.js'
const msgBehavior = require("../msgBehavior.js")

Component({
  options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true
	},
	behaviors: [msgBehavior],
  properties: {
		source: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
	},
	lifetimes: {
    attached() {
			this.init()
		}
  },
	ready () {
	},
  data: {
		html: '',
		sendStatus: "success", // fail: 失败
  },
  methods: {
		init() {
			let file = this.data.msgBody.file
			let userInfo = this.data.msgBody.userInfo || {}
			if (file) {
				let html = (addTags(file.text) || '').replace(/\\n/g, "<br/>")
				this.setData({
					html: html
				})
				this.info = {
					seatId: userInfo.seatId,
					appAccountId: userInfo.appAccountId,
					touser: userInfo.touser
				}
				if (this.data.msgBody.readed) return
				if (file.forceChat) {
					this.forcesendtext(file.text)
				} else {
					this.sendText(file.text)
				}
			} else {
				let html = filters.filterTextContextMap(this.data.msgBody.messageBody);
				html = (addTags(html) || '').replace(/\\n/g, "<br/>");
				this.setData({
					html: html
				})
			}
		},
		resend() {
			let file = this.data.msgBody.file
			if (file.forceChat) {
				this.forcesendtext(file.text)
			} else {
				this.sendText(file.text)
			}
		},
		sendText(data) {
			let param = {
				content: data,
				touser: this.info.touser,
				seatId: this.info.seatId,
				appAccountId: this.info.appAccountId
			}
			sendText(param).then(res => {
				this.afterSendMsg(res) // behavior
			})
		},
		forcesendtext(data) {
			let param = {
				content: data,
				touser: this.info.touser,
				seatId: this.info.seatId,
				appAccountId: this.info.appAccountId
			}
			forceSendText(param).then(res => {
				this.afterSendMsg(res)
			})
		}
  }
})
