// 蝴蝶谷 · 园区导览小程序
// 全局状态：打卡记录 / 当前线路 / 游客身份。全部落在本机 Storage，无需后端即可跑通。
//
// 打卡口径（2026-09 起）：**打卡是按线路独立记录的**。
//   同一条线路上有重合点位，在 A 线打过卡不会让 B 线也变成已打卡；
//   想在同一处点位为 B 线再盖一枚章，就得跟着 B 线重新走到这里。
// 所以 checkins 的结构是 { 线路key: { 点位id: 时间戳 } }。
const { SPOTS, SPOT_BY_ID, CATS } = require('./data/spots');
const { ROUTES, ROUTE_BY_KEY } = require('./data/routes');
const { BADGES, ACTIVITIES } = require('./data/activities');
const { PARK } = require('./data/park');
const { loadFonts } = require('./utils/fonts');

// v1 是「不分线路」的老结构，读到 v1 会迁移到 v2（见 restore）
const KEY = 'bfg_state_v2';
const KEY_V1 = 'bfg_state_v1';

/** 三种线路的空打卡表 */
function blankCheckins() {
  const m = {};
  for (let i = 0; i < ROUTES.length; i++) m[ROUTES[i].key] = {};
  return m;
}

App({
  globalData: {
    SPOTS: SPOTS,
    SPOT_BY_ID: SPOT_BY_ID,
    CATS: CATS,
    ROUTES: ROUTES,
    ROUTE_BY_KEY: ROUTE_BY_KEY,
    BADGES: BADGES,
    ACTIVITIES: ACTIVITIES,
    PARK: PARK,
    checkins: blankCheckins(), // { family: { s17: 时间戳 }, love: {...}, friend: {...} }
    routeKey: 'family',        // 当前线路
    bookings: {},              // 已预约的活动 { 活动标题: 时间戳 }
    feedback: [],              // 建议信箱留言
    profile: null,
    ready: false
  },

  onLaunch() {
    this.restore();
    loadFonts();
  },

  // ---------------------------------------------------------------- 存取
  restore() {
    let s = {};
    let legacy = {};
    try {
      s = wx.getStorageSync(KEY) || {};
      legacy = wx.getStorageSync(KEY_V1) || {};
    } catch (e) {
      s = {};
      legacy = {};
    }
    const g = this.globalData;
    g.routeKey = ROUTE_BY_KEY[s.routeKey] ? s.routeKey
      : (ROUTE_BY_KEY[legacy.routeKey] ? legacy.routeKey : ROUTES[0].key);
    g.checkins = this.normalizeCheckins(s.checkins, legacy.checkins, g.routeKey);
    g.bookings = (s.bookings && typeof s.bookings === 'object') ? s.bookings
      : ((legacy.bookings && typeof legacy.bookings === 'object') ? legacy.bookings : {});
    g.feedback = Array.isArray(s.feedback) ? s.feedback : (Array.isArray(legacy.feedback) ? legacy.feedback : []);
    g.profile = (s.profile && s.profile.id) ? s.profile
      : ((legacy.profile && legacy.profile.id) ? legacy.profile : this.mintProfile());
    g.ready = true;
    this.persist();
  },

  /**
   * 把存档整理成 { 线路: { 点位: 时间戳 } }。
   * - 已经是新结构：逐条补齐缺失的线路表
   * - 或拿到 v1 的老结构（{ s01: 时间戳 }）：整批迁到「当前线路」上，
   *   因为老数据不区分线路，无法判断当初是哪条线。
   */
  normalizeCheckins(cur, old, routeKey) {
    const out = blankCheckins();
    const isSpotKey = k => !!SPOT_BY_ID[k];
    if (cur && typeof cur === 'object') {
      Object.keys(cur).forEach(k => {
        const v = cur[k];
        if (ROUTE_BY_KEY[k]) {
          out[k] = (v && typeof v === 'object') ? v : {};
        } else if (isSpotKey(k)) {
          // 老结构混进了新 key
          out[routeKey][k] = v;
        }
      });
      return out;
    }
    if (old && typeof old === 'object') {
      Object.keys(old).forEach(k => {
        if (isSpotKey(k)) out[routeKey][k] = old[k];
      });
    }
    return out;
  },

  persist() {
    const g = this.globalData;
    try {
      wx.setStorageSync(KEY, {
        checkins: g.checkins,
        routeKey: g.routeKey,
        bookings: g.bookings,
        feedback: g.feedback,
        profile: g.profile
      });
    } catch (e) {
      // 存储写满时静默失败，不阻塞交互
    }
  },

  // ---------------------------------------------------------------- 活动预约 / 建议
  isBooked(title) {
    return !!this.globalData.bookings[title];
  },

  bookingCount() {
    return Object.keys(this.globalData.bookings).length;
  },

  /** 预约 / 取消预约。返回 true 表示现在是已预约状态 */
  toggleBooking(title) {
    const b = this.globalData.bookings;
    if (b[title]) delete b[title];
    else b[title] = Date.now();
    this.persist();
    return !!b[title];
  },

  addFeedback(text) {
    const t = (text || '').trim();
    if (!t) return false;
    this.globalData.feedback.unshift({ text: t, at: Date.now() });
    if (this.globalData.feedback.length > 50) this.globalData.feedback.length = 50;
    this.persist();
    return true;
  },

  feedbackCount() {
    return this.globalData.feedback.length;
  },

  mintProfile() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return {
      nick: '蝴蝶谷游客',
      id: 'BFG-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) +
        '-' + String(Math.floor(Math.random() * 900) + 100)
    };
  },

  /** 改昵称（「我的」资料卡右上角那支铅笔）。空串不接受，最多 12 个字。 */
  setNick(nick) {
    const t = (nick || '').trim();
    if (!t) return false;
    this.globalData.profile.nick = t.slice(0, 12);
    this.persist();
    return true;
  },

  // ---------------------------------------------------------------- 线路 / 点位查询
  getRoute(key) {
    return ROUTE_BY_KEY[key || this.globalData.routeKey] ||
      ROUTE_BY_KEY[this.globalData.routeKey] ||
      ROUTES[0];
  },

  routeByNo(no) {
    for (let i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i].no === no) return ROUTES[i];
    }
    return null;
  },

  /** 某条线路的打卡表（永远返回对象，不会 undefined） */
  lineCheckins(key) {
    const k = key || this.globalData.routeKey;
    if (!this.globalData.checkins[k]) this.globalData.checkins[k] = {};
    return this.globalData.checkins[k];
  },

  /** 线路 -> 点位对象数组（带线路内序号 step，以及「这条线上」的打卡态） */
  routeSpots(key) {
    const r = this.getRoute(key);
    const app = this;
    const c = this.lineCheckins(r.key);
    return r.spots.map(function (id, i) {
      const s = app.globalData.SPOT_BY_ID[id];
      return Object.assign({}, s, { step: i + 1, done: !!c[id] });
    });
  },

  /** 这个点位在某条线路上是否已盖章 */
  isCheckedIn(id, key) {
    return !!this.lineCheckins(key)[id];
  },

  checkinAt(id, key) {
    return this.lineCheckins(key)[id] || 0;
  },

  /** 这个点位在不在某条线路的动线上 */
  onLine(id, key) {
    return this.getRoute(key).spots.indexOf(id) >= 0;
  },

  /** 这个点位在「当前线路」上的第几站；不在线路上返回 0 */
  stepOnLine(id, key) {
    return this.getRoute(key).spots.indexOf(id) + 1;
  },

  /** 所有线路合起来，一共走过多少个不同点位（去重，用于概览统计） */
  totalChecked() {
    const seen = {};
    ROUTES.forEach(r => {
      const c = this.lineCheckins(r.key);
      Object.keys(c).forEach(id => { if (c[id] && SPOT_BY_ID[id]) seen[id] = 1; });
    });
    return Object.keys(seen).length;
  },

  /** 某条线路已盖章的点位数（只数该线路动线上的点） */
  routeChecked(key) {
    const app = this;
    const r = this.getRoute(key);
    const c = this.lineCheckins(r.key);
    return r.spots.filter(function (id) { return !!c[id]; }).length;
  },

  routeCheckedByNo(no) {
    const r = this.routeByNo(no);
    return r ? this.routeChecked(r.key) : 0;
  },

  /** 线路是否已经整条走完 */
  routeDone(key) {
    const r = this.getRoute(key);
    return r.spots.length > 0 && this.routeChecked(r.key) >= r.spots.length;
  },

  doneRouteCount() {
    const app = this;
    return ROUTES.filter(function (r) { return app.routeDone(r.key); }).length;
  },

  /** 线路里第一个还没打卡的点位（＝推荐下一站） */
  nextSpot(key) {
    const arr = this.routeSpots(key);
    for (let i = 0; i < arr.length; i++) if (!arr[i].done) return arr[i];
    return null;
  },

  /**
   * 徽章发放规则（2026-09 修订）：
   *   一条线路**全部走完**才发这一条线的成就章；打卡单个点位不发章。
   *   隐藏章「破茧」＝三条线路全部走完。
   */
  earnedBadges() {
    const app = this;
    return BADGES.map(function (b) {
      let got;
      if (b.line) got = app.routeCheckedByNo(b.line) >= b.need;
      else if (b.kind === 'alllines') got = app.doneRouteCount() >= ROUTES.length;
      else got = false;
      return Object.assign({}, b, { got: got });
    });
  },

  badgeCount() {
    return this.earnedBadges().filter(function (b) { return b.got; }).length;
  },

  /** 某个点位属于哪几条线路 */
  routesOfSpot(id) {
    return ROUTES.filter(function (r) { return r.spots.indexOf(id) >= 0; });
  },

  // ---------------------------------------------------------------- 变更
  setRoute(key) {
    if (!ROUTE_BY_KEY[key]) return;
    this.globalData.routeKey = key;
    this.persist();
  },

  /**
   * 随机挑一条线路（「让园区帮你选一条今天的路」）。
   * 三项等概率**真随机**：不避开当前线路，也不做「抽过的排掉」。
   * （早先的写法是「撞上当前线路就换成另一条」，结果默认线永远抽不到自己 ——
   *   停在放电线时点多少次都只会出双飞/同频，比真随机更像假的。）
   * exclude 只有「换一条试试」这种「我要一条不一样的」按钮才传。
   */
  randomRoute(exclude) {
    const n = ROUTES.length;
    if (!n) return null;
    const pool = exclude
      ? ROUTES.filter(function (r) { return r.key !== exclude; })
      : ROUTES;
    const src = pool.length ? pool : ROUTES;
    return src[Math.floor(Math.random() * src.length)];
  },

  /**
   * 打卡 / 取消打卡（作用于 key 这条线路，默认当前线路）。
   * 返回 { checked, gained, lost, badgeCount, lineDone, lineName, step, total }
   */
  toggleCheckin(id, key) {
    const r = this.getRoute(key);
    const k = r.key;
    const fail = {
      checked: false, gained: [], lost: [], badgeCount: this.badgeCount(),
      lineDone: false, lineName: r.name, step: 0, total: r.spots.length
    };
    if (!SPOT_BY_ID[id] || !ROUTE_BY_KEY[k]) return fail;

    const beforeKeys = this.earnedBadges()
      .filter(function (b) { return b.got; })
      .map(function (b) { return b.key; });

    const c = this.lineCheckins(k);
    const had = !!c[id];
    if (had) delete c[id];
    else c[id] = Date.now();
    this.persist();

    const after = this.earnedBadges();
    const gained = after.filter(function (b) {
      return b.got && beforeKeys.indexOf(b.key) < 0;
    });
    const lost = after.filter(function (b) {
      return !b.got && beforeKeys.indexOf(b.key) >= 0;
    });
    return {
      checked: !!c[id],
      gained: gained,
      lost: lost,
      badgeCount: this.badgeCount(),
      // 「刚盖完这一枚，这条线就整条走完了」——用于放大展示线路成就章
      lineDone: !had && !!c[id] && this.routeDone(k),
      lineName: r.name,
      step: r.spots.indexOf(id) + 1,
      total: r.spots.length
    };
  },

  resetProgress() {
    this.globalData.checkins = blankCheckins();
    this.persist();
  }
});
