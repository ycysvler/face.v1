/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import Progress from './progress';
import {Layout, Modal, Upload, Table, Breadcrumb, Button, Row, Col, Card, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';
import JobList from './list';
const {Header, Content,Sider} = Layout;

import './progress.less';

export default class JobIndex extends React.Component {
    constructor(props) {
        super(props);
        console.log('id -> ', props.match.params.id);
        this.unsubscribe = VideoStore.listen(this.onStatusChange.bind(this));
        let clientWidth = document.body.clientWidth - 400;
        let videoWidth = clientWidth / 2 - 32;
        let videoHeight = videoWidth / 1.84866;
        this.state = {
            id: props.match.params.id,
            name: props.match.params.name,
            sourceFrameInfo: {},
            items: [],
            frames: [],
            videoDuration: 0,
            videoWidth: videoWidth,
            videoHeight: videoHeight,
            deleteBtnEnable: false,
            newItem: {},
            fileList: []
        };
    }

    componentDidMount() {
        VideoActions.list(this.state.id);
        VideoActions.sourceFrameList(this.state.id);

        let Media = this.refs.video;
        // 加载视频完成，能得到视频时长
        Media.onloadedmetadata = () => {
            let time = parseInt(Media.duration);
            this.setState({videoDuration: time});
        };
        // 播放进度变化
        Media.ontimeupdate = (e) =>{
            console.log('timeupdate', Media.currentTime);
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === 'list') {
            console.log('items', data);
            this.setState({items: data.list, deleteBtnEnable: false, total: data.total});
        }
        if (type === 'delete') {
            VideoActions.list(this.state.cid);
        }

        if (type === 'sourceFrameList') {
            console.log('sourceFrameList', data);
            this.setState({frames: data.list, deleteBtnEnable: false, total: data.total});
        }
        if (type === 'sourceFrameInfo') {
            console.log('sourceFrameInfo', data.data);
            this.setState({sourceFrameInfo: data.data});
        }

    };


    // 鼠标点击原始帧，条转进度条
    onProgress = (frame) => {
        // 视频条转滚动态条
        let Media = this.refs.video;
        Media.currentTime = frame.time;
        // 获取某原始帧的详情
        VideoActions.sourceFrameInfo(frame._id);
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (<Layout>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item><Link to="/main/video">视频库管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/main/video">视频库</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="item-info-title">
                    <Row>
                        <Col span={6}><Button type="primary" onClick={() => {
                            let Media = this.refs.video;
                            Media.pause();
                            Media.currentTime = 5.490753;
                            Media.play();
                        }}>
                            目标识别
                        </Button></Col>

                        <Col span={6}>视频长度：{this.state.videoDuration} s</Col>
                        <Col span={6}>FPS：25 / s</Col>
                        <Col span={6}>目标数量：1234</Col>
                    </Row>
                    <Row>

                    </Row>
                </div>
                <Content className="overflow">
                    <Layout>
                        <Content>
                            <Layout className="list-content">
                                <Row>
                                    <Col span={12}>
                                        <Card>
                                            {/*poster="http://vjs.zencdn.net/v/oceans.png"*/}
                                            <video id="video" ref="video" className="video-js vjs-default-skin vjs-fluid"
                                                   style={{
                                                       width: this.state.videoWidth - 48,
                                                       height: this.state.videoHeight - 48
                                                   }}
                                                   poster=""
                                                   controls preload="Metadata"
                                                   data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
                                                <source src={"http://localhost:4001/videos/" + this.state.name} type="video/mp4"/>
                                            </video>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card>
                                            <div style={{
                                                background: '#000',
                                                textAlign: 'center',
                                                width: this.state.videoWidth - 48, height: this.state.videoHeight - 48
                                            }}>
                                                <img style={{maxHeight: '100%', maxWidth: '100%'}}
                                                     src={this.state.sourceFrameInfo.source}/>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Card>
                                            <Progress duration={this.state.videoDuration} frames={this.state.frames}
                                                      onProgress={this.onProgress}/>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Card>
                                            {
                                                this.state.sourceFrameInfo.faces ?
                                                    this.state.sourceFrameInfo.faces.map((item,index)=>{
                                                        return <img key={index}
                                                                    src={item.source}
                                                                    style={{maxHeight:100, marginRight:16, border:'1px solid #000'}}
                                                        />
                                                    })
                                                    :null
                                            }
                                        </Card>
                                    </Col>
                                </Row>
                            </Layout>
                        </Content>
                        <Sider width="400" className="progress-sider" >
                            <Card>
                                <JobList></JobList>
                            </Card>
                        </Sider>
                    </Layout>

                </Content>
            </Layout>
        );
    }
}