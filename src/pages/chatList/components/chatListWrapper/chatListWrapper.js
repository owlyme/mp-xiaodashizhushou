// pages/leftSlide/leftSlide.js
import create from '../../../../utils/omix/create'
let tool = require('../../../../utils/tool')
let {calcChatCount} = require("../../../../utils/util.js")
create({
	options: {
		styleIsolation: 'apply-shared'
	},
	properties: {
		chattingListData: {
			type: Array,
			value: []
		},
		chatListData: {
			type: Array,
			value: []
		}
	},
  data: {
		preRestitute: null
	},
	ready() {
	},
	methods: {
		chatListComponentReady() {
			this.triggerEvent('chatListComponentReady')
		},
		onClose(event) {
			const { position, instance } = event.detail;
			switch (position) {
				case 'left':
				case 'cell':
					instance.close();
					break;
				case 'right':
					this.itemDelete(event, instance)
					break;
			}
		},
		touchStart(event) {
			let { instance } = event.detail;
			if (this.data.preRestitute && instance !== this.data.preRestitute) {
				this.data.preRestitute.close()
			}
			this.setData({
				preRestitute: instance
			})
		},
		getFansDetail(e) {
			this.triggerEvent('getFansDetail', e.currentTarget.dataset.item)
		},
		getChatMessage(e) {
			this.triggerEvent('getChatMessage', e.currentTarget.dataset.item)
		},
		itemDelete: function(e, instance){  // itemDelete
			this.triggerEvent('closeConversating', {
				item: e.currentTarget.dataset.item,
				instance: instance
			})
		},
		goScramble() {
			let chatCount = calcChatCount(this.store.data.chatList, null, this.data.chattingListData, this.data.chatListData)
			tool.go('/pages/chatList/scramble/index', {
				chatCount: chatCount
			})
		}
	}
})