/**
 * 全局配置文件
 *
 * Created by zhanghongqing on 2018/6/29.
 */

module.exports = {
    // mongodb 相关配置
    // 10.211.55.7
    // 192.168.1.105
    mongodb: {
        uri: 'mongodb://192.168.31.34/',
        options: {
            useNewUrlParser:true,
            auto_reconnect: true,
            poolSize: 10
        }
    },

    // mysql 相关配置
    mysql: {
        host: '10.10.220.105',
        port: 9306,
        user: 'admin',
        password: 'admin',
        database: 'mysql'
    },

    // redis 相关配置
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: '123456'
    },

    // server 相关配置
    server: {

        face: {
            port: 4001                          // 服务启动端口号
        },
        service: {
            uri: 'http://192.168.31.34:4003',   // python service 地址
        }
    }
};