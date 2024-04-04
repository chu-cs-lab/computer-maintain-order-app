var app =getApp()
Page({
  data: {},

  onLoad(options) {},
  login() {
    wx.cloud
      .database()
      .collection("shop_users")
      .where({
        isStuff: true,
        _openid: app.globalData.openid
      })
      .get()
      .then((res) => {
        if (res.data.length > 0) {
          wx.navigateTo({
            url: "/pages/me/repair/repair",
          });
        } else {
          wx.showToast({
            icon: "none",
            title: "请向管理员申请成为维修员",
            duration:600
          }).then(()=>{
            setTimeout(()=>{
              wx.navigateBack()
            },700)
          });
          
        }
      });
  },
  onShow(){
    this.login()
  }
});
