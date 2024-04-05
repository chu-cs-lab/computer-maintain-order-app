const app = getApp();
const util = require("../../../../utils/util.js");
Page({
  data: {},

  onLoad: function (options) {
    this.setData({
      goodId: options.id,
      goodName: options.goodName,
      orderId: options.orderId,
    });
  },
  getInputValue(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  publishComment() {
    wx.cloud
      .database()
      .collection("shop_comments")
      .add({
        data: {
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName,
          text: this.data.inputValue,
          time: util.formatTime(new Date()),
          goodId: this.data.goodId,
          goodName: this.data.goodName,
        },
      })
      .then((res) => {
        //更新订单状态为已评价
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderId)
          .update({
            data: {
              status: 3,
            },
          })
          .then((res) => {});

        wx.navigateBack({
          delta: 0,
          success() {
            wx.showToast({
              title: "提交成功",
            });
          },
        });
      });
  },
});
