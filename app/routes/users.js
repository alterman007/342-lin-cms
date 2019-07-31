const Router = require('koa-router');
const userCtl = require('../controllers/users');
const Auth = require('../middlewares/auth');

const router = new Router({
  prefix: '/users',
});

router.get('/', Auth.verifyToken, userCtl.findSelf);
router.post('/', userCtl.create);

// 测试权限验证接口
// router.get('/verify', Auth.verifyToken, new Auth().verifyAuth, (ctx) => {
//   ctx.body = ctx.state.user;
// });

module.exports = router;
