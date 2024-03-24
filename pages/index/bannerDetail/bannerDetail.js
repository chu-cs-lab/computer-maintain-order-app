
Page({


  data: {

  },


  onLoad: function (options) {
    

    //根据传过来的id来查询轮播图数据
    wx.cloud.database().collection('shop_banners').doc(options.id).get()
    .then(res=>{
      
      this.setData({
        banner:res.data
      })
    })

  },

 
})