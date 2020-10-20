const db1 = wx.cloud.database().collection("plan") //对应plan大计划集合
const db2 = wx.cloud.database().collection("plan_data") //对应plan_data小计划集合
var postId
var collected = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plan_public:"",
    plan_name:"只需要10天通过四级",
    current_name:"",
    plan_id:"",
    plan_content:"",
    aitemData: [],
    temp: 0,
    currentPostId: 0,
    startime : '2020-05-18',
    endtime :'2020-05-19',
    index:"",
    flage:"",
    like_num:"",
    dislike_num:"",
    share_num:"",
    todos: [
      { name: "基础阶段（2020.3-6）", content: "asdasdasdaffxbsd",complete:false },
      { name: "强化阶段（2020.7-9）", content:'fafhaushauff', complete: true },
      { name: "冲刺阶段（2020.10-12）", content: 'dpopofpdsofpsffsd', complete: false }
    ],
    inputText:'',
    todoNum:2,
    all:false,
    allText:"全选",
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async start_find() {
    await this.find_plan()
    await this.find_plan_data()
  },
  find_plan_data:function(){
    return new Promise((resolved, reject) =>{
      db2.where({
        plan_id: this.data.plan_id
      }).orderBy('plan_step', 'asc').get({
        success: res => {
         // console.log(res.data)
          let todos = res.data.map((item, index) => {
             return {
                id: item._id,
                name: item.step_name,
                content: item.step_content,
                complete: item.plan_finish,
              }
            })

            this.setData({
              todos,
           })
          //  console.log(this.data.todos)

          // this.setData({
          //   plan_name: res.data[0].plan_name,
          //   startime: res.data[0].plan_start_time,
          //   endtime: res.data[0].plan_end_time,
          //   plan_content: res.data[0].plan_content
          // })
          resolved(res)
        }
      })
    })
  },
  find_plan:function(){
    return new Promise((resolved, reject) =>{
     // console.log("find_plan")
      wx.cloud.database().collection("plan").where({
         _id: this.data.plan_id
      }).get({
        success: res => {
         // console.log(res.data)
          this.setData({
            plan_name: res.data[0].plan_name,
            startime: res.data[0].plan_start_time,
            endtime: res.data[0].plan_end_time,
            plan_content: res.data[0].plan_content,
            like_num: res.data[0].plan_like,
            dislike_num: res.data[0].plan_dislike,
            share_num: res.data[0].plan_transmit,
            current_name: res.data[0].plan_type,
            plan_public: res.data[0].plan_public
          })
          resolved(res)
        }
      })
    })
  },
  OnAddTap:function(){
    /*if (!this.data.inputText) return
    var todos = this.data.todos
    todos.push({ text: this.data.inputText, complete: false })
    this.setData({
      todos: todos,
      inputText:'',
      todoNum: this.data.todoNum+1
    })*/
    var data = [{
      "current_name":this.data.current_name,
      "plan_name": this.data.plan_name,
      "id":this.data.plan_id,
      "data1": this.data.startime,
      "data2": this.data.endtime,
     " plan_public": this.data.plan_public,
      "plan_content": this.data.plan_content
    }]
     //console.log(data)
        

     wx.navigateTo({
       url: '../changeplan/changeplan?json=' + JSON.stringify(data),
     })
  },


  
  onLoad: function(e) {
    this.setData({
      plan_id: e.id
    })
    this.start_find()
    // console.log(this.data.plan_id)
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
  },

  

  onShown:function(){
    
  },
  onShareAppMessage: function(res) {

  },
  onShareTap: function() {

  },
  onCollectionTap: function() {

  },



  async start_change() {
    await this.plan_data_change()
    await this.plan_chaneg()
  },
  plan_data_change:function(){
    return new Promise((resolved, reject) => {
      db2.doc(this.data.todos[this.data.index].id).update({
        data: {
          plan_finish: this.data.todos[this.data.index].complete
        },
        success: resolved()
      })
    })
  },
  plan_chaneg:function(){
    return new Promise((resolved, reject) =>{
      db1.doc(this.data.plan_id).update({
        data: {
          plan_finish: this.data.flage
        },
        success: res=>{
          // console.log(this.data.flage)
          resolved()
        }
      })
    })
  },
  todoChange:function(e){
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].complete = !this.data.todos[index].complete
    this.setData({
      index,
      todos: todos,
      todoNum: this.data.todoNum + (todos[index].complete ? -1:1)
    })
    this.setData({
      flage: true
    })
    for (var i = 0; i < this.data.todos.length; i++) {
      if (!this.data.todos[i].complete) {
        this.setData({
          flage: false
        })
      }

    }
    this.start_change()

  },



  OnDelTap:function(){
     wx.cloud.database().collection('plan').doc(this.data.plan_id).remove()
    // console.log(this.data.todos)
      for (var i = 0; i < this.data.todos.length; i++) {
        wx.cloud.database().collection('plan_data').doc(this.data.todos[i].id).remove()
      }
    wx.showToast({
      title: '删除成功！',
      icon: 'success',
      duration: 3000
    })
      wx.switchTab({
        url: "../personal/personal"
      })
    // this.dd()
    


  },
  
  // toggleAllChange:function(){
  //   var todos = this.data.todos
  //   var all = !this.data.all
  //   todos.forEach(function(item,index){
  //     item.complete = all
  //   })

  //   this.setData({
  //     todos:todos,
  //     all:all,
  //     todoNum: this.data.all ? todos.length : 0,
  //     allText: this.data.all ? "全选" : "全不选"
  //   })
  // },
  // todoChange:function(e){
  //   var index = e.currentTarget.dataset.index
  //   var todos = this.data.todos
  //   todos[index].complete = !this.data.todos[index].complete
  //   this.setData({
  //     todos: todos,
  //     todoNum: this.data.todoNum + (todos[index].complete ? -1:1)
  //   })
  // },
  // toggleAllChange:function(){
  //   var todos = this.data.todos
  //   var all = !this.data.all
  //   todos.forEach(function(item,index){
  //     item.complete = all
  //   })

  //   this.setData({
  //     todos:todos,
  //     all:all,
  //     todoNum: this.data.all ? todos.length : 0,
  //     allText: this.data.all ? "全选" : "全不选"
  //   })
  // },

  // clearChange:function(){
  //   var todos = this.data.todos.filter(function(item){
  //     return !item.complete
  //   })
  //   this.setData({
  //     todos: todos,
  //     all: false,
  //     allText: "全选"
  //   })
  // }
  /*
  getStepData() {
    db.get({
      success(res){
        consoloe.log(res)
      }
    })
  }
   */
})