/**
 * 全局配置文件
 *
 * Created by zhanghongqing on 2018/6/29.
 */

module.exports = {
    // mongodb 相关配置
    mongodb: {
        uri: 'mongodb://nsop.mongodb/',
        options: {
            server: {socketOptions: {keepAlive: 1}},
            replset: {socketOptions: {keepAlive: 1}}
        }
    },

    // mysql 相关配置
    mysql: {
        host: '10.10.220.104',
        port: 9306,
        user: 'admin',
        password: 'admin',
        database: 'mysql'
    },

    // redis 相关配置
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password:'123456'
    },

    // server 相关配置
    server:{
        model:{
            port: 4001                          // 服务启动端口号
        },
        web:{
            port: 4002                          // 服务启动端口号
        }
    },

    // 父级中心节点地址
    parent:{
        host:'10.211.55.7'
    },

    // 当前节点
    current:{

    }
};