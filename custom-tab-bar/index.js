const sys = require('../utils/system');

Component({
  options: { addGlobalClass: true },

  data: {
    selected: 0,
    bottom: sys.tabBottomRpx,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: '/assets/tab/home.png', on: '/assets/tab/home-on.png' },
      { pagePath: '/pages/map/map', text: '地图', icon: '/assets/tab/map.png', on: '/assets/tab/map-on.png' },
      { pagePath: '/pages/journey/journey', text: '旅程', icon: '/assets/tab/journey.png', on: '/assets/tab/journey-on.png' },
      { pagePath: '/pages/profile/profile', text: '我的', icon: '/assets/tab/profile.png', on: '/assets/tab/profile-on.png' }
    ]
  },

  methods: {
    onTap(e) {
      const i = e.currentTarget.dataset.i;
      if (i === this.data.selected) return;
      wx.switchTab({ url: this.data.list[i].pagePath });
    }
  }
});
