
let Tool = require('../../../utils/tool')
const msgBehavior = require("../msgBehavior.js")
import filters from '../../../utils/filters.js'
const App = getApp()
Component({
	behaviors: [msgBehavior],
  properties: {
		msgBody: {
			type: Object,
			value: {
				title: "demo",
				src: "https://xds-10-2-1255528578.file.myqcloud.com/video/media/1/1-1-4c3b3d86d450c8962cf17b173b3f0a06.mp4"
			}
		},
		source: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
  },
  data: {
		loaded: false,
		src: '',
		title: '',
		fullScreen: true
	},
	lifetimes: {
    attached() {
			this.videoContext = wx.createVideoContext(`A${this.data.msgBody.messageBody.msgId}`)
			this.init()
		}
	},
	pageLifetimes: {
    show: function() {
			this.videoContext && this.videoContext.pause();
    }
  },
  methods: {
		init(){
			let file = this.file = this.data.msgBody.file
			if (file) {

			} else {
				this.setData({
					title: '',
					src: filters.urlFilter(this.data.msgBody.messageBody.media_cloud_url)
				})
				this.addPreviewImageAndVideo(this.data.src)
			}
		},
		progress(e) {
		},
		noVideoPlay() {
			Tool.showToast('视频审核通过后才可播放')
		},
		videoPlay: function (e) {
			// let videoContext = wx.createVideoContext(`A${this.data.msgBody.messageBody.msgId}`, this);
			// videoContext.requestFullScreen({direction: 0});
			// videoContext.play()
			// this.setData({
			// 	fullScreen:true
			// })
			App.globalData.appPagehiddenType = "vidoePage"
			wx.navigateTo({
				url: '/pages/previewImgVideo/previewImgVideo?src=' + this.data.src,
			})
		},
  }
})
