var postId
var collected = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aitemData: [],
    temp: 0,
    currentPostId: 0
      // axis: [{
      //     time: '2018-2-15',
      //     name: '张三',
      //     event: '垃圾太多'
      //   },
      //   {
      //     time: '2018-2-15',
      //     name: '王三',
      //     event: '垃圾太多'
      //   },
      //   {
      //     time: '2018-2-15',
      //     name: '张三',
      //     event: '垃圾太多'
      //   },
      //   {
      //     time: '2018-2-15',
      //     name: '张三',
      //     event: '垃圾太多'
      //   },
      // ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var itemsData = require('../../template/plan-template/plan-template.js');
    postId = e.id;
    var itemData = itemsData.itemList;
    this.setData({
      aitemData: itemData,
      currentPostId: postId,
    });
    //console.log(this.data.aitemData)
    //console.log('postId:',postId)
    //console.log('currentPostId:', this.data.currentPostId)
  },
  OnSavePicTap: function(options) {
    wx.navigateTo({
      url: '../save/save?id=' + this.data.currentPostId,
      // url: '../save/save'
    })
    //console.log("要传到SavePic的postId" + this.data.currentPostId)
  },
  onShareAppMessage: function(res) {

  },
  onShareTap: function() {

  },
  onCollectionTap: function() {

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