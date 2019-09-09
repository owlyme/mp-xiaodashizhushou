// components/top/top.js
import tool from '../../utils/tool'
Component({
  /**
   * 组件的配置
   */
  options: {
    // multipleSlots: true, // 启用多slot支持
    styleIsolation: 'isolated' // 启用样式隔离
  },

  /**
   * 组件的属性列表
   */
  properties: {
    mode: { // 顶部模式，easy:简单模式，custom:自定义模式
      type: String,
      value: 'custom'
		},
		onLineStatus: {
			type: String,
      value: '' // ON_LINE OFF_LINE
		},
		chatCount: {
			type: Number,
      value: 0
		},
		chatCountShow: {
			type: Boolean,
      value: false
		},
    backType: { // 返回按钮类型, null:无返回按钮，back:箭头按钮
      type: String,
      value: null
    },
    photo: { // 用户头像链接，当传入该值时，不显示返回按钮
      type: String,
      value: null
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
		topHeight: 44,
		statusBarHeight: 20,
	},

  /**
   * 组件的生命周期
   */
  lifetimes: {
		attached() { // 组件实例进入页面节点树
			const global = getApp().globalData
			if (global.statusBarHeight || global.topHeight){
				this.setData({
					statusBarHeight: global.statusBarHeight,
					topHeight: global.topHeight
				})
			} else {
				tool.getTopInfo().then(res => {
					this.setData({
						// systemInfo: res.systemInfo,
						statusBarHeight: res.statusBarHeight || this.data.statusBarHeight,
						topHeight: res.topHeight || this.data.topHeight
					})
				})
			}
    },
    ready() { // 组件渲染完成后执行
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(e) { // 点击返回按钮触发自定义事件back
			this.triggerEvent('back', 'argument')
			wx.navigateBack({
				delta: 1
			})
		},
		photoTap(e) { // 点击顶部头像
			this.triggerEvent('photoTap', e)
		}
  }
})
