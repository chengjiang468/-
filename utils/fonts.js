// 字体加载（可选）。
//
// 界面现在只用两套字：ZCOOL KuaiLe（手账大标题）与 Noto Sans SC（正文/UI）。
// Ma Shan Zheng（手写批注）已下线 —— 系统里大多没有这款字，会回落到宋体/楷体，
// 跟手账风不搭，用到它的文案也一并删掉了。
// 小程序不能内置中文字体文件（体积太大），正解是把字体放到自己的 HTTPS 空间
// （或用可信 CDN），在这里登记后用 wx.loadFontFace 拉取。
//
// 留空时不会发起任何请求：页面会退回到 WXSS 里配置的系统字体栈
// （iOS 有 PingFang SC，Android 走默认黑体），版式不受影响。
//
// 用法：把 face 换成真实可访问的 woff2 地址即可，例如
//   { family: 'ZCOOL KuaiLe', face: 'https://your-cdn.com/fonts/zcool-kuaile.woff2' }
const FONT_FACES = [
  // { family: 'ZCOOL KuaiLe', face: '' },
  // { family: 'Noto Sans SC', face: '' }
];

let done = false;

function loadFonts() {
  if (done) return;
  done = true;
  if (typeof wx.loadFontFace !== 'function') return;
  FONT_FACES.forEach(function (f) {
    if (!f.face) return;
    try {
      wx.loadFontFace({
        family: f.family,
        source: 'url("' + f.face + '")',
        global: true,
        scopes: ['webview', 'native'],
        fail: function () { /* 拉不到就用系统字体，不打断 */ }
      });
    } catch (e) { /* 忽略 */ }
  });
}

module.exports = { loadFonts: loadFonts, FONT_FACES: FONT_FACES };
