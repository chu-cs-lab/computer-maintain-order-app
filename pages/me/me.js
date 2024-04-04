const app = getApp();

Page({
  data: {
    userInfo: null
  },

  onShow() {
    if(app.globalData.userInfo !== null){
      this.setData({
        userInfo: app.globalData.userInfo,
      });

     
    } 
  },
  onLoad: function (options) {},
  toMyOrder() {
    wx.navigateTo({
      url: "/pages/me/myOrders/myOrders",
    });
  },
 login(){
  wx.navigateTo({
    url: 'userProfile/userProfile',
  })
 },
logout(){
  wx.setStorageSync('userInfo', null);
  this.setData({
    userInfo: null
  })
  app.globalData.userInfo = null;
},
  toCollect() {
    wx.navigateTo({
      url: "/pages/me/collect/collect",
    });
  },
  toRepair() {
    wx.navigateTo({
      url: "/pages/me/repair/login/login",
    });
  },
});
