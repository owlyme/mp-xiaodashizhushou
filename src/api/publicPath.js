const url = '/mp'
export default {
	dictByKey: url + '/public/getValueByKey', // 根据字典key值获取相应数据
	dictByParent: url + '/public/getValueByKeyAndPv', // 根据父级和字典key获取相应数据
}