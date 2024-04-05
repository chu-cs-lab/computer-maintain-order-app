let shared;
try {
  shared = require("./utils/shared.js");
} catch (e) {
  console.error("请配置 shared.js");
  shared = {
    cloud_id: "",
  };
}

App({
  onLaunch() {
    wx.cloud.init({
      env: shared.cloud_id,
    });

    if (wx.getStorageSync("cartList")) {
      this.globalData.cartList = wx.getStorageSync("cartList");
    }
    if (wx.getStorageSync("userInfo")) {
      this.globalData.userInfo = wx.getStorageSync("userInfo");
    }

    //调用云函数获取用户openid
    wx.cloud
      .callFunction({
        name: "shop_get_openid",
      })
      .then((res) => {
        this.globalData.openid = res.result.openid;
      });
  },
  async getUserInfo() {
    const res = await wx.cloud
      .database()
      .collection("shop_users")
      .where({
        _openid: this.globalData.openid,
      })
      .get()
    this.globalData.userInfo = res.data[0];

    // 存储到本地存储
    wx.setStorageSync("userInfo", res.data[0]);
    return res.data[0]

  },
  globalData: {
    userInfo: null,

    openid: null,

    //订单列表列表
    cartList: [],

    //订单列表
    orderList: null,
  },
});

// 家政预约维修小程序、在线维修报修小程序、上门维修服务小程序、预约上门服务、用户预约、工作人员接单上门服务

// {
//   "pagePath": "pages/add/add",
//   "text": "发布",
//   "iconPath": "/images/add_no.png",
//   "selectedIconPath": "/images/add_yes.png"
// },