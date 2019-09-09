import shareApp from '../../utils/shareApp'
const baseUrl = '%WEBVIEW_URL%'+ "/mp"
Page({
	data: {
		src: ''
	},

	onLoad(query) {
		const {type, ...data} = query
		if (type === 'news') {
			this.mpNews(data)
		} else if (type === 'map') {
			this.qqMap(data)
		} else if (type === 'link') {
			this.linkMsg(data)
		}
	},
	onShareAppMessage: shareApp,
	h5url(url, encode){
		if (encode) {
			return baseUrl + '?url=' + encodeURIComponent(url)
		} else {
			return baseUrl + '?url=' + url
		}
	},
	mpNews(data) { // 图文
		// https://mp.weixin.qq.com/
		let url = decodeURIComponent(data.url)
		this.setData({
			src: url
		})
	},

	qqMap(data){ // 地图
		let url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${data.latitude},${data.longitude};title:${data.title};addr:${data.addr}&referer=UP4BZ-ABRCG-GO4QQ-IJEKW-CP5HV-IMFGG`;
		this.setData({
			src: this.h5url(url, true)
		})
	},

	linkMsg(data) {
		let url = decodeURIComponent(data.url)
		this.setData({
			src: this.h5url(url, true)
		})
	}
})
