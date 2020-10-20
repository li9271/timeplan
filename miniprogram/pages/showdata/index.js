const app = getApp()
const util = require('../utils/utils.js')
var wxCharts = require('wxcharts.js');
var areaChart = null;
var columnChart = null;
var columnChartToday = null;
var pieChart = null;
var pieChartToday = null;
var pipdata
var pipdataToday
var chartDataToday
var chartData 

Page({
  data: {
    
  },

  //事件处理函数
  onLoad: function (options) {
    pipdata = JSON.parse(options.pipdata)
    pipdataToday = JSON.parse(options.pipdataToday)
    chartDataToday = JSON.parse(options.chartDataToday)
    chartData = JSON.parse(options.chartData)
  },

  onShow: function(){
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '成交量1',
        data: 15,
      }, {
        name: '成交量2',
        data: 35,
      }, {
        name: '成交量3',
        data: 78,
      }, {
        name: '成交量4',
        data: 63,
      }, {
        name: '成交量2',
        data: 35,
      }, {
        name: '成交量3',
        data: 78,
      }, {
        name: '成交量4',
        data: 63,
      }, {
        name: '成交量2',
        data: 35,
      }, {
        name: '成交量3',
        data: 78,
      }, {
        name: '成交量3',
        data: 78,
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    })

  }
})
