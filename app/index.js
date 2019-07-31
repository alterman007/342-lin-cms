const Koa = require('koa');
const initApp = require('./core/init');

require('./models/user');
require('./models/flow');
require('./models/classic');
const app = new Koa();

initApp.initApp(app);

app.listen(8080);
