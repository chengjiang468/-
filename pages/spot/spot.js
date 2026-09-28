const { SPOTS, SPOT_BY_ID, CATS } = require('../../data/spots');
const { PARK } = require('../../data/park');

function fmt(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
    ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

/** 邮戳上的日期：月-日 */
function fmtMd(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return p(d.getMonth() + 1) + '-' + p(d.getDate());
}

Page({
  data: {
    spot: null,
    color: '#93A199',
    accent: '#D98B3F',
    accentDeep: '#9C5218',
    done: false,
    at: '',
    atDay: '',
    lineKey: '',
    lineName: '',
    stepTxt: '',
    lines: [],
    nearby: [],
    showDialog: false,
    gained: [],
    bigBadge: null,
    doneLineName: '',
    park: PARK
  },

  onLoad(q) {
    this.id = q.id || (q.scene ? decodeURIComponent(q.scene) : '');
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const app = getApp();
    const s = SPOT_BY_ID[this.id];
    if (!s) {
      wx.showToast({ title: '这个点位不存在', icon: 'none' });
      setTimeout(function () { wx.navigateBack({ delta: 1 }); }, 900);
      return;
    }

    // 打卡是「按线路」记录的：这里只反映当前线路上的状态
    const key = app.globalData.routeKey;
    const route = app.getRoute(key);
    const at = app.checkinAt(s.id, key);
    const step = app.stepOnLine(s.id, key);

    const lines = app.routesOfSpot(s.id).map(function (r) {
      return {
        key: r.key,
        name: r.name,
        accent: r.accent,
        accentDeep: r.accentDeep,
        tint: r.tint,
        step: r.spots.indexOf(s.id) + 1,
        total: r.spots.length,
        done: app.isCheckedIn(s.id, r.key),
        current: r.key === key
      };
    });

    const nearby = SPOTS.filter(function (x) {
      return x.cat === s.cat && x.id !== s.id;
    }).slice(0, 4).map(function (x) {
      return { id: x.id, name: x.name, icon: x.icon, done: app.isCheckedIn(x.id, key) };
    });

    this.setData({
      spot: s,
      color: CATS[s.cat] || '#93A199',
      accent: route.accent || '#D98B3F',
      accentDeep: route.accentDeep || '#9C5218',
      done: app.isCheckedIn(s.id, key),
      at: at ? fmt(at) : '',
      atDay: at ? fmtMd(at) : '',
      lineKey: key,
      lineName: route.name,
      stepTxt: step ? ('第 ' + step + ' / ' + route.spots.length + ' 站') : '不在这条线的动线上',
      lines: lines,
      nearby: nearby
    });
  },

  noop() {},

  onToggle() {
    const app = getApp();
    const res = app.toggleCheckin(this.id);
    this.refresh();
    if (res.checked) {
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      const gained = res.gained || [];
      // 这一枚章盖完，当前线路正好整条走完 -> 弹窗改成「放大展示成就徽章」
      // 一次可能同时解锁两枚（走完第三条线时＝线路章 + 隐藏章「破茧」），
      // 优先展示更稀有的那枚：全通章 > 线路章。
      let big = null;
      if (res.lineDone) {
        big = gained.filter(function (b) { return b.kind === 'alllines'; })[0] ||
          gained.filter(function (b) { return b.icon; })[0] || null;
      }
      this.setData({
        showDialog: true,
        gained: gained,
        bigBadge: big,
        doneLineName: res.lineName
      });
    } else {
      wx.showToast({ title: '已取消打卡', icon: 'none' });
    }
  },

  onCloseDialog() {
    this.setData({ showDialog: false, bigBadge: null, gained: [] });
  },

  /** 切到某条线路（停在当前页）—— 重合点位要按新线路重新盖章 */
  onGoLine(e) {
    const app = getApp();
    const key = e.currentTarget.dataset.key;
    if (key === app.globalData.routeKey) {
      wx.switchTab({ url: '/pages/map/map' });
      return;
    }
    app.setRoute(key);
    this.refresh();
    wx.showToast({ title: '已切到' + app.getRoute(key).name + '，可重新盖章', icon: 'none', duration: 1800 });
  },

  onNearby(e) {
    wx.redirectTo({ url: '/pages/spot/spot?id=' + e.currentTarget.dataset.id });
  },

  onNavigate() {
    const p = PARK;
    if (p.latitude && p.longitude) {
      wx.openLocation({
        latitude: p.latitude,
        longitude: p.longitude,
        name: p.name,
        address: p.address,
        scale: 16
      });
      return;
    }
    wx.setClipboardData({
      data: p.address,
      success() {
        wx.showToast({ title: '地址已复制，可粘贴到地图 App 导航', icon: 'none', duration: 2200 });
      }
    });
  }
});
