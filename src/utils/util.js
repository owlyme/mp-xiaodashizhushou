import filters from './filters'
import dayjs from './dayjs.min.js'
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 计算是否为新粉丝
export function calcChatCount(chatList, type, chattingListData, chatListData) {
	if (chatList) {
		var num = 0;
		var isChattingList = chatList.chatType === 'chattingList'
		var calcArr
		if (isChattingList) {
			calcArr = chattingListData
		} else {
			calcArr = chatListData
		}
		calcArr.forEach(function(item) {
			if (type !== 'scramble') {
				if (chatList.chatType === 'chattingList') {
					if (
						item.convrOwnerSeatId === chatList.seatInfo.seatId ||
						(item.assistSeatIds &&
							item.assistSeatIds
								.split(',')
								.indexOf(chatList.seatInfo.seatId + '') >= 0)
					) {
						if (item.convrId !== chatList.currentChatObj.convrId) {
							if (item.unreadNum) {
								num = num + item.unreadNum;
							}
						}
					}
				} else {
					if (item.convrId !== chatList.currentChatObj.convrId) {
						if (item.unreadNum) {
							num = num + item.unreadNum;
						}
					}
				}
			} else {
				if (chatList.chatType === 'chattingList') {
					if (
						item.convrOwnerSeatId === chatList.seatInfo.seatId ||
						(item.assistSeatIds &&
							item.assistSeatIds
								.split(',')
								.indexOf(chatList.seatInfo.seatId + '') >= 0)
					) {
						if (item.unreadNum) {
							num = num + item.unreadNum;
						}
					}
				} else {
					if (item.unreadNum) {
						num = num + item.unreadNum;
					}
				}
			}
		});
		return num;
	}
};
export function calcTime(time) {
  if (!time) {
    return false
  }
  let currentTime = new Date()
  let subtractDay = dayjs(currentTime).subtract(2, 'day')
  let isBefore = dayjs(subtractDay).isBefore(dayjs(time))
  if (isBefore) {
    return true
  } else {
    return false
  }
}
export function calcMark(item, seatId) {
	if (item.convrOwnerSeatId !== seatId && item.assistSeatIds && item.assistSeatIds.split(',').indexOf(seatId + '') >= 0) {
		return 'xiezuo'
	} else if (item.assistSeatIds && item.convrOwnerSeatId === seatId) {
		return 'beixiezuo'
	} else if (calcTime(item.fansFirstVisitDate)) {
		return 'xin'
	} else if (item.fansComeToVisit) {
		return 'laifang'
	} else {
		return ''
	}
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function networkStatus() {
	wx.getNetworkType({
		fail(res) {
			wx.showToast({
				title: "网络走丢了",
				icon: "none"
			})
		}
	})
	wx.onNetworkStatusChange(function(res){
		if(res.isConnected){
			wx.showToast({
				title: "网络走丢了",
				icon: "none"
			})
		}else{
			wx.showToast({
				title: "网络回来了",
				icon: "none"
			})
		}
	})
}
export function deepClone(obj) {
	let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
				// 判断ojb子元素是否为对象，如果是，递归复制
				if(Object.prototype.toString.call(obj[key]) !== '[object Function]') {
					if (obj[key] && typeof obj[key] === "object") {
						objClone[key] = deepClone(obj[key])
					} else {
						// 如果不是，简单复制
						objClone[key] = obj[key]
					}
				}
      }
    }
  }
  return objClone
}
function sortByChat(compare) {
  return function (obj1, obj2) {
    let createTime1 = filters.unix((obj1.messageBody && obj1.messageBody.createTime))
    let createTime2 = filters.unix((obj2.messageBody && obj2.messageBody.createTime))
    if (compare === 'max') {
      return createTime2 - createTime1
    } else {
      let msgId1 = obj1.messageBody && obj1.messageBody.msgId - 0
      let msgId2 = obj2.messageBody && obj2.messageBody.msgId - 0
      if (createTime1 === createTime2) {
        return msgId1 - msgId2
      }
    }
    return createTime1 - createTime2
  }
}
function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
function groupBy( array , f ) {
	let groups = {};
	array.forEach( function( o ) {
			let group = JSON.stringify( f(o) );
			groups[group] = groups[group] || [];
			groups[group].push( o );
	});
	return Object.keys(groups).map( function( group ) {
			return groups[group];
	});
}
export function filterContextMap(contextMap) {
  let keyArr = Object.keys(contextMap)
  if (keyArr.length === 0) {
    return ''
  } else if (keyArr.length === 1) {
    return contextMap[keyArr[0]]
  }
  return contextMap
}

export function guid(len) {
	len = len || 6
	len = parseInt(len, 10)
	len = isNaN(len) ? 6 : len
	var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
	var seedLen = seed.length - 1
	var uuid = ''
	while (len--) {
		uuid += seed[Math.round(Math.random() * seedLen)]
	}
	return uuid + '-'
}

export function queryToString(args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function(key) {
    newArgs[key] = args[key];
  });
  let str = '?'
  for (let k in newArgs) {
		if (k === 'carry') {
      continue
    }
    if (newArgs[k] !== null && newArgs[k] !== undefined) {
      str += k + '=' + newArgs[k] + '&'
    }
  }
  str = str.slice(0, -1)
  return str
}

module.exports = {
	formatTime: formatTime,
	networkStatus,
	deepClone,
	calcTime,
	sortByChat,
	debounce,
	groupBy,
	calcMark,
	filterContextMap,
	guid,
	calcChatCount,
	queryToString
}
