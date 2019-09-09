import tool from '../utils/tool'
let events = {}
let initStoreData = {
	logs: [],
	chatList: {
		chatType: 'chattingList', // 正在会话类型
		activeLabelType: {
			count: 0,
			type: "recentContacts",
			name: "最近联系人"
		},
		chatTypeList:[
			'最近联系人(0)',
			'即将脱离活跃(0)',
			'刚刚脱离活跃(0)',
			'来访未发言(0)',
			'他人协作(0)'
		],
		seatInfo: {},
		currentChatObj: {},
		scrambleTotal: 0,
		chatCount: 0, // 聊天数量
		offset: 0, // 列表偏移量
		limit: 20, // 会话列表长度
		chatListData: [], // 会话列表数据
		chattingListData: [], // 正在会话中列表
		scramble: [], // 抢单池数据
		messages: [],
		watchChatTypeStatu: 1 // 切换会话类型的状态 1为成功 2为切换中
	},
	drafts: {}, // 草稿
	sendingMessages: {}, // map
	seatContinueSpeakCount: 0,
	sendedMsg: {
		status: 0,
		code: "",
		msg: ''
	}
}

let copyInitStoreData = tool.deepCopy(initStoreData)
export default {
  data: {
		...copyInitStoreData
	},
	onChange: function(val) {
		this.watch(val)
	},
	watch(data) {
		Object.entries(data).forEach((arr) => {
			if (events[arr[0]]) events[arr[0]](arr[1])
		})
	},
	on(arg){
		events = {...events, ...arg}
	},
	off(type) {

	},
	resetStoreData() {
		let clone = tool.deepCopy(initStoreData)
		Object.keys(clone).forEach(key => {
			this.data[key] = clone[key]
		})

	}
}