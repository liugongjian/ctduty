module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',

  // 以下是不同 api 接口配置
  // 主平台
  'LOGIN_URL': '"http://127.0.0.1:9528/login"', 
  'LOGOUT_URL': '"http://127.0.0.1:9528/login/logout"', 
  'BUSINESS_URL': '"http://127.0.0.1:9528"',
  'BUSAPI_ROOT': '"/nvsapi"',
  'LOT_ROOT': '"/lottery-proxy"',
  'UPLOAD_FILE_ROOT': '"/upload-file-proxy"'
}
