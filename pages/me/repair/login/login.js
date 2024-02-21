
Page({


  data: {

  },

 
  onLoad(options) {

  },
  getAccount(event){
    console.log(event.detail.value)
    this.setData({
      account:event.detail.value
    })
  },
  getPassword(event){
    console.log(event.detail.value)
    this.setData({
      password:event.detail.value
    })
  },
  login(){
    wx.cloud.database().collection('shop_repairmans')
    .where({
      account:this.data.account,
      password:this.data.password
    })
    .get()
    .then(res=>{
      console.log(res)
      if(res.data.length>0){
        wx.navigateTo({
          url: '/pages/me/repair/repair',
          success(){
            wx.showToast({
              title: '登录成功',
            })
          }
        })
      }else{
        wx.showToast({
          icon:'error',
          title: '账号密码错误',
        })
      }
    })
  }

  
})