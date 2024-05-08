Page({
  data: {
    cloudImgList: [],
  },

  onLoad(options) {
    this.setData({
      orderId: options.orderId,
    });
  },
  getText(e) {
    this.setData({
      text: e.detail.value,
    });
  },
  chooseImage() {
    var that = this;
    wx.chooseMedia({
      count: 3,
      success(res) {
        that.data.tempImgList = res.tempFilePaths;
        that.uploadImages();
      },
    });
  },
  uploadImages() {
    var that = this;
    for (var l in this.data.tempImgList) {
      wx.cloud.uploadFile({
        cloudPath: `repairmanImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[l].match(/\.(\w+)$/)[1]}`,
        filePath: this.data.tempImgList[l],
        success(res) {
          that.data.cloudImgList.push(res.fileID);
          that.setData({
            cloudImgList: that.data.cloudImgList,
          });
        },
      });
    }
  },
  deleteImg(e) {
    this.data.cloudImgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      cloudImgList: this.data.cloudImgList,
    });
  },
  submit() {
    if(!(this.data.cloudImgList&&this.data.text)){
      wx.showToast({
        title: '填写不完整，请检查',
        icon: 'none'
      })
      return;
    }
    var that =  this
    wx.showModal({
      title: "提示",
      content: "确认提交吗",
      confirmText: "确定",
    }).then((res) => {
      if (res.confirm == true) {
        wx.cloud
          .database()
          .collection("shop_orders")
          .doc(this.data.orderId)
          .update({
            data: {
              repairNote: this.data.text,
              repairImages: this.data.cloudImgList,
            },
          })
          .then((result) => {
            wx.navigateBack({
              delta: 0,
              success() {
                wx.showToast({
                  title: "提交成功",
                });
              },
            });
          });
      } else {
      }
    });
  },
});
