const fonts = require('./utils/fonts.js');
const store = (k, v) => { try { if (v === undefined) return wx.getStorageSync(k); wx.setStorageSync(k, v); } catch (e) { return undefined; } };
App({
  onLaunch() {
    fonts.load();
    let lang = store('lsm-lang');
    if (lang !== 'zh' && lang !== 'en') {   // 第一次打开：跟微信的语言
      let sys = 'zh'; try { sys = (wx.getAppBaseInfo ? wx.getAppBaseInfo() : wx.getSystemInfoSync()).language || 'zh'; } catch (e) { /* 忽略 */ }
      lang = /^zh/i.test(sys) ? 'zh' : 'en';
    }
    this.globalData.lang = lang;
  },
  globalData: { lang: 'zh' },
  store
});
