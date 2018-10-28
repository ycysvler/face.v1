import Reflux from 'reflux';
import Config from 'config';
import propx from '../http/proxy';

const FaceActions = Reflux.createActions([
        'list',
        'add',
        'delete'
    ]
);

const FaceStore = Reflux.createStore({
    listenables: [FaceActions],

    //获取列表
    onList: function (cid) {
        let self = this;
        let url = Config.server + "/face/api/catalog/images/" + cid;

        let param = {};

        propx.get(url, param, (code, data) => {
            console.log(url, JSON.stringify(param));

            let total = 0;
            // 没有数据
            if (data.statusCode === 404) {
                self.items = [];
            }
            else {
                self.items = data.data;
            }

            self.trigger('list', {total: self.items.length, list: self.items, param: param});
        });
    },

    onAdd:function(item){
        let self = this;
        let url = Config.server + "/face/api/catalog";

        let param = item;

        propx.post(url, param, (code, data) => {
            console.log(url, JSON.stringify(param));
            self.trigger('add', {data:data, param: param});
        });
    },

    onDelete:function(ids){
        let self = this;
        let url = Config.server + "/face/api/catalog/images";

        let param = ids;

        propx.delete(url, param, (code, data) => {
            console.log(url, JSON.stringify(param));
            self.trigger('delete', {data:data, param: param});
        });
    }

});


exports.FaceActions = FaceActions;
exports.FaceStore = FaceStore;