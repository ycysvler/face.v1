/**
 * Created by VLER on 2018/10/25.
 */
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const tools = require('../../utils/tools');
const uploadFile = require('../../utils/upload');
const CatalogLogic = require('../../db/mongo/dao/catalog');
const CatalogImageLogic = require('../../db/mongo/dao/catalogimage');

const catalogLogic = new CatalogLogic();
const catalogImageLogic = new CatalogImageLogic();

module.exports = function (router) {
    // 获取分组列表
    router.get('/catalog', async (ctx) => {
        let items = await catalogLogic.list();
        ctx.body = { code: 200, data: items };
    });
    // 添加分组
    router.post('/catalog', async (ctx) => {
        let ok = tools.required(ctx, ["id","name","parentid","desc"]);
        if (ok) {
            let item = await catalogLogic.create(ctx.request.body);
            ctx.body = {code: 200, data: item};
        }
    });
    // 删除分组
    router.delete('/catalog', async(ctx)=>{
        let items = await catalogLogic.removeByIds(ctx.request.body);
        ctx.body = {code: 200, data: items};
    });
    // 删除图片
    router.delete('/catalog/images', async(ctx)=>{
        let items = await catalogImageLogic.removeByIds(ctx.request.body);
        ctx.body = {code: 200, data: items};
    });
    // 获取分组下的图片列表
    router.get('/catalog/images/:cid', async (ctx) => {
        let ok = tools.required(ctx, ['cid']);
        console.log(ctx.params.cid);
        if (ok) {
            let cid = ctx.params.cid;
            let items = await catalogImageLogic.list(cid);
            ctx.body = { code: 200, data: items };
        }
    });
    // 获取图片内容
    router.get('/catalog/source/:id', async (ctx) => {
        let ok = tools.required(ctx, ['id']);
        if (ok) {
            let id = ctx.params.id;
            let item = await catalogImageLogic.single(id);
            ctx.body = item.source;
        }
    });
    // 上传图片
    router.post('/catalog/source', async (ctx) => {
        let ok = tools.required(ctx, ["cid"]);
        if (ok) {
            let cid = ctx.request.query['cid'];
            let desc = ctx.request.query['desc'];

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
            let body = { "cid":cid, "name":filename, "source":chunk, "desc":desc };
            // 添加数据
            let item = await catalogImageLogic.create(body);

            // 删掉上传的临时文件
            fs.unlink(f.path,()=>{});

            ctx.body = {status:"success", code: 200, data: filename};
        }
    });
};