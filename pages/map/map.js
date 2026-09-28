const sys = require('../../utils/system');
const { ROUTES } = require('../../data/routes');

// 三张线路地图同源同尺寸（700×748）；地图卡左右各留 40rpx → 卡片内宽 670rpx。
// movable-view 必须显式给宽高，所以这里按图片自身比例算出显示高度，
// 与图片等比，放大 / 拖动后都不会形变。
const MAP_RATIO = 748 / 700;
const MAP_W = 670;
const MAP_H = Math.round(MAP_W * MAP_RATIO);   // 716rpx

Page({
  data: {
    top: sys.navTopRpx,
    routes: ROUTES,
    routeKey: ROUTES[0].key,
    route: ROUTES[0],
    accent: ROUTES[0].accent,
    accentDeep: ROUTES[0].accentDeep,
    tint: ROUTES[0].tint,
    checked: 0,
    pct: 0,
    next: null,

    // 地图缩放：宽高给 movable-view，zoom 绑到 scale-value，
    // zoomed 只用来切换右下角那颗胶囊（真实缩放比，捏合时由 onScale 同步）
    mapW: MAP_W,
    mapH: MAP_H,
    zoom: 1,
    zoomed: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const key = app.globalData.routeKey;
    const route = app.getRoute(key);
    const list = app.routeSpots(key);
    const checked = app.routeChecked(key);
    const next = app.nextSpot(key);

    // 地图已换成整张手绘插画，不再叠加 marker：
    // 之前的序号点用的是「旧版地形底图」的归一化坐标（nx / ny），
    // 新版插画分区比例不同，套上去会整体错位，所以整层移除。
    // 颜色仍取本条线路的主色，供进度条与「下一站」卡使用。
    const color = route.accent || '#D98B3F';
    const deep = route.accentDeep || color;
    const tint = route.tint || '#F9E4CB';

    this.setData({
      routeKey: key,
      route: route,
      accent: color,
      accentDeep: deep,
      tint: tint,
      checked: checked,
      pct: list.length ? Math.round(checked * 100 / list.length) : 0,
      next: next ? {
        id: next.id,
        name: next.name,
        step: next.step,
        icon: next.icon,
        cat: next.cat
      } : null
    });
  },

  /* 地图缩放：movable-area + movable-view 自带双指缩放与拖动，
     这里只做两件事 —— 记录真实缩放比（切胶囊文案），
     以及「点一下在 1x / 2x 之间切」（模拟器和桌面端捏合不方便，留一条后路）。 */
  onScale(e) {
    const s = (e.detail && e.detail.scale) || 1;
    const zoomed = s > 1.02;
    if (zoomed !== this.data.zoomed) this.setData({ zoomed: zoomed });
  },

  onToggleZoom() {
    const to = this.data.zoomed ? 1 : 2;
    this.setData({ zoom: to, zoomed: to > 1 });
  },

  onPickRoute(e) {
    getApp().setRoute(e.currentTarget.dataset.key);
    this.refresh();
  },

  onNext() {
    if (!this.data.next) return;
    wx.navigateTo({ url: '/pages/spot/spot?id=' + this.data.next.id });
  },

  // 导航栏右上角「分享」按钮（open-type="share"）触发这里
  onShareAppMessage() {
    const route = this.data.route;
    return {
      title: route.name + ' · 蝴蝶谷园区导览地图',
      path: '/pages/map/map'
    };
  }
});
