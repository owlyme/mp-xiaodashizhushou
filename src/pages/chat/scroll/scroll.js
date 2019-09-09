class ScrollPart {
  constructor({el, parentHeight, direction, wxGetHeght, wxSetPos, wxSetTransition}) {
		this.wxGetHeght = wxGetHeght
		this.wxSetPos = wxSetPos
		this.wxSetTransition = wxSetTransition
		this.downLocked = false // 允许下滑
    this.el = el
    this.bottomPos = 0
    this.direction = direction || "y" // y x
    this.height = 0
    this.PH = parentHeight
    this.startPoint = {}
    this.movingPoint = {}
    this.endPoint = {}
    this.activePointData = {} // 拖动时，鼠标的相对位移以及时间
		this.transitionTime = 0.3
		this.touching = false
		this.movingPosList = []
    this.initPos()
  }

  async initPos() {
		this.setTransition(this.transitionTime)
		await this.getScrollPartHeight()
    if (this.height < this.PH) {
			this.setBottomPos(this.PH - this.height)
      this.setPos(this.PH - this.height)
    } else {
      if (this.bottomPos >= 0) {
				this.setBottomPos(0)
        this.setPos(0)
				this.onReachBottom()
      } else if (this.bottomPos <= this.PH - this.height){
				this.setBottomPos(this.PH - this.height)
        this.setPos(this.PH - this.height)
				this.onReachTop()
      } else {
        this.animate()
      }
    }
	}
	setBottomPos(val) {
		this.bottomPos = val || 0
	}
  setPos(pos) {
		// console.log('setting', pos)
		// this.el.style.bottom = pos + 'px';
		this.wxSetPos(pos)
	}
	// 置底部
	setToBottom() {
		if (this.height > this.PH) {
			this.wxSetPos(0)
		} else {
			this.initPos()
		}
	}
	// 置顶
	setToTop() {
		this.wxSetPos(this.PH - this.height)
	}
	// 设置过度
  setTransition(time) {
		// this.el.style.transition = `all .${time}s ease-out`
		this.wxSetTransition(time)
  }
  async getScrollPartHeight() {
		this.height = await this.wxGetHeght()
		// this.height = this.el.getBoundingClientRect().height
  }
  scrollUp () {
    this.getScrollPartHeight()
    this.setTransition(this.transitionTime)
    if (this.height < this.PH) {
      this.setPos(this.PH - this.height)
    } else {
			this.setBottomPos(0)
			this.setPos(0)
    }
  }
  scrollDown () {
    this.getScrollPartHeight()
    this.setTransition(this.transitionTime)
    if (this.height < this.PH) {
      this.setPos(this.PH - this.height)
    } else {
			this.setBottomPos(this.PH - this.height)
			this.setPos(this.PH - this.height)
    }
  }
  touchstart(data) {
		this.touching = true
    this.startPoint = data
  }
  touchmoving(data) {
		if(!this.touching) return
    this.movingPoint = data
    const pointData = this.computedMovingData()
		this.setTransition(0)
		this.triggerMoving(data)
    if (this.direction === 'y') {
			if (this.downLocked && pointData.y > 0) return
      this.setPos(this.bottomPos - pointData.y)
    } else {

    }
  }
  touchend(data) {
		this.touching = false
		this.endPoint = data

		const pointData = this.computedMovingData()
		if (this.downLocked && pointData.y > 0) return

		this.setBottomPos(this.bottomPos - pointData.y)
		this.movingPosList = []
    this.initPos()
  }
  computedMovingData() {
    this.activePointData = {
      x: this.movingPoint.x - this.startPoint.x,
      y: this.movingPoint.y - this.startPoint.y,
      timeStamp: this.movingPoint.timeStamp - this.startPoint.timeStamp
    }
    return this.activePointData
  }
  setMoveEndBottomPos() {
		this.setBottomPos(this.endPoint.y - this.startPoint.y)
  }
  // 滑动状态
  animate() {
		const pointData = this.activePointData
		if (this.downLocked && pointData.y > 0) return
    if (pointData.timeStamp <= 300 && pointData.timeStamp > 10){
			this.setBottomPos(this.bottomPos - pointData.y / 300 * 700)
      console.log('this.bottomPos', this.bottomPos , pointData.y)
      pointData.timeStamp = 0
      this.setPos(this.bottomPos)
      this.initPos()
    }
	}
	// touch拖动时触发事件，并判断 向上 向下 滑动
	triggerMoving(pos) {
		let movingPosList = this.movingPosList
		movingPosList.push(pos)

		if (movingPosList.length > 2) {
			movingPosList.shift()
		}

		if (movingPosList.length === 2) {
			// console.log(movingPosList)
			const [prestep, nextstep] = movingPosList
			let type = null
			if (prestep.y > nextstep.y) {
				type = 'up'
			} else {
				type = 'down'
			}
			this.moving({type, currentPosition: nextstep})
		}
	}
  // 监听事件
  onReachTop(){}
  onReachBottom(){}
  onScroll() {}
  onStart() {}
  onEnd() {}
	moving() {}

}

export default ScrollPart
