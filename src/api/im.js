var Service = require('../utils/request.js')
const Path = {
	getCompanyConnectConfig: '/mp/im/getCompanyConnectConfig', // 小程序获取消息设置内容
	updateConnectConfig: '/mp/im/updateConnectConfig' // socket 连接
}

// 小程序获取消息设置内容
export async function  getCompanyConnectConfig (params) {
	// status ON_LINE, // 在线 OFF_LINE; // 离开
  return Service.post(Path.getCompanyConnectConfig, params);
}

//
export async function  updateConnectConfig (params) {
	// ON_LINE, // 在线 OFF_LINE; // 离开
  return Service.post(Path.updateConnectConfig, params);
}
