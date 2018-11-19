import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';

import {Layout, Modal, Upload, Table, Breadcrumb, Divider, Row, Col, Collapse, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';

const {Header, Content, Sider} = Layout;
const Panel = Collapse.Panel;

export default class JobList extends React.Component {
    constructor(props) {
        super(props);
        console.log('videoid -> ', props.videoid);
        this.unsubscribe = VideoStore.listen(this.onStatusChange.bind(this));

        this.state = {
            videoid: props.videoid,
            jobs: [],
            keyFrames: {}
        };
    }

    componentDidMount() {
        VideoActions.jobList(this.state.videoid);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === 'jobList') {
            console.log('jobList', data);
            this.setState({jobs: data.list, deleteBtnEnable: false, total: data.total});
        }
        if(type === "sourceKeyList"){
            console.log('sourceKeyList', data.list);
            let keyFrames = this.state.keyFrames;
            keyFrames[data.param.jobId] = data.list;
            this.setState({keyFrames});
        }
    }

    columns = [
        {
            title: '编号',
            dataIndex: '_id',
            width: 240,
            render: (text, info) => {
                return <Link to={`/main/video/info/${info._id }/${info.name }`}>{info._id}</Link>
            },
        },

        {
            title: '名称',
            dataIndex: 'name',
            render: (text, info) => {
                return <Link to={"/main/video/info/" + info._id}>{info.name}</Link>
            },
        }
    ];

    render() {
        return (<div>
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>查询任务</Breadcrumb.Item>
                <Breadcrumb.Item>&nbsp;</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                className="bg-white"
                rowKey="_id"
                rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                pagination={{
                    defaultPageSize: 10, total: this.state.total,
                    hideOnSinglePage: true
                }} size="middle"/>
        </div>)
    }
}