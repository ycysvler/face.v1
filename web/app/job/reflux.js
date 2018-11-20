import Reflux from 'reflux';
import Config from 'config';
import propx from '../http/proxy';

const JobActions = Reflux.createActions([
        'list',
        'add',
        'delete',
        'sourceFrameList',
        'sourceFrameInfo',
        'sourceKeyList'
    ]
);

const JobStore = Reflux.createStore({
    listenables: [JobActions],
    onList: function (videoId) {
        let self = this;
        let url = Config.server + "/face/api/job/" + videoId;

        let param = {};

        propx.get(url, param, (code, data) => {
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
    onAdd: function (item) {
        let self = this;
        let url = Config.server + "/face/api/job";

        let param = item;

        propx.post(url, param, (code, data) => {
            console.log(url, JSON.stringify(param));
            self.trigger('add', {data: data, param: param});
        });
    },
    onDelete: function (ids) {
        let self = this;
        let url = Config.server + "/face/api/job";

        let param = ids;

        propx.delete(url, param, (code, data) => {
            console.log(url, JSON.stringify(param));
            self.trigger('delete', {data: data, param: param});
        });
    },

    onSourceKeyList: function (jobId) {
        let self = this;
        let url = Config.server + "/face/api/job/key/frame/" + jobId;

        let param = {jobId};

        propx.get(url, param, (code, data) => {
            let total = 0;
            let keyFrames = [];

            data.data.map((item) => {
                item.res.map((res) => {
                    let frame = {frameno: item.frameno, time: item.time, ...res};
                    keyFrames.push(frame);
                });
            });
            console.log('onSourceKeyList', keyFrames);
            self.trigger('sourceKeyList', {total: self.items.length, list: keyFrames, param: param});
        });
    },

    onSourceFrameList: function (videoId) {
        let self = this;
        let url = Config.server + "/face/api/video/source/frame/" + videoId;

        let param = {};

        propx.get(url, param, (code, data) => {
            let total = 0;
            // 没有数据
            if (data.statusCode === 404) {
                self.items = [];
            }
            else {
                self.items = data.data;
            }

            self.trigger('sourceFrameList', {total: self.items.length, list: self.items, param: param});
        });
    },

    onSourceFrameInfo: function (frameId) {
        let self = this;
        let url = Config.server + "/face/api/video/source/frame/info/" + frameId;

        let param = {};

        propx.get(url, param, (code, data) => {
            // 没有数据
            self.trigger('sourceFrameInfo', {data: data.data, param: param});
        });
    }
});


exports.JobActions = JobActions;
exports.JobStore = JobStore;