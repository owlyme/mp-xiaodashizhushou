import expressionList from '../../utils/expression'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
		expressionList: [],
		indicatorDots: true,

	},
	lifetimes:{
		attached() {
			this.setData({
				expressionList: this.resetExpressionList()
			})
		}
	},
  methods: {
		resetExpressionList() {
			const number = 27
			let qrArr = [[]]
			let lineIndex = 0
			expressionList.forEach((item, index) => {
				if (index && !(index % number)) {
					qrArr[++lineIndex] = []
				}
				qrArr[lineIndex].push(item)
			})
			return qrArr
		},
		getSelected(e) {
			if (e.type === "tap" && e.currentTarget.dataset.emoji) {
				let emoji = e.currentTarget.dataset.emoji
				this.triggerEvent('selectedImg', emoji)
			}
		}
  }
})
