# 蝴蝶谷园区导览小程序

江门百合镇蝴蝶谷景区导览微信小程序。围绕**亲情线 / 爱情线 / 友情线**三条主题游览路线，
提供手绘导览地图、点位打卡、路线进度与成就收集等功能。

## 技术形态

- 微信小程序原生开发（无框架），`miniprogramRoot` 为项目根目录
- **无后端**：所有状态通过 `wx.setStorageSync('bfg_state_v2')` 本地持久化
- 自定义 `tabBar`（`custom-tab-bar/`）与自定义导航栏（`components/nav-bar/`）
- 基础库 `libVersion: 3.0.0`，开启 `lazyCodeLoading: requiredComponents`

## 目录结构

```
butterfly-valley/
├── app.js / app.json / app.wxss    # 全局逻辑、路由与 tabBar 配置、全局样式
├── custom-tab-bar/                 # 自定义底部导航栏
├── components/
│   ├── nav-bar/                    # 自定义顶部导航栏
│   └── page-bg/                    # 页面背景容器
├── pages/
│   ├── welcome/                    # 开屏页
│   ├── home/                       # 首页
│   ├── map/                        # 导览地图（三线切换、点位打卡）
│   ├── journey/                    # 旅程 / 路线进度
│   ├── profile/                    # 我的
│   ├── activities/                 # 活动列表
│   ├── activity/                   # 活动详情
│   ├── bookings/                   # 预约记录
│   └── spot/                       # 点位详情
├── data/                           # 静态数据（点位、路线、活动、园区信息）
├── utils/                          # 字体、系统适配等工具函数
└── assets/                         # 图片资源
    ├── _retired/                   # 历史版本废弃素材（未参与打包）
    ├── img/  map/  route/  spots/  tab/  badge/
```

## 本地运行

1. 用微信开发者工具「导入项目」，目录选择本仓库根目录
2. AppID：`wx7e047a204a93fac8`
3. 直接编译即可，无需安装任何依赖

## 说明

- `assets/_retired/` 为历史迭代中替换下来的旧素材，已在 `project.config.json`
  的 `packOptions.ignore` 中排除，不参与小程序打包。
