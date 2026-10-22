/* 小程序连接的服务器（web-original/consult-server）。
   开发：微信开发者工具里勾选「不校验合法域名」，用本机地址；
   上线：换成总部确认的 HTTPS 域名，并在小程序后台「开发管理 → 服务器域名」里登记 request 和 downloadFile 合法域名。 */
module.exports = {
  API_BASE: 'http://localhost:8765',
  /* 手绘字体放在服务器上（scripts/build-fonts.cjs 生成，部署到 web-live/fonts/），不占小程序包体积 */
  FONT_BASE: 'http://localhost:8765/fonts/',
  /* 订阅消息模板 ID（小程序后台「订阅消息」里选一个进度提醒类模板）。留空就不请求订阅，学生照样能在页面里看到群码。
     服务器上要配同一个模板：WX_SUB_TEMPLATE_ID 和字段 WX_SUB_TEMPLATE_DATA，见 consult-server/README.md。 */
  SUB_TEMPLATE_ID: ''
};
