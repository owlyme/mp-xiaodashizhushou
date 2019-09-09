// components/site/index.js
var app = getApp()
import tool from '../../utils/tool'

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
			type: Array,
			// value: ['中国', '四川', '凉山']
			value: []
		},
		siteType: {
			type: String,
			value: 'fans'  // fans:粉丝相关地区，company: 企业相关地区
		}
	},

  /**
   * 组件的初始数据
   */
  data: {
		getNum: 0, // 获取一级地区数据次数（连续获取三次）
		keys: null, // 当前所用keys
		keys1: ['WECHAT_COUNTRY', 'WECHAT_PROVINCE', 'WECHAT_CITY'], // 粉丝相关三级地区数据对应的Key
		keys2: ['Province', 'CountyId', 'District'], // 企业相关三级地区数据对应的key
		showSite: false,
		rank: null, // 变动级别，0:第一级，1:第二级，2:第三级
		select: [0, 0, 0], // 地区选中项索引(未确认)
		// selected: [0, 0, 0], // 地区选中项索引(已确认)
		sitesVal: [], // 选中地区三级编号（itemValue）
		sites: [[], [], []], // 当前显示省市区数据
		write: []
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
		created() { // 组件实例创建完成
			this.init()
		},
		moved() { // 组件实例被移动到节点树的另一个位置
			this.init()
		},
		attached() { // 组件实例进入页面节点树
    },
    ready() { // 组件渲染完成后执行
    }
	},

	observers: {
		showSite: function(val) {
			this.triggerEvent('on-visible-change', val)
		},
		value: function(val) {
			if (val) {
				this.setData({
					write: val
				})
			}
		},
		siteType: function(val) {
			this.init()
		}
	},

  /**
   * 组件的方法列表
   */
  methods: {
		init() { // 初始化
			if (this.data.siteType == 'company') {
				this.setData({
					keys: this.data.keys2
				})
			} else {
				this.setData({
					keys: this.data.keys1
				})
			}
			this.getSite1()
		},
		open(e) { // 打开地区选择器
			const list = this.data.sites[0] // 一级地区数据列表
			if (!list || !list.length) {
				this.getSite1('tab')
			}
			this.setData({
				showSite: true
			})
			console.log(this.data.value)
		},

		siteChange(e) { // 选中项发生变化
			const val = tool.deepCopy(e.detail.value)
			const rank = this.getChangeRank(val) // 修改的列的索引
			const dex = val[rank] // 修改后选中的项索引
			this.setData({
				rank,
				select: val,
				[`sitesVal[${rank}]`]: this.data.sites[rank][dex].itemValue
			})
			if (rank < 2) {
				this.getSite2(rank)
			}
		},
		getSitesItem() { // 获取当前选中地区对象
			const sites = []
			this.data.select.forEach((v, i) => {
				sites.push(this.data.sites[i][v])
			})
			return sites
		},
		enter() { // 点击确定
			// this.setData({
			// 	selected: tool.deepCopy(this.data.select)
			// })
			this.triggerEvent('enter', this.getSitesItem())
			this.close()
		},
		cancel() { // 点击取消
			this.triggerEvent('cancel', false)
			this.close()
		},
		close() { // 关闭地区选择器
			this.setData({
				showSite: false
			})
		},

		getChangeRank(arr) { // 获取变化级别
			let res = 3
			const arr2 = this.data.select
			arr.forEach((v, i) => {
				if (v != arr2[i]) {
					res = i
				}
			})
			return res
		},
		getDex(list, name, key) { // 根据地区名与相应字段，获取相应索引值
			let dex = 0
			list.forEach((v, i) => {
				if (v[key] == name) {
					dex = i
				}
			})
			return dex
		},
		getSite1(tab) { // 获取第一级数据
			if (!tab) {
				if (this.data.getNum > 2) { return }
				this.setData({ getNum: ++this.data.getNum })
			}
			app.http.post(app.api.dictByKey, {
				itemKey: this.data.keys[0]
			}).then(res => {
				if (res.code == 1) {
					let list = res.data.sort((a, b) => a.itemIdx - b.itemIdx)
					const nowDex = this.getDex(list, this.data.write[0], 'itemName')
					this.setData({
						['sites[0]']: list,
						['sitesVal[0]']: list[nowDex].itemValue,
						[`select[1]`]: nowDex
					})
					if (!list[nowDex].itemValue) {
						setTimeout(() => {
							this.getSite1()
						}, 1000)
					}
					this.getSite2(0)
				}
			})
		},
		getSite2(v) { // 获取第二、三数据
			// v:0 取第二级数据 v:1 取第三级数据
			const rank = v === 0 ? this.data.keys[1] : this.data.keys[2]
			const key = v === 0 ? 'sites[1]' : 'sites[2]'
			const pv = this.data.sitesVal[v]
			console.log(this.data.sitesVal)
			if (!pv) { return }
			app.http.post(app.api.dictByParent, {
				itemPv: pv,
				itemKey: rank,
			}).then(res => {
				if (res.code == 1) {
					let list = res.data.sort((a, b) => a.itemIdx - b.itemIdx)
					if (!list || !list.length) {
						list = [{'itemName': '', 'itemValue': 0}]
					}
					const nowDex = this.getDex(list, this.data.write[v + 1], 'itemName')
					this.setData({
						[key]: list,
						[`sitesVal[${v + 1}]`]: list[nowDex].itemValue,
						[`select[${v + 1}]`]: nowDex
					})
					if (v === 0) {
						this.getSite2(1)
					}
				} else {
					tool.showToast(res.message)
				}
			})
		}
  }
})
