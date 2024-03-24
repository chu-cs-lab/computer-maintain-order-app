
Page({


  data: {

  },


  onLoad: function (options) {

  },
  getValue(event){
    
    let inputValue = event.detail.value
    this.setData({
      inputValue
    })
    

  },
  search(){
    wx.cloud.database().collection('shop_goods').where({
      title: wx.cloud.database().RegExp({
        regexp: this.data.inputValue,
        options:'i'
      }),
      status:true,
      stockNumber:wx.cloud.database().command.gt(0)//库存数量必须大于0
    }).get()
    .then(res=>{
      
      this.setData({
        goodList:res.data
      })
    })
  },
  toGoodDetail(event){
    
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id ,
    })
  },
  
})