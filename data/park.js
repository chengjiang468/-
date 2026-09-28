// 园区基本信息。
//
// ⚠️ 经纬度请填成蝴蝶谷的真实坐标：填好后「导航到园区」按钮会直接调
//    wx.openLocation 唤起系统地图；留空时按钮退化为「复制地址」，
//    不会给出错误位置。
const PARK = {
  name: '蝴蝶谷',
  fullName: '江门 · 百合镇蝴蝶谷',
  city: '广东省江门市',
  address: '广东省江门市恩平市百合镇蝴蝶谷',
  latitude: null,   // 例：22.123456
  longitude: null,  // 例：112.123456
  openHour: '09:00 - 18:00',
  phone: ''
};

module.exports = { PARK: PARK };
