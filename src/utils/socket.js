import {getCompanyConnectConfig, updateConnectConfig} from '../api/im.js'
import store from "../store/index"
const io = require('./weapp.socket.io.js')

const sleep = async function(time) {
	return new Promise((reslove) => {
		setTimeout(() => {
			reslove()
		}, time)
	})
}

wx.setStorageSync('socket_connect_status', "disconnect")
class Socket {
  constructor() {
		this.onLineStatus = 'OFF_LINE'
    this.disconnectFlag = false // 重连锁,
    this.imReconnect = 3
    this.maxReconnectTime = 60 // 重连接次数-----------
    this.socket = null // socket客户端
    this.timeoutObj = null // 心跳定时器
		this.socketUrl = null
		this.heartBeatInterval = 1000 * 60 * 3
		this.tasks = []
    // 自定义事件名
    this.eventNames = {
      onDisconnect: true,
      heartBeatEvent: true,
      conversation: true,
      convrMsg: true,
			convrEvent: true,
			msgTest: true
    }
  }
  // 创建socket连接
  async createSocket(isHasConnect) {
		wx.showLoading({
			title: '会话连接中'
		})

		this.resetSocket(isHasConnect)
		const res = await this.getSocketUrl()
    if (res.code !== 1 && !this.socketUrl) {
      if (this.imReconnect === 1) {
        return
      }
			this.imReconnect = this.imReconnect - 1
			await sleep(5000)
      this.createSocket(true) // 第一次返回undefined
    } else {
			console.info('开始连接');
			// 无限重连
			if (!this.socket) {
				this.onLineStatus = store.data.chatList.seatInfo.onLineStatus
				this.socket = io(`${this.socketUrl}?sessionId=${wx.getStorageSync('sessionId')}&onLine=${store.data.chatList.seatInfo.onLineStatus}`,
				{
					reconnect: false,
					forceNew: false,
					transports: ['websocket']
				})
				this.socket.open()
			}
			this.initEventHandle()
    }
	}

  async getSocketUrl() {
    let params = {
      status: "ON_LINE"
		}
		let res = await getCompanyConnectConfig(params)
    if (res.code === 1) {
      this.socketUrl = `${res.data.adrr}${res.data.namespace}`
    }
    return res
	}

  resetSocket(isHasConnect) {
    if (!isHasConnect) {
      this.imReconnect = 3
    }
    this.disconnectFlag = false
    this.maxReconnectTime = 60
    // this.socket = null
    this.socketUrl = null
		this.resetHeartCheck()
    this.close()
  }
  // 初始化socket事件
  initEventHandle() {
		let socket = this.socket
    // socket客户端连接事件
    socket.on('connect', () => {
			wx.setStorageSync('socket_connect_status', "connect")
      this.heartCheck() // 启动心跳
			this.disconnectFlag = false
			wx.hideLoading()
			this.connectHook && this.connectHook()
    })
    // socket业务连接成功，，，业务事件关闭手动断开
    socket.on('connectEvent', data => {
      console.log('业务事件', data)
    })
    // 心跳监听----------------------发送心跳的回调
    socket.on('heartBeatEvent', data => {
			console.log('心在跳', data)
      if (data.code !== 1) {
        console.log('心跳报错', data.message)
        if (data.code == 200) {
          this.close()
        } else {
          this.close()
          this.createSocket()
        }
      }
    })
    // socket客户端掉线事件，退出close， disconnect事件触发,服务端断开连接（单人登录，触发）
    socket.on('disconnect', reason => {
			wx.setStorageSync('socket_connect_status', "disconnect")
      console.log('断开客户端的连接 disconnect', reason)
      this.resetHeartCheck()
			if ((reason === 'io server disconnect' || reason === 'transport close')
					 && !this.disconnectFlag) {
				// transport close
        // ping超时-transport error-server断开触发
        console.log('socket 服务断开去open重连')
        this.disconnectFlag = true
				this.createSocket()
				this.disconnectHook && this.disconnectHook()
      }
    })
    // socket客户端重连错误事件
    socket.on('reconnect_error', error => {
			socket.io.opts.transports = ['websocket'];
			console.error('reconnect_error', error)
			this.close()
    })
    // socket客户端重连失败事件, socket重连多次也连不上-----
    socket.on('reconnect_failed', reconnectionAttempts => {
			wx.showLoading({
				title: 'socket客户端重连失败事件, socket重连多次也连不上'
			})
      console.error('reconnect_failed', reconnectionAttempts)
      // 重连失败，关闭重新创建连接
      this.close()
    })
    // socket客户端,连接超时超时重连
    socket.on('reconnect', timeout => {
			console.error('reconnect', timeout)
    })
    // socket客户端
    socket.on('connect_timeout', timeout => {
      console.error('connect_timeout', timeout)
    })
    socket.on('connect_error', error => {
			console.error('connect_error', error)
			// this.createSocket()
    })
    // socket客户端
    socket.on('reconnect_attempt', data => {
      // 解决返回节点错误，然后尝试重连
      console.error('reconnect_attempt', data)
		})
		socket.on('convrMsg', data => {
			// this.convrMsg && this.convrMsg(data)
			this.tasks['convrMsg'].forEach(fn => {
				fn(data)
			})
		})
		socket.on('convrEvent', data => {
			// this.convrEvent && this.convrEvent(data)
			this.tasks['convrEvent'].forEach(fn => {
				fn(data)
			})
		})

  }
  // 心跳检测(),重置重新开始心跳-------------------
  heartCheck() {
    // 发送心跳消息
    this.timeoutObj = setInterval(() => {
      const params = {
        sessionId: wx.getStorageSync('sessionId'),
        createTime: new Date().getTime()
      }
      console.log(params, '心跳参数')
      this.emit('heartBeatEvent', {
        ...params
      })
    },  this.heartBeatInterval)
  }
  // 清空心跳
  resetHeartCheck() {
    // 清空上一次心跳的倒计时
    clearInterval(this.timeoutObj)
    return this
  }
  // 检测事件是否注册---------------
  checkEvent(eventName) {
    let validEvent = this.eventNames[eventName]
    return !!validEvent
  }
  // 重写socket客户端emit方法-------------
  emit(type, data) {
    if (this.checkEvent(type) && this.socket) {
      this.socket.emit(type, data)
    }
  }
  // 重写socket客户端on事件-----------
  on({type, eventId}, fn) {
    if (this.checkEvent(type)) {
			if (!this.tasks[type]) {
				this.tasks[type] = []
			}
			fn.eventId = eventId
			this.tasks[type].push(fn)
      // this.socket.on(type, data => {
      //   fn(data)
      // })
    }
	}
	off({type, eventId}) {
		this.tasks[type] = this.tasks[type].filter(fn => fn.eventId !== eventId)
	}
  // 主动关闭socket连接和业务连接
  close() {
    if (this.socket) {
      console.log(
        '触发断开' + wx.getStorageSync('sessionId') + '的业务连接',
        '停止心跳',
        '断开客户端连接',
        '销毁客户端'
      )
      // 业务断线
      this.socket.emit('onDisconnect', {
        sessionId: wx.getStorageSync('sessionId')
      })
      // 系统短线
			this.socket.close()
			updateConnectConfig({status: "OFF_LINE"})
			wx.setStorageSync('socket_connect_status', "disconnect")
			this.socket = null
    }
	}
}

export default new Socket()
