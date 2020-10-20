const db = wx.cloud.database() //对应tomto集合
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name:"",
    user_image:"",
    id:"",
    date1: '2020-05-01',
    date2: '2020-05-01',
    plan_date:" ",
    openID:"",
    openid: wx.getStorageSync("token"),
    public : '1',
    selected: false,
    current_name:"未选择",
    item_name: [
      '学习',
      '工作',
      '思考',
      '写作',
      '运动',
      '阅读'
    ],
    itemss: [{
      name: '公开',
      checked: 'true'
    }],
    plan_name: "",
    plan_content: "",
    type : ''
  },  
  OnSelectMenu: function () {
    this.setData({
      selected: !this.data.selected
    })
  },
  //选择分类
  OnMySelectTap: function (e) {
    //console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      current_name: name,
      selected: false
    })
    //console.log("type:" + this.data.type)
  },
  checkboxChange: function(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    //console.log("长度:" + e.detail.value.length);
    this.setData({
      public: e.detail.value.length,
    })
    console.log("是否公开:" + e.detail.value.length);
  },
  // 拿到输入计划标题
   getPlanName: function (e) {
    var val = e.detail.value;
    this.setData({
      plan_name: val
    });
    //console.log("plan_name" + this.data.plan_name)
    },
    changeDate1(e){
       this.setData({ date1:e.detail.value});
    },
    changeDate2(e){
      this.setData({ date2:e.detail.value});
   },
   //拿到计划内容
  getPlanContent: function (e) {
    var val = e.detail.value;
    this.setData({
      plan_content: val
    });
    //console.log("plan_name" + this.data.plan_content)
  },
   getOpenid() {
    let page = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        var openid = res.result.openid
        page.setData({
          openid: openid
        })
      }
    })
  },
  async doIt() {
    await this.find_user()
    await this.plan_add()
    await this.plan_find()
  },
  find_user: function () {
    const user = db.collection("user")
    return new Promise((resolved, reject) => {
      user.where({
        _openid: this.data.openid
      }).get({
        success: res => {
          this.setData({
            user_name: res.data[0].user_name,
            user_image: res.data[0].user_image,
          })
           console.log(this.data)
          // console.log("查询成功")
          resolved(res)
        }
      })
    })

  },
  plan_add:function(){
    return new Promise((resolved, reject) => {
      const plan = db.collection("plan")
      plan.add({
          data: {
            openid: this.data.openid,
            plan_dislike: 0,
            plan_end_time: this.data.date2,
            plan_finish: 0,
            plan_like: 0,
            plan_transmit:0,
            plan_name: this.data.plan_name,
            plan_content: this.data.plan_content,
            plan_start_time: this.data.date1,
            plan_type: this.data.current_name,
            plan_public: this.data.public,
            user_name: this.data.user_name,
            user_image: this.data.user_image,
          },
        success: res => {
          //console.log("添加成功")
          resolved(res)
        }
      })
    })
  },
  plan_find:function(){
    const plan =db.collection("plan")
    return new Promise((resolved, reject) =>{
      plan.where({
        _openid: this.data.openid
      }).get({

        success: res => {
          var id = res.data.pop()._id
          // console.log(id);
          this.setData({
             id:id
           })
          // console.log(this.data.id)
          // console.log("查询成功")
          wx.navigateTo({
            url: '../madestep/madestep?id=' + this.data.id
          })
          resolved(res)
        }
      })
    })
  },

  addPlan: function(){
      
    if (this.data.current_name != "未选择" && this.data.plan_name!= null){
    this.doIt();
    }
   
  },
  cancle : function(){
    wx.switchTab({
      url: '../plan/plan',
    })
  },
  onLoad: function (options) {
      this.setData({
        //tomato_date : util.formatTime(new Date)
      })
      
  },
  
})