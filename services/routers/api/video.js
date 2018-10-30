/**
 * Created by VLER on 2018/10/25.
 */
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const moment = require('moment');

const tools = require('../../utils/tools');
const uploadFile = require('../../utils/upload');
const VideoLogic = require('../../db/mongo/dao/video');
const VideoKeyFrameLogic = require('../../db/mongo/dao/videokeyframe');
const VideoSourceFrameLogic = require('../../db/mongo/dao/videosourceframe');

const videoLogic = new VideoLogic();
const videoKeyFrameLogic = new VideoKeyFrameLogic();
const videoSourceFrameLogic = new VideoSourceFrameLogic();

module.exports = function (router) {
    router.get('/video', async (ctx) => {
        let items = await videoLogic.list();
        ctx.body = {code: 200, data: items};
    });

    router.post('/video', async (ctx) => {
        let ok = tools.required(ctx, ["group", "fps",  "desc"]);
        if (ok) {
            let id = uuid.v1();
            let desc = ctx.request.query['desc'];
            let group = ctx.request.query['group'];
            let fps = ctx.request.query['fps'];

            let serverFilePath = path.join(__dirname, '../../public');

            // 上传文件事件
            let f = await uploadFile(ctx, {
                fileType: 'videos',          // 上传之后的目录
                path: serverFilePath
            });
            // 文件名
            let filename = path.basename(f.path);
            // 消息体
            let body = {"id": id, "fps": fps, "group": group, "name": filename, "desc": desc};
            // 添加数据
            let item = await videoLogic.create(body);

            ctx.body = {code: 200, data: item};
        }
    });

    router.delete('/video', async (ctx) => {
        let items = await videoLogic.removeByIds(ctx.request.body);
        ctx.body = {code: 200, data: items};
    });

    router.get('/video/source/frame/:vid', async (ctx) => {
        let ok = tools.required(ctx, ['vid']);
        console.log(ctx.params.name);
        if (ok) {
            let vid = ctx.params.vid;
            let items = await videoSourceFrameLogic.list(vid);
            ctx.body = {code: 200, data: items};
        }
    });

    router.get('/video/key/frame/:vid', async (ctx) => {
        let ok = tools.required(ctx, ['vid']);
        console.log(ctx.params.name);
        if (ok) {
            let vid = ctx.params.vid;
            let items = await videoKeyFrameLogic.list(vid);
            ctx.body = {code: 200, data: items};
        }
    });

    router.post('/video/abc', async (ctx) => {
        let ok = true;

        if (ok) {
            let serverFilePath = path.join(__dirname, '../../public');

            // 上传文件事件
            let f = await uploadFile(ctx, {
                fileType: 'images',          // 上传之后的目录
                path: serverFilePath
            });
            // 文件名
            let filename = path.basename(f.path);
            // 文件内容
            let chunk = fs.readFileSync(f.path);
            // 消息体
            let body = {
                "source": chunk,
                "faces":""
            };

            console.log('body', f.formData.faces);
            console.log('first', f.formData.faces[0]);
            console.log('formData', JSON.parse( f.formData.faces));

            // 删掉上传的临时文件
            fs.unlink(f.path, () => {
            });

            ctx.body = {code: 200, data: filename};
        }
    });

    router.post('/video/source/frame', async (ctx) => {
        let ok = tools.required(ctx, ["vid","frameno", "time"]);

        if (ok) {
            let vid = ctx.request.query['vid'];
            let frameno = ctx.request.query['frameno'];
            let time = ctx.request.query['time'];

            let serverFilePath = path.join(__dirname, '../../public');

            // 上传文件事件
            let f = await uploadFile(ctx, {
                fileType: 'images',          // 上传之后的目录
                path: serverFilePath
            });
            // 文件名
            let filename = path.basename(f.path);
            // 文件内容
            let chunk = fs.readFileSync(f.path);
            // 消息体
            let body = {"vid": vid, "time": time, "frameno":frameno, "source": chunk, "faces":[]};

            console.log('body', body);
            // 添加数据
            let item = await videoSourceFrameLogic.create(body);

            // 删掉上传的临时文件
            fs.unlink(f.path, () => {
            });

            ctx.body = {code: 200, data: filename};
        }
    });

    router.post('/video/key/frame', async (ctx) => {
        let ok = tools.required(ctx, ["vid", "time"]);
        if (ok) {
            let item = await catalogLogic.create(ctx.request.body);
            ctx.body = {code: 200, data: item};
        }

        if (ok) {
            let vid = ctx.request.query['vid'];
            let time = ctx.request.query['time'];

            let serverFilePath = path.join(__dirname, '../../public');

            // 上传文件事件
            let f = await uploadFile(ctx, {
                fileType: 'images',          // 上传之后的目录
                path: serverFilePath
            });
            // 文件名
            let filename = path.basename(f.path);
            // 文件内容
            let chunk = fs.readFileSync(f.path);
            // 消息体
            let body = {"vid": vid, "time": time, "source": chunk};
            // 添加数据
            let item = await videoKeyFrameLogic.create(body);

            // 删掉上传的临时文件
            fs.unlink(f.path, () => {
            });

            ctx.body = {code: 200, data: filename};
        }
    });

    router.get('/video/source/frame/image/:id', async (ctx) => {
        let ok = tools.required(ctx, ['id']);
        console.log('ctx.params.id', ctx.params.id);
        if (ok) {
            let id = ctx.params.id;
            let item = await videoSourceFrameLogic.single(id);
            ctx.body = item.source;
        }
    });

    router.get('/video/key/frame/image/:id', async (ctx) => {
        let ok = tools.required(ctx, ['id']);
        console.log('ctx.params.id', ctx.params.id);
        if (ok) {
            let id = ctx.params.id;
            let item = await videoKeyFrameLogic.single(id);
            ctx.body = item.source;
        }
    });
};