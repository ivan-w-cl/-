/* 全局状态：语言、测验答案、上次推荐结果、收藏、对比。全部只存本机（wx Storage）。 */
const KEY = 'lsm-mp-state-v1';
App({
  globalData: { lang: 'zh', homeAnswers: {}, lifeAnswers: [], lifeExtra: {}, lastResult: null, favorites: [], compare: [] },
  onLaunch() {
    try {
      const saved = wx.getStorageSync(KEY);
      if (saved && typeof saved === 'object') Object.assign(this.globalData, saved);
    } catch (e) { /* 存储不可用时照常使用 */ }
  },
  save() {
    try { wx.setStorageSync(KEY, this.globalData); } catch (e) {}
  },
  setLang(lang) {
    this.globalData.lang = lang === 'en' ? 'en' : 'zh'; this.save();
    wx.setNavigationBarTitle({ title: lang === 'en' ? 'Liverpool Student Life Map' : '利物浦学生生活地图' });
  },
  favSet() { return new Set(this.globalData.favorites); },
  toggleFav(id) {
    const f = this.globalData.favorites, i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    this.save(); return i < 0;
  }
});
