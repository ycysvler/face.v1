/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class VehicleLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Vehicle;
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

    list(platenumber, pageSize, pageIndex){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Vehicle;

            let re = new RegExp(platenumber);
            doc.where({'platenumber':re}).count((err, count)=>{
                doc.where({'platenumber':re}).skip((pageIndex - 1) * pageSize).limit(pageSize).exec(function (err, Items) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            pagination: {total: count},
                            items:Items
                        });
                    }
                });

            });

        });
    }
};