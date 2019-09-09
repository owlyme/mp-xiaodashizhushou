let url = '/mp/chatList'
export default {
	getConversationListCount: url + '/getConversationListCount', // 获取最近联系人列表统计计数(即将脱离活跃,刚刚脱离活跃,来访未发言,他人协作)
	getConversationList: url + '/getConversationList', // 获取会话列表或抢单列表
  getWillOutActiveConvListByPage: url + '/getWillOutActiveConvListByPage', // 获取即将脱离活跃的粉丝会话消息集合
  getJustNowOutActiveConvListByPage: url + '/getJustNowOutActiveConvListByPage', // 获取刚刚脱离活跃的粉丝会话消息集合
  getRecentContactsList: url + '/getRecentContactsList', // 获取最近联系人列表会话消息集合
	getCollaborativeList: url + '/getCollaborativeList', // 获取协作会话列表会话消息集合
	getVisitNoSpeakList: url + '/getVisitNoSpeakList', // 获取来访未发言列表会话消息集合
  closeConversating: url + '/closeConversating', // 关闭正在会话中中指定会话
	getScrambleOrder: url + '/getConversationList', // 获取当前坐席的抢单池
	incrUnRead: url + '/incrUnRead', // 减少未读会话条数
	clickScrambleOrder: url + '/clickScrambleOrder', // 抢单池点击抢单
	updateChatStateByType: url + '/updateChatStateByType', // 切换在线状态
	checkSeatFansBind: url + '/checkSeatFansBind', // 坐席粉丝应用号关系校验
	forcesendtext: "/mp/message/send/forcedtext",
	sendtext: "/mp/message/send/text", // 发送文本消息
	sendimage: "/mp/message/send/image", // 发送图片消息
	sendvoice: "/mp/message/send/voice", // 发送语音消息
	getChatSeatInfo: url + '/getChatSeatInfo', // 获取坐席信息
	getForcedChatMsgCountToDay: url + "/getForcedChatMsgCountToDay", // 获取强制发送次数

	getSeatList: '/mp/chat/convr/getSeatList', //	yhc
	getInteractiveStatistics: "/mp/chat/convr/getInteractiveStatistics", // 获取互动统计	yhc
	getConvMessageListByConvId: "/mp/chat/convr/getConvMessageListByConvId" // 获取指定会话消息列表	yhc

}
