/* 网站配置（可以公开的值）。
   googleMapsEmbedKey：Google Maps Embed API 密钥，填了以后「住户评价」页显示 Google 地图官方嵌入框；不填只给 Google 地图链接。
   这个密钥按设计就放在网页里：请在 Google Cloud 里把它限制为只能用 Maps Embed API、只能在本站域名下使用。 */
window.LSM_CONFIG = Object.assign({ googleMapsEmbedKey: '' }, window.LSM_CONFIG);
