// 由 tools/gen_data.py 生成，请勿手改。
// nx / ny 是点位在 3.0 手绘地图内的归一化坐标（0~1）；
// 地图已改为「整张插画不叠标注」，这两个字段目前仅作排序 / 定位参考。
const CATS = {
  '水上游乐': '#3E8E9E',
  '游玩体验': '#C4553C',
  '研学会务': '#8B7FA6',
  '餐饮市集': '#C9922B',
  '生态农园': '#6E9C6B',
  '住宿露营': '#2F6B4C',
  '服务设施': '#7C8A80',
};

const SPOTS = [
  { id: 's01', name: '窑鸡区', cat: '餐饮市集', nx: 0.08455, ny: 0.27513, icon: '/assets/spots/01.jpg', intro: '土窑现烤走地鸡，外皮焦香、肉汁锁在里面，是园区的招牌风味。' },
  { id: 's02', name: '沙地无动力乐园', cat: '游玩体验', nx: 0.19636, ny: 0.26772, icon: '/assets/spots/02.jpg', intro: '攀爬网、滑索、沙坑与平衡木，孩子放完电的好地方。' },
  { id: 's03', name: '皮划艇', cat: '水上游乐', nx: 0.30818, ny: 0.23915, icon: '/assets/spots/03.jpg', intro: '泛舟湖上，贴着水杉与芦苇慢慢划一段，水面比岸上安静。' },
  { id: 's04', name: '水幕电影', cat: '水上游乐', nx: 0.45, ny: 0.21058, icon: '/assets/spots/04.jpg', intro: '入夜后湖面升起水幕，灯光与影像落在一片水雾上。' },
  { id: 's05', name: '活动草坪', cat: '游玩体验', nx: 0.30273, ny: 0.53545, icon: '/assets/spots/05.jpg', intro: '大片缓坡草地，适合野餐、放风筝，也是园区活动的常驻场地。' },
  { id: 's06', name: '碎石广场', cat: '服务设施', nx: 0.30273, ny: 0.43175, icon: '/assets/spots/06.jpg', intro: '石凳石桌铺散的休憩广场，园区的集散与等人点。' },
  { id: 's07', name: '婚礼草坪', cat: '游玩体验', nx: 0.53909, ny: 0.34074, icon: '/assets/spots/07.jpg', intro: '临湖草坪礼堂，白色拱门与一条花径，午后光线最好。' },
  { id: 's08', name: 'KUKU PARK农场', cat: '生态农园', nx: 0.16727, ny: 0.43704, icon: '/assets/spots/08.jpg', intro: '亲子农场，喂小羊、摘时蔬，认识餐桌上的作物。' },
  { id: 's09', name: '餐厅', cat: '餐饮市集', nx: 0.39864, ny: 0.49206, icon: '/assets/spots/09.jpg', intro: '园区主餐厅，以本地食材做家常菜，午市有煲仔饭。' },
  { id: 's10', name: '萌宠乐园', cat: '游玩体验', nx: 0.21318, ny: 0.52698, icon: '/assets/spots/10.jpg', intro: '羊驼、兔子、小香猪与山羊，可以近距离投喂。' },
  { id: 's11', name: '非遗研习室', cat: '研学会务', nx: 0.48455, ny: 0.49524, icon: '/assets/spots/11.jpg', intro: '葵艺、灰塑、竹编等本地非遗手作课堂，需现场预约。' },
  { id: 's12', name: '生态园', cat: '生态农园', nx: 0.47182, ny: 0.57778, icon: '/assets/spots/12.jpg', intro: '温室与露天果园相连，四季都能观察植物变化。' },
  { id: 's13', name: '培育室', cat: '生态农园', nx: 0.47273, ny: 0.66032, icon: '/assets/spots/13.jpg', intro: '种苗培育温室，能看到一颗种子到幼苗的全过程。' },
  { id: 's14', name: '卫生间', cat: '服务设施', nx: 0.21091, ny: 0.64233, icon: '/assets/spots/14.jpg', intro: '园区公共卫生间，含无障碍间与母婴室。' },
  { id: 's15', name: '侨礼·优选农产超市', cat: '餐饮市集', nx: 0.29909, ny: 0.62751, icon: '/assets/spots/15.jpg', intro: '侨乡手信与当季农产品，无花果干和葵艺小物值得带。' },
  { id: 's16', name: '蝴蝶主题雕塑', cat: '游玩体验', nx: 0.49091, ny: 0.77672, icon: '/assets/spots/16.jpg', intro: '园区地标，蝴蝶造型雕塑立于广场中央，傍晚逆光好看。' },
  { id: 's17', name: '生态停车场', cat: '服务设施', nx: 0.47091, ny: 0.91746, icon: '/assets/spots/17.jpg', intro: '园区主入口停车场，含新能源充电位与接驳点。' },
  { id: 's18', name: '无花果生态园', cat: '生态农园', nx: 0.67636, ny: 0.10794, icon: '/assets/spots/18.jpg', intro: '连片无花果园，采摘季对外开放，园内设品尝台。' },
  { id: 's19', name: '碉楼酒店', cat: '住宿露营', nx: 0.73545, ny: 0.75238, icon: '/assets/spots/19.jpg', intro: '由侨乡碉楼改造的乡居酒店，房间保留原有砖墙。' },
  { id: 's20', name: '野奢民宿', cat: '住宿露营', nx: 0.91136, ny: 0.72063, icon: '/assets/spots/20.jpg', intro: '藏在山林里的独栋民宿，落地窗对着整片树冠。' },
  { id: 's21', name: '富氧养殖场', cat: '生态农园', nx: 0.05479, ny: 0.40676, icon: '/assets/spots/21.jpg', intro: '林下散养的家禽与鱼塘相连，清晨能听见一片鸡鸣。' },
];

const SPOT_BY_ID = SPOTS.reduce((m, s) => (m[s.id] = s, m), {});

module.exports = { CATS, SPOTS, SPOT_BY_ID };
