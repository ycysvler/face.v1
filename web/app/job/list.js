/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import Progress from './progress';
import {Layout, Modal, Upload, Table, Breadcrumb, Divider, Row, Col, Collapse, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';

const {Header, Content, Sider} = Layout;
const Panel = Collapse.Panel;
import './progress.less';

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
    };

    callback = (key) => {
        VideoActions.sourceKeyList(key);
    };

    render() {
        return (<div>
            <Collapse accordion className="collapse" onChange={this.callback}>
                {
                    this.state.jobs.map((job, index) => {
                        return <Panel header={job.name} key={job._id}>
                            {
                                this.state.keyFrames[job._id] ?
                                    this.state.keyFrames[job._id].map((item, index) => {
                                        return (<Row key={index}>
                                            <Col span={12} className="center">
                                                <img src={Config.server + "/face/api/video/source/face/" + item.res[0].frameid + "/" + item.res[0].trackid}></img>
                                            </Col>
                                            <Col span={12} className="center">
                                                <img src={Config.server + "/face/api/catalog/source/" + item.res[0].cid}></img>
                                            </Col>
                                        </Row>)
                                    }) : null
                            }
                        </Panel>
                    })
                }
            </Collapse>
        </div>)
    }
}