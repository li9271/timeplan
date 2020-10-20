const db1 = wx.cloud.database().collection("plan") //对应plan大计划集合
const db2 = wx.cloud.database().collection("plan_data") //对应plan_data小计划集合
var postId
var collected = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_image:"",
    user_id:"",
    plan_type:"",
    dislike_id:"",
    public:"",
    transmit_id:"",
    plan_name: "只需要10天通过四级",
    aitemData: [],
    plan_content:"",
    openid: wx.getStorageSync("token"),
    temp: 0,
    currentPostId: 0,
    search:'',
    startime : '2020-05-18',
    endtime :'2020-05-19',
    like : 1,
    like_num : 9,
    dislike : 1,
    dislike_num : 2,
    share : 1,
    share_num : 10,
    like_id:"",
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


  chang_others:function(){
     wx.navigateTo({
       url: '../others/others?id=' + this.data.user_id,
      // url: '../save/save'
    })
  },
  find_user: function (id) {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("user").where({
        _openid: id
      }).get({
        success: res => {
          this.setData({
            user_image: res.data[0].user_image
          })
          // console.log(this.data.user_name)
          resolved(res)
        }
      })
    })
  },
  async start_find(id) {
    await this.find_plan()
    await this.find_plan_data()
    await this.find_user(id)
  },
  find_plan_data: function () {
    return new Promise((resolved, reject) => {
      db2.where({
        plan_id: this.data.plan_id
      }).orderBy('plan_step', 'desc').get({
        success: res => {
          // console.log(res.data)
          let todos = res.data.reverse().map((item, index) => {
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
          //console.log(this.data.todos)

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
  find_plan: function () {
    //console.log(this.data.plan_id)
    return new Promise((resolved, reject) => {
      db1.where({
        _id: this.data.plan_id
      }).get({
        success: res => {
          this.setData({
            plan_name: res.data[0].plan_name,
            startime: res.data[0].plan_start_time,
            endtime: res.data[0].plan_end_time,
            plan_content: res.data[0].plan_content,
            like_num: res.data[0].plan_like,
            dislike_num: res.data[0].plan_dislike,
            share_num: res.data[0].plan_transmit,
            plan_type: res.data[0].plan_type,
            public: res.data[0].plan_public
          })
          resolved(res)
        }
      })
    })
  },
  onLoad: function(e) {
    var itemsData = require('../../template/plan-template/plan-template.js');
    postId = e.id;
    var itemData = itemsData.itemList;
    this.setData({
      aitemData: itemData,
      currentPostId: postId,
      plan_id: e.id,
      user_id:e.user_id
    })
    this.start_find(e.user_id)
  },
  OnSavePicTap: function(options) {
    // wx.navigateTo({
    //   url: '../save/save?id=' + this.data.currentPostId,
    //   // url: '../save/save'
    // })
    //console.log("要传到SavePic的postId" + this.data.currentPostId)
  },
  onShareAppMessage: function(res) {

  },
  //维护like 与 dilike
  onShow: function () {
    this.maintain()
  }, 
  async maintain() {
   await this.like_miantian()
    await this.dislike_minatian()
  },
  
  like_miantian:function(){
    const that = this 
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan_like").where({
        plan_id:this.data.plan_id,
        _openid:this.data.openid
      }).get({
        success: res => {
          //console.log("like_maintain")
         // console.log(res.data)
          if(res.data.length >0){
            this.setData({
              like: 0
            })
          }
          else{
            this.setData({
              like: 1
            })
          }

          resolved()
          },
        fail: err =>{
          this.setData({
            like: 1
          })
        }
      })
    })
  },


  dislike_minatian:function(){
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan_dislike").where({
        plan_id: this.data.plan_id,
        _openid: this.data.openid
      }).get({
        success: res => {
         // console.log("like_maintain")
          //console.log(res.data)
          if (res.data.length > 0) {
            this.setData({
              dislike: 0
            })
          }
          else {
            this.setData({
              dislike: 1
            })
          }

          resolved()
        }
    
      })
    })
  },






  onShareTap: function() {
    this.doIT_plan()
  },
  onCollectionTap: function() {

  },

//删除like表里数据
  async del_like() {
   await this.del_like1()
    await this.del_like2()
    await this.del_like3()
  },
  del_like1:function(){
    return new Promise((resolved, reject) => {
    wx.cloud.database().collection("plan_like").where({
      openid: this.data.openid,
      plan_id: this.data.plan_id
    }).get({
      success:res=>{
        this.setData({
          like_id :res.data[0]._id
        })
        resolved()
      }
    })
    })
  },
  del_like2: function () {
    wx.cloud.database().collection("plan_like").doc(this.data.like_id).remove()
    
  },

  del_like3:function(){
    const _ = wx.cloud.database().command;
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").doc(this.data.plan_id).update({
        data: {
          plan_like: _.inc(-1)
        }
      })
    })

  },
  async addlike(){
    await this.add_like1()
    await this.add_like2()
  },
  add_like1:function() {
    return new Promise((resolved, reject) => {
    wx.cloud.database().collection("plan_like").add({
      data: {
        openid: this.data.openid,
        plan_id: this.data.plan_id
      },
      success: res => {
        var ss = this.data.like_num + 1
        this.setData({
          like: 0,
          like_num :ss
        })
        resolved()
      }
    })
    })
  },

  add_like2: function () {
    const _ = wx.cloud.database().command;
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").doc(this.data.plan_id).update({
        data: {
          plan_like: _.inc(1)
        }
      })
    })
  },



  onLikeTap:function(){
    if (this.data.like == 1){
      this.addlike()
    }
    else{
      var ss = this.data.like_num-1
      this.del_like()
      this.setData({
        like: 1,
        like_num :ss
      })
      
    }
  },










  onUnLikeTap:function(){
    if (this.data.dislike == 1) {
      this.add_dislike()
    }
    else {
      var ss = this.data.dislike_num - 1
      this.del_dislike()
      this.setData({
        dislike: 1,
        dislike_num: ss
      })

    }

  },
  //删除like表里数据
  async del_dislike() {
    await this.del_dislike1()
    await this.del_dislike2()
    await this.del_dislike3()
  },
  del_dislike1: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan_dislike").where({
        openid: this.data.openid,
        plan_id: this.data.plan_id
      }).get({
        success: res => {
          this.setData({
            dislike_id: res.data[0]._id
          })
          resolved()
        }
      })
    })
  },
  del_dislike2: function () {
    wx.cloud.database().collection("plan_dislike").doc(this.data.dislike_id).remove()

  },

  del_dislike3: function () {
    const _ = wx.cloud.database().command;
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").doc(this.data.plan_id).update({
        data: {
          plan_dislike: _.inc(-1)
        }
      })
    })

  },
  async add_dislike() {
    await this.add_dislike1()
    await this.add_dislike2()
  },
  add_dislike1: function () {
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan_dislike").add({
        data: {
          openid: this.data.openid,
          plan_id: this.data.plan_id
        },
        success: res => {
          var ss = this.data.dislike_num + 1
          this.setData({
            dislike: 0,
            dislike_num: ss
          })
          resolved()
        }
      })
    })
  },

  add_dislike2: function () {
    const _ = wx.cloud.database().command;
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").doc(this.data.plan_id).update({
        data: {
          plan_dislike: _.inc(1)
        }
      })
    })
  },







//转发
  async doIT_plan(){
    await this.plan_add()
    await this.plan_find()
    await this.plan_data_add()
    await this.plan_transmit_add()
    
  },
  //找转发id
  plan_find:function(){
    //console.log(this.data.openid)
    return new Promise((resolved, reject) => {
      wx.cloud.database().collection("plan").where({
        _openid: this.data.openid
      }).get({
        success: res => {
         // console.log(res.data)
          var id = res.data.pop()._id
        
          this.setData({
            transmit_id: id
          })
          // console.log(this.data.transmit_id)
          // console.log("查询成功")
          
          resolved(res)
        }
      })
    })

  },
  plan_data_add:function(){
    //console.log(this.data.transmit_id)
    var todos = this.data.todos
    for (var i = 0; i < this.data.todos.length; i++) {
      db2.add({
        data: {
          openid: this.data.openid,
          plan_id: this.data.transmit_id,
          plan_step: i + 1,
          step_content:todos[i].content,
          step_name: todos[i].name,
          plan_finish: 0,
        },
        success: res => {
         // console.log(添加成功)
          // wx.navigateTo({
          //   url: '../madestep/madestep?id=' + this.data.id
          // })
          
        }
      })
    }
     // wx.navigateTo({
          //   url: '../madestep/madestep?id=' + this.data.id
          // })
  },
  plan_add: function () {
    return new Promise((resolved, reject) => {
      db1.add({
        data: {
          openid: this.data.openid,
          plan_dislike: 0,
          plan_end_time: this.data.startime,
          plan_finish: false,
          plan_like: 0,
          plan_transmit: 0,
          plan_dislike: 0,
          plan_name: this.data.plan_name,
          plan_content: this.data.plan_content,
          plan_start_time: this.data.endtime,
          plan_type: this.data.plan_type,
          plan_public: this.data.public,
          user_name: wx.getStorageSync("name"),
          user_image: wx.getStorageSync("image"),
        },
        success: res => {
          //console.log("添加成功")
          resolved(res)
        }
      })
    })
  },
  plan_transmit_add:function(){
    const _ = wx.cloud.database().command;
      db1.doc(this.data.plan_id).update({
        data:{
          plan_transmit:_.inc(1)
        }
      })
    wx.switchTab({
             url: '../plan/plan'
           })
  }






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