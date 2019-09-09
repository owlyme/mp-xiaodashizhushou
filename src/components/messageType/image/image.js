import Uploader from '../../../utils/upload.js'
import filters from '../../../utils/filters.js'
import {
 sendImage
} from '../../../api/chatList.js'
const msgBehavior = require("../msgBehavior.js")
const App = getApp()
Component({
	behaviors: [msgBehavior],
 options: {
  styleIsolation: 'apply-shared',
  multipleSlots: true
  },
  properties: {
  msgBody: {
   type: Object,
   value: {
    bodyType: "TEXT",
    source: 1, // 1: 收到的语音消息 0: 自己发送出去的语音消息
    file: null,
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
  },
  source: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
   type: Number,
   value: 0
  }
  },
  data: {
		width: 300 / 1.656,
		height: 420 / 1.656,
		loaded: false,
		src: '',
		uploadStatus: "end", // end: 上传结束， begin： 上传开始 ， fail: 上传失败
 },
 lifetimes: {
	attached() {
		this.init()
	}
},
 ready () {
	this.addPreviewImageAndVideo(filters.urlFilter(this.data.src))
 },
  methods: {
		init() {
			let file = this.data.msgBody.file
			let userInfo = this.data.msgBody.userInfo || {}
			if (file) {
				this.info = {
					seatId: userInfo.seatId,
					appAccountId: userInfo.appAccountId,
					touser: userInfo.touser
				}
				this.setData({
					src: file.path
				})
				if (this.data.msgBody.readed) return
				this.setData({
					uploadStatus: "begin"
				})
				this.uploadImage(file)
			} else {
				let url = this.data.msgBody.messageBody.media_cloud_url
				this.setData({
					src:  filters.urlFilter(url)
				})
			}
		},
		binderror(event) {

		},
		resend() {
			let file = this.data.msgBody.file
			this.setData({
				uploadStatus: "begin"
			})
			this.uploadImage(file)
		},
		imageload(e){
			// width: 672px;
			// height: 420px;
			let width = e.detail.width;
			let height = e.detail.height;
			let WIDTH = 672
			let HEIGHT = 420

			if (width <= WIDTH && height <= HEIGHT) {
				WIDTH = width * 1.656
				if (WIDTH > 672) WIDTH = 672
				HEIGHT = height * 1.656
				if (HEIGHT > 672) HEIGHT = 420
			} else if (WIDTH / HEIGHT < width / height ) {
				WIDTH = 672
				HEIGHT = height * WIDTH / width
			} else if (WIDTH / HEIGHT > width / height) {
				WIDTH = width * HEIGHT / height
				HEIGHT = 420
			}
			// 1.656  =》  viewportWidth: 165.6,
			this.setData({
				width: WIDTH / 1.656,
				height: HEIGHT / 1.656,
				loaded: true
			})
			this.imageloadedEvent()
		},
		preview(e) {
			App.globalData.appPagehiddenType = "previewImage"
			wx.previewImage({
				current: e.currentTarget.dataset.src, // 当前显示图片的http链接
				urls: App.globalData.imageAndVideoList, // 需要预览的图片http链接列表
				complete: (res) => {
				}
			})
		},
		uploadImage(file) {
			this.uploader = new Uploader({
				onSuccess: (res) => {
				this.setData({
					uploadStatus: "end"
				})
				this.sendImage(res)
				},
				uploadFail: (res) => {
				this.setData({
					uploadStatus: "fail"
				})
				this.data.msgBody.messageBody.contextMap = {CONVR_ERR_MSG: '上传失败！'}
				}
			})

			this.uploader.uploadCloud({
				filePath: file.path,
				cloudToken: {
				params: {
					seatId: this.info.seatId,
					type: "image",
					size: file.size,
					busiType: 2, // 1:微信永久素材 2微信临时素材 3:公众号文件 4：聊天文件
					appAccountId: this.info.appAccountId
				}
				}
			})
		},
			sendImage(data) {
				let param = {
					mediaId: data.mediaId,
					media_cloud_url: data.cloudUrl,
					touser: this.info.touser,
					seatId: this.info.seatId,
					appAccountId: this.info.appAccountId
				}
				sendImage(param).then(res => {
					this.afterSendMsg(res)
				})
			},
			imageloadedEvent() {
				if (this.data.src.includes('https://')) this.triggerEvent("imageloadedEvent")
			}
		}
})