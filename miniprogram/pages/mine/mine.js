const CONSTANT = require('../../utils/constant')
const app = getApp()
const db = wx.cloud.database()
const questionsCollection = db.collection('questions')
const answersCollection = db.collection('answers')
const _ = db.command


const buttons = [
  {
    label: '创建投票',
    icon: CONSTANT.pollIcon,
  },
  {
    label: '撰写图文',
    icon: CONSTANT.composeIcon,
  },
]

Page({
  /**
   * Page initial data
   */
  data: {
    buttons,
    currentTab: "myQuestions",
    askedQuestionArr:[],
    answeredQuestionArr:[],
    answered_questions_id:[],
  },

  onTabChange(e) {
    this.setData({
      current: e.detail.key,
    })
  },

  onClickAddButton(e) {
    // console.log('onclick', e.detail.index);
    if(e.detail.index === 1) {
      wx.navigateTo({
        url: '../compose/compose',
      });
    } else if (e.detail.index === 0) {
      wx.navigateTo({
        url: '../createPoll/createPoll',
      });
    }
  },

  loadAskedQuestions: function() {
    questionsCollection.where({
      owner:app.globalData.openid,
    }).get().then((res)=>{
      console.log(res)
      let array = res.data
      let askedQuestionArr = []
      for (var index = 0; index < array.length; index++) { 
        askedQuestionArr.push(array[index].question)
      } 
      this.setData({
        askedQuestionArr: askedQuestionArr
      })
    })
  },

  loadAnsweredQuestions: function() {
    answersCollection.where({
      owner: app.globalData.openid,
    }).get().then((res)=>{
      let array = res.data
      let answered_questions_id = []
      for (var index = 0; index < array.length; index++) { 
        answered_questions_id.push(array[index].question_id)
      } 
      this.setData({
        answered_questions_id: answered_questions_id
      })
    }).then(()=>{
      questionsCollection.where({
        _id: _.in(this.data['answered_questions_id'])
      }).get().then((res)=>{
        let array = res.data
        let answeredQuestionArr = []
        for (var index = 0; index < array.length; index++) { 
          answeredQuestionArr.push(array[index].question)
        } 
        this.setData({
          answeredQuestionArr: answeredQuestionArr
        })
      })
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.loadAskedQuestions()
    this.loadAnsweredQuestions()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})