

const opinion = wx.cloud.database().collection("opinion") //对应tomto集合
const util = require('../utils/utils.js')
const app = getApp()
// import Toast from 'vant-weapp/toast/toast';
// Toast.success('成功文案');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0, 
    openid: wx.getStorageSync('token'),
    activeIndex: 0,
    activeId :0,
    opinion_date : '',
    opinion_type : '',
    opinion_content : '',
    cateArr:[
      {id : 0,text:"页面卡顿"},
    {id : 1, text:"功能缺失"},
    { id : 2,text:"其他问题"},
    {id : 3,text: "界面错位" },
    {id : 4,text: "产品建议"},
    {id : 5,text: "无法提交" }],
    cateActive: '0'
  },
  onLoad: function (e) {
  },
  clickCate: function (e) {
    this.setData({
      cateActive: e.currentTarget.dataset.index,
      activeId : e.currentTarget.dataset.index
    })
    //console.log("activeId:" + this.data.activeId)
  },
  getOpinionTap: function (e) {
    this.setData({
      opinion_date: util.formatTime(new Date)
    })
    if(this.data.activeId==0){
      this.setData({
        opinion_type : '页面卡顿'
      })
    }
    if(this.data.activeId==1){
      this.setData({
        opinion_type : '功能缺失'
      })
    }
    if(this.data.activeId==2){
      this.setData({
        opinion_type : '其他问题'
      })
    }
    if(this.data.activeId==3){
      this.setData({
        opinion_type : '界面错位'
      })
    }
    if(this.data.activeId==4){
      this.setData({
        opinion_type : '产品建议'
      })
    }
    if(this.data.activeId==5){
      this.setData({
        opinion_type : '无法提交'
      })
    }
    var val = e.detail.value;
    this.setData({
      opinion_content: val
    });
  },
  OnSubmitTap : function(){
    if (this.data.opinion_content){
    opinion.add({
      data: {
        openid: this.data.openid,
        opinion_content: this.data.opinion_content,
        opinion_type: this.data.opinion_type,
        submit_time: this.data.opinion_date
      },
      success: res => {

        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 1200
        })
        wx.switchTab({
          url: '../person/person'
        })
        resolved(res)
      },
      fail: res => {
        resolved(res)
      }
    })

    }
  
  }
})