// 活动详情页
//
// 定位很重要：**这不是打卡界面**。
// 从首页「今日活动」/「预约体验」页点一张活动卡进来，要看到的是
//   活动介绍 + 小科普 + 温馨提示，
// 而不是点位打卡那一套（邮戳、动线、成就章）。
// 想打卡的人，从最下面「活动地点」那张卡点进点位页 —— 那条路是明确标出来的。
const { ACTIVITIES } = require('../../data/activities');
const { SPOT_BY_ID, CATS } = require('../../data/spots');

Page({
  data: {
    idx: 0,
    act: null,
    spot: null,
    color: '#3F9A66',
    booked: false,
    onLine: false,
    lineTxt: ''
  },

  onLoad(q) {
    const i = parseInt((q && q.i) || '0', 10);
    this.idx = (isNaN(i) || i < 0 || i >= ACTIVITIES.length) ? 0 : i;
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const act = ACTIVITIES[this.idx];
    if (!act) {
      wx.showToast({ title: '这个活动不存在', icon: 'none' });
      setTimeout(function () { wx.navigateBack({ delta: 1 }); }, 900);
      return;
    }
    const spot = SPOT_BY_ID[act.spot] || null;
    // 用点位的分类色做这一页的强调色；活动没挂点位时退回品牌橙
    const color = spot ? (CATS[spot.cat] || '#3F9A66') : '#3F9A66';
    // 这个点位在哪几条动线上 —— 让「想打卡」的人知道走哪条线能到。
    // 注意：有 4 处点位（卫生间 / 无花果生态园 / 碉楼酒店 / 野奢民宿）不在任何动线上，
    // 只做浏览、不走动线，所以这一栏的两个文案要分开：
    // 在动线上才说「点进去可打卡」，不在动线上只能说「点进去看看」。
    const lines = spot ? app.routesOfSpot(spot.id) : [];

    this.setData({
      idx: this.idx,
      act: act,
      spot: spot,
      color: color,
      booked: app.isBooked(act.title),
      onLine: lines.length > 0,
      lineTxt: lines.length
        ? ' · 在' + lines.map(function (r) { return r.name; }).join('、') + '上'
        : (spot ? ' · 不在任何动线上' : '')
    });
  },

  noop() {},

  /** 预约 / 取消预约（跟活动列表页共用同一份预约记录） */
  onBook() {
    const act = this.data.act;
    if (!act) return;
    const on = getApp().toggleBooking(act.title);
    this.refresh();
    wx.showToast({
      title: on ? '已预约 · ' + act.title : '已取消预约',
      icon: 'none',
      duration: 1600
    });
  },

  /** 唯一的打卡入口：去这个活动的点位页 */
  onSpot() {
    if (!this.data.spot) return;
    wx.navigateTo({ url: '/pages/spot/spot?id=' + this.data.spot.id });
  },

  onShareAppMessage() {
    const a = this.data.act || {};
    return {
      title: a.title ? (a.title + ' · ' + a.day + ' · ' + a.place) : '蝴蝶谷 · 预约体验',
      path: '/pages/activity/activity?i=' + (this.idx || 0)
    };
  }
});
