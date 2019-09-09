let timer = null
const options = {
  duration: 59000, // 59s
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}

function randomNum(minNum,maxNum){
 switch(arguments.length){
   case 1:
     return parseInt(Math.random()*minNum+1,10);
   break;
   case 2:
     return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
   break;
   default:
     return 0;
   break;
 }
}

Component({
 options: {
  styleIsolation: 'apply-shared',
  multipleSlots: true // 在组件定义时的选项中启用多slot支持
 },
 properties: {
  disable: {
   type: Boolean,
   value: false,
  }
 },
 data: {
  touchBtn: false
 },
 ready() {
  this.init()
  this.onStop()
 },
  methods: {
  init() {
   this.recorderManager= wx.getRecorderManager() //录音管理上下文
   this.startPoint= {} //记录长按录音开始点信息,用于后面计算滑动距离。
	 this.sendLock= true //发送锁，当为true时上锁，false时解锁发送
	 this.touching = false
	 this.hasRecordAuth = false
  },
  onStop () {
   this.recorderManager.onStop(res => {
    this.setData({touchBtn: false})
    if (this.sendLock) {
     // 上锁不发送
    } else { // 解锁发送，发送网络请求
     if (res.duration < 1000) {
      wx.showToast({
       title: "说话时间太短",
       duration: 1000
      })
     } else {
      // console.log("send")
      this.triggerEvent('stopRecord', {data: res});
     }
    }
   });
  },
  async handleRecordStart(e) {
		this.touching = true
		this.hasRecordAuth = await this.checkAuth()
		if(!this.touching) return
   if (this.hasRecordAuth) {
    this.startRecord(e)
    this.setData({touchBtn: true})
    this.showMicAni(0)
   } else {
    this.reOpenAuth()
   }
  },
  startRecord(e) {
   this.startPoint = e.touches[0]; //记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
   this.recorderManager.start(options); //
   this.sendLock = false;//长按时是不上锁的。
  },
  handleRecordStop() {
	 // touchend(手指松开)时触发
	 this.touching = false
   wx.hideToast();//结束录音、隐藏Toast提示框
   if (this.hasRecordAuth) this.recorderManager.stop();//结束录
   clearTimeout(timer)
   this.setData({touchBtn: false})
  },
	handleTouchCancel() {
		this.touching = false
	},
  handleTouchMove(e) {
   //touchmove时触发
   var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY; //移动距离
   if (Math.abs(moveLenght) > 50) {
    console.log('cancle')
    wx.showToast({
     title: '松开，取消发送',
     duration: 10000,
     image: `/image/record/cancle.png`
    })
    this.sendLock = true;//触发了上滑取消发送，上锁
   } else {
    this.showMicAni(0)
    this.sendLock = false;//上划距离不足，依然可以发送，不上锁
   }
  },
  showMicAni(i) {
	 let index = i
	 if (!this.touching) {
		 wx.hideToast()
		 return
	 }
   timer = setTimeout(() => {
    if (this.data.touchBtn && !this.sendLock) {
     wx.showToast({
      title: '上滑，取消发送',
      duration: 1000,
      image: `/image/record/${index}.png`
     })
     clearTimeout(timer)
     index = randomNum(0, 7)
     this.showMicAni(index)
    }
   }, 300)
  },
  async checkAuth() {
   return new Promise((resolve) => {
    wx.authorize({
     scope: 'scope.record',
     success: () =>  {
			// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
       this.hasRecordAuth = true
       resolve(true)
     },
     fail: () =>  {
      // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      this.hasRecordAuth = false
      resolve(false)
     }
    })
   })
  },
  reOpenAuth() {
   wx.showModal({
    title: "是否打开授权",
    content: "你当前没有授权录音功能",
    showCancel: false,
    confirmText: '去设置',
    success: () => {
     wx.openSetting({
      success (res) {
       console.log(res.authSetting)
      },
      fail (res) {
       console.log(res)
      }
     })
    }
   })
  }
 }
})