module.exports = {
  appId: 'dingoahed9fulq5pu3nxew',
  appSecret: 'lnYP9imRtj6YXHFl1OWuld0K5vCymgSHkc1fRgRAlVVjnU3ZKUv875zYiCNHOf39',
  redirectTo: 'http://local.xujsp.com:3000/api/users/login/ding',
  codeToUserUrl: 'https://oapi.dingtalk.com/sns/getuserinfo_bycode?accessKey=%s&timestamp=%s&signature=%s',
  autoPage:
    'https://oapi.dingtalk.com/connect/qrconnect?appid=%s&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=%s',
};
