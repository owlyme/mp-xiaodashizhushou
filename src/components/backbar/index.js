import { VantComponent } from '../vant/common/component'
VantComponent({
	props: {
		tip: {
			type: Boolean,
			value: false
		},
		title: {
			type: String,
			value: ''
		}
	},
	data: {
		checked: false
	},
	methods: {
		onBack() {
			this.triggerEvent('back')
			!this.data.tip && wx.navigateBack({
				delta: 1
			})
		},
		onIndex() {
			wx.switchTab({
				url: '/pages/chatList/chatList'
			})
		}
	}
})
