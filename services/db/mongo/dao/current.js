/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class CurrentLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Current;
                let item = new Doc(data);
                item.updatetime = new moment();

                item.save(async(err, item) => {
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

    /**
     * 获取单条数据
     * @return {array}  收费站信息
     */
    single() {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Current;
            doc.find({},  function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    if(Item){
                        resolve(Item[0]);
                    }else{
                        resolve(null);
                    }
                }
            });
        });
    }
};