
Page({


  data: {
    currentType:0
  },

  onLoad: function (options) {
     //获取分类
     this.getTypeList()
  },
  onShow(){

  },
  //获取分类
  getTypeList(){
    wx.cloud.database().collection('shop_types').get()
    .then(res=>{
      console.log(res)
      this.setData({
        typeList:res.data
      })
      this.getTypeGoodsList_first(res.data[0]._id)
    })
  },

  //获取对应分类下面的商品列表
  getTypeGoodsList(event){
    
    console.log(event.currentTarget.dataset.index)
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    let index = event.currentTarget.dataset.index

    this.setData({
      currentType:index
    })

    wx.cloud.database().collection('shop_goods')
    .where({
      type:id,
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
  //获取对应分类下面的商品列表
  getTypeGoodsList_first(id){
    
    wx.cloud.database().collection('shop_goods')
    .where({
      type:id,
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
  }

})