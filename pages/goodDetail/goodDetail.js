const app = getApp()
const util = require('../../utils/util.js')
Page({


  data: {

  },
  previewCover(event){
    console.log(event)
    wx.previewImage({
      current:event.currentTarget.dataset.src,//当前图片地址
      urls: [event.currentTarget.dataset.src],//所有娱乐图片的的地址的集合
    })
  },
  previewImage(event){
    console.log(event)
    wx.previewImage({
      current:event.currentTarget.dataset.src,//当前图片地址
      urls: this.data.good.images,//所有娱乐图片的的地址的集合
    })
  },

  onLoad: function (options) {

    console.log('用户信息',app.globalData.userInfo)

    console.log(options)
    this.setData({
      goodId:options.id
    })

    //根据传过来的id来查询商品
    wx.cloud.database().collection('shop_goods').doc(options.id).get()
    .then(res=>{
      console.log(res)
      this.setData({
        good:res.data
      })
      //库存或者商品状态的拦截
      if(res.data.stockNumber<=0){
        wx.navigateBack({
          delta: 0,
          success(){
            wx.showToast({
              icon:'error',
              title: '库存不足',
            })
          }
        })
      }
      if(res.data.status==false){
        wx.navigateBack({
          delta: 0,
          success(){
            wx.showToast({
              icon:'error',
              title: '商品已下架',
            })
          }
        })
      }
    })

    //设置购物车商品数量
    console.log(app.globalData.cartList)
    this.setData({
      cartList: app.globalData.cartList
    })

    //获取评论内容
    this.getGoodComment()

    //获取收藏情况
    this.getCollectStatus()
  },
  //获取评论内容
  getGoodComment(){
    //根据传过来的id来查询商品
    wx.cloud.database().collection('shop_comments')
    .where({
      goodId:this.data.goodId
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        commentList:res.data
      })
    })
  },
  //分享给好友
  onShareAppMessage(){

   return {
      title: this.data.good.title,
      path:'/pages/goodDetail/goodDetail?id=' + this.data.good._id,
      imageUrl:this.data.good.cover
   }
  },
  //分享到朋友圈
  onShareTimeline(){
   return {
     title:this.data.good.title,
     query :{
        id:this.data.good._id
     },
     imageUrl:this.data.good.cover
    }
  },
  //添加当前商品到购物车
  addCart(){

    //登录拦截
    if(!app.globalData.userInfo){
      wx.switchTab({
        url: '/pages/me/me',
        success(){
          wx.showToast({
            icon:'error',
            title: '请登录',
          })
        }
      })
      return
    }


    let cartList = app.globalData.cartList
    let index = -1
    if(cartList.lengh == 0){
      this.data.good.number = 1
      //默认是选中状态
      this.data.good.choose = true
      app.globalData.cartList.push(this.data.good)
      wx.setStorageSync('cartList', app.globalData.cartList)
    }else{
      for(let idx in cartList){
        console.log(idx)
        if(cartList[idx]._id == this.data.good._id){
          index = idx
        }
      }
      if(index != -1){
        //库存判断
        if(cartList[index].number + 1 > this.data.good.stockNumber){
          wx.showToast({
            icon:'error',
            title: '库存不足',
          })
          return
        }
        cartList[index].number =  cartList[index].number + 1
        app.globalData.cartList = cartList
        wx.setStorageSync('cartList', app.globalData.cartList)
      }else{
        this.data.good.number = 1
        //默认是选中状态
        this.data.good.choose = true
        app.globalData.cartList.push(this.data.good)
        wx.setStorageSync('cartList', app.globalData.cartList)
      }
    }

    wx.showToast({
      title: '添加成功！',
    })
    this.setData({
      cartList: app.globalData.cartList
    })
    
    
  },
  toOrder(){

    //登录拦截
    if(!app.globalData.userInfo){
      wx.switchTab({
        url: '/pages/me/me',
        success(){
          wx.showToast({
            icon:'error',
            title: '请登录',
          })
        }
      })
      return
    }


    let orderList = []
    this.data.good.number = 1
    orderList.push(this.data.good)
    app.globalData.orderList = orderList

    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  toCart(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  collect(){
    wx.cloud.database().collection('shop_collects')
    .add({
      data:{
        cover:this.data.good.cover,
        title:this.data.good.title,
        price:this.data.good.price,
        goodId:this.data.good._id,
        time:util.formatTime(new Date())
      }
    })
    .then(res=>{
      console.log(res)
      wx.showToast({
        title: '收藏成功',
      })
      this.getCollectStatus()
    })
  },
  //获取收藏情况
  getCollectStatus(){
    wx.cloud.database().collection('shop_collects')
    .where({
      _openid:app.globalData.openid,
      goodId: this.data.goodId
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.data.length > 0){
        this.setData({
          isCollected:true
        })
      }else{
        this.setData({
          isCollected:false
        })
      }
    })
  },
  cancelCollect(){
    wx.cloud.database().collection('shop_collects')
    .where({
      _openid:app.globalData.openid,
      goodId: this.data.goodId
    })
    .get()
    .then(res=>{
      console.log(res)
      wx.cloud.database().collection('shop_collects')
      .doc(res.data[0]._id)
      .remove()
      .then(result=>{
        wx.showToast({
          title: '取消成功',
        })
        this.getCollectStatus()
      })
    })
  }
})