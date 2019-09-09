import API from '../api/cloudUpload.js'
import { queryToString } from './util.js'
let md5 = require('./md5')
const COS = require('./cos-wx-sdk-v5')
const baseUrl = "%API_PATH%"
var Bucket = '%CLOUD_BUCKET%';
var Region = '%CLOUD_REGION%';


class Uploader {
	constructor(arg) {
		this.cos = null
		this.auto = true
		this.filePath = ''
		this.fileName = ''
		this.cloudUrl = ''
		this.timeLength = null
		this.seqTokenId = 0
		this.cloudToken = {}
		this.tokenData = {}
		this.queryMediaExitedTime = 3
		this.uploadFail = arg.uploadFail || (() => {})
		this.onProgress = arg.onProgress || (() => {})
		this.onSuccess = arg.onSuccess || (() => {})
	}
	async getCloudToken(cloudToken) {
		return new Promise(resolve => {
			//
			let paramsData = Object.assign({}, {
				seatId: null,
				type: "image",
				size: null,
				busiType: 2,  // 1:微信永久素材 2微信临时素材 3:公众号文件 4：聊天文件
				appAccountId: 0,
				sessionId: wx.getStorageSync('sessionId')
			}, cloudToken.params);
			paramsData.carry = md5.hexMD5(queryToString(paramsData) + 'mal#b@fI')
			wx.request({
				url: baseUrl + (cloudToken.url || API.updateGetCloudToken), // 步骤二提供的签名接口
				data: paramsData,
				method: "POST",
				dataType: 'text',
				success:(result) => {
					var data = JSON.parse(result.data).data //result.data;
					this.tokenData = data
					resolve(data)
				},
				fail (err) { // 获取token 错误
					self.uploadFail({err:err, step: 1 })
				}
		});
		})
	}
	// 初始化实例
	initCos (cloudToken) {
		const self = this
		this.cos = new COS({
			getAuthorization(options, callback) {
					callback({
						TmpSecretId: self.tokenData.tmpSecretId,
						TmpSecretKey: self.tokenData.tmpSecretKey,
						XCosSecurityToken: self.tokenData.sessionToken,
						ExpiredTime: self.tokenData.expiredTime
					})
				}
		})
	}
	// 上传云
	async uploadCloud ({cloudToken, filePath, fileName, timeLength}) {
		this.filePath = filePath || ''

		this.cloudToken = cloudToken
		this.timeLength = timeLength
		await this.getCloudToken(this.cloudToken)

		var _fileType =  this.filePath.substr(this.filePath.lastIndexOf('.'));
		this.fileName = this.tokenData.fileName + _fileType
		this.seqTokenId = this.tokenData.seqTokenId

		this.initCos(this.cloudToken)

		return new Promise((resolve, reject) => {
			this.cos.postObject({
					Bucket: Bucket,
					Region: Region,
					Key: (this.tokenData.filePath + this.tokenData.fileName + _fileType).replace(/^\//, ''),
					FilePath: filePath,
					onProgress: (info) => {
						this.onProgress(info)
					}
			},(err, data) => {
				if(data) {
					this.cloudUrl = data.Location
				}
				if (this.auto) {
					this.uploadToNode()
				} else {
					resolve(err || data)
				}
			});
		})
	}

	//  上传node --> 上传微信
	uploadToNode() {

		let filePath = this.filePath
		let param = {
			seqTokenId: this.seqTokenId,
			title: this.fileName,
			sessionId: wx.getStorageSync('sessionId'),
			appAccountId: this.cloudToken.params.appAccountId,
			cloudUrl: this.cloudUrl,
			metarialType: this.cloudToken.params.type,
		}
		// if (param.metarialType=== 'voice'){
		// 	param.timeLength = this.timeLength
		// }

		return new Promise(resolve => {
			wx.uploadFile({
				url: baseUrl + API.syncSaveMedia, //仅为示例，非真实的接口地址
				filePath: filePath,
				name: 'file',
				formData: param,
				success:(res) => {
					resolve(res)
					let data = JSON.parse(res.data)
					this.queryMediaExited(data)
				},
				fail: (err) => {
					this.uploadFail({err:err, step: 2 })
				}
			})
		})
	}

	queryMediaExited(data) {
		let cloudUrl = this.changeCloudUrlToCDN()
    let paramsData = {
      mediaId: data.mediaId,
      type: this.cloudToken.params.type,
      appAccountId: this.cloudToken.params.appAccountId,
      busiType: this.cloudToken.params.busiType,
      sessionId: wx.getStorageSync('sessionId')
		}
		paramsData.carry = md5.hexMD5(queryToString(paramsData) + 'mal#b@fI')
		wx.request({
			url: baseUrl + API.queryMediaExited,
			data: paramsData,
			method: "POST",
			success: (res) => {
				if (res.data.code === 1 && res.data.data) {
					this.onSuccess({ ...paramsData, ...res.data, cloudUrl})
				} else {
					if (this.queryMediaExitedTime) {
						setTimeout(() => {
							this.queryMediaExited(data)
						}, 3000)
						this.queryMediaExitedTime--
					} else {
						this.queryMediaExitedTime = 2
						this.uploadFail({ ...paramsData, ...res.data, cloudUrl, step: 4 })
					}
				}
			},
			fail: (err) => { // 获取token 错误
				this.uploadFail({...err, step: 4})
			}
		});
	}

	changeCloudUrlToCDN() { // 将云保存地址切换成cdn
		let cdn = wx.getStorageSync('urlRequestName')
		if (cdn) {
			return this.cloudUrl.replace(/^.+myqcloud\.com/, cdn)
		}
		return this.cloudUrl
	}
}

// module.exports = new Uploader()
module.exports = Uploader
