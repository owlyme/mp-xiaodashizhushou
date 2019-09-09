let {deepClone, sortByChat} = require("../../utils/util.js")
export function filterChatListData(data, compare) {
	if (!(data && data.length > 0)) {
		return data
	}
	let list = deepClone(data)
	list.sort(sortByChat(compare))
	return list
}