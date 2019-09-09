import Const from './const'
export default {
	SET_ERR_MESSAGE(_this, payload) {
		// let messages = _this.data.store.chatList.messages
		let messages = _this.data.messages
		let index = messages.findIndex(item => {
      return item.messageBody.msgId === payload.contextMap.CONVR_MSG_ID
		})
		if (index >= 0) {
      messages[index].status = 0
      messages[index].messageBody.contextMap = payload.contextMap
		}
		_this.setData({	messages })
	},
	SET_SOCKETMSG(_this, payload) {
		let chatList = _this.data.store.chatList

		chatList.currentChatObj = payload
		if (payload.messageBody.msgType === 'WX_KF_MSG') {
			payload.source = 1
		} else {
			payload.source = 0
		}
		let messages = _this.data.messages
		let index = messages.findIndex(_item => {
      return _item.messageBody.msgId - 0 === payload.messageBody.msgId - 0
    })
    if (index >= 0) {
      messages[index] = {
        ...messages[index],
        ...payload
      }
    } else {
      messages.push(payload)
		}
		_this.setData({
			messages: messages
		})

		switch (payload.messageBody.msgType) {
			case 'WX_EVENT_UN_SUBSCRIBE':
				_this.setData({
					cancelFocus: true
				})
				break
			case 'WX_EVENT_SUBSCRIBE':
				_this.setData({
					cancelFocus: false
				})
				break;
			case 'WX_EVENT_FANS_POSTER_SUBSCRIBE':
				_this.setData({
					cancelFocus: false
				})
				break
			case 'WX_EVENT_OTHER_SUBSCRIBE':
				_this.setData({
					cancelFocus: false
				})
				break
			case 'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE':
				_this.setData({
					cancelFocus: false
				})
				break
			default:
				break
		}
		if (_this.data.scrollBottom < 600) {
			// _this.setBottom()
		}
	},
	tranformMsg(item) {
		item.messageBody = JSON.parse(item.content) || {}
		item.messageBody.msgType = Const.messageCodeAndKey[item.msgType] && Const.messageCodeAndKey[item.msgType].type
		item.bodyType = item.messageBody.msgBodyType = Const.msgBodyTypeTransfrom[item.bodyType]
		item.messageBody.createId = item.createId
		item.messageBody.createTime = item.createTime
		item.messageBody.msgId = item.id + ''
		if (item.messageBody.msgType === 'WX_KF_MSG') {
			item.source = 1
		} else {
			item.source = 0
		}
		if (item.msgType >= 100 && item.msgType < 150) {
			item.messageBody.head = item.head
			item.messageBody.name = item.name
		} else if (item.msgType >= 250 && item.msgType < 280) {
			item.messageBody.head = item.head
			item.messageBody.name = item.name
		}
		delete item.head
		delete item.msgType
		delete item.content
		delete item.id
		return item
	}
}