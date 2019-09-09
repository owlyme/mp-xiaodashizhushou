import { VantComponent } from '../common/component'
VantComponent({
	props: {
		tags: {
			type: Object,
			value: {}
		},
		parentValue: {
			type: Array,
			value: [],
			observer: 'updateTags'
		}
	},
	data: {
		checked: false
	},
	methods: {
		emitChange(value) {
			this.$emit('toggle', { name: this.data.tags.tagId, value})
		},
		toggle() {
			const { checked } = this.data
			this.emitChange(!checked)
		},
		updateTags() {
			const status = this.data.parentValue.includes(this.data.tags.tagId)
			this.setData({
				checked: status
			})
		}
	}
})
