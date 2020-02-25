//index.js
const app = getApp()
const Bs = require('../../Base64.js').Bs
const DB = wx.cloud.database({
  env: 'doghead-zewrd'
});
app.DB = DB
const Keys = app.DB.collection('api-key');
const Album = app.DB.collection('user-album')
app.Keys = Keys
app.Album = Album
Page({
  data: {
    isRemove: false,
    isShow: false,
    isCheck:false,
    isDone: false,
    isChoose: false,
    showImg: 'http://b230.photo.store.qq.com/psb?/V137jxAm36USXG/6Q*0EpyGtOFocpJBLOjr3fr*17JWY*I3M7kEPcAfRqU!/b/dOYAAAAAAAAA&bo=OAQ4BDgEOAQRBzA!&rf=viewer_4',
    showFile: '',
    isSubmit: false,
    bs64Img: '',
    wxData: {
      size: 'auto',
      bg_color: '438EDB'
    },
    apiNum: 0,
    apiIndex: 0,
    apiKey: "",
    apikeys: [],
    apiId: '',
    nowAlbum:''
  },

  onLoad: function() {
    this.onKeys()
  },
  onShow: function() {
    if (app.globalData.OPENID) return;
    this.isReturn()
  },
  onKeys: function() {
    let self = this
    Keys.get().then(res => {
      self.data.apikeys = res.data
      self.inFindKey()
    })
  },
  inFindKey: function() {
    // console.log(this.data.apikeys[this.data.apiIndex])
    let item = this.data.apikeys[this.data.apiIndex]
    if (!item) {
      console.log('次数全部为空')
      wx.showToast({
        title: '系统维护',
        icon: 'none'
      })
    } else if (item.count <= 0) {
      console.log('当前次数为0', this.data.apiIndex)
      this.data.apiIndex++
        this.inFindKey()
    } else {
      // console.log(item, '当前可用')
      this.data.apiId = item._id
      this.data.apiKey = item.key
      this.showNum()
    }
  },
  onRemove: function() {
    if (this.data.isShow && this.data.isCheck) return;
    this.setData({
      isRemove: true,
      isSubmit: true
    })
    if (this.data.isChoose) {
      delete this.data.wxData.image_url
      this.data.wxData.image_file_b64 = this.data.showImg;
    } else {
      delete this.data.wxData.image_file_b64
      this.data.wxData.image_url = this.data.showImg;
    }
    this.requestRemove()

  },
  requestRemove: function() {
    let self = this;
    let fs = wx.getFileSystemManager()
    let myPath = wx.env.USER_DATA_PATH + '/no-bg';
    if (self.data.apiNum > 0) {
      wx.cloud.callFunction({
        // 云函数名称
        name: 'onRemove',
        data: {
          // fileImg: self.data.showImg,
          wxData: self.data.wxData,
          key: self.data.apiKey
        },
        success: function(res) {
          let code = res.result.body
          self.data.nowAlbum = "data:image/png;base64," + wx.arrayBufferToBase64(res.result.body)
          self.setData({
            bs64Img: "data:image/png;base64," + wx.arrayBufferToBase64(res.result.body),
            isDone: true
          })
          // console.log('成功---remove')
          self.addAlbum()
          self.updateKey()
        },
        fail: function(error) {
          wx.showToast({
            title: '系统维护中',
            icon: 'none'
          })
          console.log(error, '错误')
        }
      })
    }

  },
  onOver: function() {
    let self = this;
    self.setData({
      isRemove: false,
      isShow: true,
      showImg: ''
    })
    // console.log('onOver')
    let timer = setInterval(() => {
      // console.log(self.data.isDone, '....---')
      if (self.data.isDone) {
        self.setData({
          showImg: self.data.bs64Img
        })
        clearInterval(timer)
        wx.hideLoading()
        wx.showToast({
          title: '成功',
        })
      } else {
        wx.showLoading({
          title: '取图路上堵车啦',
        })
      }
    }, 500)
  },
  onImage: function() {
    let self = this;
    // console.log('.....点击率')
    wx.showActionSheet({
      itemList: ['相册', '拍照'],
      itemColor: '#008AFF',
      success: function(res) {
        if (res.tapIndex) {
          self.chooseImg('camera')
        } else {
          self.chooseImg('album')
        }
      }
    })

  },
  chooseImg: function(type) {
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [type],
      success(res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          // filePath:'img',
          success: res => {
            // console.log('读取图片为bs64')
            // console.log(res.data)
            wx.showLoading({
              title: '',
            })
            self.checkAlbum(res.data)
          }
        })
      }
    })
  },
  onBackUp: function() {
    this.showNum()
    if (this.data.isDone) {
      this.setData({
        isRemove: false,
        isShow: false,
        isDone: false,
        showImg: app.DOG_HEAD,
        isSubmit: false,
        isChoose: false
      })
    } else {
      wx.showToast({
        title: '抠图中，无法重置',
        icon: 'none'
      })
    }
  },
  onImg(event) {
    let current = event.target.dataset.src
    wx.previewImage({　　　　
      current: current,
      urls: [current]　　
    })
  },
  onSetting: function() {
    let self = this;
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum']) {
          self.saveImg()
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              self.saveImg()
            },
            fail() {
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          })
        } else {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                self.saveImg()
              } else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })

        }

      }
    })

  },
  saveImg() {
    wx.saveImageToPhotosAlbum({
      filePath: '',
      success: function(res) {
        console.log(res)
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  onSave() {
    // this.onSetting()
    // this.addAlbum()
    if (this.data.isDone) {
      wx.showToast({
        title: '点击预览后，长按保存图片',
        mask: true,
        duration: 3000,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '抠图中，无法保存',
        icon: 'none'
      })
    }
  },
  showNum() {
    let self = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'onAccount',
      data: {
        key: self.data.apiKey
      },
      success: function(res) {
        let account = JSON.parse(Bs.decode(wx.arrayBufferToBase64(res.result.body))).data
        self.data.apiNum = account.attributes.api.free_calls
        // console.log(self.data.apiNum, '目前剩余。。。')
        return self.data.apiNum
      },
      fail: function(error) {
        wx.showToast({
          title: '系统维护中',
          icon: 'none'
        })
        console.log(error, '错误2')
      }
    })
  },
  isReturn() {
    let self = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'isReturn',
      success: function(res) {
        app.globalData.OPENID = res.result.OPENID
      },
      fail: function(error) {
        wx.showToast({
          title: '系统维护中',
          icon: 'none'
        })
        console.log(error, '错误3')
      }
    })
  },
  updateKey() {
    let self = this
    if(self.data.apiNum <= 1) self.data.apiNum = 0;
    else self.data.apiNum--
    Keys.doc(self.data.apiId).update({
      data: {
        count: self.data.apiNum,
      },
      success: res => {
        if(res.stats.updated === 1) {
          wx.showToast({
            title: '已成功',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error(err)
      }
    })

  },
  addAlbum(){
    let self = this
    let isLogin = wx.getStorageSync('userInfo')
    if(isLogin){
      app.Album.add({
        data: {
          album: self.data.nowAlbum
        }
      })
        .then(res => {
          console.log(res)
          if (res.errMsg === app.globalData.ADD_API) {
            wx.showToast({
              title: '成功',
            })
          }
        })
        .catch(console.error)
    }
    
  },
  checkAlbum(buffer){
    let self = this;
    // let buffer = wx.base64ToArrayBuffer(base64_album)
    wx.cloud.callFunction({
      name: 'checkAlbum',
      data: {
        value: buffer
      }
    }).then(res => {
      // console.log("检测结果", res.result);
      wx.hideLoading()
      if (!res.result.errCode) {
        self.setData({
          isChoose: true,
          isCheck:true,
          showImg: 'data:image/png;base64,' + buffer
        })
      } else if(res.result.errCode === app.IMG_ERROR_CODE) {
        // console.log(res, '图片违规')
        wx.showToast({
          icon: 'none',
          title: '图片含有违法信息',
        })
        self.setData({
          showImg:app.DOG_HEAD,
          isCheck:false
        })
      } else{
        wx.showToast({
          icon:'none',
          title: '图片尺寸过大',
        })
        self.setData({
          showImg: app.DOG_HEAD,
          isCheck: false
        })
      }
    })

    
  }
})