Page({
  data: {},

  onLoad(options) {},
  getAccount(event) {
    this.setData({
      account: event.detail.value,
    });
  },
  getPassword(event) {
    this.setData({
      password: event.detail.value,
    });
  },
  login() {
    wx.cloud
      .database()
      .collection("shop_repairmans")
      .where({
        account: this.data.account,
        password: this.data.password,
      })
      .get()
      .then((res) => {
        if (res.data.length > 0) {
          wx.navigateTo({
            url: "/pages/me/repair/repair",
            success() {
              wx.showToast({
                title: "登录成功",
              });
            },
          });
        } else {
          wx.showToast({
            icon: "error",
            title: "账号密码错误",
          });
        }
      });
  },
});
