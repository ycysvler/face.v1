import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import Progress from '../job/progress';
import JobList from '../job/list';
import {Layout, Modal, Upload, Table, Breadcrumb, Button, Row, Col, Card, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';
import './index.less';

export default class VideoInfo extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscribe = VideoStore.listen(this.onStatusChange.bind(this));
        let clientWidth = document.body.clientWidth;
        let videoWidth = clientWidth / 3 - 26;
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
        //VideoActions.sourceFrameList(this.state.id);

        let Media = this.refs.video;
        // 加载视频完成，能得到视频时长
        Media.onloadedmetadata = () => {
            let time = parseInt(Media.duration);
            //this.setState({videoDuration: time});
        };
        // 播放进度变化
        Media.ontimeupdate = (e) => {
            console.log('timeupdate', Media.currentTime);
        };
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
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
        return (<div className="video-root">
            <div className="video ">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item><Link to="/main/video">视频库管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/main/video">视频库</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="list-content">
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
                                    <source src={Config.server + "/videos/" + this.state.name} type="video/mp4"/>
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
                                        this.state.sourceFrameInfo.faces.map((item, index) => {
                                            return <img key={index}
                                                        src={item.source}
                                                        style={{
                                                            maxHeight: 100,
                                                            marginRight: 16,
                                                            border: '1px solid #000'
                                                        }}
                                            />
                                        })
                                        : null
                                }
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="job">
                <JobList videoid={this.state.id}/>
            </div>
        </div>);
    }
}