var Service = require('../utils/request.js')
import Path from './chatPath'
// 获取最近联系人列表统计计数(即将脱离活跃,刚刚脱离活跃,来访未发言,他人协作)
export function getConversationListCount(params) {
  return Service.post(Path.getConversationListCount, params);
}
export function queryQcCloudUrlRequestName(params) {
  return Service.post('/api/wxPublicAccount/queryQcCloudUrlRequestName', params)
}
// 获取会话列表
export function getTypeOfChatList(action, params) {
  return Service.post(Path[action], params);
}

// 关闭正在会话中中指定会话
export function closeConversating(params) {
  return Service.post(Path.closeConversating, params);
}
// 获取抢单池列表
export function getScrambleOrderList(params) {
  return Service.post(Path.getConversationList, params);
}

// 减少未读会话条数
export function incrUnRead(params) {
  return Service.post(Path.incrUnRead, params);
}

// 抢单池点击抢单
export function clickScrambleOrder(params) {
  return Service.post(Path.clickScrambleOrder, params);
}

// 坐席粉丝应用号关系校验
export function checkSeatFansBind(params) {
  return Service.post(Path.checkSeatFansBind, params);
}

// 切换在线状态
export function updateChatStateByType(params) {
  return Service.post(Path.updateChatStateByType, params);
}

// 发送消息
export function forceSendText(params) {
  return Service.post(Path.forcesendtext, params);
}
// 发送消息
export function sendText(params) {
  return Service.post(Path.sendtext, params);
}
// 发送消息
export function sendImage(params) {
  return Service.post(Path.sendimage, params);
}
// 发送消息
export function sendVoice(params) {
	return Service.post(Path.sendvoice, params);
}
// 获取坐席信息
export function getChatSeatInfo(params) {
  return Service.post(Path.getChatSeatInfo, params);
}
// 获取聊天记录
export function getConvMessageListByConvId(params) {
  return Service.post(Path.getConvMessageListByConvId, params);
}

// 获取强制发送次数
export function getForcedChatMsgCountToDay(params) {
  return Service.post(Path.getForcedChatMsgCountToDay, params);
}
