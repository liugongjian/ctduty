// 公共开发环境
module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prev"',

  // 以下是不同 api 接口配置
  // 主域名
  'LOGIN_URL': '"http://host31.880508.xyz:8667/elogin"', 
  'LOGOUT_URL': '"http://host31.880508.xyz:8667/logout"', 
  'BUSINESS_URL': '"http://0.0.0.0:9528"',
  'BUSAPI_ROOT': '"/nvsapi"',
  'LOT_ROOT': '"/lottery-proxy"',
  'UPLOAD_FILE_ROOT': '"/upload-file-proxy"'
}
