import dayjs from './dayjs.min.js'
const chatFilterDate = function(val, type) {
  if (!val) {
    return '--'
  }
  const week = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
  }
  // let _date = val.toString().length < 13 ? val * 1000 : val
  let _date = val
  let days = dayjs(dayjs(new Date()).format('YYYY-MM-DD')).diff(
    dayjs(dayjs(_date).format('YYYY-MM-DD')),
    'day'
	)
	let yearDiff = dayjs(dayjs(new Date()).format('YYYY-MM-DD')).diff(
    dayjs(dayjs(_date).format('YYYY-MM-DD')),
    'years'
  )
  let fromatDate = '--'
  if (days <= 0) {
    fromatDate = dayjs(_date).format('HH:mm')
  } else if (days > 0 && days <= 1) {
    fromatDate = '昨天'
  } else if (days <= 6) {
    fromatDate = week[dayjs(_date).day()]
  } else {
    if (yearDiff < 0) {
      fromatDate = dayjs(_date).format('YYYY/MM/DD')
    } else {
      fromatDate = dayjs(_date).format('MM/DD')
    }
  }
  if (type === 'content') {
    if (days <= 0) {
      fromatDate = dayjs(_date).format(' HH:mm:ss')
    } else {
      fromatDate = dayjs(_date).format('YYYY/MM/DD HH:mm:ss')
    }
  } else if (type === 'notSecond') {
    if (days <= 0) {
      fromatDate = dayjs(_date).format(' HH:mm')
    } else {
      fromatDate = dayjs(_date).format('YYYY/MM/DD HH:mm')
    }
  }
  return fromatDate
}
const filterTextContextMap = function(messageBody) {
	if (Object.keys(messageBody.contextMap).length > 0 && messageBody.content) {
		// let regexp = new RegExp(/(?<=(\$\{)).*?(?=\})/, 'g')
		// let contextReg = messageBody.content.match(regexp)
		let contextReg = messageBody.content.replace(/\\n/g, "<br/>").split(/\}?\$\{|\}/)
		let context = messageBody.content
		contextReg && contextReg.forEach(item => {
			// if (item !== 'nickName') {
				let reg = `\\$\\{${item}\\}`
				let regexpItem = new RegExp(reg, 'g')
				context = context.replace(regexpItem, messageBody.contextMap[item])
			// }
		})
		return context
	} else {
		return messageBody.content
	}
}
const unix = function(val) {
  return dayjs(val).unix()
}
// 对会话列表socket推过来的消息的顺序进行排序
const insertChatList = function(chatList, payload) {
  let i
  let createTime1 = unix(payload.messageBody.createTime)
  i = chatList.findIndex((item) => {
    let createTime2 = unix(item.messageBody.createTime)
    return createTime1 > createTime2
  })
  if (i < 0) {
    i = 0
  }
  chatList.splice(i, 0, payload)
  return chatList
}
const urlFilter = function(src) {
	if (src && src.indexOf('myqcloud.com') >= 0) { // 腾讯云地址
		if (src.indexOf('https://') >= 0) {
			return src
		} else {
			return 'https://' + src
		}
	} else if (src && src.indexOf('/') === 0) {
		return `http://${wx.getStorageSync('urlRequestName')}${src}`
	} else {
		return src
	}
}
export default {
	insertChatList,
	urlFilter,
	chatFilterDate,
	filterTextContextMap,
	unix,
  dayjs(time, format) {
    return dayjs(time).format(format)
  }
}