// components/top/top.js
var app = getApp()
Component({
  /**
   * 组件的配置
   */
  options: {
    // multipleSlots: true, // 启用多slot支持
    // styleIsolation: 'isolated' // 启用样式隔离
  },

  /**
   * 组件的属性列表
   */
  properties: {
		item: Object
    // item: {
    //   type: Object, // 类型
    //   value: '' // 默认值
    // },
  },

  /**
   * 组件的初始数据
   */
  data: {
		hasFocus: false // 是否获取了焦点
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached() { // 组件实例进入页面节点树
    },
    ready() { // 组件渲染完成后执行
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
		input: function(e) {
			this.triggerEvent('input', e)
		},
		focus: function(e) {
			this.setData({
				hasFocus: true
			})
			this.triggerEvent('focus', e)
		},
		blur: function(e) {
			this.setData({
				hasFocus: false
			})
			this.triggerEvent('blur', e)
		},
		clean: function(e) {
			this.triggerEvent('clean', e)
		}
  }
})
