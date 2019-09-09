//index.js
//获取应用实例
import filters from "../../../../utils/filters.js"
import create from '../../../../utils/omix/create'
import Const from '../../const'
let {filterContextMap} = require('../../../../utils/util')
import {addTags} from "../../../../components/messageType/text/textHtmlChange"
create({
	properties: {
		color: {
			type: String,
			value: "#409fff"
		},
		item: {
			type: Object,
			value: {
			},
			observer: function (newVal, oldVal) {
				if (this.data.store) {
					let infoContent = this.infoContent()
					this.setData({
						nodes: infoContent
					})
				}
			}
		},
		infoType: {
			type: String
		}
	},
	ready() {
		let infoContent = this.infoContent()
		this.setData({
			nodes: infoContent
		})
	},
  data: {
    nodes: ''
	},
	methods:{
    infoContent() {
			let contextMap = this.data.item.messageBody.contextMap
			let seatId = this.data.store.chatList.seatInfo.seatId
      switch (this.data.item.messageBody.msgBodyType) {
        case 'EVENT':
          switch (this.data.item.messageBody.msgType) {
						case 'ERROR_CODE':
              return '未知错误消息'
						case 'SEAT_EVENT_UPDATE_FANS_SEAT':
							if (!contextMap.SEAT_UPDATE_FANS_ORIGINAL_KF_NO) {
								return `粉丝分配给【${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NAME || ''}${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NO || ''}】`
							} else {
								return `粉丝从客服【${contextMap.SEAT_UPDATE_FANS_ORIGINAL_KF_NAME || '-'}${contextMap.SEAT_UPDATE_FANS_ORIGINAL_KF_NO || '-'}】【${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NAME || ''}${contextMap.SEAT_UPDATE_FANS_TARGET_KF_NO || ''}】`
							}
            case 'SYS_MSG_NOTICE':
            return `取消公众号`
            case 'SYS_MSG_CONVR_START':
              return `客服对话开始通知`
            case 'SYS_MSG_CONVR_END':
							return `客服对话结束通知`
						case 'WEB_EVEN_CLICK_OPEN':
              return `粉丝点击网页端<span style="color: ${this.data.color}">【${Const.platformType[contextMap.PLATFORM_TYPE]}/${contextMap.PAGE_URL}/我要开通】</span>`
            case 'WEB_EVEN_CLICK_BUY':
              return `粉丝点击网页端<span style="color: ${this.data.color}">【${Const.platformType[contextMap.PLATFORM_TYPE]}/${contextMap.PAGE_URL}/我要购买】</span>`
            case 'WEB_EVEN_CLICK_RENEW':
              return `粉丝点击网页端<span style="color: ${this.data.color}">【${Const.platformType[contextMap.PLATFORM_TYPE]}/${contextMap.PAGE_URL}/我要续费】</span>`
						case 'WX_EVENT_JUMP_URL':
              return `粉丝点击跳转网页菜单【${contextMap.EVENT_JUMP_MENU_NAME || '网页链接'}】`
            case 'WX_EVENT_JUMP_MINPROGRAM':
              return `粉丝点击跳转小程序菜单【${filterContextMap(contextMap) || '小程序'}】`
            case 'WX_ERROR_MSG':
              return `微信异常消息类型`
            case 'SYS_MSG_TEAM_ON':
              return `参与协作通知`
            case 'SYS_MSG_FANS_OFF':
              return `取消关注后聊天关闭通知`
            case 'SYS_MSG_SEAT_OFF':
              return `与坐席关系取消聊天关闭通知`
            case 'WX_EVENT_UN_SUBSCRIBE':
              return `取消关注公众号`
						case 'WX_EVENT_SUBSCRIBE':
              return `粉丝通过【${this.filterSubscribe(contextMap)}】关注公众号`
            case 'WX_EVENT_FANS_POSTER_SUBSCRIBE':
              return `粉丝扫描裂变海报【${filterContextMap(contextMap)}】关注公众号`
            case 'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE':
              return `粉丝扫描渠道二维码【${contextMap.QR_CODE_CHANNEL}】关注公众号`
            case 'WX_EVENT_OTHER_SUBSCRIBE':
              return `粉丝通过其他类型扫码关注公众号`
            case 'WX_EVEN_LOCATION':
              return `[位置]`
            case 'WX_EVEN_CLICK':
              return `粉丝点击菜单【${filterContextMap(contextMap)}】`
            case 'WX_EVEN_VIEW':
              return `粉丝点击菜单【${filterContextMap(contextMap)}】跳转链接`
            case 'WX_EVENT_CHANNEL_QR_CODE_SCAN':
              return `粉丝扫描渠道二维码【${contextMap.QR_CODE_CHANNEL}】`
            case 'WX_EVENT_FANS_POSTER_SCAN':
          return `粉丝扫描裂变海报【${filterContextMap(contextMap)}】`
            case 'SYS_EVENT_AUTOREPLY':
              return `系统自动回复内容`
            case 'WX_EVENT_SCRAMBLE_SUCCESS':
              return `客服【${contextMap.SEAT_SCRAMBLE_ORDER_SEAT_NAME}${contextMap.SEAT_SCRAMBLE_ORDER_SEAT_ID}】抢单成功`
            case 'WX_EVENT_DELETE_ASSIS_SEAT':
              if (seatId === contextMap.CONVR_CLOSE_SEAT_ID) {
                return `你关闭【${contextMap.CONVR_CLOSE_ASSIS_SEAT_NAME}】协作客服`
              } else {
                 return `客服【${contextMap.CONVR_CLOSE_SEAT_NAME}】关闭【${contextMap.CONVR_CLOSE_ASSIS_SEAT_NAME}】协作客服`
              }
            case 'SEAT_EVENT_REQ_TEAM_ON':
              if (seatId === contextMap.REQUEST_SEAT_ID) {
								let str = `你已成功请求【${contextMap.COOPERATION_KF_NAME}${contextMap.COOPERATION_SEAT_NO}】协作。`
								if(contextMap.REQUEST_COOPERATION_REASON) {
									str = str + `协作原因:${contextMap.REQUEST_COOPERATION_REASON}`
								}
								return str
              } else {
								let str = `【${contextMap.REQUEST_KF_NAME}${contextMap.REQUEST_SEAT_NO}】请求【${contextMap.COOPERATION_KF_NAME}${contextMap.COOPERATION_SEAT_NO}】协作。`
								if(contextMap.REQUEST_COOPERATION_REASON) {
									str = str + `协作原因:${contextMap.REQUEST_COOPERATION_REASON}`
								}
								return str
              }
            case 'INTELLIGENT_RECEPTION_SYSTEM_MESSAGE':
              if (contextMap.INTELLIGENT_RECEPTION_START_DATE) {
                return `智能接待开始`
              } else {
                return `智能接待结束`
              }
            case 'SEAT_EVENT_FS_MOBILE_PACKET':
              return `客服将粉丝从【${contextMap.FANS_OLD_GROUP_NAME}】移动到【${contextMap.FANS_NEW_GROUP_NAME}】`
            case 'SEAT_EVENT_SET_FANS_TAG':
              return `设置粉丝标签`
            case "WX_EVENT_SCAN_OTHER_QR":
              return `客服扫描【${contextMap.QR_CODE_OTHER}】`;
            case "WX_EVENT_SCAN_LOGIN":
              return `客服通过扫描【${contextMap.EVENT_SCAN_LOGIN_QR_CODE}】二维码登陆`;
            default:
              return ''
          }
        case 'TEXT':
          return this.textMsg()
        default:
        	return `${Const.msgBodyType[this.data.item.messageBody.msgBodyType]}`
      }
		},
		filterSubscribe(obj) {
      for (let k in obj) {
        switch (k) {
          case 'ADD_SCENE_SEARCH':
            return '搜索公众号'
          case 'ADD_SCENE_ACCOUNT_MIGRATION':
            return '公众号迁移'
          case 'ADD_SCENE_PROFILE_CARD':
            return '名片分享'
          case 'ADD_SCENE_QR_CODE':
            return '扫描二维码'
          case 'ADD_SCENE_PROFILE_LINK':
            return '图文页内名称点击'
          case 'ADD_SCENE_PROFILE_ITEM':
            return '图文页右上角菜单'
          case 'ADD_SCENE_PAID':
            return '支付后关注'
          case 'ADD_SCENE_OTHERS':
            return '其他'
          default:
            return '--'
        }
      }
		},
		textMsg() {
			let text = filters.filterTextContextMap(this.data.item.messageBody);
			text = addTags(text).replace(/\\n/g, "<br/>")
      return text
    },
	}
})
