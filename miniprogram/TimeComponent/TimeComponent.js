Component({
  options: {
    multipleSlots: true
  },
  timecomponent: {
  properties: {
    isCurent: {
      type: Boolean,
      value: false
    },
    isShowLeftLine: {
      type: Boolean,
      value: true
    },
    axisTitle: {
      type: String,
      value: ''
    },
    axisTime: {
      type: String,
      value: ''
    },
    textArray: {
      type: Array,
      value: []
    }

  },

  data: {

  },
  ready() {
    console.log(this.data.textArray)
  },

  methods: {

  }
  }
})
// var postId;
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     aitemData: [],
//     currentPostId: 0
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     var itemsData = require('../../../template/plan-template/plan-template.js');
//     postId = e.id;
//     var itemData = itemsData.itemList;
//     this.setData({
//       aitemData: itemData,
//       currentPostId: postId,
//     });
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
    
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
    
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
    
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
    
//   }
// })