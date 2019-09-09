var app = getApp() // 获取应用实例
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
    value: {
      type: String, // 类型
      value: 'custom' // 默认值
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
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
  }
})
