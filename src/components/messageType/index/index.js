/**消息类型匹配
 *  1: 'TEXT',
    2: 'IMAGE',
    3: 'VOICE',
    4: 'VIDEO',
    5: 'TEXT',
    6: 'NEWS',
    7: 'MPNEWS',
    8: 'LINK',
    9: 'TEMPLATE',
    50: 'EVENT'
 */
Component({
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
		msgData: {
			type: Object,
			value: {
				bodyType: "",
				source: 1, // 1: 收到的语音消息 0: 自己发送出去的语音消息
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
		},
		type: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
  },
	ready() {
		this.pageReady()
	},
  methods: {
		pageReady() {
			this.triggerEvent('msgComponentReady')
		},
		touchAvatar() {
			if (this.data.msgData.source) {
				this.triggerEvent("touchAvatar")
			}
		},
		popoverEvent(e){
			this.triggerEvent("popoverEvent", e.detail)
		}
  }
})
