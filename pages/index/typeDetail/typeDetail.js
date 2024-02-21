
Page({


  data: {

  },

  onLoad: function (options) {
    console.log(options)
    this.getTypeGoodsList(options.id)
  },
  getTypeGoodsList(typeId){
    wx.cloud.database().collection('shop_goods')
    .where({
      type:typeId,
      status:true,
      stockNumber:wx.cloud.database().command.gt(0)//库存数量必须大于0
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        goodsList:res.data
      })
    })
  },
  toGoodDetail(event){
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id ,
    })
  },
 
})