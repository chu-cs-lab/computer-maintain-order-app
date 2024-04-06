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
    if (!this.data.inviteCode) {
      return false
    }
    const result = await wx.cloud
      .database()
      .collection("invite_code_list")
      .where({
        invite_code: this.data.inviteCode,
      })
      .get()
    if (result.data.length !== 0) {
      return true
    } else {

      return false
    }
  },
  async enterRepair() {
    const verified = await this.verifyInviteCode()
    if (!verified) {
      wx.showToast({
        title: '邀请码不存在',
        icon: 'error'
      })
      return
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
