const app = getApp();
Page({
  data: {
    //全选的状态
    allChoose: false,
  },

  onLoad: function (options) {},
  onShow() {
    //登录拦截
    if (!app.globalData.userInfo) {
      wx.switchTab({
        url: "/pages/me/me",
        success() {
          wx.showToast({
            icon: "error",
            title: "请登录",
          });
        },
      });
      return;
    }

    this.setData({
      cartList: app.globalData.cartList,
    });

    //计算合计
    this.total();
  },
  add(event) {
    let index = event.currentTarget.dataset.index;
    this.data.cartList[index].number = this.data.cartList[index].number + 1;
    //
    this.setData({
      cartList: this.data.cartList,
    });
    //更新全局里和缓存里的的预约列表列表数据
    app.globalData.cartList = this.data.cartList;
    wx.setStorageSync("cartList", this.data.cartList);

    //计算合计
    this.total();
  },
  reduce(event) {
    let index = event.currentTarget.dataset.index;
    if (this.data.cartList[index].number != 1) {
      this.data.cartList[index].number = this.data.cartList[index].number - 1;

      this.setData({
        cartList: this.data.cartList,
      });
      //更新全局里和缓存里的的预约列表列表数据
      app.globalData.cartList = this.data.cartList;
      wx.setStorageSync("cartList", this.data.cartList);

      //计算合计
      this.total();
    } else {
      wx.showModal({
        title: "提示",
        content: "确认从预约列表删除此服务吗",
        confirmText: "确定",
      }).then((res) => {
        if (res.confirm == true) {
          this.data.cartList.splice(index, 1);

          this.setData({
            cartList: this.data.cartList,
          });
          //更新全局里和缓存里的的预约列表列表数据
          app.globalData.cartList = this.data.cartList;
          wx.setStorageSync("cartList", this.data.cartList);

          //计算合计
          this.total();
        }
      });
    }
  },
  chooseGood(event) {
    let index = event.currentTarget.dataset.index;
    this.data.cartList[index].choose = !this.data.cartList[index].choose;
    this.setData({
      cartList: this.data.cartList,
    });
    //更新全局里和缓存里的的预约列表列表数据
    app.globalData.cartList = this.data.cartList;
    wx.setStorageSync("cartList", this.data.cartList);

    //计算合计
    this.total();
  },
  toGoodDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goodDetail/goodDetail?id=" + id,
    });
  },
  //全选
  chooseAll() {
    this.setData({
      allChoose: !this.data.allChoose,
    });
    if (this.data.allChoose == true) {
      for (let index in this.data.cartList) {
        this.data.cartList[index].choose = true;
      }
    } else {
      for (let index in this.data.cartList) {
        this.data.cartList[index].choose = false;
      }
    }
    this.setData({
      cartList: this.data.cartList,
    });
    //更新全局里和缓存里的的预约列表列表数据
    app.globalData.cartList = this.data.cartList;
    wx.setStorageSync("cartList", this.data.cartList);

    //计算合计
    this.total();
  },
  //计算合计价格
  total() {
    let sum = 0;
    for (let index in this.data.cartList) {
      if (this.data.cartList[index].choose == true) {
        sum =
          sum +
          this.data.cartList[index].price * this.data.cartList[index].number;
      }
    }
    this.setData({
      sum: sum.toFixed(2),
    });
  },
  //跳入预约页面
  toOrder() {
    let orderList = [];
    for (let index in this.data.cartList) {
      if (this.data.cartList[index].choose == true) {
        orderList.push(this.data.cartList[index]);
      }
    }

    app.globalData.orderList = orderList;

    if (app.globalData.orderList.length == 0) {
      wx.showToast({
        icon: "error",
        title: "请选择服务",
      });
      return;
    }

    wx.navigateTo({
      url: "/pages/order/order",
    });
  },
});
