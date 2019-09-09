import {tempAddTags} from "../../../utils/textHtmlChange.js"
const msgBehavior = require("../msgBehavior.js")
Component({
	behaviors: [msgBehavior],
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
		msgBody: {
			type: Object,
			value: {
				bodyType: "TEMPLATE",
				source: 1, // 1: 收到的语音消息 0: 自己发送出去的语音消息
				messageBody: {
					"className": "com.xkco.xkdata.commons.support.msg.body.event.EventBody",
					"msgId": "304",
					"name": null,
					"head": null,
					"msgType": "WX_EVENT_DELETE_ASSIS_SEAT",
					"msgTypeCode": null,
					"createTime": 1559801556563,
					"createId": "3",
					"status": null,
					"content": "",
					"contextMap": {
					 "CONVR_CLOSE_SEAT_NAME": "HappyZX002",
					 "CONVR_CLOSE_SEAT_ID": 3,
					 "CONVR_CLOSE_ASSIS_SEAT_NAME": "秀秀ZX004",
					 "CONVR_CLOSE_ASSIS_SEAT_ID": 5
					},
				}
			}
		}
  },
	data: {
		title: "",
		createTime: "",
		name: "迎客通",
		nodes: ''
	},
	ready() {
		let file = this.file = this.data.msgBody.file
		if (file) {

		} else {
			let body = this.data.msgBody.messageBody || {}
			this.setData({
				title: body.title,
				createTime: body.createTime,
				nodes: this.formatCont(body.contextMap.TEMPLATE_CONTENT, body.templateData),
				name: body.name
			})
		}
	},
  methods: {
		formatCont(cont, list) {
			cont = (cont || "").replace(/\n/g, "<br/>") || ''
			let newCont = cont.replace(/{{.+?}}/g, function(txt) {
				let value
				list.forEach(item => {
					item.value = tempAddTags(item.value)
					if (txt.includes(item.name)) {
						value = item.value
							? `<span style="color:${item.color}">${item.value}</span>`
							: ""
					}
				})
				return value
			})
			// 对内容头无内容移除换行
			newCont = (newCont || '').replace(/^(<br\/>)+/, "")
			return newCont
		}
  }
})
