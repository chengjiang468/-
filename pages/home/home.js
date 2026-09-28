const sys = require('../../utils/system');
const { SPOTS, CATS } = require('../../data/spots');
const { ROUTES } = require('../../data/routes');
const { ACTIVITIES } = require('../../data/activities');
const { PARK } = require('../../data/park');

Page({
  data: {
    gap: sys.navTotalRpx,
    park: PARK,
    routes: ROUTES,
    routeKey: ROUTES[0].key,
    route: ROUTES[0],
    pct: 0,
    checked: 0,
    hot: [],
    query: '',
    results: [],
    totalSpots: SPOTS.length,
    acts: [],
    // 「让园区帮你选一条」弹窗
    showPick: false,
    pick: null
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const key = app.globalData.routeKey;
    const route = app.getRoute(key);
    const done = app.routeChecked(key);
    const hot = this.buildHot(key);
    const acts = ACTIVITIES.slice(0, 4).map(function (a, i) {
      return Object.assign({}, a, { idx: i, booked: app.isBooked(a.title) });
    });

    this.setData({
      routeKey: key,
      route: route,
      pct: route.spots.length ? Math.round(done * 100 / route.spots.length) : 0,
      checked: done,
      hot: hot,
      acts: acts
    });
    if (this.data.query) this.runSearch(this.data.query);
  },

  buildHot(key) {
    const app = getApp();
    const route = app.getRoute(key);
    return route.spots
      .map(function (id, i) {
        const s = SPOTS.filter(function (x) { return x.id === id; })[0];
        return {
          id: s.id,
          name: s.name,
          cat: s.cat,
          icon: s.icon,
          color: CATS[s.cat],
          step: i + 1,
          done: app.isCheckedIn(s.id, key)
        };
      });
  },

  // ------------------------------------------------------------- 交互
  onRoute(e) {
    const key = e.currentTarget.dataset.key;
    getApp().setRoute(key);
    this.refresh();
  },

  onQuery(e) {
    const q = (e.detail.value || '').trim();
    this.setData({ query: q });
    this.runSearch(q);
  },

  runSearch(q) {
    if (!q) {
      this.setData({ results: [] });
      return;
    }
    const app = getApp();
    const low = q.toLowerCase();
    const hits = SPOTS.filter(function (s) {
      return (s.name + s.cat + s.intro).toLowerCase().indexOf(low) >= 0;
    }).slice(0, 12).map(function (s) {
      return {
        id: s.id,
        name: s.name,
        cat: s.cat,
        icon: s.icon,
        color: CATS[s.cat],
        done: app.isCheckedIn(s.id)
      };
    });
    this.setData({ results: hits });
  },

  onClearQuery() {
    this.setData({ query: '', results: [] });
  },

  onSpot(e) {
    wx.navigateTo({ url: '/pages/spot/spot?id=' + e.currentTarget.dataset.id });
  },

  /** 今日活动的卡 → 活动详情（介绍 / 小科普 / 温馨提示），不是打卡页 */
  onAct(e) {
    const i = e.currentTarget.dataset.idx;
    wx.navigateTo({ url: '/pages/activity/activity?i=' + (i === undefined ? 0 : i) });
  },

  /** 热门打卡点那张线路卡：点一下直接去地图页看这条线的导览图 */
  onGoMap() {
    wx.switchTab({ url: '/pages/map/map' });
  },

  onActivities() {
    wx.navigateTo({ url: '/pages/activities/activities' });
  },

  /**
   * 智能选路：三条线路等概率真随机挑一条。
   * 挑完先弹一张卡：线路名 + 几句有趣的话，确认了再跳地图。
   */
  onSmartPick() {
    const pick = getApp().randomRoute();
    if (!pick) return;
    this.setData({ showPick: true, pick: pick });
  },

  /** 不喜欢这条，换一条 —— 这里明确「排除当前这条」，点了必须换掉 */
  onPickAgain() {
    const cur = this.data.pick && this.data.pick.key;
    const pick = getApp().randomRoute(cur);
    if (!pick) return;
    this.setData({ pick: pick });
  },

  onClosePick() {
    this.setData({ showPick: false, pick: null });
  },

  /** 就走这条线 → 设成当前线路并跳地图 */
  onConfirmPick() {
    const pick = this.data.pick;
    if (!pick) return;
    getApp().setRoute(pick.key);
    this.setData({ showPick: false, pick: null });
    wx.switchTab({ url: '/pages/map/map' });
  },

  noop() {}
});
