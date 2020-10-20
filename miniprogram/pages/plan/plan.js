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
    select_name: "",
    openid: wx.getStorageSync("token"),
    plan_data: [{ id: 0 }],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_01.jpg?sign=5e951683632909fb9869b8566c538b66&t=1590244451",
    }, {
      id: 1,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_02.jpg?sign=8584ba293477225ab432d16e29afb02c&t=1590244463",
    }, {
      id: 2,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_03.jpg?sign=1e626940912726590b62c7240b3a7652&t=1590244480",
    }, {
      id: 3,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_04.jpg?sign=f255f93cfb840550b3cd2ad61440feaa&t=1590244490",
    }, {
      id: 4,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_05.jpg?sign=54f07e2f2015a73b94dddd4dfa3487ed&t=1590244499",
    }, {
      id: 5,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_06.jpg?sign=1df20834e978507126bd694eb9d929a9&t=1590244507",
    }, {
      id: 6,
      type: 'image',
        url: "https://7469-timeplan-9yepf-1259735400.tcb.qcloud.la/image/plan/sw_07.jpg?sign=1849eae44b7d717ae46c73282e267229&t=1590244513",
    }],

    cateMid: [
      {
        id: 0,
        icon: "效率",
        text: "学习"
      },
      {
        id: 1,
        icon: "medal",
        text: "工作"
      },
      {
        id: 2,
        icon: "alarm1",
        text: "思考"
      },
      {
        id: 3,
        icon: "part1",
        text: "分类"
      }],
    add: "../../images/plan/add.png",
    item: [{ type: '学习' }, { type: '工作' }, { type: '思考' }, { type: '写作' }, { type: '运动' }, { type: '阅读' }],
    bgimg: "../../images/plan/bg-green2.jpg",
    like_anti: "../../images/plan/like-anti.png",
    unlike_anti: "../../images/plan/unlike-anti.png",
    share_anti: "../../images/plan/share-anti.png",
    currentPostId: 0,
    postId: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0
  },

  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      currentTab: 0 //当前页的一些初始数据，视业务需求而定
    })
    this.onLoad(); //重新加载onLoad()
  },
  

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },


  async find_plan_select() {
    await this.find_plan3()
    await this.find_plan4()
  },
  find_plan3: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").where({
        plan_type: this.data.select_name
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
  find_plan4: function () {
    return new Promise((resolved, reject) => {
      var temp_data = []
      //console.log(this.data.plan_data)
      for (var i = 0; i < this.data.plan_data.length; i++) {
        if (this.data.plan_data[i]._openid != this.data.openid && this.data.plan_data[i].plan_public) {
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
            "plan_start_time": this.data.plan_data[i].plan_start_time,
            "user_name": this.data.plan_data[i].user_name,
            "user_image": this.data.plan_data[i].user_image
          })
        }
      }
      //console.log(temp_data)
      this.setData({
        item_key: temp_data
      })
    })
  },

  onSelecttypeTap: function (e) {
    this.setData({
      select_name: e.currentTarget.id
    })
    this.find_plan_select()
    this.setData({
      modalName: ''
    })

  },




  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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
      wx.cloud.database().collection("plan").orderBy('plan_like', 'desc').get({
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
      var that =this
      //console.log(this.data.plan_data)
      for (var i = 0; i < this.data.plan_data.length; i++) {
        //this.user(this.data.plan_data[i]._openid)
        if (this.data.plan_data[i]._openid != this.data.openid && this.data.plan_data[i].plan_public) {
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
            "plan_content": this.data.plan_data[i].plan_content,
            "plan_start_time": this.data.plan_data[i].plan_start_time,
            "user_name": this.data.plan_data[i].user_name,
            "user_image": this.data.plan_data[i].user_image
          })
        }
      }
      //console.log(temp_data)
     
      this.setData({
        item_key: temp_data
      })
    })
  },

  async find_plan_plan() {
    await this.find_plan_plan1()
    await this.find_plan_plan2()
  },
  find_plan_plan1: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").orderBy('plan_like', 'desc').
      where({
        plan_name: { $regex:'.*' + wx.getStorageSync("search") + '.*'}
      }).get({
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
  find_plan_plan2: function () {
    return new Promise((resolved, reject) => {
      var temp_data = []
      //console.log(this.data.plan_data)
      for (var i = 0; i < this.data.plan_data.length; i++) {
        if (this.data.plan_data[i]._openid != this.data.openid && this.data.plan_data[i].plan_public) {
         
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
            "plan_content": this.data.plan_data[i].plan_content,
            "plan_start_time": this.data.plan_data[i].plan_start_time,
            "user_name": this.data.plan_data[i].user_name,
            "user_image": this.data.plan_data[i].user_image

          })
        }
      }
     // console.log(this.data.user_name)
      this.setData({
        item_key: temp_data
      })
    })
  },


  onLoad: function (options) {
    //console.log(wx.getStorageSync("search"))
    // if (wx.getStorageSync("search") !=null){
    //   this.find_plan_plan()
    // }
    // else{
    this.find_plan()
    // }
    //console.log(this.data.item_key)
    // this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可

  },

  async find() {
    await this.find1()
    await this.find2()
  },
  find1: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").orderBy('plan_like', 'desc').get({
        success: res => {
          //console.log(res.data)
          this.setData({
            plan_data: res.data
          })
          //console.log(res.data)
          resolved(res)
        }
      })

    })
  },
  find2: function () {
    return new Promise((resolved, reject) => {
      var temp_data = []
      //console.log(this.data.plan_data)
      for (var i = 0; i < this.data.plan_data.length; i++) {
       
        if (this.data.plan_data[i]._openid != this.data.openid && this.data.plan_data[i].plan_public) {
        
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
            "plan_content": this.data.plan_data[i].plan_content,
            "plan_start_time": this.data.plan_data[i].plan_start_time,
            "user_name": this.data.plan_data[i].user_name,
            "user_image": this.data.plan_data[i].user_image

          })
        }
      }
      //console.log(temp_data)
      this.setData({
        item_key: temp_data
      })
    })
  },




  OnCreatePlanTap: function () {
    wx.navigateTo({
      url: '../madeplan/madeplan'
    })
  },
  searchIcon: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onOthersTap: function () {
    wx.navigateTo({
      url: '../others/others'
    })
  },
  onAddTap: function () {
    wx.navigateTo({
      url: '../madeplan/madeplan'
    })
  },
  async user_find(id){
    //console.log(id)
    await this.user_find1(id)
    await this.user_find2(id)
  },
 user_find1:function(id){
   return new Promise((resolved, reject) => {
   wx.cloud.database().collection("plan").where({
     _id:id
   }).get({
     success: res => {
       this.setData({
         user_id: res.data[0]._openid
       })
       //console.log(this.data.user_id)
       resolved(res)
     }
   })
   })
 },
  user_find2: function (id) {
    return new Promise((resolved, reject) => {
    wx.navigateTo({
        url: '../plan_detail/plan_detail2?id=' +id+"&user_id="+this.data.user_id,
      })
    })
    resolved(res)
  },
  DetailTap: function (event) {
    this.user_find(event.currentTarget.id)
 
  },
 async user(id){
   await this.find_user(id)
 },
  find_user:function(id){
    var that =this
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("user").where({
        _openid: id
      }).get({
        success: res => {
          that.setData({
            user_name: res.data[0].user_name,
            user_image: res.data[0].user_image
          })
          console.log("user")
          resolved(res)
        }
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
    this.find_plan()
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
