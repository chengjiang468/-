const sys = require('../../utils/system');
const { ROUTES } = require('../../data/routes');
const { PARK } = require('../../data/park');

Page({
  data: {
    routes: ROUTES,
    park: PARK,
    capTop: sys.navTopRpx + 28,
    nick: ''
  },

  onShow() {
    const app = getApp();
    this.setData({ nick: (app.globalData.profile || {}).nick || '' });
  },

  /** 开启旅程 → 首页。
      注意：不在这里 setRoute —— 回访用户可能已经选了别的线路，
      强制重置会把他们的选择清掉（线路选择本身是持久化的）。 */
  onStart() {
    wx.switchTab({ url: '/pages/home/home' });
  },

  onCopyAddress() {
    wx.setClipboardData({
      data: PARK.address,
      success() {
        wx.showToast({ title: '园区地址已复制', icon: 'none' });
      }
    });
  }
});
