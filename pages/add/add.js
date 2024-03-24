const util = require("../../utils/util.js");
Page({
  data: {
    cloudDetaiImage: [], //服务详情图片
    cloudCoverImage: [], //服务封面图片
  },

  onLoad(options) {},
  onShow() {
    this.getTypeList();
  },

  //获取分类
  getTypeList() {
    wx.cloud
      .database()
      .collection("shop_types")
      .get()
      .then((res) => {
        this.setData({
          typeList: res.data,
        });
      });
  },
  getType(event) {
    this.setData({
      currentIndex: event.currentTarget.dataset.index,
      typeId: this.data.typeList[event.currentTarget.dataset.index]._id,
    });
  },

  //添加服务到数据库
  addGood(event) {
    let good = event.detail.value;

    if (!good.title) {
      wx.showToast({
        icon: "error",
        title: "名称为空",
      });
      return;
    }
    if (!good.price) {
      wx.showToast({
        icon: "error",
        title: "价格为空",
      });
      return;
    }
    if (!good.stockNumber) {
      wx.showToast({
        icon: "error",
        title: "数量为空",
      });
      return;
    }
    if (!this.data.typeId) {
      wx.showToast({
        icon: "error",
        title: "请选择类型",
      });
      return;
    }
    if (!good.contact) {
      wx.showToast({
        icon: "error",
        title: "联系为空",
      });
      return;
    }
    if (this.data.cloudCoverImage.length == 0) {
      wx.showToast({
        icon: "error",
        title: "封面图片为空",
      });
      return;
    }

    wx.cloud
      .database()
      .collection("shop_goods")
      .add({
        data: {
          title: good.title,
          price: Number(good.price),
          type: this.data.typeId,
          cover: this.data.cloudCoverImage[0],
          images: this.data.cloudDetaiImage,
          text: good.text,
          isHome: false,
          status: true,
          stockNumber: Number(good.stockNumber),
          saleNumber: 0,
          contact: good.contact,
          time: util.formatTime(new Date()),
        },
      })
      .then((res) => {
        wx.showToast({
          title: "发布成功",
        });
        this.setData({
          title: "",
          price: "",
          typeId: "",
          currentIndex: -1,
          cloudCoverImage: [],
          cloudDetaiImage: [],
          text: "",
          stockNumber: "",
          contact: "",
        });
      });
  },
  //选择详情图片
  chooseDetailImage() {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.cloudDetaiImage.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        that.data.tempImgList = res.tempFilePaths;
        //上传图片
        that.uploadImageDetail();
      },
    });
  },
  //上传详情图片到云存储
  uploadImageDetail() {
    var that = this;
    for (let l in this.data.tempImgList) {
      wx.cloud.uploadFile({
        cloudPath: `goodImage/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[l],
        success(res) {
          that.data.cloudDetaiImage.push(res.fileID);
          that.setData({
            cloudDetaiImage: that.data.cloudDetaiImage,
          });
        },
      });
    }
  },
  //删除详情图片
  deleteDetailImage(event) {
    this.data.cloudDetaiImage.splice(event.currentTarget.dataset.index, 1);
    this.setData({
      cloudDetaiImage: this.data.cloudDetaiImage,
    });
  },

  //选择封面图片
  chooseCoverImage() {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.cloudCoverImage.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        that.data.tempImgList = res.tempFilePaths;
        //上传图片
        that.uploadImageCover();
      },
    });
  },
  //上传封面图片到云存储
  uploadImageCover() {
    var that = this;
    for (let l in this.data.tempImgList) {
      wx.cloud.uploadFile({
        cloudPath: `goodImage/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[l],
        success(res) {
          that.data.cloudCoverImage.push(res.fileID);
          that.setData({
            cloudCoverImage: that.data.cloudCoverImage,
          });
        },
      });
    }
  },
  //删除封面图片
  deleteCoverImage(event) {
    this.data.cloudCoverImage.splice(event.currentTarget.dataset.index, 1);
    this.setData({
      cloudCoverImage: this.data.cloudCoverImage,
    });
  },
});
