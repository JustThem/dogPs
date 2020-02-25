//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      ADD_API:'collection.add:ok',
      IMG_ERROR_CODE:87014,
      DOG_HEAD:'http://b230.photo.store.qq.com/psb?/V137jxAm36USXG/6Q*0EpyGtOFocpJBLOjr3fr*17JWY*I3M7kEPcAfRqU!/b/dOYAAAAAAAAA&bo=OAQ4BDgEOAQRBzA!&rf=viewer_4'
    }
  }
})
