/**
 * Created by VLER on 2018/10/25.
 */
const moment = require('moment');
const CatalogLogic = require('../../db/mongo/dao/catalog');
const tools = require('../../utils/tools');
const catalogLogic = new CatalogLogic();

module.exports = function (router) {
    router.get('/catalog', async (ctx) => {
        let items = await catalogLogic.list();
        ctx.body = { code: 200, data: items };
    });

    router.post('/catalog', async (ctx) => {
        let ok = tools.required(ctx, ["id","name","parentid","desc"]);
        if (ok) {
            let item = await catalogLogic.create(ctx.request.body);
            ctx.body = {code: 200, data: item};
        }
    });

    router.delete('/catalog', async(ctx)=>{
        let items = await catalogLogic.removeByIds(ctx.request.body);
        ctx.body = {code: 200, data: items};

    });
};