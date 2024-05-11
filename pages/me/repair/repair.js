const app = getApp();
Page({
  data: {
    status: 0,
    whereObj: {
      status: 0,
    },
  },

  onLoad: function (options) {
    this.getOrderList();
  },
  onShow: function () {
    this.getOrderList();
  },
  choooType(event) {
    let status = event.currentTarget.dataset.type;
    let whereObj = {};
    if (status != 0) {
      whereObj.status = Number(status);
      whereObj.repairmanOpenid = app.globalData.openid;
    } else {
      whereObj.status = Number(status);
    }
    this.setData({
      whereObj,
      status,
    });

    this.getOrderList();
  },
  getOrderList() {
    wx.cloud.callFunction({
      name: "dbSelect",
      data: {
        where: this.data.whereObj
      },
      success: res => {
        console.log(res);
        this.setData({
          orderList: res.result.list          
        });
      },
    })
  },

  pay(event) {
    let index = event.currentTarget.dataset.index;

    wx.showModal({
      title: "提示",
      content: "是否支付服务价格" + this.data.orderList[index].totalMoney + "元",
      confirmText: "支付",
    }).then((res) => {
      if (res.confirm == true) {
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderList[index]._id)
          .update({
            data: {
              status: 0,
            },
          })
          .then((result) => {
            wx.showToast({
              title: "预约成功",
            });
            this.getOrderList();

            //添加服务销量  减去对应库存数量
            this.addSaleNumber(index);
          });
      } else {
        wx.showToast({
          icon: "error",
          title: "支付失败",
        });
      }
    });
  },

  cancel(event) {
    let index = event.currentTarget.dataset.index;

    wx.showModal({
      title: "提示",
      content: "是否取消此订单",
      confirmText: "确定",
    }).then((res) => {
      if (res.confirm == true) {
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderList[index]._id)
          .update({
            data: {
              status: -2,
            },
          })
          .then((result) => {
            wx.showToast({
              title: "取消成功",
            });
            //退款
            this.refund();
            this.getOrderList();
          });
      } else {}
    });
  },
  //退款
  refund() {},

  toComment(event) {
    wx.navigateTo({
      url: "/pages/me/myOrders/comment/comment?id=" +
        event.currentTarget.dataset.id +
        "&goodName=" +
        event.currentTarget.dataset.title +
        "&orderId=" +
        event.currentTarget.dataset.orderid,
    });
  },
  //添加服务销量  减去对应库存数量
  addSaleNumber(index) {
    for (let l in this.data.orderList[index].goods) {
      wx.cloud
        .database()
        .collection("shop_goods")
        .doc(this.data.orderList[index].goods[l]._id)
        .update({
          data: {
            saleNumber: wx.cloud
              .database()
              .command.inc(this.data.orderList[index].goods[l].number),
            stockNumber: wx.cloud
              .database()
              .command.inc(-this.data.orderList[index].goods[l].number),
          },
        })
        .then((res) => {});
    }
  },
  //接单
  jiedan(event) {
    let index = event.currentTarget.dataset.index;

    wx.showModal({
      title: "提示",
      content: "确认接单吗",
      confirmText: "确定",
    }).then((res) => {
      if (res.confirm == true) {
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderList[index]._id)
          .update({
            data: {
              status: 1,
              repairmanOpenid: app.globalData.openid,
            },
          })
          .then((result) => {
            wx.showToast({
              title: "接单成功",
            });
            this.getOrderList();
          });
      } else {}
    });
  },
  toUploadImage(event) {
    let index = event.currentTarget.dataset.index;

    wx.navigateTo({
      url: "/pages/me/repair/uploadImage/uploadImage?orderId=" +
        this.data.orderList[index]._id,
    });
  },
  toRepairResult(event) {
    let index = event.currentTarget.dataset.index;

    wx.navigateTo({
      url: "/pages/me/repair/repairResult/repairResult?orderId=" +
        this.data.orderList[index]._id,
    });
  },
  previewImage(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.src, //当前图片地址
      urls: this.data.orderList[event.currentTarget.dataset.index].repairImages, //所有娱乐图片的的地址的集合
    });
  },
});