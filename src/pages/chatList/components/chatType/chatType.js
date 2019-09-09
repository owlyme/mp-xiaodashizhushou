import Const from '../../const'
import tool from '../../../../utils/tool'
import create from '../../../../utils/omix/create'
let {debounce} = require('../../../../utils/util')
create({
	options: {
		styleIsolation: 'apply-shared'
	},
	properties: {
		activeType: {
			type: String,
			value: "chattingList",
			observer: function (newVal) {
				this.triggerEvent('watchChatType', newVal)
			}
		},
		type: {
			type: Object,
			value: {
				count: 0,
				type: "recentContacts",
				name: "最近联系人"
			}
		},
		chatTypeList: {
			type: Array,
			value: [],
			observer: function () {
				if (this.data.continuousSheet) {
					this.showChatTypeList()
				}
			}
		},
		watchChatTypeStatu: {
			type: Number,
			value: 1
		}
	},
	data: {
		continuousSheet: false, // 获取会话类型的数量是并发的 需要实时更新最新的数量
		topHeight: 44,
		statusBarHeight: null
	},
	ready() {
		tool.getTopInfo().then(res => { // 获取系统信息及胶囊位置信息
			{
				this.setData({
					// systemInfo: res.systemInfo,
					statusBarHeight: res.statusBarHeight,
					topHeight: res.topHeight
				})
			}
		})
	},
	methods: {
		changeChatType(e) {
			wx.showLoading({
				title: '加载中'
			});
			// this.data.store.chatList.chatListData = []
			this.triggerEvent('changeChatType', e.currentTarget.dataset.chattype)
		},
		showChatTypeList: debounce(function() {
			wx.showActionSheet({
				itemList: this.data.chatTypeList,
				success: (e) => {
					let typeObj = Const.chatTypeActionSheet[e.tapIndex]
					if (typeObj.type !== this.data.activeType) {
						wx.showLoading({
							title: '加载中'
						});
						this.triggerEvent('changeChatType', typeObj.type)
						this.triggerEvent('changeActiveLabelType', typeObj)
					}
				},
				complete: () => {
					this.setData({
						continuousSheet: false
					})
				}
			})
		}, 100),
		toggleChatType() {
			// if (this.data.watchChatTypeStatu === 2) {
			// 	return
			// }
			if (this.data.activeType === 'chattingList') {
				wx.showLoading({
					title: '加载中'
				});
				// this.data.store.chatList.chatListData = []
				this.triggerEvent('changeChatType', this.data.type.type)
			} else {
				if (this.data.continuousSheet || this.data.watchChatTypeStatu === 2) {
					return
				}
				this.setData({
					continuousSheet: true
				})
				this.triggerEvent('getConversationListCount')
				this.showChatTypeList()
			}
		}
	}
})