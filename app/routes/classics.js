const Router = require('koa-router');

const router = new Router({ prefix: '/classics' });

router.get('/latest', (ctx) => {
  ctx.body = 'classic';
});

module.exports = router;
