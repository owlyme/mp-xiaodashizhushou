// components/temp/temp.js
var order = ['red', 'yellow', 'blue', 'green', 'red']
Component({
	options: {
		styleIsolation: 'apply-shared',
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
		list: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				this.setData({
					loading: false,
					showloadmore: false,
					refresh: false,
				})
			}
		},
		headerHeight: {
			type: Number,
			value: 0
		},
		footerHeight: {
			type: Number,
			value: 0
		}
  },

  /**
   * 组件的初始数据
   */
  data: {
		scrollTop: 100,
		refresh: false,
		showloadmore: false,
		loading: false
  },
  /**
   * 组件的方法列表
   */
	lifetimes: {
    attached() {
			// 在组件实例进入页面节点树时执行

    }
  },

  methods: {
		upper: function(e) {
			if (!this.data.loading) {
				this.triggerEvent('onUpper')
				this.setData({
					loading: true,
					refresh: true
				})
			}
		},
		lower: function(e) {
			if (!this.data.loading) {
				this.triggerEvent('onLower')
				this.setData({
					loading: true,
					showloadmore: true
				})
			}
		},
		scroll: function(e) {
		}
	}
})
/**eg
 *
 * page need
 * 	onPullDownRefresh (e) {
		this.selectComponent('#scrollInf').upper()
		wx.stopPullDownRefresh()
	},
<srcoll-inf
	id="scrollInf"
	list="{{scrollList}}"
	bindonUpper="upper"
	bindonLower="lower"
	headerHeight="60"
	footerHeight="60"
>
	<view slot="scroll-header">
		scroll-header
	</view>
	<view>
		<view wx:for="{{scrollList}}" wx:key="{{item}}">{{item}}</view>
	</view>
	<view slot="scroll-footer">
		scroll-footer
	</view>
</srcoll-inf>
 */