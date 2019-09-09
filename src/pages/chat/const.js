export default {
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
	msgBodyTypeTransfrom: {
    1: 'TEXT',
    2: 'IMAGE',
    3: 'VOICE',
    4: 'VIDEO',
    5: 'TEXT',
    6: 'NEWS',
    7: 'MPNEWS',
		8: 'LINK',
		15: 'NEWLINK',
    9: 'TEMPLATE',
    50: 'EVENT'
	},
	platformType: {
    PC_WEB_CHAT: 'pc端web聊天系统',
    PC_DESKTOP_CHAT: 'pc端桌面聊天系统',
    PC_WEB_ADMIN: '企业管理系统',
    PC_WEB_MANAGE: 'pc端web运营管理系统',
    WX_MP_CHAT: '微信小程序聊天系统'
  },
  pageUrl: {
    CHANNEL_QR_CODE: '渠道二维码',
    TASK_TREASURE: '任务宝',
    MISSION_REWARDS: '任务奖励',
    RANKING_LIST: '排行榜',
    INDIVIDUALIZATION_MENU: '个性化菜单',
    STANDARD_GROUP: '标准群发',
    SENIOR_GROUP: '高级群发',
    INTERACTION_GROUP: '互动群发',
    TREASURE_GROUP: '群发宝',
    INTELLIGENT_RECEPTION: '智能接待',
    KEY_WORD_REPLY: '关键词回复',
    ATTENTION_REPLY: '被关注回复',
    FANS_CRM: '粉丝管理',
    CUSTOMER_SERVICE_SYSTEM: '客服系统',
    PUBLIC_ACCOUNT_NUMBER: '公众号数量',
    EMPLOYEE_NUMBER: '员工数量',
    SEAT_NUMBER: '坐席数量',
    CLOUD_SERVICE_SPACE: '云服务空间',
    FANS_NUMBER: '粉丝数量包'
  },
  messageKeyAndCode: {
    'SYS_MSG_NOTICE': {
      type:1,
      name: '平台系统通知'
    },
    'SYS_MSG_CONVR_START': {
      type:2,
      name: '客服对话开始通知'
    },
    'SYS_MSG_CONVR_END': {
      type:3,
      name: '客服对话结束通知'
    },
    'WX_ERROR_MSG': {
      type:4,
      name: '微信异常消息类型'
    },
    'SYS_MSG_TEAM_ON': {
      type:50,
      name: '参与协作通知'
    },
    'SYS_MSG_FANS_OFF': {
      type:51,
      name: '粉丝取消关注后聊天关闭通知'
    },
    'SYS_MSG_SEAT_OFF': {
      type:52,
      name: '粉丝与坐席关系取消聊天关闭通知'
    },
    'WX_KF_MSG': {
      type:100,
      name: '微信客服消息'
    },
    'WX_EVENT_SUBSCRIBE': {
      type:150,
      name: '关注事件消息'
    },
    'WX_EVEN_LOCATION': {
      type:180,
      name: '微信客服事件消息-地理位置'
    },
    'WX_EVEN_CLICK': {
      type:152,
      name: '微信客服事件消息-点击菜单拉取消息时的事件推送'
    },
    'WX_EVEN_VIEW': {
      type:153,
      name: '微信客服事件消息-点击菜单跳转链接时的事件推送'
    },
    'WX_EVENT_AUTOREPLY': {
      type: 154,
      name: '自动回复'
    },
    'WX_EVENT_FANS_POSTER_SCAN': {
      type: 162,
      name: '扫码二维码-裂变海报已关注事件'
    },
    'WX_EVENT_CHANNEL_QR_CODE_SCAN': {
      type:159,
      name: '扫码二维码-渠道二维码已关注事件'
    },
    'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE': {
      type:160,
      name: '扫码二维码-渠道二维码关注事件'
    },
    'WX_EVENT_FANS_POSTER_SUBSCRIBE': {
      type:161,
      name: '扫码二维码-裂变海报关注事件'
    },
    'WX_EVENT_SCRAMBLE_SUCCESS': {
      type: 280,
      name: '客服抢单成功事件'
    },
    'WX_EVENT_DELETE_ASSIS_SEAT': {
      type:281,
      name: '客服关闭协作客服事件'
    },
    'WX_EVENT_OTHER_SUBSCRIBE': {
      type:179,
      name: '扫码二维码-其它类型的扫码关注事件消息'
    },
    'WX_EVENT_UN_SUBSCRIBE': {
      type:199,
      name: '取消关注事件消息'
    },
    'KF_MASS_MSG': {
      type:200,
      name: '客服群发消息'
    },
    'KF_MASS_WX_KF_MSG': {
      type:201,
      name: '客服群发微信消息'
    },
    'KF_MASS_WX_TEMPLATE_MSG': {
      type:202,
      name: '客服群发微信模板'
    },
    'KF_MASS_WX_PREVIEW_MSG': {
      type:203,
      name: '客服群发微信预览'
    },
    'SEAT_KF_MSG': {
      type:250,
      name: '坐席客服消息'
    },
    'SEAT_WECHAT_KF_MSG': {
      type:251,
      name: '坐席微信客服消息'
    },
    'SEAT_WECHAT_MASS_PREVIEW_MSG': {
      type:252,
      name: '坐席微信群发预览消息'
    },
    'SEAT_EVENT_FS_MOBILE_PACKET': {
      type: 282,
      name: '客服移动分组'
    },
    'SEAT_EVENT_SET_FANS_TAG': {
      type: 283,
      name: '设置粉丝标签'
    },
    'SYS_MSG_REQ_TEAM_ON': {
      type: 300,
      name: '请求协作'
    },
    'INTELLIGENT_RECEPTION_SYSTEM_MESSAGE': {
      type: 301,
      name: '智能接待系统消息'
    },
    'SEAT_EVENT_REQ_TEAM_ON': {
      type: 284,
      name: '请求协作'
    },
    'SYS_EVENT_AUTOREPLY': {
      type: 302,
      name: '自动回复'
    },
    'WX_EVENT_SCAN_OTHER_QR': {
      type: 163,
      name: '扫码二维码-其它类型的扫码事件消息'
    },
    'WX_EVENT_SCAN_LOGIN': {
      type: 164,
      name: '扫码二维码-登陆平台事件消息'
		},
		'WX_EVENT_JUMP_URL': {
      type: 182,
      name: '点击菜单跳转链接事件消息'
    },
    'WX_EVENT_JUMP_MINPROGRAM': {
      type: 181,
      name: '点击菜单跳转小程序事件消息'
		},
		'SEAT_EVENT_UPDATE_FANS_SEAT': {
      type: 285,
      name: '客服设置所属事件'
		},
		'ERROR_CODE': {
      type: 151,
      name: '错误兼容消息'
		},
		'WEB_EVEN_CLICK_OPEN': {
      type: 500,
      name: '点击我要开通'
    },
    'WEB_EVEN_CLICK_BUY': {
      type: 501,
      name: '点击我要购买'
    },
    'WEB_EVEN_CLICK_RENEW': {
      type: 502,
      name: '点击我要续费'
    }
  },
  messageCodeAndKey: {
		500: {
      type: 'WEB_EVEN_CLICK_OPEN',
      name: '点击我要开通'
    },
    501: {
      type: 'WEB_EVEN_CLICK_BUY',
      name: '点击我要购买'
    },
    502: {
      type: 'WEB_EVEN_CLICK_RENEW',
      name: '点击我要续费'
    },
		151: {
      type: 'ERROR_CODE',
      name: '错误兼容消息'
    },
		285: {
      type: 'SEAT_EVENT_UPDATE_FANS_SEAT',
      name: '客服设置所属事件'
    },
		182: {
      type: 'WX_EVENT_JUMP_URL',
      name: '点击菜单跳转链接事件消息'
    },
    181: {
      type: 'WX_EVENT_JUMP_MINPROGRAM',
      name: '点击菜单跳转小程序事件消息'
    },
    1: {
      type: 'SYS_MSG_NOTICE',
      name: '平台系统通知'
    },
    2: {
      type: 'SYS_MSG_CONVR_START',
      name: '客服对话开始通知'
    },
    3: {
      type: 'SYS_MSG_CONVR_END',
      name: '客服对话结束通知'
    },
    4: {
      type: 'WX_ERROR_MSG',
      name: '微信异常消息类型'
    },
    50: {
      type: 'SYS_MSG_TEAM_ON',
      name: '参与协作通知'
    },
    51: {
      type: 'SYS_MSG_FANS_OFF',
      name: '粉丝取消关注后聊天关闭通知'
    },
    52: {
      type: 'SYS_MSG_SEAT_OFF',
      name: '粉丝与坐席关系取消聊天关闭通知'
    },
    100: {
      type: 'WX_KF_MSG',
      name: '微信客服消息'
    },
    150: {
      type: 'WX_EVENT_SUBSCRIBE',
      name: '关注事件消息'
    },
    180: {
      type: 'WX_EVEN_LOCATION',
      name: '微信客服事件消息-地理位置'
    },
    152: {
      type: 'WX_EVEN_CLICK',
      name: '微信客服事件消息-点击菜单拉取消息时的事件推送'
    },
    153: {
      type: 'WX_EVEN_VIEW',
      name: '微信客服事件消息-点击菜单跳转链接时的事件推送'
    },
    159: {
      type: 'WX_EVENT_CHANNEL_QR_CODE_SCAN',
      name: '扫码二维码-渠道二维码已关注事件'
    },
    160: {
      type: 'WX_EVENT_CHANNEL_QR_CODE_SUBSCRIBE',
      name: '扫码二维码-渠道二维码关注事件'
    },
    161: {
      type: 'WX_EVENT_FANS_POSTER_SUBSCRIBE',
      name: '扫码二维码-裂变海报关注事件'
    },
    154: {
      type: 'WX_EVENT_AUTOREPLY',
      name: '自动回复'
    },
    162: {
      type: 'WX_EVENT_FANS_POSTER_SCAN',
      name: '扫码二维码-裂变海报已关注事件'
    },
    163: {
      type: 'WX_EVENT_SCAN_OTHER_QR',
      name: '扫码二维码-其它类型的扫码事件消息'
    },
    164: {
      type: 'WX_EVENT_SCAN_LOGIN',
      name: '扫码二维码-登陆平台事件消息'
    },
    280: {
      type: 'WX_EVENT_SCRAMBLE_SUCCESS',
      name: '客服抢单成功事件'
    },
    281: {
      type:'WX_EVENT_DELETE_ASSIS_SEAT',
      name: '客服关闭协作客服事件'
    },
    179: {
      type: 'WX_EVENT_OTHER_SUBSCRIBE',
      name: '扫码二维码-其它类型的扫码关注事件消息'
    },
    199: {
      type: 'WX_EVENT_UN_SUBSCRIBE',
      name: '取消关注事件消息'
    },
    200: {
      type: 'KF_MASS_MSG',
      name: '客服群发消息'
    },
    201: {
      type: 'KF_MASS_WX_KF_MSG',
      name: '客服群发微信消息'
    },
    202: {
      type: 'KF_MASS_WX_TEMPLATE_MSG',
      name: '客服群发微信模板'
    },
    203: {
      type: 'KF_MASS_WX_PREVIEW_MSG',
      name: '客服群发微信预览'
    },
    250: {
      type: 'SEAT_KF_MSG',
      name: '坐席客服消息'
    },
    251: {
      type: 'SEAT_WECHAT_KF_MSG',
      name: '坐席微信客服消息'
    },
    252: {
      type: 'SEAT_WECHAT_MASS_PREVIEW_MSG',
      name: '坐席微信群发预览消息'
    },
    282: {
      type: 'SEAT_EVENT_FS_MOBILE_PACKET',
      name: '客服移动分组'
    },
    283: {
      type: 'SEAT_EVENT_SET_FANS_TAG',
      name: '设置粉丝标签'
    },
    300: {
      type: 'SYS_MSG_REQ_TEAM_ON',
      name: '请求协作'
    },
    301: {
      type: 'INTELLIGENT_RECEPTION_SYSTEM_MESSAGE',
      name: '智能接待系统消息'
    },
    284: {
      type: 'SEAT_EVENT_REQ_TEAM_ON',
      name: '请求协作'
    },
    302: {
      type: 'SYS_EVENT_AUTOREPLY',
      name: '自动回复'
    }
  }
}
