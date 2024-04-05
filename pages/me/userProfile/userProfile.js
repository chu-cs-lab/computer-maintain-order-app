const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp();

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: ''
    }
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
    })
  },

  onInputChange(e) {
    const nickName = e.detail.value
    this.setData({
      "userInfo.nickName": nickName
    })
  },
  async confirmLogin() {
    var that = this
    wx.cloud
      .database()
      .collection("shop_users")
      .where({
        _openid: app.globalData.openid,
      })
      .get()
      .then((result) => {
        if(!that.data.userInfo.nickName){
          wx.showToast({
            title: '请输入昵称！',
            icon: 'error'
          })
          return
        }
        if (result.data.length == 0) {
          //添加用户数据到数据库
          wx.cloud
            .database()
            .collection("shop_users")
            .add({
              data: {
                avatarUrl: that.data.userInfo.avatarUrl,
                nickName: that.data.userInfo.nickName,
              },
            })
            .then(async (addResult) => {
              //获取数据库用户信息
              app.getUserInfo().then(() => {
                wx.showToast({
                  title: "登录成功",
                }).then(() => {
                  wx.navigateBack()
                })
              });
            });
        } else {
          wx.cloud
            .database()
            .collection("shop_users")
            .doc(result.data[0]._id)
            .update({
              data: {
                avatarUrl: that.data.userInfo.avatarUrl,
                nickName: that.data.userInfo.nickName,
              },
            })
            .then(async (updateResult) => {
              //获取数据库用户信息
             app.getUserInfo().then(() => {
                wx.showToast({
                  title: "登录成功",
                }).then(() => {
                  wx.navigateBack()
                })
              });

            });
        }
      });

  }
})