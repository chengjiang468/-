const sys = require('../../utils/system');

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },

  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    // 'center'（默认，带返回键的二级页）| 'left'（tab 页，标题贴左、不放返回键）
    align: { type: String, value: 'center' },
    // 第 13 轮：原来是不透明白（#FBF8F1），会盖住背景图顶边；
    // 改成半透明白，.nav 上加 backdrop-filter 一起构成磨砂顶栏
    bg: { type: String, value: 'rgba(255, 255, 255, 0.62)' },
    bordered: { type: Boolean, value: false }
  },

  data: {
    top: sys.navTopRpx,
    barH: sys.navBarRpx,
    total: sys.navTotalRpx
  },

  methods: {
    onBack() {
      if (this.data.align === 'left') return;
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({ delta: 1 });
      } else {
        wx.switchTab({ url: '/pages/home/home' });
      }
    }
  }
});
