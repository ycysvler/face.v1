/**
 * koa app
 *
 * Created by zhanghongqing on 2018/6/28.
 */

const path = require('path');                               // 基础库
const moment = require('moment');                           // 时间日期库
const cors = require('koa2-cors');                          // 引用跨域库
const Koa = require('koa');                                 // 引用koa框架
const bodyparser = require('koa-bodyparser');               // 加载bodyparser中间件
const koastatic = require('koa-static');                    // 加载静态资源处理
const consuming = require('../middleware/consuming');       // 加载计算耗时中间件
const config = require('../config/config');                 // 加载配置文件
const logger = require('../utils/logger');                  // 引用日志组建
const loader = require('../utils/loader');                  // 路由加载器

const app = new Koa();                                      // 创建koa实例化
const log = logger('hamaster.api');                         // 日志



app.on('error', (err, ctx) => {                             // 全局错误处理
    console.log(err);
});

app.use(cors({credentials: true}));                         // 处理跨域(设置credentials：true,是要支持客户端跨域使用cookie)
app.use(koastatic(path.join(__dirname, '../public')));      // 处理静态资源
app.use(bodyparser());                                      // 使用ctx.body解析中间件
app.use(consuming);                                         // 计算耗时中间件

//const root = loader(path.join(__dirname, './routers/api'), '/nsop/hamaster/api');
//app.use(root.routes()).use(root.allowedMethods());        // 加载路由

app.listen(config.server.web.port);                         // 启动http服务

log.info({                                                  // 记录系统启动日志
    path: '~',
    type: 'start',
    port: config.server.web.port
}, 'hamaster v1.0 app services is starting at port ' + config.server.web.port);


module.exports = app;