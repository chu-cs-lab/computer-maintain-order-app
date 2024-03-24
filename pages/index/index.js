Page({

  data: {
    
  },

 
  onLoad: function (options) {
    
    //获取轮播图数据库记录
    this.getBanners()

    //获取分类
    this.getTypeList()

    
  },
  onShow(){
    //获取商品列表
    this.getGoodsList()
  },
  //获取轮播图数据库记录
  getBanners(){

    wx.cloud.database().collection('shop_banners').get()
    .then(res=>{
      
      this.setData({
        bannerList:res.data
      })
    })


  },
  toBannerDetail(event){
    
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/bannerDetail/bannerDetail?id=' + id ,
    })
  },
  getTypeList(){
    wx.cloud.database().collection('shop_types')
    .where({
      isShowOnHome:true
    })
    .get()
    .then(res=>{
      
      this.setData({
        typeList:res.data
      })
    })
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
  toTypeDetail(event){
    
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/typeDetail/typeDetail?id=' + id,
    })

  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  }
  
})