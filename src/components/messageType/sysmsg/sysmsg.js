
import Const from '../../../pages/chat/const'
const App = getApp()
let Tool = require('../../../utils/tool')
Component({
 options: {
  styleIsolation: 'apply-shared',
  multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
  msgData: {
   type: Object,
   value: {},
   observer: function (val) {
    let code = Const.messageKeyAndCode[val.messageBody.msgType].type
        if ((code < 199 && code >= 1) || (code < 200 && code >= 150) || (code >= 300)) {
     this.setData({
      infoType: '系统通知：'
     })
        } else if (code < 300 && code >= 250) {
					this.setData({
						infoType: '客服操作：'
					})
				}
				let contextMap = val.messageBody.contextMap || null
				if (contextMap.EVENT_LOCATION) {
					let EVENT_LOCATION_LATITUDE = contextMap.EVENT_LOCATION_LATITUDE // 地理位置纬度
      		let EVENT_LOCATION_LONGITUDE = contextMap.EVENT_LOCATION_LONGITUDE // 地理位置精度
					let nameArr = contextMap.EVENT_LOCATION.split(',')
					let simpleName = nameArr[nameArr.length - 1]
					let detailName = contextMap.EVENT_LOCATION.replace(/,/g, '')
					this.setData({
						simpleName: simpleName,
						detailName: detailName,
						latitude: EVENT_LOCATION_LATITUDE,
						longitude: EVENT_LOCATION_LONGITUDE,
						markers: [{
							latitude: EVENT_LOCATION_LATITUDE,
      				longitude: EVENT_LOCATION_LONGITUDE,
						}]
					})
				}
			}
		},
		source: { // 1: 收到的语音消息 0: 自己发送出去的语音消息
			type: Number,
			value: 0
		}
  },
  data: {
		infoType: '',
		latitude: 23.099994,
		longitude: 113.324520,
		markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
  },
 ready() {

 },
  methods: {
  	showDetail() {

		},
		goBigMap() {
			App.globalData.appPagehiddenType = "mapPage"
			wx.openLocation({
				latitude: parseFloat(this.data.latitude),
				longitude: parseFloat(this.data.longitude),
				scale: 18
			})
			// Tool.go('/pages/showmap/showmap', {
			// 	type: 'map',
			// 	latitude: this.data.latitude,
			// 	longitude: this.data.longitude,
			// 	title: this.data.simpleName,
			// 	addr: this.data.detailName
			// })
		}
  }
})