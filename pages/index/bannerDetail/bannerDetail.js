
Page({


  data: {

  },


  onLoad: function (options) {
    console.log(options.id)

    //根据传过来的id来查询轮播图数据
    wx.cloud.database().collection('shop_banners').doc(options.id).get()
    .then(res=>{
      console.log(res)
      this.setData({
        banner:res.data
      })
    })

  },

 
})