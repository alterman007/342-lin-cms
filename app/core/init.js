const path = require('path');
const Router = require('koa-router');
const requireDir = require('require-directory');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const body = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');

const isDev = process.env.NODE_ENV !== 'production';

class InitManager {
  static initApp(app) {
    InitManager.app = app;
    InitManager.configMiddleware();
    InitManager.loadRouters();
  }

  static configMiddleware() {
    const { app } = InitManager;
    // cors
    app.use(cors({ credentials: true }));
    // 错误处理
    app.use(
      error({
        postFormat: (e, { stack, ...rest }) => (isDev ? { stack, ...rest } : rest),
      }),
    );
    // 静态文件服务
    app.use(koaStatic(path.join(process.cwd(), 'app/public')));
    // 解析请求体
    app.use(
      body({
        multipart: true,
        formidable: {
          uploadDir: path.join(process.cwd(), 'app/public/uploads'),
          keepExtensions: true,
        },
      }),
    );
    // 参数校验
    app.use(parameter(app));
  }

  static loadRouters() {
    const appDir = path.join(process.cwd(), 'app/routes');
    const apiRouter = new Router({ prefix: '/api' });
    const { app } = InitManager;
    requireDir(module, appDir, {
      visit(router) {
        if (router instanceof Router) {
          apiRouter.use(router.routes()).use(router.allowedMethods());
        }
      },
    });
    app.use(apiRouter.routes());
  }
}

module.exports = InitManager;
