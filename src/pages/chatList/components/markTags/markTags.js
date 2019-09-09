import create from '../../../../utils/omix/create'
let {calcMark} = require("../../../../utils/util.js")
create({
	properties: {
		item: {
			type: Object,
			value: {},
			observer: function (val) {
				if (this.data.store) {
					let seatId = this.data.store.chatList.seatInfo.seatId
					let markClass = calcMark(val, seatId)
					this.setData({
						markClass: markClass || ''
					})
				}
			}
		}
	},
	data: {
		markClass: 'class'
	},
	ready() {
		let seatId = this.data.store.chatList.seatInfo.seatId
		let markClass = calcMark(this.data.item, seatId)
		this.setData({
			markClass: markClass || ''
		})
		this.pageReady()
	},
	methods: {
		pageReady() {
			this.triggerEvent('chatListComponentReady')
		}
	},
})