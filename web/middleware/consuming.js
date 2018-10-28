/**
 * 记录一次请求的耗时情况
 *
 * Created by zhanghongqing on 2018/6/28.
 */

const logger = require('../utils/logger');                // 引用日志组建

const consumingLog = logger('time-consuming');            // 日志
//const dataDebugLog = logger('data-debug','debug');        // 日志

module.exports = async function(ctx, next){
    const start = Date.now();                            // 开始时间
    await next();
    const ms = Date.now() - start;                       // 计算耗时

    // 性能日志
    consumingLog.info({'type':'consuming','path':ctx.path,'consuming':ms},'请求耗时：[' + ms + '] 毫秒');
};