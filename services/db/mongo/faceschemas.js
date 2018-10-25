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
            desc: String,                                                   // 描述信息
            updatetime: {type: Date, index: true}                           // 更新时间
        });
        this.Catalog = conn.model('Catalog', this.catalogSchema);

        // 任务图像
        this.catalogImageSchema = new mongoose.Schema({
            cid: {type: String, index: true},                               // 人像目录ID
            name: String,                                                   // 人像图片名称
            source: Buffer,                                                 // 原始图像
            feature: Buffer,                                                // 人脸特征
            desc: String,                                                   // 描述信息
            updatetime: {type: Date, index: true}                           // 更新时间
        });
        this.CatalogImage = conn.model('CatalogImage', this.catalogImageSchema);


        // 视频库
        this.videoSchema = new mongoose.Schema({
            id: {type: String, index: {unique: true, dropDups: true}},      // video id
            group: {type: String},                                          // 将来视频是分布式存储的，这个Group代表在哪
            name: {type: String},                                           // 视频名称
            desc: String,                                                   // 描述信息
            updatetime: {type: Date, index: true}                           // 更新时间
        });
        this.Video = conn.model('Video', this.videoSchema);

        // 视频帧
        this.videoSourceFrameSchema = new mongoose.Schema({
            vid: {type: String, index: true},                               // video id
            time: {type: Number},                                           // 这一帧所在的时间：秒
            source: Buffer,                                                 // 原始图像
            feature: Buffer                                                 // 人脸特征
        });
        this.VideoSourceFrame = conn.model('VideoSourceFrame', this.videoSourceFrameSchema);

        // 关键帧
        this.videoKeyFrameSchema = new mongoose.Schema({
            vid: {type: String, index: true},                               // video id
            time: {type: Number},                                           // 这一帧所在的时间：秒
            source: Buffer,                                                 // 原始图像
            feature: Buffer                                                 // 人脸特征
        });
        this.VideoKeyFrame = conn.model('VideoKeyFrame', this.videoKeyFrameSchema);
    }
};

