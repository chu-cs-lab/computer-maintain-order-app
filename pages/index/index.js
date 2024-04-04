Page({
  data: {
    loading: true
  },

  onLoad: function (options) {},
  async onShow() {

    //获取服务列表
    await this.getGoodsList();
      this.setData({
        loading: false
      })
  },
  async getGoodsList() {
    const res = await wx.cloud
      .database()
      .collection("shop_goods")
      .where({
        status: true,
        isHome: true,
      })
      .get()
      console.log(res.data)
    this.setData({
      goodsList: res.data,
    });
    console.log(1111)
  },
  toGoodDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goodDetail/goodDetail?id=" + id,
    });
  },
  toSearch() {
    wx.navigateTo({
      url: "/pages/index/search/search",
    });
  },
});