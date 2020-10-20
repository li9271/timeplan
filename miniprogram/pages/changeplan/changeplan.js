const db = wx.cloud.database() //对应tomto集合
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan_public:"",
    date_step:"",
    id:"",
    date1: '2020-05-01',
    date2: '2020-05-01',
    plan_date:" ",
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
      checked: 'false'
    }],
    plan_name: "",
    plan_content: "",
    type : '',
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
    //console.log("是否公开:" + e.detail.value.length);
  },
  // 拿到输入计划标题
   getPlanname: function (e) {
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
  async doIt() {
    await this.plan_add()
  },
  //拿到计划内容
  getPlanContent: function (e) {
    var val = e.detail.value;
    this.setData({
      plan_content: val
    });
    //console.log("plan_name" + this.data.plan_content)
  },
  addPlan: function(){
    if (this.data.current_name != "未选择" && this.data.plan_name!= null){
    this.doIt();
    }
   
  },

  changeUrl:function(){
    wx.navigateTo({
      url: '../changestep/changestep?json=' + JSON.stringify(this.data.date_step)
    })
  },
  async doIt() {
    await this.plan_update()
    await this.find_step()
    await this.changeUrl()
  },
  plan_update: function () {
    console.log(this.data.id)
    
    return new Promise((resolved, reject) => {
      const plan = db.collection("plan")
      const _ = wx.cloud.database().command
      plan.doc(this.data.id).update({
        data: {
          plan_end_time: this.data.date2,
          plan_name: this.data.plan_name,
          plan_content: this.data.plan_content,
          plan_start_time: this.data.date1,
          plan_type: this.data.current_name,
          plan_public: this.data.public,
          plan_finish:"false"

        },
        success: res => {
          // console.log("用户添加成功")
          resolved(res)
        }
      })
    //   plan.doc(this.data.id).update({
    //     date: {
    //       plan_like: _.inc(1),
    //       plan_end_time: this.data.date2,
    //       plan_name: this.data.plan_name,
    //       plan_start_time: this.data.date1,
    //       plan_type: this.data.current_name,
    //       plan_public: this.data.public
    //     },
    //     success: res => {
    //       console.log("修改成功")
    //       resolved(res)
    //     },
    //     fail: err => {
    //       console.log("修改失败")
    //     }
    //   })
     })
  },

    find_step:function(){
    const plan = db.collection("plan_data")
    return new Promise((resolved, reject) => {
      plan.where({
        plan_id:this.data.id
      }).orderBy('plan_step', 'esc').get({
        success: res => {
          console.log("find_step");
          this.setData({
            date_step:res.data
          })
          // console.log(this.data.id)
          // console.log("查询成功")
          resolved(res)
        }
      })
    })
  },
  cancle : function(){
    wx.switchTab({
      url: '../plan/plan',
    })
  },
  onLoad: function (options) {
   var  data = JSON.parse(options.json)
    console.log(data)
     this.setData({
       current_name: data[0].current_name,
       plan_name: data[0].plan_name,
       id: data[0].id,
       data1: data[0].data1,
       data2: data[0].data2,
       public: data[0].plan_public,
       plan_content: data[0].plan_content
      
    })
  },





  onShow:function(){

  }
  
  
})