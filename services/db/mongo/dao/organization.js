/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');
const tools = require('../../../utils/tools');
const DialingLogic = require('./dialing');
module.exports = class OrganizationLogic {

    /*
    * 初始化基础数据
    * */
    async init(){
        let root = await this.single('root');
        if(!root){
            console.log("root org: undefine");

            let Doc = getMongoPool().Organization;
            let item = new Doc({
                orgid:'root',
                code:'root',
                type:0,
                name:'root',
                parentid:'0',
                host:tools.getIps(),
                updatetime:moment()
            });

            item.save((err, item)=>{
                if(err){
                    console.log("add root org err :", err);
                }else{
                    console.log("add root org success:", item);
                }
            });
        }else{
            console.log("root org:", root);
        }
    }
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Organization;
                let item = new Doc(data);
                item.updatetime = new moment();

                item.save(async(err, item) => {
                    if (!err) {
                        let dlogic = new DialingLogic();
                        // hamaster 心跳
                        dlogic.create({
                            "orgid": data.orgid,
                            "type": "hamaster",
                            "port": 4999,
                            "path": "/nsop/hamaster/api/heartbeat"
                        });
                        // basedata 心跳
                        dlogic.create({
                            "orgid": data.orgid,
                            "type": "basedata",
                            "port": 4997,
                            "path": "/nsop/basedata/api/heartbeat"
                        });
                        // datasync 心跳
                        dlogic.create({
                            "orgid": data.orgid,
                            "type": "datasync",
                            "port": 4998,
                            "path": "/nsop/datasync/api/heartbeat"
                        });
                        // vehicle 心跳
                        dlogic.create({
                            "orgid": data.orgid,
                            "type": "vehicle",
                            "port": 4000,
                            "path": "/vehicle/api/heartbeat"
                        });

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
    single(id) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.findOne({orgid: id}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    /**
     * 获取全部数据
     * @return {array}  收费站信息
     */
    list() {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.find({}, function (err, Item) {
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
     * @return {array}  收费站信息
     */
    singleByIp(host) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.findOne({host: host}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    removeByCode(code) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.remove({code: code}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    removeByIds(ids) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.deleteMany({_id: {$in: ids}}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};