const app = getApp();
const util = require("../../utils/util.js");
Page({
  data: {
    timeList:[
      "8:00-10:00",
      "10:00-12:00",
      "14:00-16:00",
      "16:00-18:00",
      "18:00-20:00"
    ],
    timeIndex:0
  },

  onLoad: function (options) {

    this.setData({
      orderList: app.globalData.orderList,
    });
    this.total();

    //读取缓存里的地址
    let repairLocation = wx.getStorageSync("repairLocation");
   if(repairLocation){
    this.setData({
      phone: repairLocation.telNumber,
      name: repairLocation.userName,
      repairLocation:
        repairLocation.provinceName +
        repairLocation.cityName +
        repairLocation.countyName +
        repairLocation.detailInfo,
    });
   }
  },
  add(event) {
    let index = event.currentTarget.dataset.index;

    //库存判断
    if (
      this.data.orderList[index].number + 1 >
      this.data.orderList[index].stockNumber
    ) {
      wx.showToast({
        icon: "error",
        title: "库存不足",
      });
      return;
    }

    this.data.orderList[index].number = this.data.orderList[index].number + 1;
    //
    this.setData({
      orderList: this.data.orderList,
    });

    //计算合计
    this.total();
  },
  reduce(event) {
    let index = event.currentTarget.dataset.index;
    if (this.data.orderList[index].number != 1) {
      this.data.orderList[index].number = this.data.orderList[index].number - 1;
    } else {
      wx.showToast({
        title: "当前数量已经不能减少了",
        icon: "none",
      });
    }
    this.setData({
      orderList: this.data.orderList,
    });

    //计算合计
    this.total();
  },
  //计算合计价格
  total() {
    let sum = 0;
    let totalNumber = 0;
    for (let index in this.data.orderList) {
      sum =
        sum +
        this.data.orderList[index].price * this.data.orderList[index].number;

      totalNumber = totalNumber + this.data.orderList[index].number;
    }
    this.setData({
      sum: sum.toFixed(2),
      totalNumber,
    });
  },
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  inputLocation: function(e) {
    this.setData({
      repairLocation: e.detail.value
    });
  },
  getNote(event) {
    this.setData({
      note: event.detail.value,
    });
  },
  addOrder() {
    if(!(this.data.name && this.data.phone && this.data.repairLocation && this.data.chooseDate && this.data.chooseTime)){
      wx.showToast({
        title: '信息不完整!请检查',
        icon: 'none'
      })
      return;
    }
    wx.cloud
      .database()
      .collection("shop_orders")
      .add({
        data: {
          name: this.data.name,
          phone: this.data.phone,
          repairLocation: this.data.repairLocation,
          goods: this.data.orderList,
          totalMoney: Number(this.data.sum),
          time: util.formatTime(new Date()),
          note: this.data.note,
          status: -1,
          //预约维修时间
          yuyueTime: this.data.chooseDate + " " + this.data.chooseTime,
        },
      })
      .then((res) => {
        let orderId = res._id;
        this.setData({
          orderId,
        });

        //调起虚拟支付
        this.confirmOrder();
      });
  },
  confirmOrder() {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "是否确定预约该服务？",
      confirmText: "是",
      cancelText: "否",
    }).then((res) => {
      if (res.confirm == true) {
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderId)
          .update({
            data: {
              status: 0,
            },
          })
          .then((result) => {
            //从订单列表里面清除订单列表里面的服务
            if(app.globalData.isOneKey){
            that.clearCartList();
            }
            //添加服务销量  减去对应库存数量
            that.addSaleNumber();

            wx.navigateBack({
              delta: 0,
              success() {
                wx.showToast({
                  title: "预约成功",
                });
              },
            });
          });
      } else {
        wx.navigateBack({
          delta: 0,
          success() {
            wx.showToast({
              icon: "error",
              title: "支付失败",
            });
          },
        });
      }
    });
  },
  clearCartList() {
    for (let i in app.globalData.cartList) {
      for (let j in app.globalData.orderList) {
        if (app.globalData.orderList[j]._id == app.globalData.cartList[i]._id) {
          app.globalData.cartList.splice(i, 1);
        }
      }
    }
    wx.setStorageSync("cartList", app.globalData.cartList);
  },
  //添加服务销量  减去对应库存数量
  addSaleNumber() {
    for (let l in app.globalData.orderList) {
      wx.cloud
        .database()
        .collection("shop_goods")
        .doc(app.globalData.orderList[l]._id)
        .update({
          data: {
            saleNumber: wx.cloud
              .database()
              .command.inc(app.globalData.orderList[l].number),
            stockNumber: wx.cloud
              .database()
              .command.inc(-app.globalData.orderList[l].number),
          },
        })
        .then((res) => {});
    }
  },
  pay() {},

  chooseDate(e) {
    this.setData({
      chooseDate: e.detail.value,
    });
  },
  chooseTime(e) {
    this.setData({
      chooseTime: this.data.timeList[e.detail.value],
      timeIndex : e.detail.value
    });
  },
});
