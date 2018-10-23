/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class DialingLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let Doc = getMongoPool().Dialing;
                let item = new Doc(data);
                item.updatetime = new moment();
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
            let doc = getMongoPool().Dialing;
            doc.findOne({'orgid': orgid, 'type':type},  function (err, Item) {
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
            let doc = getMongoPool().Dialing;
            doc.find().sort({orgid:1, port:1}).exec(function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    removeByIds(ids){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Dialing;
            doc.deleteMany({_id:{$in:ids}}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};
