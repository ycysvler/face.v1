/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class MonitorLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let Doc = getMongoPool().Monitor;
                let item = new Doc(data);
                item.save(async (err, item) => {
                    if (!err) {
                        resolve(item);
                    } else {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    single(orgid, type) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Monitor;
            doc.findOne({'orgid': orgid, 'type':type},  function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    update(orgid, type, info){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Monitor;

            doc.findOneAndUpdate(
                {orgid: orgid, type:type},
                info,
                function (err, Item) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(Item);
                    }
                });
        });
    }

    list(){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Monitor;
            doc.find().sort({orgid:1, type:1}).exec(function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};
