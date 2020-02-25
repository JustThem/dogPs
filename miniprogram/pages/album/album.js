// miniprogram/pages/album/album.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbum()
  },
  showAlbum(event) {
    let current = event.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  getAlbum(){
    let self = this
    // console.log(app, 'APP---')
    app.Album.where({ _openid: app.globalData.OPENID }).get().then(res => {
      // console.log(res, '相册')
      self.setData({
        albumList: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})