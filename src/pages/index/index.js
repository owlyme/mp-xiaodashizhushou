//index.js
//获取应用实例
var app = getApp()
import create from '../../utils/omix/create'
import store from '../../store/index'
import setWatcher from '../../utils/watch.js'
import shareApp from '../../utils/shareApp'
create(store, {
	data: {
		motto: 'Hello World',
		userInfo: {},
		// photo: '',
		photo: 'http://thirdwx.qlogo.cn/mmopen/5O2H0GTib03RADLWXwVE8uCVwSXtNce4p06cE2hZ0riaLThe5bLFwejbiaINzvWzZXoFsw9qgrNvwY2fNAV5gNYCVweF6hBczSQ/132'
	},
	onLoad: function () {
		setWatcher(this.store.data, this.watch)
	},
	onShareAppMessage: shareApp,
	watch: {
		logs: {
			handler(val) {
			},
			deep: true
		}
	},
	copyText: function (e) {
		var txt = e.currentTarget.dataset.text;
		wx.setClipboardData({
			data: txt,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '复制成功！',
							icon: 'success',
							duration: 1000
						})
					}
				})
			}
		})
	},
	back: function(e) { // 点击顶部返回按钮
	}
});
