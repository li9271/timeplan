const app = getApp()
const user = wx.cloud.database().collection("user") 
let that = this
Page({
  data: {
    motto: '改变自己，你不再孤身一人',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: '',
    length:"99",
    flage: 0,
  },

  //事件处理函数
  onLoad: function () {
    
    const db = wx.cloud.database();
    const user = db.collection('user');

    let page = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        var openid = res.result.openid
       // console.log('openid--', openid)
        this.setData({
          openid: openid
        })
        wx.setStorageSync("token", openid)
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
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
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },

  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync("name", this.data.userInfo.nickName)
    wx.setStorageSync("image", this.data.userInfo.avatarUrl)
    this.doIt();
    
  },
  async doIt(){
     await this.user_find()
     await this.user_add()  
  },
  
  user_find:function(){   
      return new Promise((resolved, reject) => {
        //    你只要不执行resolved，这个user_add就不会结束，
        user.where({
          _openid: this.data.openid
        }).get({
          success: res => {
           // console.log(res.data);
            this.setData({
              length: res.data.length
            })
            resolved(res)
          }
        })
        //  不管里面有多少个回调。你把resolved放到最终的那个回调用。那么user_add就会结束
      })
  
  },
  user_add:function(){
    return new Promise((resolved, reject) =>{
      if (this.data.length == 0) {
        user.add({
          data: {
            openid: this.data.openid,
            plan_complish_number: 0,
            tomato_time: 0,
            user_grade: 0,
            tomato_number: 0,
            user_name: this.data.userInfo.nickName,
            user_image: this.data.userInfo.avatarUrl
          },
          success: res => {
          //  console.log("用户第一次登陆，添加成功")
            this.setData({
              flage: 1
            })
            resolved(res)
          },
          fail: res => {
          //  console.log("用户第一次登陆，添加失败")
            resolved(res)
          }

        })
      }
      else {
     //   console.log("用户已存在")
      }
    })  
  },
  jumpPage: function(e){
    if(this.data.flage==0){
    wx.switchTab({
      url: "../plan/plan"
    })
    }
    else{
      wx.navigateTo({
        url: "../plan/guide"
      })
    }
  },
})
