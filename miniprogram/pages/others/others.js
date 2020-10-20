// pages/personal/personal.js
var itemData;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name:"",
    user_image:"",
    user_id:"",
    grade:"",
    nickName:"",
    item_key:"",
    plan_data:"",
    openid:"",
    money:0,
    grade : 1,
    img_money:"../../images/personal/money.png",
    img_my:"../../images/personal/my.png",
    img_template:"../../images/personal/template.png",
    img_dynamic:"../../images/personal/dynamic.png",
    img_dell:"../../images/personal/dell.png",
    img_setup:"../../images/personal/setup.png",
    img_individuation:"../../images/personal/individuation.png",
    img_advise:"../../images/personal/doc.png",
    img_funtion:"../../images/personal/clock.png",
    img_more: "../../images/personal/search.png",
    img_about: "../../images/personal/profile.png",
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    plan_complish_number:0,
    tomato_time:0,
    user_grade:0
  },

  seTup: function(){
    wx.navigateTo({
      url: '../setup/setup',
    })
  },
  myplan:function(){
    wx.navigateTo({
      url: '../myplan/myplan',
    })
  },
  mytemplate: function () {
    wx.navigateTo({
      url: '../mytemplate/mytemplate',
    })
  },
  mydynamic: function () {
    wx.navigateTo({
      url: '../mydynamic/mydynamic',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  async find_plan() {
    await this.find_plan1()
    await this.find_plan2()
   
  },
  find_plan1: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").where({
        _openid :this.data.openid
      }).orderBy('plan_like', 'desc').get({
        success: res => {
          this.setData({
            plan_data: res.data
          })
          //console.log(res.data)
          resolved(res)
        }
      })

    })
  },
  find_plan2: function () {
    return new Promise((resolved, reject) => {
      var temp_data = []
      //console.log(this.data.plan_data)
      for (var i = 0; i < this.data.plan_data.length; i++) {
          temp_data.push({
            "plan_id": this.data.plan_data[i]._id,
            "plan_like": this.data.plan_data[i].plan_like,
            "plan_dislike": this.data.plan_data[i].plan_dislike,
            "plan_share": this.data.plan_data[i].plan_transmit,
            "plan_type": this.data.plan_data[i].plan_type,
            "like_anti": "../../images/plan/like-anti.png",
            "unlike_anti": "../../images/plan/unlike-anti.png",
            "share_anti": "../../images/plan/share-anti.png",
            "plan_name": this.data.plan_data[i].plan_name,
            "plan_content": this.data.plan_data[i].plan_content,
            "user_name": this.data.plan_data[i].user_name,
            "user_image": this.data.plan_data[i].user_image
          })
        
      }
      //console.log(temp_data)
      this.setData({
        item_key: temp_data
      })
      console.log(this.data.item_key)

    })
  },

 

  onLoad: function (options) {
    
    this.setData({
      openid: options.id
    })

    this.find_plan()
    // const user = wx.cloud.database().collection("user");
    // var openid = wx.getStorageSync('token');
    // user.where({
    //   _openid: openid
    // }).get({
    //   success: res => {
    //     console.log(res.data[0]);
    //     this.setData({
    //       plan_complish_number: res.data[0].plan_complish_number,
    //       tomato_time: res.data[0].tomato_time,
    //       user_grade: res.data[0].user_grade,

    //     })
    //   }
    // })

    
    // var that = this;
    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res);
    //     var avatarUrl = 'userInfo.avatarUrl';
    //     var nickName = 'userInfo.nickName';
    //     that.setData({
    //       [avatarUrl]: res.userInfo.avatarUrl,
    //       [nickName]: res.userInfo.nickName,
    //     })
    //   }
    // })

  },

  OnTemplateTap:function(e){
    wx.navigateTo({
      url: '../plan_detail/plan_detail2?id=' + e.currentTarget.id + "&user_id=" + this.data.openid,
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
    const user = wx.cloud.database().collection("user");
    user.where({
      _openid: this.data.openid
    }).get({
      success: res => {
        // console.log(res.data[0]);
        this.setData({
          plan_complish_number: res.data[0].plan_complish_number,
          tomato_time: res.data[0].tomato_time,
          user_grade: res.data[0].user_grade,
          grade: res.data[0].user_grade,
          nickName: res.data[0].user_name,
          user_image: res.data[0].user_image
        })
      }
    })


    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        //  var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          // [nickName]: res.userInfo.nickName,
        })
      }
    })
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