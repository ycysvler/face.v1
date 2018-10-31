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
    // 获取原始帧列表
    router.get('/video/source/frame/:videoid', async (ctx) => {
        let ok = tools.required(ctx, ['videoid']);
        if (ok) {
            let videoid = ctx.params.videoid;
            let items = await videoSourceFrameLogic.list(videoid);
            ctx.body = {code: 200, data: items};
        }
    });
    // 获取关键帧列表
    router.get('/video/key/frame/:videoid', async (ctx) => {
        let ok = tools.required(ctx, ['videoid']);
        console.log(ctx.params.name);
        if (ok) {
            let videoid = ctx.params.videoid;
            let items = await videoKeyFrameLogic.list(videoid);
            ctx.body = {code: 200, data: items};
        }
    });
    // 获取原始帧数据
    router.get('/video/source/frame/info/:id', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);
        console.log('ctx.params.id', ctx.params.id);
        if (ok) {
            let id = ctx.params.id;
            let item = await videoSourceFrameLogic.single(id);
            if(item === null){
                ctx.body =  {code: 404, data: item};
            }
            else{
                item.source = 'data:image/png;base64,' + item.source.toString('base64');
                for(let f of item.faces){
                    f.source = 'data:image/png;base64,' + f.source.toString('base64');
                }
                ctx.body =  {code: 200, data: item};
            }
        }

    });

    // 【废弃】获取原始帧大图数据
    router.get('/video/source/frame/image/:id', async (ctx) => {
        let ok = tools.required(ctx, ['id']);
        console.log('ctx.params.id', ctx.params.id);
        if (ok) {
            let id = ctx.params.id;
            let item = await videoSourceFrameLogic.single(id);
            ctx.body =  item.source;
        }
    });
    // 【废弃】获取原始帧大图Base64
    router.get('/video/source/frame/base64/:id', async (ctx) => {
        let ok = tools.required(ctx, ['id']);
        console.log('ctx.params.id', ctx.params.id);
        if (ok) {
            let id = ctx.params.id;
            let item = await videoSourceFrameLogic.single(id);
            ctx.body =  'data:image/png;base64,' + item.source.toString('base64');
        }
    });
    // 【废弃】获取关键帧图像数据
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
