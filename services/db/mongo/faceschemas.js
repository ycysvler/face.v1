const config = require('../../config/config');
const mongoose = require('mongoose');

module.exports = class Schemas {
    constructor() {
        let uri = config.mongodb.uri + 'facedb';
        let conn = mongoose.createConnection(uri, config.mongodb.options);

        conn.then(function (db) {
            console.log("facedb mongodb connected!");
        });

        // 人像库
        this.catalogSchema = new mongoose.Schema({
            id: {type: String, index: {unique: true, dropDups: true}},      // 人像库ID
            parentid: {type: String},                                       // 上级ID
            name: String,                                                   // 目录名称
            desc:String,                                                    // 描述信息
            images:Array,                                                   // 人像图片信息集合
            updatetime: {type: Date, index: true}                           // 更新时间
        });
        this.Catalog = conn.model('Catalog', this.catalogSchema);


        // 视频库
        this.videoSchema = new mongoose.Schema({
            group: {type: String},                                          // 将来视频是分布式存储的，这个Group代表在哪
            name: {type: String},                                           // 视频名称
            sourceframe: Array,                                             // 原始人脸帧信息
            keyframe: Array,                                                // 对比结果关键帧信息
            updatetime: {type: Date, index: true}                           // 更新时间
        });
        this.Video = conn.model('Video', this.videoSchema);
    }
};

