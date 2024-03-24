const app = getApp();
Page({
  data: {},

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },
  onLoad: function (options) {},
  toMyOrder() {
    wx.navigateTo({
      url: "/pages/me/myOrders/myOrders",
    });
  },

  login() {
    wx.getUserProfile({
      desc: "用于完善用户信息",
    }).then((res) => {
      this.setData({
        userInfo: res.userInfo,
      });

      wx.cloud
        .database()
        .collection("shop_users")
        .where({
          _openid: app.globalData.openid,
        })
        .get()
        .then((result) => {
          if (result.data.length == 0) {
            //添加用户数据到数据库
            wx.cloud
              .database()
              .collection("shop_users")
              .add({
                data: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                },
              })
              .then((addResult) => {
                //获取数据库用户信息
                app.getUserInfo();

                wx.showToast({
                  title: "登录成功",
                });
              });
          } else {
            wx.cloud
              .database()
              .collection("shop_users")
              .doc(result.data[0]._id)
              .update({
                data: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                },
              })
              .then((updateResult) => {
                //获取数据库用户信息
                app.getUserInfo();

                wx.showToast({
                  title: "登录成功",
                });
              });
          }
        });
    });
  },
  loinOut() {
    app.globalData.userInfo = null;
    wx.setStorageSync("userInfo", null);
    this.setData({
      userInfo: null,
    });
  },
  toKefu() {
    wx.navigateTo({
      url: "/pages/me/kefu/kefu",
    });
  },
  toFeedback() {
    wx.navigateTo({
      url: "/pages/me/feedback/feedback",
    });
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
