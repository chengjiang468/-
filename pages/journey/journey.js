const { ROUTES } = require('../../data/routes');
const { SPOTS } = require('../../data/spots');

Page({
  data: {
    routes: [],
    badges: [],
    tile: 136,
    badgeGot: 0,
    badgeAll: 0,
    routesDone: 0,
    routesAll: ROUTES.length,
    total: 0,
    totalAll: SPOTS.length
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const cur = app.globalData.routeKey;

    const routes = ROUTES.map(function (r) {
      const done = app.routeChecked(r.key);
      const n = r.spots.length;
      return {
        no: r.no,
        key: r.key,
        name: r.name,
        accent: r.accent,
        tint: r.tint,
        icon: r.icon,                 // 线路插画：风车 / 双蝶 / 纸飞机
        done: done,
        total: n,
        pct: n ? Math.round(done * 100 / n) : 0,
        current: r.key === cur,
        full: n > 0 && done >= n
      };
    });

    // 徽章一共 4 枚：放电线 / 双飞线 / 同频线 各 1 枚 + 1 枚隐藏（破茧）。
    // 一条线路整条走完才发章；破茧要三条线都走完。
    // 每一枚都有专属金火漆插画 —— 不再有「回落到通用金印章」的兜底。
    const badges = app.earnedBadges();

    // 设计稿是 4 枚 136rpx 方块排成一行。数量变化时按行宽等比缩放，
    // 保证永远一行排开 —— 一旦换行，排版会被浮动标签栏压住。
    const AVAIL = 614;                       // 卡宽 670 - 左右各 28 内边距
    const GAP = 20;
    const n = badges.length;
    let tile = n > 1 ? Math.floor((AVAIL - (n - 1) * GAP) / n) : 136;
    if (tile > 136) tile = 136;
    if (tile < 84) tile = 84;

    this.setData({
      routes: routes,
      badges: badges,
      tile: tile,
      badgeGot: badges.filter(function (b) { return b.got; }).length,
      badgeAll: badges.length,
      routesDone: app.doneRouteCount(),
      total: app.totalChecked()
    });
  },

  /**
   * 点徽章：已解锁 -> 直接看大图（章面上就写着成就名）；
   * 未解锁 -> 只说解锁条件，不剧透图案。
   */
  onBadge(e) {
    const b = this.data.badges[e.currentTarget.dataset.i];
    if (!b) return;
    if (b.got && b.icon) {
      wx.previewImage({ urls: [b.icon], current: b.icon });
      return;
    }
    wx.showModal({
      title: '未解锁 · ' + b.name,
      content: b.cond,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onRoute(e) {
    getApp().setRoute(e.currentTarget.dataset.key);
    wx.switchTab({ url: '/pages/map/map' });
  },

  onReset() {
    const self = this;
    wx.showModal({
      title: '清空打卡记录',
      content: '会清掉三条线路上已盖的所有章和已解锁的徽章，重新开始。确定吗？',
      confirmText: '清空',
      confirmColor: '#3F9A66',
      success(res) {
        if (!res.confirm) return;
        getApp().resetProgress();
        self.refresh();
        wx.showToast({ title: '已清空，重新出发', icon: 'none' });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我的蝴蝶谷旅程 · 已收集 ' + this.data.badgeGot + ' 枚徽章',
      path: '/pages/journey/journey'
    };
  }
});
