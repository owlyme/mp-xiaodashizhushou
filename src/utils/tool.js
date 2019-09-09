const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.src = encodeURI("/image/voice/notice.mp3")
const tool = {
	// 页面路径
	path: {
		chatList: "/pages/chatList/chatList",
    company: "/pages/company/index",
    statistics: "/pages/statistics/index",
    login: "/pages/login/index",
    creat: "/pages/create/index"
	},
	// 纯文字提示信息
	showToast(title) {
		if (typeof title === 'object') title = JSON.stringify(title)
		wx.showToast({
			title: title,
			icon: 'none'
		})
	},
	// 显示模态对话框
	showModal(payload) {
		let constObj = {
			title: '',
			content: '',
			showCancel: false,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '知道了',
			confirmColor: '#177ee5',
			success (res) {
				if (res.confirm) {
				} else if (res.cancel) {
				}
			}
		}
		payload = Object.assign(constObj, payload)
		wx.showModal(payload)
	},
	// 跳转函数(只能跳转到非tabBar页面)
	go(path, query, type = 1) {
		// 判断是否跳转到当前页面，防止页面闪烁
		let route = getCurrentPages()
		let curPath = '/' + route[route.length - 1].route
		if (curPath == path) { return }
		// 解析query
		let str = '?'
		for (let k in query) {
			str += k + '=' + query[k] + '&'
		}
		str = str.slice(0, -1)

		if (type === 1) { // 保留页面记录（可以返回）
			wx.navigateTo({
				url: path + str
			})
		} else {
			wx.redirectTo({ // 关闭当前页，打开新页面（无法返回）
				url: path + str
			})
		}
	},
	deepCopy(v) { // 深拷贝数组与对象
		return JSON.parse(JSON.stringify(v))
	},
	getTopInfo: function () { // 获取状态栏及胶囊尺寸信息
		return new Promise(resolve => {
			const capsule = wx.getMenuButtonBoundingClientRect() // 胶囊信息
			// const that = this
			wx.getSystemInfo({ // 系统信息
				success: function (res) {
					const result = {
						capsule,
						systemInfo: res, // 完整的系统信息
						statusBarHeight: res.statusBarHeight, // 状态栏高度
						topHeight: capsule.height + 2 * (capsule.top - res.statusBarHeight) // 顶部高度
					}
					resolve(result)
				}
			})
		})
	},
	notifyVoice() {
		innerAudioContext.play()
	}
}

module.exports = tool