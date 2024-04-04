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
    // if(app.globalData.orderList.length<10){
    //   wx.navigateBack({
    //     delta: 0,
    //     success(){
    //       wx.showToast({
    //         icon:'error',
    //         title: '数量小于10',
    //       })
    //     }
    //   })
    // }

    this.setData({
      orderList: app.globalData.orderList,
    });
    this.total();

    //读取缓存里的地址
    let address = wx.getStorageSync("address");
   if(address){
    this.setData({
      phone: address.telNumber,
      name: address.userName,
      address:
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo,
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
  addAddress() {
    let that = this;
    wx.chooseAddress({
      success: (result) => {
        that.setData({
          phone: result.telNumber,
          name: result.userName,
          address:
            result.provinceName +
            result.cityName +
            result.countyName +
            result.detailInfo,
        });
        wx.setStorageSync("address", result);
      },
    });
  },
  getNote(event) {
    this.setData({
      note: event.detail.value,
    });
  },
  addOrder() {
    if(!(this.data.name && this.data.phone && this.data.address && this.data.chooseDate && this.data.chooseTime)){
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
          address: this.data.address,
          goods: this.data.orderList,
          totalMoney: Number(this.data.sum),
          time: util.formatTime(new Date()),
          note: this.data.note,
          status: -1,
          //预约时间
          yuyueTime: this.data.chooseDate + " " + this.data.chooseTime,
          //-2: 取消订单
          //-1：待支付
          // 0: 待发货
          // 1：待收货 +已发货 ；
          // 2：待评价 ；
          // 3：已完成
        },
      })
      .then((res) => {
        let orderId = res._id;
        this.setData({
          orderId,
        });

        //调起微信支付
        this.pay();

        //调起虚拟支付
        this.xuniPay();
      });
  },
  xuniPay() {
    let that = this;
    wx.showModal({
      title: "提示",
      content: "是否支付服务价格" + this.data.sum + "元",
      confirmText: "支付",
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
            that.clearCartList();

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
    console.log(e);
    this.setData({
      chooseTime: this.data.timeList[e.detail.value],
      timeIndex : e.detail.value
    });
  },
});
