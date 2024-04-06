const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    userInfo: null
  },

  async onShow() {
    if (app.globalData.userInfo !== null) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });


    } else {
      
     await this.login()
    }
  },
  onLoad: function (options) {},
  toMyOrder() {
    wx.navigateTo({
      url: "/pages/me/myOrders/myOrders",
    });
  },
  async login() {
    wx.showLoading({
      title: '登录中',
    })
   await app.getUserInfo();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      wx.hideLoading()
      this.onLoad()
      return
    }
    wx.navigateTo({
      url: 'userProfile/userProfile',
    })
  },
  async logout() {
    wx.showModal({
      title: '确认',
      content: '是否要从小程序完全注销你的用户账户？',
      complete: async (res) => {
        if (res.cancel) {
          return
        }

        if (res.confirm) {
          const userInfo = await app.getUserInfo()
          if (!userInfo) {
            wx.showToast({
              title: '注销失败',
              icon: 'error'
            })
            return
          }
          await wx.cloud
            .database()
            .collection("shop_users")
            .doc(userInfo._id).remove()
          wx.setStorageSync('userInfo', null);
          this.setData({
            userInfo: null
          })
          app.globalData.userInfo = null;
          wx.showToast({
            title: '注销成功',
            icon: 'success'
          })
        }
      }
    })

  },
  toCollect() {
    wx.navigateTo({
      url: "/pages/me/collect/collect",
    });
  },
  toRepair() {
    wx.cloud
      .database()
      .collection("shop_users")
      .where({
        isStuff: true,
        _openid: app.globalData.openid
      })
      .get()
      .then((res) => {
        if (res.data.length > 0) {
          wx.navigateTo({
            url: "/pages/me/repair/repair",
          });
        } else {
          wx.navigateTo({
            url: "/pages/me/repair/login/login",
          });
        }
      });
  },
  imgLoaded(){
    
  },
  imgLoadedError(e){
    this.setData({
      "userInfo.avatarUrl": defaultAvatarUrl
    })
    console.log(e)
  }
});
