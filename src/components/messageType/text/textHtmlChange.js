/* eslint-disable */
import list from '../../../utils/expression.js'
const expressionList = Array.prototype.slice.call(list)
const specialStr = '👻🙏💪🎉😄😷😂😝😳😱😔😒'
const chatEmojiStrList = expressionList.map(item => item.chatStr)
const reverseKeyAndVal = (obj) => {
  let _obj = {}
  for (let key in obj) {
    _obj[obj[key]] = key
  }
  return _obj
}

const insertTags = {
  "粉丝昵称": 'nickName',
  "分享者昵称": 'sharerNickName',
  "客服名称": 'customerServiceName',
  "海报名称": 'posterName',
  "需要关注数": 'activityNeedFollowers',
  "已邀请数量": 'invitedNum',
  "已取关数": 'cancelFollowNum',
  "还需关注数": 'stillNeedFollowersNum',
  "累计关注数": 'followersNum',
  "活动有效期": 'activityValidityPeriod',
  "裂变海报有效期": 'fansPosterValidityTime',
  "链接": 'link'
}
const changeKeyAndValInsertTags = reverseKeyAndVal(insertTags)

const getPattern = (insertTags) => {
  let keys = Object.keys(insertTags).map(item => '\\[' + item + '\\]').join('|')
      keys = new RegExp(keys, 'g')
  let values = Object.values(insertTags).map(item => '\\$\\{' + item + '\\}').join('|')
      values = new RegExp(values, 'g')
  return {
    keyPattern: keys,
    valuePattern: values
  }
}
// 图片表情
function changeAltToSrc(str, notice) {
  let arr = str.match(/\[(.{1,2}?)\]/g) || []
  let replacecdList = []
  arr.forEach(item => {
    let val = item.replace(/\[(.*)\]/, '$1')
    let emoji = expressionList.find(item => item.title === val)
    if (emoji && !replacecdList.includes(val)) {
      replacecdList.push(val)
      let pattern = new RegExp(`\\[${val}\\]`, "g")
      if (notice) {
        str = `[${emoji.title}]`
      } else {
        str = str.replace(pattern, `<img style="width:15px;height:15px;" src="${emoji.url}" alt="[${emoji.title}]">`)
      }
    }
  })
  return str
}

export function isHaveEmoji(val) {
  let str = val
  let arr = str.match(/\[(.{1,2}?)\]/g) || []
  let emoji
  for (let i = 0; i < arr.length; i++) {
    let strdone = arr[i].replace(/\[(.*)\]/, '$1')
    emoji = expressionList.find(item => item.title === strdone)
    if (emoji) {
      return true
    }
  }
  emoji = expressionList.find(item => {
    let xx = item.chatStr && item.chatStr.replace(/\\/g, '')
    return str.indexOf(xx) >= 0
  })
  if (emoji) {
    return true
  }
  return false
}
// 特殊表情符
function changeSpecialEmoji(val) {
  return val.replace(/👻|🙏|💪|🎉|😄|😷|😂|😝|😳|😱|😔|😒/g, $0 => {
    let emoji = expressionList.find(item => item.title === $0)
    if (emoji) {
      return `<img style="width:15px;height:15px;" src="${emoji.url}" alt="[${emoji.title}]">`
    } else {
      return $0
    }
  })
}
// 聊天表情符
const chatEmojiStrListPattern = new RegExp( chatEmojiStrList.join("|").replace(/\|*$/, ''), 'g')
function changechatEmojiStr(val, notice) {
  return val.replace(chatEmojiStrListPattern, $0 => {
    let emoji = expressionList.find(item => {
      let xx = item.chatStr.replace(/\\/g, '')
      return xx === $0
    })
    if (emoji) {
      if (notice) {
        return `[${emoji.title}]`
      } else {
        return `<img style="width:15px;height:15px;" src="${emoji.url}" alt="[${emoji.title}]">`
      }
    } else {
      return $0
    }
  })
}

const _filterTags = (val) => {
  if (!val) return val
  // 换行符
  val = val.replace(/\n/g, ' ')
  // 表情 和 特殊表情
  val = val.replace(/<img[^\[]*(\[(.*?)\]).*?>/g, ($0, $1, $2) => {
    return specialStr.includes($2) ? $2 : $1
  })
  return val
}


const _addTags = (val, notice) => {
  if (!val) return val
  val = JSON.parse(JSON.stringify(val))
  // 图片表情
  val = changeAltToSrc(val, notice)

  // 聊天表情符
  val = changechatEmojiStr(val, notice)
  // 特殊表情符
  // val = changeSpecialEmoji(val)
  val = val.replace(/<a\s/g,"<a target=\"_blank\" ")
  return val
}

export const filterTags = (arg) => { return !arg ? arg : _filterTags(arg) }
// notice 用来处理桌面通知的标签
export const addTags = (arg, notice) => { return !arg ? arg : _addTags(arg, notice) }


