const msgBehavior = require("../msgBehavior.js")
const computedBehavior = require('../../../utils/computed')
import filters from '../../../utils/filters.js'
const App = getApp()
Component({
	behaviors: [msgBehavior, computedBehavior],
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},

  properties: {
		msgBody: {
			type: Object,
			observer: function (newVal, oldVal) {
				let result = this.result(newVal)
				this.setData({
					result: result
				})
			}
		}
  },
	ready() {
	},
  methods: {
		result(val) {
      if (val.messageBody.msgBodyType === 'NEWS') {
        let obj = val.messageBody.list[0]
        return {
          picurl : filters.urlFilter(obj.picurl),
          title : obj.title,
          description: obj.description,
          url: obj.url
        }
      } else {
				let data = val.messageBody
        return {
          picurl : filters.urlFilter(data.thumb_cloud_url || data.url),
          title : data.title,
          description: data.description,
          url: data.content_source_url
        }
      }
    },
		towebview() {
			App.globalData.appPagehiddenType = "newsPage"
			let url = this.data.result.url

			wx.navigateTo({
				url: '/pages/webpage/webpage?type=news&url='+ encodeURIComponent(url),  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀

				success: function(){},      //成功后的回调；
				fail: function(){},          //失败后的回调；
				complete: function(){}      //结束后的回调(成功，失败都会执行)
			})
		}
  }
})
