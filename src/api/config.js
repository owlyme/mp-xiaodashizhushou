import publicPath from './publicPath'
var Service = require('../utils/request.js')
const Path = {
 getMyNotificationConfigInfo: '/mp/tconfig/getMyNotificationConfigInfo', // 小程序获取消息设置内容
 updateMyNotificationConfig: '/mp/tconfig/updateMyNotificationConfig', // 小程序更新设置内容
 getCorpItemValueByCorpSystem: '/mp/tconfig/getCorpItemValueByCorpSystem' // 获取企业端会话设置内容
}
// 小程序获取消息设置内容
export function getMyNotificationConfigInfo(params) {
  return Service.post(Path.getMyNotificationConfigInfo, params);
}
// 小程序更新设置内容
export function updateMyNotificationConfig(params) {
  return Service.post(Path.updateMyNotificationConfig, params);
}
// 获取企业端会话设置内容
export function getCorpItemValueByCorpSystem(params) {
  return Service.post(Path.getCorpItemValueByCorpSystem, params);
}


export function getValueByKey(params) {
  return Service.post(publicPath.dictByKey, params);
}