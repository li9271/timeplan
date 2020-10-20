// pages/madeplan/madeplan.js
const db = wx.cloud.database().collection("plan_data") //对应plan_data小计划集合
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tets:"",
    data_step:"",
    appdata : app.globalData, //拿到全局变量
    step_data: [{id: 0,name: '',content: ''}],
    img_made: "../../images/plan/madeplan/made.png",
    add_img : "../../images/plan/madeplan/add.png",
    sub_img : "../../images/plan/madeplan/sub.png",
    step_name: "",
    step_content: '',
    step_id : 0,
    stepNum : 1
  },
  // 拿到步骤标题
  getStepName: function (e) {
    var that = this
    var val = e.detail.value;
    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容
    //console.log("id:" + id);
    that.setData({
      step_name: val,
      step_id : id
    });
    this.data.step_data[id].id = id
    this.data.step_data[id].name = this.data.step_name
    //console.log("step_id:" + this.data.step_id)
  },
  // 拿到步骤内容
  getStepContent: function (e) {
   var that = this
    var val = e.detail.value;
    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容
    that.setData({
      step_content: val,
      step_id : id
    });
    this.data.step_data[id].id = id
    this.data.step_data[id].content = this.data.step_content
    //console.log(this.data.step_data)
  },
  addList: function () {
    var step = this.data.step_data.reverse();
    var newData = {};
    newData.name=this.data.step_name;
    newData.content=this.data.step_content;
    step.push(newData); //实质是添加step_data数组内容，使for循环多一次
    this.setData({
      step_data: step
    });
    this.data.stepNum++;
   // console.log("stepNum:"+this.data.stepNum)
  },

  delList: function () {
    var step = this.data.step_data;
    step.pop();      //实质是删除step_data数组内容，使for循环少一次
    this.setData({
      step_data: step,
    })
    this.data.stepNum--
  },

  async doIt() {
    await this.add()
    await this.delStep()
  },
  delStep:function(){
    for (var i = 0; i < this.data.data_step.length; i++){
      db.doc(this.data.data_step[i]._id).remove()
    }
    wx.switchTab({
      url: '../plan/plan'
    })
  },
  add:function(){
    //console.log(this.data.step_data)
    var flage = 1
    for (var i = 0; i < this.data.stepNum; i++) {
      if (this.data.step_data[i].name == null) {
        flage = 0
      }
    }
    if (flage == 1) {
      return new Promise((resolved, reject) => {
      for (var i = 0; i < this.data.stepNum; i++) {
        db.add({
          data: {
            openid: this.data.openID,
            plan_id: this.data.plan_id,
            plan_step: i + 1,
            step_content: this.data.step_data[i].content,
            step_name: this.data.step_data[i].name,
            plan_finish: 0,
          },
          success: res => {
            console.log(添加成功)
            wx.showToast({
              title: '修改成功！',
              icon: 'success',
              duration: 3000
            })
           
          }
        })
      }
         
        
        resolved()
      })
    
      
    }
  },

  addStep : function (){
    this.doIt()
    wx.showToast({
      title: '修改成功！',
      icon: 'success',
      duration: 1200
    }) 

  },
  cancle : function(){
    wx.switchTab({
      url: '../plan/plan',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.data, '111')
     this.setData({
       data_step :JSON.parse(options.json),
       stepNum: JSON.parse(options.json).length,
       plan_id: JSON.parse(options.json)[0].plan_id,
       
    //   current_name: "学习",
    //   plan_name: "背单词",
    //   id: "aa9f906d5ec10e9f00f401511ff71aec",
    //   data1: "2020-05-01",
    //   data2: "2020-05-01",
    //   plan_public: 0
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
    // console.log(this.data.data_step)
    // var step_data= [{ id: 0, name: '', content: '' }]
    let step_data = this.data.data_step.map((item, index) => {
      return {
        id: index + 1,
        name: item.step_name,
        content: item.step_content
      }
    })

    this.setData({
      step_data,
    })

    // console.log(this.data.step_data)
 
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