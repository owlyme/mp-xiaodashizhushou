var app = getApp() // 获取应用实例
import Scroll from './scroll.js'
const creatTouchEventData = function(e) {
	let event = e.changedTouches[0] || {
		x: 0,
		y: 0,
		timeStamp: Date.now()
	}
	return {
		x: event.pageX,
		y: event.pageY,
		timeStamp: Date.now()
	}
}
let SP = null
let self = null

Component({
  options: {
    // multipleSlots: true, // 启用多slot支持
    // styleIsolation: 'isolated' // 启用样式隔离
  },

  properties: {
    value: {
      type: String, // 类型
      value: 'custom' // 默认值
		},
		downLocked: {
			type: Boolean, // 类型
			value: false, // 默认值
			observer(nv) {
				SP && (SP.downLocked = nv)
			}
		}
  },

  data: {
		bottom: 0,
		translateY: 0,
		transition: `all .3s ease-out`
  },

  lifetimes: {
    attached() { // 组件实例进入页面节点树
    },
		ready() { // 组件渲染完成后执行
			this.init()
    }
  },

  methods: {
		async init() {
			// el, parentHeight, direction
			self = this
			SP = new Scroll({
				wxGetHeght: async () => {
					return self.wxGetHeght('#inner-scroll')
				},
				wxSetPos: (data) => {
					self.wxSetPos(data)
				},
				wxSetTransition: (data) => {
					self.wxSetTransition(data)
				},
				parentHeight: await self.wxGetHeght('#scroll-outer')
			})
			SP.onReachTop = () => {
				self.triggerEvent('reachTop')
			}
			SP.onReachBottom = () => {
				self.triggerEvent('reachBottom')
			}
			SP.moving = (data) => {
				self.triggerEvent('moving', data)
			}
		},
		wxGetHeght: async (id) => {
			return new Promise(resolve => {
				self.createSelectorQuery().select(id).boundingClientRect(rect => {
					resolve(rect.height)
				}).exec()
			})
		},
		wxSetPos: (pos) => {
			self.setData({translateY: -pos})
		},
		wxSetTransition:(time) => {
			self.setData({transition: `all ${time}s ease-out`})
		},

		async touchStart(e) {
			SP.PH = await self.wxGetHeght('#scroll-outer')
			SP.touchstart(creatTouchEventData(e))
		},
		touchEnd(e) {
			SP.touchend(creatTouchEventData(e))
		},
		touchMove(e) {
			let pos = creatTouchEventData(e)
			SP.touchmoving(pos)
		},
		// 置底部
		setToBottom() {
			if (SP) SP.setToBottom()
		},
		// 置顶
		setToTop() {
			SP.setToTop()
		}
  }
})
