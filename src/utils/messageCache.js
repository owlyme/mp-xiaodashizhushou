// app = getApp()
export function setFansInfo(app, convrId, fansInfo) {
	app.globalData.messageCache[`fans-${convrId}`] = fansInfo
}

export function getFansInfo(app, convrId) {
	return app.globalData.messageCache[`fans-${convrId}`] || {fansId: null}
}

export function getLast20(app, convrId, currentMsg, historyMsg) {
		// 当从chat 页面离开时，保存当前聊天记录的后20条， 可以小于20
		let currentMsgs = currentMsg
		let cacheMsgs = currentMsgs.slice(0, 20)
		if (cacheMsgs.length < 20) {
			let historyMsgs = historyMsg.slice(0, 20 - cacheMsgs.length)
			cacheMsgs = cacheMsgs.concat(historyMsgs)
		}
		app.globalData.messageCache[convrId] = cacheMsgs || []
}

export function addReciveMsgToCache(app, newMsg) {
	// 在chatlist页面时, 收到消息后，应该向messageCache 追加一条消息
	if (app.globalData.messageCache[newMsg.convrId] && !wx.getStorageSync('chat_page_loaded')) {
		if (newMsg.messageBody.msgType === 'WX_KF_MSG') {
			newMsg.source = 1
		} else {
			newMsg.source = 0
		}
		app.globalData.messageCache[newMsg.convrId].unshift(newMsg)
		console.log(app.globalData.messageCache[newMsg.convrId])
	}
}

export function addSendMsgToStore (store, sendMsgs) {
	// 从chat页面离开时，若当前聊天内容最后一条为坐席发送的消息则保存到对应的
	// store.chatList.chatListData
	console.log(store, sendMsgs)
	let last = sendMsgs.length > 0 ? sendMsgs[sendMsgs.length - 1] : null
	if (last && last.file) {
		let current = store.data.chatList.currentChatObj
		current.messageBody = {
			...current.messageBody,
			// msgType: 'SEAT_WECHAT_KF_MSG',
			createTime: last.messageBody.createTime,
			content: last.file.text,
			msgBodyType: last.messageBody.msgBodyType
		}
	}
}
