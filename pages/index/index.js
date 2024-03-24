Page({

  data: {
    
  },

 
  onLoad: function (options) {
    
    
  },
  onShow(){
    //获取商品列表
    this.getGoodsList()
  },
  getGoodsList(){

    wx.cloud.database().collection('shop_goods')
    .where({
      status:true,
      isHome:true,
      stockNumber:wx.cloud.database().command.gt(0)//库存数量必须大于0
    })
    .get()
    .then(res=>{
      
      this.setData({
        goodsList:res.data
      })

    })

  },
  toGoodDetail(event){
    
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id ,
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  }
  
})