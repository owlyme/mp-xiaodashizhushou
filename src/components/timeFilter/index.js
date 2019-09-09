
import filters from "../../utils/filters.js"
const computedBehavior = require('../../utils/computed')
Component({
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true
	},
	behaviors: [computedBehavior],
	properties: {
		createTime: {
			type: [String, Number],
			value: "",
			observer: function (newVal) {
			}
		},
		type: {
			type: String,
			value: ""
		}
	},
	computed: {
		filterTime() {
			return filters.chatFilterDate(this.data.createTime, this.data.type)
		}
	}
});
