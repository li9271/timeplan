// pages/tomato/tomato.js
//获取应用实例
const tomato = wx.cloud.database().collection("tomato") //对应tomto集合
const app = getApp()
const util = require('../utils/utils.js')
const user = wx.cloud.database().collection("user") 
//图表
var wxCharts = require('../../utils/wxcharts.js');
var areaChart = null;
var columnChart = null;
var columnChartToday = null;
var pieChart = null;
var pieChartToday = null;
var flage = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chartData :{
      data:[],
      categories:[],
    },
    chartDataToday: {
      data: [],
      categories: [],
    },
    clockShow: false,
    clockHeight: 0,
    time: '25',
    mTime: 300000,
    timeStr: '05:00',
    tomato_date : null,
    rate: '',
    timer: null,
    //time:25,
    active: 0, 
    openid: wx.getStorageSync('token'),
    id:"",
    //logs
    logs: [],
    activeIndex: 0,
    activeId :0,
    tomatoWork : '',
    dayList: [],
    list: [],
    column:[],
    sum: [
      {
        title: '今日番茄次数',
        val: '0' 
      },
      {
        title: '累计番茄次数',
        val: '0'
      },
      {
        title: '今日专注时长',
        val: '0分钟'
      },
      {
        title: '累计专注时长',
        val: '0分钟'
      }
    ],
    cateArr:[
      {
        id : 0,
        icon:"study",
        text:"学习"
    },
    {
      id : 1,
      icon:"work",
      text:"工作"
    },
    {
      id : 2,
      icon:"think",
      text:"思考"
    },
    {
      id : 3,
      icon: "write",
      text: "写作"
    },
    {
      id : 4,
      icon: "sport",
      text: "运动"
    },
    {
      id : 5,
      icon: "read",
      text: "阅读"
    }],
    cateActive: '0',
    okShow: false,
    pauseShow: true,
    continueCancleShow: false

  },

  sliderChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  onLuanch() {
   
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    // const user = wx.cloud.database().collection("user")
    // user.where({
    //   _openid: this.data.openid
    // }).get({
    //   success: res => {
    //     console.log(res.data.length);
    //     this.setData({
    //       id: res.data[0].id
    //     })
    //   }
    // })
    // 750rpx 
    var res = wx.getSystemInfoSync();
    var rate = 750 / res.windowWidth;

    //  ? / res.windowHeight;
    this.setData({
      rate: rate,
      clockHeight: rate * res.windowHeight,
    })
   
  },
  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  clickCate: function (e) {
    this.setData({
      cateActive: e.currentTarget.dataset.index,
      activeId : e.currentTarget.dataset.index
    })
    //console.log("activeId:" + this.data.activeId)
  },
  start: function () {
    this.setData({
      clockShow: true,
      mTime: this.data.time * 60 * 1000,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00'
    })
    this.drawBg();
    this.drawActive();
  },
  drawBg: function () {
    var lineWidth = 6 / this.data.rate; // px
    var ctx = wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#000000');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400 / this.data.rate / 2, 400 / this.data.rate / 2, 400 / this.data.rate / 2 - 2 * lineWidth, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  },
  drawActive: function () {
    var _this = this;
    var timer = setInterval(function () {
      // 1.5 3.5
      // 0 2 
      // 300000 100
      // 3000
      // 2 / 3000
      var angle = 1.5 + 2 * (_this.data.time * 60 * 1000 - _this.data.mTime) / (_this.data.time * 60 * 1000);
      var currentTime = _this.data.mTime - 100
      _this.setData({
        mTime: currentTime
      });
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          var timeStr1 = currentTime / 1000; // s
          var timeStr2 = parseInt(timeStr1 / 60) // m
          var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : '0' + (timeStr1 - timeStr2 * 60);
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2;
          _this.setData({
            timeStr: timeStr2 + ':' + timeStr3
          })
        }
        var lineWidth = 6 / _this.data.rate; // px
        var ctx = wx.createCanvasContext('progress_active');
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle('#ffffff');
        ctx.setLineCap('round');
        ctx.beginPath();
        ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI, false);
        ctx.stroke();
        ctx.draw();
      } else {
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift({
          date: util.formatTime(new Date),
          cate: _this.data.cateActive,
          time: _this.data.time
        });
        wx.setStorageSync('logs', logs);
        _this.setData({
          timeStr: '00:00',
          okShow: true,
          pauseShow: false,
          continueCancleShow: false,
        })
        clearInterval(timer);
      }
    }, 100);
    _this.setData({
      timer: timer
    })
   // console.log("timeStr" + this.data.timeStr) //
  },
  pause: function () {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      continueCancleShow: true,
      okShow: false
    })
    //console.log("timeStr" + this.data.timeStr) //结束时间
    //console.log("time" + parseInt(this.data.time)) //总时间
    
  },
  continue: function () {
    this.drawActive();
    this.setData({
      pauseShow: true,
      continueCancleShow: false,
      okShow: false
    })
  },
  cancle: function () {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancleShow: false,
      okShow: false,
      clockShow: false
    })
  },
  async add() {
    await this.tomato_add()
    await this.user_find()
    await this.user_add()
  },
  async tomato_update(){
    await this.tomato_find()
  },
  tomato_add:function(){
    //console.log("tomato_add");
    return new Promise((resolved, reject) => {
        tomato.add({
          data: {
            openid: this.data.openid,
            tomato_endtime: this.data.tomato_date,
            tomato_time: this.data.time,
            tomato_finish: 1,
            tomato_work: this.data.tomatoWork
          },
          success: res => {
            //console.log(添加成功)
            resolved(res)
          },
          fail: res => {
            //console.log("添加失败")
            resolved(res)
          }
        })
      resolved()   
    })  
  },
  tomato_find: function () {
    //console.log("user_find");
   // console.log(this.data.openid);
    return new Promise((resolved, reject) => {
      //    你只要不执行resolved，这个user_add就不会结束，
      tomato.where({
        _openid: this.data.openid
      }).get({
        success: res => {
          //console.log(res.data);
          wx.setStorageSync('logs', res.data)
          resolved(res)
        }
      })
      //  不管里面有多少个回调。你把resolved放到最终的那个回调用。那么user_add就会结束
    })
  },
  user_find: function () {
   // console.log("user_find");
    //console.log(this.data.openid);
    return new Promise((resolved, reject) => {
      //    你只要不执行resolved，这个user_add就不会结束，
      user.where({
        _openid: this.data.openid
      }).get({
        success: res => {

          //console.log(res.data[0]._id);
          this.setData({
            id: res.data[0]._id
          })
          resolved(res)
        }
      })
      //  不管里面有多少个回调。你把resolved放到最终的那个回调用。那么user_add就会结束
    })

  },
  user_add:function(){
    //console.log(" user_add");
    return new Promise((resolved, reject) => {
      const _ = wx.cloud.database().command;
      //console.log(this.data.id);
      user.doc(this.data.id).update({
        data: {
          tomato_number:  _.inc(1),
          tomato_time:   _.inc(this.data.time)
        },
        
        success: res => {
          
         // console.log("用户添加成功")
          resolved(res)
        }
      })

    })
  },
  
  ok: function () {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      continueCancleShow: false,
      okShow: false,
      clockShow: false,
      tomato_date: util.formatTime(new Date)
    })
    if(this.data.activeId==0){
      this.setData({
        tomatoWork : '学习'
      })
    }
    if(this.data.activeId==1){
      this.setData({
        tomatoWork : '工作'
      })
    }
    if(this.data.activeId==2){
      this.setData({
        tomatoWork : '思考'
      })
    }
    if(this.data.activeId==3){
      this.setData({
        tomatoWork : '写作'
      })
    }
    if(this.data.activeId==4){
      this.setData({
        tomatoWork : '运动'
      })
    }
    if(this.data.activeId==5){
      this.setData({
        tomatoWork : '阅读'
      })
    }
   // console.log("tomato_date:" + this.data.tomato_date)
     this.add(); 

  },





  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  //logs


  onShow: function () {
    this.data.chartData= {
      data: [],
        categories: [],
    }

    this.data.chartDataToday={
      data: [],
        categories: [],
    }

    this.tomato_update()

    for (i = 0; i < this.data.cateArr.length; i++) {
      this.data.chartData.categories.push(this.data.cateArr[i].text)
      this.data.chartData.data[i]=0
      this.data.chartDataToday.categories.push(this.data.cateArr[i].text)
      this.data.chartDataToday.data[i] = 0
    }
    //console.log(this.data.chartData)
    
    var logs = wx.getStorageSync('logs') || [];
    //console.log(logs)
    // console.log(logs)//;
    var day = 0;
    var total = logs.length;
    var dayTime = 0;
    var totalTime = 0;
    var dayList = [];
    if (logs.length > 0) {
      // console.log("SS")
      for (var i = logs.length-1; i >= 0; i--) {
        if (logs[i].tomato_endtime.substr(0, 10) == util.formatTime(new Date).substr(0, 10)) {
          for (var j = 0; j < 6; j++) {
            if (logs[i].tomato_work == this.data.chartDataToday.categories[j]) {
              this.data.chartDataToday.data[j] += logs[i].tomato_time;
            }
          }
          day = day + 1;
          dayTime = dayTime + parseInt(logs[i].tomato_time);
          dayList.push(logs[i]);
          this.setData({
            dayList: dayList,
            list: dayList
          })
          
        }
        //获取柱状图数据
        for (var j = 0; j < 6; j++) {
          if (logs[i].tomato_work == this.data.chartData.categories[j]) {
            this.data.chartData.data[j] += logs[i].tomato_time;
          }
        }
        totalTime = totalTime + parseInt(logs[i].tomato_time)
      }
      console.log(this.data.chartData)
      this.setData({
        'sum[0].val': day,
        'sum[1].val': total,
        'sum[2].val': dayTime + '分钟',
        'sum[3].val': totalTime + '分钟'
      })
     // console.log("totalTime：" + totalTime) //时间
    }
    //柱状图
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

      // console.log(this.data.chartData.categories)
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: this.data.chartData.categories,
      series: [{
        name: '任务种类',
        data: this.data.chartData.data,
        format: function (val, name) {
          return val.toFixed() ;
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '分钟';
        },
        title: ' ',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: 300,
      height: 160,
    })
    
    columnChartToday = new wxCharts({
      canvasId: 'columnCanvas-date',
      type: 'column',
      animation: true,
      categories: this.data.chartDataToday.categories,
      series: [{
        name: '任务种类',
        data: this.data.chartDataToday.data,
        format: function (val, name) {
          return val.toFixed() ;
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '分钟';
        },
        title: ' ',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: 300,
      height: 160,
    })
    
//饼状图
    var pipdata = []
    var pipdataToday=[]
    for (var i = 0; i < this.data.cateArr.length; i++) {
      pipdata.push({ 'name': this.data.chartData.categories[i], 'data': this.data.chartData.data[i]})
      pipdataToday.push({ 'name': this.data.chartDataToday.categories[i], 'data': this.data.chartDataToday.data[i] })
    }
    // console.log(pipdataToday)
    // console.log(pipdata)
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: pipdata,
      width: 300,
      height: 300,
      dataLabel: true,
    })
    
    pieChartToday = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas-date',
      type: 'pie',
      series: pipdataToday,
      width: 300,
      height: 300,
      dataLabel: true,
    }) 

  },
  con:function(){
    this.tomato_update()
  },
  changeType: function (e) {
    var index = e.currentTarget.dataset.index;
    var activeId = e.currentTarget.dataset.activeId;
    if (index == 0) {
      this.setData({
        list: this.data.dayList
      })
    } else if (index == 1) {
      var logs = wx.getStorageSync('logs') || [];
      this.setData({
        list: logs.reverse()
      })
    }
    this.setData({
      activeIndex: index,
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

  },

})