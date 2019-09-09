const url = '/mp'
export default {
	statistics: url + '/xds/mp/login/getRepSeatConvrStatistics', // 统计数据

	bindSession: url + '/xds/mp/login/updateBindSession', // 绑定用户sessionId
  updateSession: url + '/xds/mp/login/updateUserDataInfo', // 更新用户信息与session信息
  getMobile: url + '/xds/mp/login/getUserMobile', // 解析用户手机号
  getCompanys: url + '/xds/mp/login/getUserCorpAuthMulti', // 获取用户公司列表
  createCompany: url + '/xds/mp/login/saveCorpCreateForFreeOrder', // 创建免费企业
  enterCompany: url + '/xds/mp/login/saveLoginCorpIdBySession', // 进入公司
  getSession: url + '/xds/mp/login/getSession', // 验证session有效性
  logoutSession: url + '/xds/mp/login/logoutBySession', // 企业列表解绑session
  getPublicList: url + '/xds/mp/login/getPublicAccountList', // 获取公众号列表
}