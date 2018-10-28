import Reflux from 'reflux';

const AppActions = Reflux.createActions([
        'message'
    ]
);

const AppStore = Reflux.createStore({
    listenables: [AppActions],

    //获取列表
    onMessage: function (type, msg) {
        this.trigger('message', {type, msg});
    }
});


exports.AppActions = AppActions;
exports.AppStore = AppStore;