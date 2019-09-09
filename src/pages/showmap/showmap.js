
Page({
	data: {
		latitude: 23.099994,
		longitude: 113.324520,
		title: "123",
		addr: "123",
		markers: [{
			id: 1,
			latitude: 23.099994,
			longitude: 113.324520,
			name: 'T.I.T 创意园'
		}]
	},
	onLoad(query) {
		const {latitude, longitude, title, addr} = query
		if (latitude) {
			// this.setData({
			// 	latitude,
			// 	longitude,
			// 	title,
			// 	addr,
			// 	markers: [{
			// 		id: 1,
			// 		latitude,
			// 		longitude,
			// 		name: title
			// 	}]
			// })
			this.show({latitude, longitude})
		}
	},
	show({latitude, longitude}) {
		wx.openLocation({
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
			scale: 18
		})
		// wx.getLocation({
		// 	type: 'gcj02', //返回可以用于wx.openLocation的经纬度
		// 	success (res) {
		// 		const latitude = res.latitude
		// 		const longitude = res.longitude
		// 		wx.openLocation({
		// 			latitude,
		// 			longitude,
		// 			scale: 18
		// 		})
		// 	}
		//  })
	}
})