// 由 tools/gen_data.py 生成，请勿手改。
// 线路名只用破折号后面的名字（放电线 / 双飞线 / 同频线）；
// 亲情 / 爱情 / 友情 只是区分主题，不对游客出现。
const ROUTES = [
  {
    no: 1, key: 'family', name: '放电线', alias: '线路一',
    accent: '#D98B3F', accentDeep: '#9C5218', tint: '#F9E4CB', stamp: '#C9922B',
    hours: '约 3 小时', distance: '2.4 km', tag: '三代同游',
    sub: '把娃撒进草坪，把爸妈交给风景',
    intro: '把娃撒进草坪，把爸妈交给风景，你终于能坐下喝一杯咖啡。',
    fun: ['把娃撒进草坪，把爸妈交给风景。', '今天只有一个 KPI：把电量条跑到底。', '谁先喊累，谁请吃窑鸡。'],
    icon: '/assets/route/r-family.png',
    cover: '/assets/route/cover-family.jpg',
    map: '/assets/map/park-family.jpg',
    spots: ['s17', 's16', 's13', 's12', 's11', 's09', 's05', 's10', 's01', 's21', 's15'],
  },
  {
    no: 2, key: 'love', name: '双飞线', alias: '线路二',
    accent: '#D9738A', accentDeep: '#A03B58', tint: '#FADDE5', stamp: '#C9922B',
    hours: '约 3.5 小时', distance: '2.8 km', tag: '两人同行',
    sub: '从并肩走路到十指紧扣',
    intro: '从并肩走路到十指紧扣，中间只隔一条山谷的风。',
    fun: ['从并肩走路，到十指紧扣。', '这条路走完，手大概就牵上了。', '他拍风景，你拍他。'],
    icon: '/assets/route/r-love.png',
    cover: '/assets/route/cover-love.jpg',
    map: '/assets/map/park-love.jpg',
    spots: ['s17', 's16', 's13', 's12', 's11', 's09', 's07', 's04', 's03', 's10', 's08', 's15'],
  },
  {
    no: 3, key: 'friend', name: '同频线', alias: '线路三',
    accent: '#5B86C4', accentDeep: '#37619F', tint: '#DFEAF8', stamp: '#C9922B',
    hours: '约 3 小时', distance: '2.7 km', tag: '朋友结伴',
    sub: '有人接得住你的梗，有人陪你一起疯',
    intro: '有人接得住你的梗，有人陪你一起疯，山谷负责记住这一天。',
    fun: ['有人接得住你的梗，有人陪你一起疯。', '笑点在同一条线上，脚自然也在同一条线上。', '这一路，音量关不掉。'],
    icon: '/assets/route/r-friend.png',
    cover: '/assets/route/cover-friend.jpg',
    map: '/assets/map/park-friend.jpg',
    spots: ['s17', 's16', 's13', 's12', 's11', 's09', 's05', 's06', 's03', 's02', 's10', 's15'],
  },
];

const ROUTE_BY_KEY = ROUTES.reduce((m, r) => (m[r.key] = r, m), {});

module.exports = { ROUTES, ROUTE_BY_KEY };
