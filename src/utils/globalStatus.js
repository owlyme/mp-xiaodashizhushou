import store from "../store/index";
// 在多种情况下需要初始化
function resetGlobalSatus() {
	console.info('resetGlobalSatus');
	store.resetStoreData()
	wx.setStorageSync('socket_connect_status', "disconnect")
	wx.setStorageSync('chat_page_loaded', false)
}

export default resetGlobalSatus