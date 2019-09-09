import Const from './const';
let { deepClone, debounce } = require('../../utils/util');
import {
	getConversationListCount,
	queryQcCloudUrlRequestName,
	getTypeOfChatList,
	closeConversating,
	checkSeatFansBind,
	getScrambleOrderList,
	incrUnRead,
	clickScrambleOrder,
	updateChatStateByType,
	getChatSeatInfo
} from '../../api/chatList';
import { filterChatListData } from './filtersData';
import { addReciveMsgToCache } from '../../utils/messageCache';
let Tool = require('../../utils/tool');
import utilConst from '../chat/const';

// 区分储存数据
function distinguishSave(isChattingList, chatList, data, _this) {
	if (isChattingList) {
		// 正在会话中
		console.log(data)
		_this.setData({
			chattingListData: data
		})
		// chatList.chattingListData = data;
	} else {
		// 其他
		_this.setData({
			chatListData: data
		})
	}
}

export default {
	async queryQcCloudUrlRequestName() {
		let data = await queryQcCloudUrlRequestName({ type: 1 });
		if (data.code === 1) {
			wx.setStorageSync('urlRequestName', data.data);
		}
	},
	getConversationListCount(_this, func) {
		let constChatCount = Const.constChatCount;
		constChatCount.forEach(item => {
			let conversationType = item.conversationType;
			let params = {
				conversationType,
				offset: 0,
				limit: 10
			};
			getConversationListCount(params).then(data => {
				if (data.code === 1) {
					_this.store.data.chatList.chatTypeList[
						item.index
					] = _this.store.data.chatList.chatTypeList[item.index].replace(
						/\([\s\S]*\)/g,
						'(' + data.data + ')'
					);
					if (func) {
						func.apply(this, data);
					}
				} else {
					Tool.showToast(data.message);
				}
			});
		});
	},
	getChatSeatInfo(_this) {
		_this.store.data.chatList.seatInfo = {};
		return new Promise((resolve, reject) => {
			getChatSeatInfo().then(data => {
				if (data.code === 1) {
					_this.store.data.chatList.seatInfo = data.data;
					resolve(data);
				} else {
					Tool.showToast(data.message);
					reject(data);
				}
			});
		});
	},
	// 初始化会话列表
	async setInitChatList(_this) {
		_this.setData({
			loadingStatu: 1
		});
		let constChatType = Const.constChatType;
		let chatList = _this.store.data.chatList;
		let seatId = chatList.seatInfo.seatId;
		let chatType = chatList.chatType;
		let isChattingList = chatList.chatType === 'chattingList';

		wx.showLoading({
			title: '加载中'
		});
		let params = {
			offset: 0,
			limit: 15,
			seatId: constChatType[chatType].type ? seatId : null,
			setType: constChatType[chatType].type || null
		};
		let data = await getTypeOfChatList(constChatType[chatType].action, params);
		wx.hideLoading();
		if (data.code === 1) {
			_this.setData({
				chatListLength: (data.data.records && data.data.records.length) || 0
			});
			distinguishSave(isChattingList, chatList, data.data.records || [], _this);
		} else {
			Tool.showToast(data.message);
		}
	},
	// 下拉加载刷新会话列表
	setRefreshChatList(_this) {
		let constChatType = Const.constChatType;
		let chatList = _this.store.data.chatList;
		let seatId = chatList.seatInfo.seatId;
		let chatType = chatList.chatType;
		let isChattingList = chatList.chatType === 'chattingList';
		let limit = isChattingList ? _this.data.chattingListData.length : _this.data.chatListData.length;
		let params = {
			offset: 0,
			limit,
			seatId: constChatType[chatType].type ? seatId : null,
			setType: constChatType[chatType].type || null
		};
		getTypeOfChatList(constChatType[chatType].action, params).then(data => {
			_this.stopPullDownRefresh();
			if (data.code === 1) {
				// _this.data.chatListData = filterChatListData(data.data.records, 'max') || []
				distinguishSave(isChattingList, chatList, data.data.records || [], _this);
			} else {
				Tool.showToast(data.message);
			}
		});
	},
	// 滚动条滚动到底部一定距离获取下一页的聊天列表
	setScrollData(_this) {
		if (_this.data.loadingStatu === 2 || _this.data.loadingStatu === 3) {
			return;
		}
		_this.setData({
			loadingStatu: 2
		});
		let constChatType = Const.constChatType;
		let chatList = _this.store.data.chatList;
		let seatId = chatList.seatInfo.seatId;
		let chatType = chatList.chatType;
		let isChattingList = chatList.chatType === 'chattingList';
		let offset = isChattingList ?  _this.data.chattingListData.length : _this.data.chatListData.length;
		let params = {
			offset,
			limit: 10,
			seatId: constChatType[chatType].type ? seatId : null,
			setType: constChatType[chatType].type || null
		};
		getTypeOfChatList(constChatType[chatType].action, params).then(data => {
			_this.setData({
				loadingStatu: 1
			});
			if (data.code === 1) {
				if (!(data.data.records && data.data.records.length > 0)) {
					_this.setData({
						loadingStatu: 3
					});
				}
				_this.setData({
					chatListLength: (data.data.records && data.data.records.length) || 0
				});
				// let chatListData = deepClone(_this.data.chatListData)
				// let records = filterChatListData(data.data.records, 'max') || []
				// chatListData = [...chatListData, ...records]
				// _this.data.chatListData = chatListData || []
				// _this.data.chatListData = [..._this.data.chatListData, ...(data.data.records || [])]
				let dataList = isChattingList
					? [..._this.data.chattingListData, ...(data.data.records || [])]
					: [..._this.data.chatListData, ...(data.data.records || [])];
				distinguishSave(isChattingList, chatList, dataList, _this);
			} else {
				Tool.showToast(data.message);
			}
		});
	},
	// 删除聊天
	closeConversating(_this, payload, instance) {
		if (_this.data.deleteStatu === 2) {
			return;
		}
		_this.setData({
			deleteStatu: 2
		});
		let chatList = _this.store.data.chatList;
		let conversationId = payload.convrId;
		let touser = conversationId.replace(/(\d+_){2}(.+)/, '$2');
		let seatId = chatList.seatInfo.seatId;
		let chatType = chatList.chatType;
		let appAccountId = payload.appAccountId;
		let isChattingList = chatList.chatType === 'chattingList';
		let params = {
			conversationId,
			touser,
			seatId,
			appAccountId,
			convrSortedSetType:
				chatType === 'chattingList'
					? 'CONV_ING_LIST'
					: chatType === 'recentContacts'
					? 'CONV_RECENT_CONTACTS_LIST'
					: null
		};
		closeConversating(params).then(data => {
			_this.setData({
				deleteStatu: 1
			});
			if (data.code === 1) {
				instance.close();
				let dataList = isChattingList
					? deepClone(_this.data.chattingListData)
					: deepClone(_this.data.chatListData);
				dataList = dataList.filter(item => {
					return conversationId !== item.convrId;
				});
				distinguishSave(isChattingList, chatList, dataList, _this);
			} else {
				Tool.showToast(data.message);
			}
		});
	},
	// 删除会话
	DEL_CHAT_INFO(_this, payload) {
		let chatList = _this.store.data.chatList;
		let isChattingList = chatList.chatType === 'chattingList';
		let dataList = isChattingList
			? deepClone(_this.data.chattingListData)
			: deepClone(_this.data.chatListData);
		dataList = dataList.filter(item => {
			return payload.convrId !== item.convrId;
		});
		distinguishSave(isChattingList, chatList, dataList, _this);
	},
	// 抢单成功删除抢单
	DELETE_OTHER_SCRALER(_this, payload) {
		let chatList = _this.store.data.chatList;
		let scramble = deepClone(chatList.scramble);
		let index = scramble.findIndex(item => {
			return item.convrId === payload.convrId;
		});
		if (index >= 0) {
			chatList.scrambleTotal--;
			scramble.splice(index, 1);
			chatList.scramble = scramble;
		}
	},
	// 更新抢单池列表
	SET_SOCKET_SCRAMBLE(_this, payload) {
		let chatList = _this.store.data.chatList;
		let scramble = deepClone(chatList.scramble);
		let index = scramble.findIndex(_item => {
			return _item.convrId === payload.convrId;
		});
		if (index >= 0) {
			scramble[index] = {
				...scramble[index],
				...payload
			};
		} else {
			chatList.scrambleTotal++;
			scramble.push(payload);
		}
		chatList.scramble = filterChatListData(scramble, 'max');
	},
	// 更新会话列表
	SET_SOCKET_CHATLIST(_this, payload, app) {
		let chatList = _this.store.data.chatList;
		let isChattingList = chatList.chatType === 'chattingList';
		let pages = getCurrentPages();
		let currPage = null;
		if (pages.length) {
			currPage = pages[pages.length - 1];
		}
		if (payload.unreadNum > 0 && currPage.route === 'pages/chat/chat') {
			this.setIncrUnRead(_this, payload);
		}

		let chattingList = deepClone(_this.data.chattingListData);
		if (isChattingList) {
			this.add_newConvr(isChattingList, chatList, chattingList, payload, _this);
		} else {
			// 当列表在最近联系人的情况下
			let recentList = deepClone(_this.data.chatListData);
			this.add_newConvr(isChattingList, chatList, recentList, payload, _this);
			this.add_newConvr(true, chatList, chattingList, payload, _this);
		}
		addReciveMsgToCache(app, payload);
	},
	add_newConvr(isChattingList, chatList, dataList, payload, _this) {
		let index = dataList.findIndex(_item => {
			return _item.convrId === payload.convrId;
		});
		if (index >= 0) {
			dataList[index] = {
				...dataList[index],
				...payload
			};
		} else {
			if (chatList.chatType === 'chattingList') {
				dataList.unshift(payload);
			}
		}
		distinguishSave(
			isChattingList,
			chatList,
			filterChatListData(dataList, 'max'),
			_this
		);
	},
	SET_ALLSOCKETMSG(payload) {
		// 提示音
		console.log('get message')
		if (payload.list.listType === 'CONV_QDC_LIST') {
			console.log('mag remind voice play')
			Tool.notifyVoice();
		} else {
			let msgType =
				utilConst.messageKeyAndCode[payload.list.messageBody.msgType].type;
			let seatId = payload.list.convrOwnerSeatId;

			payload.noticeList.forEach(item => {
				if (item.value !== '1') return;
				if (
					!seatId &&
					msgType >= 150 &&
					msgType <= 199 &&
					item.key === 'XDS_VOICE_VISIT_NOT_SPEAK'
				) {
					// 来访未发言声音
					Tool.notifyVoice();
				}
				if (
					!seatId &&
					msgType >= 100 &&
					msgType <= 149 &&
					item.key === 'XDS_VOICE_FANS_SEND_MSG'
				) {
					// 粉丝发消息声音
					Tool.notifyVoice();
				}
				if (
					seatId &&
					msgType >= 100 &&
					msgType <= 199 &&
					item.key === 'XDS_VOICE_NORMAL_MSG'
				) {
					// 普通消息
					Tool.notifyVoice();
				}
			});
		}
	},
	getScrambleOrderList(_this) {
		if (
			_this.data.loadingStatuScramble === 2 ||
			_this.data.loadingStatuScramble === 3
		) {
			return;
		}
		_this.setData({
			loadingStatuScramble: 2
		});
		let chatList = _this.store.data.chatList;
		let limit = 20;
		let offset = chatList.scramble.length;
		let seatId = chatList.seatInfo.seatId;
		let params = {
			offset: offset,
			limit: limit,
			seatId: seatId,
			setType: 'CONV_QDC_LIST'
		};
		getScrambleOrderList(params).then(data => {
			_this.setData({
				loadingStatuScramble: 1
			});
			if (data.code === 1) {
				if (!(data.data.records && data.data.records.length > 0)) {
					_this.setData({
						loadingStatuScramble: 3
					});
				}
				let scramble = deepClone(chatList.scramble);
				let records = filterChatListData(data.data.records, 'max') || [];
				scramble = [...scramble, ...records];
				chatList.scramble = scramble;
				chatList.scrambleTotal = data.data.totalCount;
			} else {
				Tool.showToast(data.message);
			}
		});
	},
	// 减少未读会话条数
	setIncrUnRead: debounce(function(_this, payload) {
		let chatList = _this.store.data.chatList;
		let readNum = payload.unreadNum;
		let seatId = chatList.seatInfo.seatId;
		let appAccountId = payload.appAccountId;
		let convrId = payload.convrId;
		let params = { readNum, seatId, appAccountId, convrId };

		let isChattingList = chatList.chatType === 'chattingList';
		incrUnRead(params).then(data => {
			if (data.code === 1) {
				let dataList = isChattingList
					? deepClone(_this.data.chattingListData)
					: deepClone(_this.data.chatListData);
				let index = dataList.findIndex(item => {
					return item.convrId === convrId;
				});
				if (index >= 0) {
					chatList.currentChatObj.unreadNum = 0;
					dataList[index].unreadNum = 0;
					distinguishSave(isChattingList, chatList, dataList, _this);
				}
			} else {
				Tool.showToast(data.message);
			}
		});
	}, 400),
	// 抢单池点击抢单
	clickScrambleOrder(_this, payload) {
		if (_this.data.clickLoadstatu === 2) {
			return;
		}
		_this.setData({
			clickLoadstatu: 2
		});
		let chatList = _this.store.data.chatList;
		let seatId = chatList.seatInfo.seatId;
		let conversationId = payload.convrId;
		let touser = conversationId.replace(/(\d+_){2}(.+)/, '$2');
		let appAccountId = payload.appAccountId;
		let params = {
			seatId,
			conversationId,
			touser,
			appAccountId
		};
		clickScrambleOrder(params).then(data => {
			_this.setData({
				clickLoadstatu: 1
			});
			if (data.code === 1) {
				chatList.currentChatObj = { ...chatList.currentChatObj, ...payload };
				Tool.go('/pages/chat/chat');
			} else {
				Tool.showToast(data.message);
			}
		});
	},
	// 坐席粉丝应用号关系校验
	checkSeatFansBind(_this, payload) {
		let conversationId = payload.convrId;
		let touser = conversationId.replace(/(\d+_){2}(.+)/, '$2');
		let appAccountId = payload.appAccountId;
		let params = { touser, appAccountId };
		return new Promise((reslove, reject) => {
			checkSeatFansBind(params).then(data => {
				if (data.code === 1) {
					reslove(data.code);
				} else {
					let title, content;
					switch (data.code) {
						case 6509:
							title = '公众号不可用';
							content = '公众号停用或不可用';
							break;
						case 6508:
							title = '公众号取消授权';
							content = '当前粉丝所在公众号已取消授权请重新授权后再发起会话';
							break;
						case 6500:
							title = '应用账号不存在';
							content = '当前应用账号不存在';
							break;
						case 5043:
							title = '坐席分配失效';
							content = '该公众号取消分配给您，无法发送消息';
							break;
						case 5034:
							title = '无会话权限';
							content = '当前粉丝与您不存在所属或协作关系无法发起会话';
							break;
						case 0:
							title = '坐席分配失效';
							content = '该公众号取消分配给您，无法发送消息';
							break;
						default:
							title = '暂不可用';
							content = data.message;
							break;
					}
					Tool.showModal({
						title: title,
						content: content,
						success(res) {
							if (res.confirm) {
							} else if (res.cancel) {
							}
						}
					});
					reject(0);
				}
			});
		});
	},
	// 切换在线状态
	updateChatStateByType(_this, type) {
		let params = { type };
		updateChatStateByType(params).then(data => {
			if (data.code === 1) {
				_this.store.data.chatList.seatInfo.onLineStatus = type;
			} else {
				Tool.showToast(data.message);
			}
		});
	}
};
