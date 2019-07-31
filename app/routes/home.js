const Router = require('koa-router');
const userCtl = require('../controllers/users');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'hello alterman';
});

// 账号密码登录
router.post('/login', userCtl.loginDefault);
// 钉钉扫码登录
router.get('/login/ding', userCtl.loginDing);

module.exports = router;
