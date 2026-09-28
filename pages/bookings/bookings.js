// 我的预约
//
// 与「预约体验」（pages/activities/activities，本周可预约 6 场全列）的分工：
//   那一页 = 能约什么；这一页 = 我已经约了什么。
// 数据源就是 app.globalData.bookings（{ 活动标题: 时间戳 }），
// 所以**只有在活动详情里真按下过「预约这场体验」的场次才会出现在这里** ——
// 首页「今日活动」点进去约的、和「预约体验」列表里点价格约的，是同一份记录。
const { ACTIVITIES } = require('../../data/activities');

Page({
  data: {
    list: [],
    count: 0,
    // 已结束/已下架的活动标题（当前没有，留个口子）
    missing: 0
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const list = ACTIVITIES
      .map(function (a, i) {
        return Object.assign({}, a, { idx: i });
      })
      .filter(function (a) { return app.isBooked(a.title); })
      // 最近约的排前面
      .sort(function (a, b) {
        return (app.globalData.bookings[b.title] || 0) - (app.globalData.bookings[a.title] || 0);
      });

    this.setData({
      list: list,
      count: app.bookingCount(),
      missing: app.bookingCount() - list.length
    });
  },

  /** 点卡片 → 活动详情（介绍 / 小科普 / 温馨提示），在那里也能取消预约 */
  onAct(e) {
    const i = e.currentTarget.dataset.idx;
    wx.navigateTo({ url: '/pages/activity/activity?i=' + (i === undefined ? 0 : i) });
  },

  /** 卡片上的「取消预约」：自己吃掉点击，不触发进详情 */
  onCancel(e) {
    const title = e.currentTarget.dataset.title;
    const self = this;
    wx.showModal({
      title: '取消预约',
      content: '确定要取消「' + title + '」吗？',
      confirmText: '取消预约',
      confirmColor: '#3F9A66',
      cancelText: '再想想',
      success(res) {
        if (!res.confirm) return;
        getApp().toggleBooking(title);
        self.refresh();
        wx.showToast({ title: '已取消预约', icon: 'none' });
      }
    });
  },

  onAll() {
    wx.navigateTo({ url: '/pages/activities/activities' });
  },

  onShareAppMessage() {
    return {
      title: '蝴蝶谷 · 我已经约了 ' + this.data.count + ' 场体验',
      path: '/pages/home/home'
    };
  }
});
