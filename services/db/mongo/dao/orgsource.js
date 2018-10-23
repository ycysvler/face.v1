/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class OrgSourceLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let Doc = getMongoPool().OrgSource;
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

    updateTarget(_id, tversion, state) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().OrgSource;
            doc.findOneAndUpdate(
                {_id: _id},
                {tversion: tversion, state: state, updatetime: new moment()},
                function (err, Item) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(Item);
                    }
                });
        });
    }

    update(_id, data) {
        return new Promise((resolve, reject) => {
            data.updatetime = new moment();
            let doc = getMongoPool().OrgSource;
            doc.findOneAndUpdate(
                {_id: _id},
                data,
                function (err, Item) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(Item);
                    }
                });
        });
    }

    /**
     * 获取单条数据
     * @return {array}  程序包信息
     */
    single(orgid, type) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().OrgSource;
            doc.findOne({orgid: orgid, type: type}, function (err, Item) {
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
            let doc = getMongoPool().OrgSource;
            doc.find({}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};