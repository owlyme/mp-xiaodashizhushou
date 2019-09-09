export default function (res) {
	if (res.from === 'button') {
		// 来自页面内转发按钮
		console.log(res.target)
	}
	return {
		title: '我正在使用销大师与粉丝互动',
		imageUrl: 'https://xds-10-1-1255528578.file.myqcloud.com/static/mp/share.png',
		path: '/pages/chatList/chatList'
	}
}
