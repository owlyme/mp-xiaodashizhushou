const baseUrl = "%API_PATH%"
// const baseUrl = "http://192.168.0.26:8091"
import tool from './tool.js'
import globalReset from './globalStatus'
import { queryToString } from './util.js'
let md5 = require('./md5')


// http数据拦截
function afterHttp (url, res) {
	if (!res) { return }
	const noToLogin = [
		'/mp/im/updateConnectConfig',
		'/mp/xds/mp/login/getSession'
	]
	if (res.code == 200) {
		res.message = '当前账号已在其他设备登录或账号信息已失效'
		if (noToLogin.indexOf(url) == -1) {
			globalReset()
			tool.go(tool.path.login)
		}
	} else if (res.code == 4303 || res.code === 5022 || res.code === 5001) {
		res.message = '你当前的客服权限被禁用或停用或没有客服权限'
	}
}

function post (url, data) {
	for(let k in data) {
		if (data[k] === null) {
			delete data[k]
		}
	}
  return new Promise(reslove => {
		let paramsData = {
			sessionId: wx.getStorageSync('sessionId'),
			...data
		}
		paramsData.carry = md5.hexMD5(queryToString(paramsData) + 'mal#b@fI')
    wx.request( {
      url: baseUrl + url,
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: paramsData,
			fail: res => {
			},
      complete:  res => {
				afterHttp(url, res.data)
				reslove(res.data, res)
      }
    })
  })
}

function get (url, data) {
	for(let k in data) {
		if (data[k] === null) {
			delete data[k]
		}
	}
	return new Promise((reslove) => {
		let paramsData = {
			sessionId: wx.getStorageSync('sessionId'),
			...data
		}
		paramsData.carry = md5.hexMD5(queryToString(paramsData) + 'mal#b@fI')
	  wx.request( {
			url: baseUrl + url,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "GET",
			data: paramsData,
			complete: res => {
				afterHttp(url, res.data)
        reslove(res.data, res)
			}
	  })
	})
}

module.exports = {
	post: post,
	get: get
}
