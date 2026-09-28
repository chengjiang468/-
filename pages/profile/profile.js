const { ROUTES } = require('../../data/routes');
const { SPOTS } = require('../../data/spots');

Page({
  data: {
    profile: null,
    badges: 0,
    routesDone: 0,
    routesAll: ROUTES.length,
    secret: 0,
    secretAll: 1,
    booked: 0,
    feedback: 0,
    total: 0,
    totalAll: SPOTS.length
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const badges = app.earnedBadges();
    // 隐藏成就＝破茧（三条线路全部走完）；线路成就章不算隐藏
    const secret = badges.filter(function (b) { return b.kind === 'alllines'; });

    this.setData({
      profile: app.globalData.profile,
      badges: badges.filter(function (b) { return b.got; }).length,
      routesDone: app.doneRouteCount(),
      secret: secret.filter(function (b) { return b.got; }).length,
      secretAll: secret.length,
      booked: app.bookingCount(),
      feedback: app.feedbackCount(),
      total: app.totalChecked()
    });
  },

  /** 我的预约：只列「真的点过预约」的那几场（在首页今日活动里约的） */
  onBookings() {
    wx.navigateTo({ url: '/pages/bookings/bookings' });
  },

  onFeedback() {
    const self = this;
    wx.showModal({
      title: '建议信箱',
      editable: true,
      placeholderText: '写下你对园区的建议，比如想去的地方、想加的功能…',
      confirmText: '提交',
      confirmColor: '#C9922B',
      success(res) {
        if (!res.confirm) return;
        if (getApp().addFeedback(res.content)) {
          self.refresh();
          wx.showToast({ title: '已记录，谢谢你的建议', icon: 'none' });
        } else {
          wx.showToast({ title: '还没写内容哦', icon: 'none' });
        }
      }
    });
  },

  onAbout() {
    wx.showModal({
      title: '关于这个小程序',
      content: '蝴蝶谷 v1.0 · 江门市百合镇\n\n'
        + '· 三条主题线路，共 ' + SPOTS.length + ' 处打卡点位\n'
        + '· 打卡、徽章、活动预约都存在本机，不需要登录\n'
        + '· 换手机或清缓存会丢失记录\n'
        + '· 园区坐标为占位值，配好后「导航」会直接唤起地图',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /** 资料卡右上角那支铅笔：改昵称。ID 不动，点 ID 那一行才复制。 */
  onEditProfile() {
    const self = this;
    const cur = (this.data.profile || {}).nick || '';
    wx.showModal({
      title: '修改个人信息',
      editable: true,
      content: cur,
      placeholderText: '给自己起个名字（12 字以内）',
      confirmText: '保存',
      confirmColor: '#C9922B',
      success(res) {
        if (!res.confirm) return;
        if (!getApp().setNick(res.content)) {
          wx.showToast({ title: '名字不能为空', icon: 'none' });
          return;
        }
        self.refresh();
        wx.showToast({ title: '已保存', icon: 'none' });
      }
    });
  },

  onCopyId() {
    const id = (this.data.profile || {}).id || '';
    if (!id) return;
    wx.setClipboardData({
      data: id,
      success() { wx.showToast({ title: 'ID 已复制', icon: 'none' }); }
    });
  },

  // 导航栏右上角「分享」按钮（open-type="share"）触发这里
  onShareAppMessage() {
    return {
      title: '蝴蝶谷园区导览 · 三条主题线路',
      path: '/pages/home/home'
    };
  }
});
