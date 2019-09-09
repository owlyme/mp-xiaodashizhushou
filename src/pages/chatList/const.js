
export default {
	conversationListType: {
    CONV_ING_LIST: 'chattingList', // 正在会话中
    CONV_RECENT_CONTACTS_LIST: 'recentContacts', // 最近联系人
    CONV_VISIT_UNSPEAK_LIST: 'visitNoSpeech', // 来访未发言
    CONV_ASSIST_LIST: 'othersCooperate', // 他人协作
    CONV_QDC_LIST: 'scramble' // 抢单池
	},
	msgBodyType: {
    IMAGE: '[图片]',
    VOICE: '[语音]',
    VIDEO: '[视频]',
    MUSIC: '[音乐]',
    NEWS: '[图文]',
    WXCARD: '[卡券]',
    MPNEWS: '[内链图文消息]',
    LINK: '[文件]',
    NEWLINK: '[链接]',
    TEMPLATE: '[模板消息]',
    MINIPROGRAM: '[小程序]',
    TEMPLATE_SUBSCRIBE: '[订阅模板消息视频]',
    LOCATION: '[地理位置消息]',
    SHORT_VIDEO: '[短视频]'
  },
	// 下拉的会话类型
	chatTypeActionSheet: {
		0: {
      count: 0,
      type: "recentContacts",
      name: "最近联系人"
		},
		1: {
      count: 0,
      type: "disengage",
      name: "即将脱离活跃"
    },
    2: {
      count: 0,
      type: "justOffTheGrid",
      name: "刚刚脱离活跃"
    },
    3: {
      count: 0,
      type: "visitNoSpeech",
      name: "来访未发言"
    },
    4: {
      type: "othersCooperate",
      name: "他人协作",
      count: 0
    }
	},
	constChatType: {
    chattingList: {
      type: 'CONV_ING_LIST',
      action: 'getConversationList'
    },
    recentContacts: {
      type: 'CONV_RECENT_CONTACTS_LIST',
      action: 'getConversationList'
    },
    disengage: {
      type: '',
      action: 'getWillOutActiveConvListByPage'
    },
    justOffTheGrid: {
      type: '',
      action: 'getJustNowOutActiveConvListByPage'
    },
    visitNoSpeech: {
      type: '',
      action: 'getVisitNoSpeakList'
    },
    othersCooperate: {
      type: '',
      action: 'getCollaborativeList'
    },
    scramble: {
      type: 'CONV_QDC_LIST',
      action: 'getConversationList'
    }
	},
	// 会话类型的次数
  constChatCount: [
		{
			conversationType: 'CONV_RECENT_CONTACTS_LIST', // 最近联系人
			index: 0
		},
		{
			conversationType: 'WILL_OUT_ACTIVE', // 即将脱离活跃
			index: 1
		},
		{
			conversationType: 'JUST_NOW_OUT_ACTIVE', // 刚刚脱离活跃
			index: 2
		},

		{
			conversationType: 'VISIT_NO_SPEAK', // 来访未发言
			index: 3
		},
		{
			conversationType: 'COLLABORATIVE', // 他人协作
			index: 4
		}
	],
	limit: 20,
}