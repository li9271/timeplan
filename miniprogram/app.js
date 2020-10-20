//app.js
App({
  onLaunch: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey
        console.log(res.code)
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',//微信服务器获取appid的网址 不用变
            method: 'post',//必须是post方法
            data: {
              js_code: res.code,
              appid: 'wxf147d8ba3bdfa206',//仅为实例appid
              secret: '0dc6857cc6fc1d61bc2edf27202208da',//仅为实例secret
              grant_type: 'authorization_code'
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (response) {
              console.log(response.data)
              wx.setStorageSync('app_openid', response.data.openid); 将openid存入本地缓存
              wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
            }
          })
        } else {
          console.log("登陆失败");
        }
      }
    })
    var that = this  //早success里面不能使用this 因为 success 是回调函数 它会不停的检测是否成功，因此在不断回调的过程中this的指向就发生了变化
    wx.getStorage({
      key: 'app_openid',//获取key值
      success: function (res) {
        console.log(res)
        that.setData({
          openid: res.data//返回key对应的value
        })
      },
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    
    this.globalData = {}
  }
  
})
