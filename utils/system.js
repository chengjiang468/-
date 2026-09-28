// 设备尺寸与安全区。页面靠这些数值给自定义导航栏 / 浮动标签栏留位。
// 全部换算成 rpx，方便在 WXSS 里直接用。
let info = {};
try {
  info = (typeof wx.getWindowInfo === 'function') ? wx.getWindowInfo() : wx.getSystemInfoSync();
} catch (e) {
  info = {};
}

const W = info.windowWidth || 375;
const rpx = function (px) { return px * 750 / W; };

const statusBarHeight = info.statusBarHeight || 20;
const safeArea = info.safeArea || null;
const screenH = info.screenHeight || 0;
const safeBottom = safeArea && screenH ? Math.max(0, screenH - safeArea.bottom) : 0;

module.exports = {
  windowWidth: W,
  windowHeight: info.windowHeight || 667,
  statusBarHeight: statusBarHeight,
  safeBottom: safeBottom,
  rpx: rpx,
  rpx2: function (px) { return Math.round(rpx(px)); },
  // 自定义导航栏
  navBarHeight: 44,
  navTopRpx: Math.round(rpx(statusBarHeight)),
  navBarRpx: Math.round(rpx(44)),
  navTotalRpx: Math.round(rpx(statusBarHeight + 44)),
  // 浮动胶囊标签栏：高 124rpx，距底 24rpx + 安全区
  tabPillRpx: 124,
  tabBottomRpx: Math.round(rpx(12)) + Math.round(rpx(safeBottom)),
  tabSpaceRpx: 124 + 24 + Math.round(rpx(safeBottom)) + 24
};
