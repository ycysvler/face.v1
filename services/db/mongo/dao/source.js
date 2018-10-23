/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class SourceLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let Doc = getMongoPool().Source;
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

    list(){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;
            doc.find().sort({type:1, version:1}).exec(function (err, Item) {
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
    single(id) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;
            doc.findOne({_id: id}, function (err, Item) {
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
            let doc = getMongoPool().Source;
            doc.deleteMany({_id:{$in:ids}}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
 
    updateservices(id, services){ 
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;
            doc.findOneAndUpdate(
                {_id: id},
                {services: services, updatetime: new moment()},
                function (err, Item) {
                    if (err) {
                        reject(err);
                    } else {
                        Item.services = services;
                        resolve(Item);
                    }
                });
        });
    }

    updatesourceinfo(id, info){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;

            info.updatetime = new moment();
            doc.findOneAndUpdate(
                {_id: id},
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
 

    updatesourcepath(id, sourcepath) {

        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;
            doc.findOneAndUpdate(
                {_id: id},
                {sourcepath: sourcepath, updatetime: new moment()},
                function (err, Item) {
                    if (err) {
                        reject(err);
                    } else {
                        Item.sourcepath = sourcepath;
                        resolve(Item);
                    }
                });
        });
    }
};
