const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiNum: '',
    apiKey: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onInput: function(e) {
    let name = e.target.dataset.name
    this.data[name] = e.detail.value
  },
  onSubmit: function() {
    let self = this
    if(self.data.apiKey && self.data.apiNum){
      app.Keys.add({
        data: {
          count: parseInt(self.data.apiNum),
          done: true,
          key: self.data.apiKey
        }
      })
        .then(res => {
          console.log(res)
          if (res.errMsg === app.globalData.ADD_API){
            wx.showToast({
              title: '成功',
            })
            self.setData({
              apiKey:'',
              apiNum:''
            })
          }
        })
        .catch(console.error)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})