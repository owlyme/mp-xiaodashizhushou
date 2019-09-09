//index.js
//获取应用实例
import create from '../../../utils/omix/create'
import shareApp from '../../../utils/shareApp'
import store from '../../../store/index'
import Actions from '../action'
create(store, {
	data: {
		loadingStatuScramble: 1,
		clickLoadstatu: 1,
		chatCount: 0
	},
	grabScramble(e) {
		let item = e.currentTarget.dataset.item
		Actions.clickScrambleOrder(this, item)
	},
	onShareAppMessage: shareApp,
	onShow() {
		this.setData({
			chatCount: this.options.chatCount
		})
		wx.setStorageSync('scramble_page_loaded', true)
		this.store.data.chatList.scramble = []
		this.setData({
			loadingStatuScramble: 1
		})
		Actions.getScrambleOrderList(this)
	},
	onPullDownRefresh() {
		Actions.getScrambleOrderList(this)
  },
});
