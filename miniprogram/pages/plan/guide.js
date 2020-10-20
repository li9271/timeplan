Page({
  data: {
    imgs: [
      "../../images/show/show1.png",
      "../../images/show/show2.png",
      "../../images/show/show3.png",
      "../../images/show/show4.png",
    ],
    userInfo: {
      open_id: "", //用户唯一标识
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    },
  },
  start(res) {
    wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
            wx.getUserInfo({
              success: (res) => {
                //console.log(res)
              }
            })
          } else { //未授权，跳到授权页面
            wx.redirectTo({
              url: '../authorize/authorize', //授权页面
            })
          }
        }
      }),
      wx.switchTab({
        url: '../plan/plan'
      })

  },
})