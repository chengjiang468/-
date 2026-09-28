const { ACTIVITIES } = require('../../data/activities');

Page({
  data: {
    acts: [],
    count: 0,
    bookedCount: 0,
    routeName: '',
    routeAccent: '#3F9A66',
    routeIcon: '/assets/route/r-family.png',
    done: 0,
    total: 0
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const acts = ACTIVITIES.map(function (a, i) {
      return Object.assign({}, a, { idx: i, booked: app.isBooked(a.title) });
    });
    const key = app.globalData.routeKey;
    const route = app.getRoute(key);

    this.setData({
      acts: acts,
      count: acts.length,
      bookedCount: app.bookingCount(),
      routeName: route.name,
      routeAccent: route.accent,
      routeIcon: route.icon,
      done: app.routeChecked(key),
      total: route.spots.length
    });
  },

  onBook(e) {
    const title = e.currentTarget.dataset.title;
    const on = getApp().toggleBooking(title);
    this.refresh();
    wx.showToast({
      title: on ? '已预约 · ' + title : '已取消预约',
      icon: 'none',
      duration: 1600
    });
  },

  /**
   * 点活动卡 → 活动详情页（活动介绍 / 小科普 / 温馨提示）。
   * 这里**不再**跳到点位打卡页：想看打卡从详情页最下方的「活动地点」进。
   */
  onAct(e) {
    const i = e.currentTarget.dataset.idx;
    wx.navigateTo({ url: '/pages/activity/activity?i=' + (i === undefined ? 0 : i) });
  },

  onJourney() {
    wx.switchTab({ url: '/pages/journey/journey' });
  },

  // 导航栏右上角「分享」按钮（open-type="share"）触发这里
  onShareAppMessage() {
    return {
      title: '蝴蝶谷 · 可预约的园区体验 共 ' + this.data.count + ' 项',
      path: '/pages/activities/activities'
    };
  }
});
