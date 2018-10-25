/**
 * Created by VLER on 2018/10/25.
 */
const moment = require('moment');
const CatalogLogic = require('../../db/mongo/dao/catalog');
const tools = require('../../utils/tools');
const catalogLogic = new CatalogLogic();

module.exports = function (router) {
    router.get('/catalog', async (ctx) => {
        ctx.body = {
            code: 200,
            date: moment().format("YYYY-MM-DD hh:mm:ss")
        };
    });

    router.post('/catalog', async (ctx) => {
        let ok = tools.required(ctx, ['name']);
        if (ok) {
            let item = await catalogLogic.create(ctx.body);
            ctx.body = {code: 200, data: item};
        }
    });
};