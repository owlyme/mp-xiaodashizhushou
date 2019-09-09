/**语音消息
 * 时长 < 60s
 * 体积 < 2m 2048KB 2097152B
 */
import Uploader from '../../../utils/upload.js'
import filters from '../../../utils/filters.js'
import innerAudioContext from '../../../utils/innerAudioContext.js'
import {
	sendVoice
} from '../../../api/chatList.js'
const msgBehavior = require("../msgBehavior.js")

const App = getApp()
Component({
	behaviors: [msgBehavior],
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
		source: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
  },
  data: {
		maxSize: 2097152,
		uploadStatus: "end", // end: 上传结束， begin： 上传开始 ， fail: 上传失败
		size: 100000,
		duration: 0,
		tempFilePath: '',
		voiceFont: 'iconyuyin2',
		palying: false, // true正在播放 false停止
		precent: 10
	},
	lifetimes: {
    attached() {
			this.init()
		}
  },
	ready() {

	},
  methods: {
		init(){
			innerAudioContext.onPlay(() => {
				if (App.globalData.voicePath === this.data.tempFilePath && this.data.tempFilePath) {
					this.switchVoiceFont()
					this.setData({
						palying: true
					})
				}
			})
			innerAudioContext.onStop(() => {
				this.setData({
					palying: false,
					voiceFont: 'iconyuyin2'
				})
				clearInterval(this.timer)
			})
			innerAudioContext.onEnded(() => {
				this.setData({
					palying: false,
					voiceFont: 'iconyuyin2'
				})
				clearInterval(this.timer)
			})
			innerAudioContext.onError((res) => {
				wx.showToast({
					title: res,
					icon: "none"
				})
			})
			let file = this.file = this.data.msgBody.file
			let userInfo = this.data.msgBody.userInfo || {}
			console.log('file', file)

			if (file) {
				this.info = {
					seatId: userInfo.seatId,
					appAccountId: userInfo.appAccountId,
					touser: userInfo.touser
				}

				this.setData({
					uploadStatus: "begin",
					size: file.fileSize,
					duration: parseInt(file.duration /1000),
					tempFilePath: file.tempFilePath,
					precent: parseInt(file.duration /1000) / 59
				})
				if (this.data.msgBody.readed) return
				this.uploadVoice(file)
			} else {
				console.log(filters.urlFilter(this.data.msgBody.messageBody.media_cloud_url))
				this.setData({
					size: 22,
					duration: parseInt(this.data.msgBody.messageBody.timeLength /1000),
					tempFilePath: filters.urlFilter(this.data.msgBody.messageBody.media_cloud_url)
				})
			}
		},
		resend() {
			let file = this.data.msgBody.file
			this.setData({
				uploadStatus: "begin"
			})
			this.uploadVoice(file)
		},
		async playVoice(e) {
			if (!this.data.palying) {
				App.globalData.voicePath = this.data.tempFilePath
				await this.stopPlay()
				if (this.data.tempFilePath) {
					innerAudioContext.src = this.data.tempFilePath
					innerAudioContext.play()
				} else {
					wx.showToast({
						title: '资源路径丢失！',
						icon: "none"
					})
				}
			} else {
				await this.stopPlay()
			}
		},
		async stopPlay() {
			innerAudioContext.stop()
			return new Promise(resolve => {
				setTimeout(() => {
					resolve()
				}, 300);
			})
		},
		uploadVoice(file) {
			this.uploader = new Uploader({
				onSuccess: (res) => {
					this.setData({
						uploadStatus: "end"
					})
					this.sendVoice(res, file)
				},
				uploadFail: (res) => {
					this.setData({
						uploadStatus: "fail"
					})
					this.data.msgBody.messageBody.contextMap = {CONVR_ERR_MSG: '上传失败！'}
				}
			})

			this.uploader.uploadCloud({
				filePath: file.tempFilePath,
				timeLength: file.duration,
				cloudToken: {
					params: {
						seatId: this.info.seatId,
						type: "voice",
						size: file.fileSize,
						busiType: 2, // 1:微信永久素材 2微信临时素材 3:公众号文件 4：聊天文件
						appAccountId: this.info.appAccountId
					}
				}
			})
		},
		sendVoice(data, file) {
			let param = {
				mediaId: data.mediaId,
				media_cloud_url: data.cloudUrl,
				touser: this.info.touser,
				seatId: this.info.seatId,
				appAccountId: this.info.appAccountId,
				timeLength: parseInt(file.duration),
				size: file.fileSize
			}
			// console.log('voice', param)
			sendVoice(param).then(res => {
				this.afterSendMsg(res)
			})
		},
		switchVoiceFont() {
			/* <!-- iconyuyin1 iconyuyin3 iconyuyin2 --> */
			this.timer = setInterval(() => {
				this.setData({
					voiceFont: this.data.voiceFont === "iconyuyin2" ? 'iconyuyin1' :
											this.data.voiceFont === "iconyuyin1" ? 'iconyuyin3' : 'iconyuyin2'
				})
			}, 300)
		}
  }
})
