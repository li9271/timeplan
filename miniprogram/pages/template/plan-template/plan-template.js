// pages/word-template/word-template.js
var item = [{
  "postId": 0,
  "plan_name": "1.如何只需要10天通过四级",
  "plan_Click": 112,
  "plan_like": 89,
  "plan_dislike": 53,
  "plan_share": 20,
  "plan_type":"学习",
  "like_anti": "../../images/plan/like-anti.png",
  "unlike_anti": "../../images/plan/unlike-anti.png",
  "share_anti": "../../images/plan/share-anti.png",
  "user_ID": 123,
  "plan_Complish": "0",
  "plan_content": "1.1背必考词,分数就有了保障,听力是难点, 多听",
  "parent_ID": null,
  "plan_start_time": "2019-12-04",
  "end_Time": "2019-12-29",
  "is_Start": "0",
  "location": 1,
  "has_Son": "1",
  "son": [{
    "postId": 1,
    "plan_name": "2.多找真题听力进行练习",
    "plan_Click": 112,
    "plan_like": 89,
    "plan_dislike": 53,
    "plan_share": 20,
    "like_anti": "../../images/plan/like-anti.png",
    "unlike_anti": "../../images/plan/unlike-anti.png",
    "share_anti": "../../images/plan/share-anti.png",
    "user_ID": 123,
    "plan_Complish": "0",
    "plan_content": "2.1按正式时间和步骤考试那样自己练习, 听完后对答案, 如果错了, 重听, 多听几遍, 直到听懂每个单词, 听时不看答案, 听多遍实在听不懂再看。真题阅读理解要多做, 第一遍看题目, 带着题目去看原文大意",
    "parent_ID": 1,
    "start_Time": "2019-12-04 10:16:11",
    "end_Time": "2019-12-05 09:16:11",
    "is_Start": "1",
    "location": 2,
    "has_Son": "0",
    "son": []
  }, {
    "postId": 2,
    "plan_name": "3.背单词必可不少",
    "plan_Click": 120,
    "plan_like": 12,
    "plan_dislike": 30,
    "plan_share":20,
    "like_anti": "../../images/plan/like-anti.png",
    "unlike_anti": "../../images/plan/unlike-anti.png",
    "share_anti": "../../images/plan/share-anti.png",
    "user_ID": 123,
    "plan_Complish": "0",
    "plan_content": "3.1每天背50个单词，反复背",
    "parent_ID": 1,
    "start_Time": "2019-12-04 10:16:36",
    "end_Time": null,
    "is_Start": "1",
    "location": 2,
    "has_Son": "1",
    "son": [{
      "postId": 3,
      "plan_Name": "4早上25个，睡前25个",
      "plan_Click": null,
      "plan_Like": null,
      "plan_Unlike": null,
      "user_ID": 123,
      "plan_Complish": "0",
      "plan_Content": "4.1早上时间段可以选择7点到8点的时间段，记忆力号，睡前可以花1个小时去记单词",
      "parent_ID": 2,
      "start_Time": null,
      "end_Time": null,
      "is_Start": null,
      "location": 3,
      "has_Son": "0"
    }, {
      "son": []
    }
    ]
  }
  ]
},
  {
    "postId": 1,
    "plan_name": "如何在十天内通过计算机二级",
    "plan_Click": 62,
    "plan_like": 32,
    "plan_dislike": 12,
    "plan_share": 20,
    "plan_type": "学习",
    "like_anti": "../../images/plan/like-anti.png",
    "unlike_anti": "../../images/plan/unlike-anti.png",
    "share_anti": "../../images/plan/share-anti.png",
    "user_ID": 123,
    "plan_Complish": "0",
    "plan_content": "如果时间很充裕的话，先在网上买一套计算机二级的书，里面包括了基本的知识点和题库，因为计算机二级，大部分是刷题，但是要是懂基础知识对于刷题就更快更有效。",
    "parent_ID": null,
    "plan_start_time": "2019-12-05",
    "end_Time": "2019-12-29",
    "is_Start": "0",
    "location": 1,
    "has_Son": "1"
    }
]
module.exports = {
  itemList: item
}
Page({
  data: {
    bgimg: "../../images/plan/fly.png",
    like_anti: "../../images/plan/like-anti.png",
    unlike_anti: "../../images/plan/unlike-anti.png",
    share_anti: "../../images/plan/share-anti.png",
  },
  gotolabel: function () {
    var itemsData = require('../../word-template/word-template.js');
    itemData = itemsData.itemList;
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../label/label?id=' + postId
    })
    console.log('gotolabel的postId' + postId)
  }
})