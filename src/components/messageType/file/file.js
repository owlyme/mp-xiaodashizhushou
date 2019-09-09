
let Tool = require('../../../utils/tool')
const msgBehavior = require("../msgBehavior.js")
Component({
	behaviors: [msgBehavior],
  properties: {
		msgBody: {
			type: Object,
			value: {
			}
		}
  },

  data: {
		type: '',
		name: "",
		logoUrl: "",
		size: ""
	},
	lifetimes: {
		attached() {
			console.log(this.data.msgBody)
			let arr = this.data.msgBody.messageBody.title.match(/(.+)(\.\w{3,5})$/)
			let type, name;
			if (arr) {
				type = arr[2]
				name = arr[1]
			} else {
				name = this.data.msgBody.messageBody.title.
				type = this.data.msgBody.messageBody.url.match(/(.+)(\.\w{3,5})$/)[2]
			}

			if ( name.length > 8) {
				name = name.substring(0, 6) + '...'
			}

			this.setData({
				type: type,
				name: name,
				size: this.fileSizeFilter(this.data.msgBody.messageBody.description),
				logoUrl: this.fileType(type)
			})
		}
	},
	methods: {
		look() {
			Tool.showToast('暂时不能查看，请在电脑端进行查看')
		},
		fileSizeFilter(size) {
			if(/\w/.test(size)){
				return size
			} else if (size < 1024) {
				return size + 'B'
			} else if (size < 1024 * 1024) {
				return (size / 1024).toFixed(3) + 'KB'
			} else {
				return (size / (1024 * 1024)).toFixed(3) + "MB"
			}
		},
		fileType(type) {
			let _type = (type || '').replace(/.*\.([^\.]+?)$/, '$1').substring(0, 3) || "zip"
			return `http://chattest.xingke100.com/static/images/fileType/${_type}.png`
		}
	}
})
