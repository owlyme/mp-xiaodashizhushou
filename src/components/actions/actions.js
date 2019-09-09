
Component({
  options: {
   multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
		show: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
				if (newVal) {
					this.up()
				}
	  }
	},
	duration: {
		type: Number,
		value: 300,
		observer: function (newVal, oldVal) {}
	},
	cancle: {
		type: String,
		value: '取消'
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
		actionSheetHidden: true,
		animationData: {}
  },

  /**
   * 组件的方法列表
   */
	created() {
		var animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'ease'
		})
		this.animation = animation

	},
	attached() {
		// this.up()
	},

  methods: {
    up: function () {
		this.setData({
			actionSheetHidden: false
		})
		// this.animation.top(this.data.top).step()
		this.animation.bottom('0').step()
		this.setData({
			animationData: this.animation.export()
		})
	},
	down(e) {
		// this.animation.top('100%').step()
		this.animation.bottom("-100%").step()
		this.setData({
			animationData: this.animation.export()
		})
		setTimeout(() => {
			this.setData({
				actionSheetHidden: true
			})
			this.close(e)
		}, this.data.duration)
	},
	selected(e) {
		// this.triggerEvent('myevent', myEventDetail, myEventOption)
	},
	close(e) {
		this.triggerEvent('onClose')
	}
  }
})

/* <actions id="actions" show="{{showAction}}" bindonClose="close">
		<block>
			<view data-index="1">1</view>
			<view data-index="2">2</view>
			<view data-index="3">3</view>
		</block>
	</actions> */
