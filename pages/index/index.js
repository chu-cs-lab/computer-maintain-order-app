Page({
  data: {
    loading: true,
    imgLoaded: false
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
    this.setData({
      goodsList: res.data,
    });
  },
  toGoodDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goodDetail/goodDetail?id=" + id,
    });
  },
  imgLoadSuccess(){
    this.setData({
      imgLoaded: true,
      loading:false
    })
  },
  toSearch() {
    wx.navigateTo({
      url: "/pages/index/search/search",
    });
  },
});