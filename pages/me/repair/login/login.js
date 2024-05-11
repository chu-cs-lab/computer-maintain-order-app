var app = getApp()
Page({
  data: {
    inviteCode: ''
  },

  onLoad(options) {},
  onInputChange(e) {
    const inviteCode = e.detail.value
    this.setData({
      inviteCode
    })
  },
  async verifyInviteCode() {
    let res =await wx.cloud.callFunction({
      name: "cloud",
      data: {
        route:"verifyInviteCode",
        param:{
          code:this.data.inviteCode
        }
      }
    })
    console.log(res);
    if(res.result.code !== 1){
      wx.showToast({
        title: res.result.msg,
        icon: 'error'
      })
      return false
    }else{
      return true
    }
  },
  async enterRepair() {
    const verified = await this.verifyInviteCode()
    if (!verified) {
      return false;
    }else{
      wx.showToast({
        title: "验证成功",
        icon: 'success'
      })
    }
    wx.navigateTo({
      url: '/pages/me/repair/repair',
    })
    const userInfo = await app.getUserInfo()
    wx.cloud
      .database()
      .collection("shop_users")
      .doc(userInfo._id).update({
       data:{
         isStuff: true
       }
      })
  }
});
