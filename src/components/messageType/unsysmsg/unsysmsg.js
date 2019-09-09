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
				status: 1,
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
			},
			observer(nv) {
				this.setData({
					headUrl: this.filterUrl(nv.messageBody.head)
				})
			}
		},
		type: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
	},
	data: {
		headUrl: ''
	},
	ready() {

	},
  methods: {
		filterUrl(src) {
			if (src) { // 腾讯云地址
				if (/^http/.test(src)) {
					return src.replace('http://', 'https://')
				} else if (src.includes('myqcloud.com')) {
					return 'https://' + src
				} else if (src.indexOf('/') === 0) {
					return `http://${wx.getStorageSync('urlRequestName')}${src}`
				}
			} else {
				return src || ""
			}
		},
		imageloadedEvent(e) {
			this.triggerEvent("imageloadedEvent")
		},
		popoverEvent(e) {
			this.triggerEvent("popoverEvent", e.detail)
		},
		touchAvatar() {
			if (this.data.msgData.source) {
				this.triggerEvent("touchAvatar")
			}
		}
  }
})
