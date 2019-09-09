
const msgBehavior = require("../msgBehavior.js")
Component({
	behaviors: [msgBehavior],
  properties: {
		msgBody: {
			type: Object,
			value: {
			}
		}
  },
  data: {
		type: '',
		name: "",
		title: "",
		desc: "",
		url: ""
	},
	lifetimes: {
		attached() {
			let {title, description, thumb_cloud_url} = this.data.msgBody.messageBody
			this.setData({
				title: this.switchFansNickName(title),
				desc: this.switchFansNickName(description),
				url: thumb_cloud_url ? `http://${wx.getStorageSync('urlRequestName')}${thumb_cloud_url}` : "/image/link.png"
			})
		}
	},
	methods: {
		clickTarget() {
			let url = this.data.msgBody.messageBody.url
			this.copyBtn(url)

			// wx.navigateTo({
			// 	url: '/pages/webpage/webpage?type=link&url='+ encodeURIComponent(url),  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀

			// 	success: function(){},      //成功后的回调；
			// 	fail: function(){},          //失败后的回调；
			// 	complete: function(){}      //结束后的回调(成功，失败都会执行)
			// })
		},
		switchFansNickName(str) {
      return (str || "").replace(/\$\{nickName\}/g, wx.getStorageSync('userInfo').userInfo.nickName)
		},
		copyBtn(data) {
			wx.setClipboardData({
			 //准备复制的数据
				data: data,
				success: function (res) {
					wx.hideToast()
					wx.showModal({
						title: '复制成功',
						content: "当前链接不支持在小程序端访问。链接地址已为您复制成功，请在手机端浏览器粘贴访问",
						confirmText: "知道了",
						showCancel: false
					});
				}
			});
		}
	}
})
