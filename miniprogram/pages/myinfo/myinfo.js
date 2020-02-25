const app = getApp()
const Admin = app.DB.collection('admin');
app.Admin = Admin
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showImg:'http://b230.photo.store.qq.com/psb?/V137jxAm36USXG/6Q*0EpyGtOFocpJBLOjr3fr*17JWY*I3M7kEPcAfRqU!/b/dOYAAAAAAAAA&bo=OAQ4BDgEOAQRBzA!&rf=viewer_4',
    luList: [
    // {
    //   icon: 'about',
    //   name: '关于狗头',
    // }
    ],
    isAdmin:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let isUserInfo = wx.getStorageSync('userInfo')
    if (app.globalData.userInfo || isUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo || isUserInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.setStorageSync("userInfo", res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          wx.setStorageSync("userInfo", res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    if (this.data.isAdmin) return;
    this.onAdmin()
  },
  getUserInfo: function (e) {

    if (this.data.hasUserInfo) {
      console.log('个人信息')
    } else {
      // console.log(e, '授权登录')
      if (e.detail.errMsg === 'getUserInfo:ok') {
        app.globalData.userInfo = e.detail.userInfo
        wx.setStorageSync("userInfo", e.detail.userInfo)
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        
      }
    }
  },
  onAdmin(){
    let self = this
    Admin.get().then(res => {
      let ADMINID = res.data[0].userAdmin
      if (ADMINID) self.setData({ isAdmin: true });
    })
  },
  onAdminKey(){
    wx.navigateTo({
      url: '../../pages/admin/admin',
    })
  },
  onAlbum(){
    wx.navigateTo({
      url: '../../pages/album/album',
    })
  }
})
