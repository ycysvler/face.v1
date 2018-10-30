/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import Progress from './progress';
import {Layout, Modal, Upload, Table, Breadcrumb, Button, Row, Col, Card, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';
const {Header, Content} = Layout;

export default class JobList extends React.Component {
    constructor(props) {
        super(props);
        console.log('id -> ', props.match.params.id);
        this.unsubscribe = VideoStore.listen(this.onStatusChange.bind(this));
        let clientWidth = document.body.clientWidth;
        let videoWidth = clientWidth / 2 - 32;
        let videoHeight = videoWidth / 1.84866;
        this.state = {
            id: props.match.params.id,
            name: props.match.params.name,
            items: [],
            videoWidth: videoWidth,
            videoHeight: videoHeight,
            deleteBtnEnable: false,
            newItem: {},
            fileList: []
        };

        console.log('document.body.clientWidth', document.body.clientWidth);
    }

    componentDidMount() {
        VideoActions.list(this.state.cid);
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
    };

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    };

    deleteClick = () => {
        console.log('selectedRowKeys', this.state.selectedRowKeys);
        VideoActions.delete(this.state.selectedRowKeys);
    };

    columns = [
        {
            title: '编号',
            dataIndex: '_id',
            width: 240
        },
        {
            title: '名称',
            dataIndex: 'name',
        },

        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '更新时间',
            dataIndex: 'updatetime',
        }];

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.state.selectedRowKeys = selectedRowKeys;
            if (selectedRowKeys.length > 0) {
                this.setState({deleteBtnEnable: true, selectedRowKeys: selectedRowKeys});
            } else {
                this.setState({deleteBtnEnable: false, selectedRowKeys: selectedRowKeys});
            }
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
        getCheckboxProps: record => ({
            disabled: record.key === '3',
        }),
    };

    onPageChange = (pageNumber) => {
        VideoActions.getList(pageNumber, 10);
    };

    // 显示添加组的弹窗
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    // 确定添加组的弹窗
    handleOk = (e) => {
        let item = this.state.newItem;
        item.parentid = "0";
        VideoActions.add(item);
        this.setState({visible: false, newItem: {}});
    };
    // 取消添加组的弹窗
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleChange = (info) => {
        let fileList = info.fileList;
        this.setState({fileList: fileList});
        console.log(fileList);
        if (info.file.status === "done") {
            this.state.visible = false;
            this.state.fileList = [];
            this.state.newItem = {};
            FaceActions.list(this.state.cid);
        }
    };

    onProgress=(time)=>{
        // 视频条转滚动态条
        let Media = this.refs.video;
        Media.currentTime = time;
    }

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
                        <Col span={4}><Button type="primary" onClick={() => {
                            let Media = this.refs.video;
                            Media.pause();
                            Media.currentTime = 5.490753;
                            Media.play();
                        }}>
                            目标识别
                        </Button></Col>
                        <Col span={5}>视频名称：{this.state.name}</Col>
                        <Col span={5}>视频长度：134 s</Col>
                        <Col span={5}>FPS：25 / s</Col>
                        <Col span={5}>目标数量：1234</Col>
                    </Row>
                </div>
                <Content className="overflow">
                    <Layout className="list-content">
                        <Row >
                            <Col span={12}>
                                <Card style={{width: this.state.videoWidth, height: this.state.videoHeight}}>
                                    <video id="video" ref="video" className="video-js vjs-default-skin vjs-fluid"
                                           style={{
                                               width: this.state.videoWidth - 48,
                                               height: this.state.videoHeight - 48
                                           }}
                                           poster="http://vjs.zencdn.net/v/oceans.png"
                                           controls preload="Metadata"
                                           data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
                                        <source src="http://localhost:4001/videos/mov_bbb.mp4" type="video/mp4"/>
                                    </video>
                                </Card>

                            </Col>
                            <Col span={12}>
                                <Card style={{width: this.state.videoWidth, height: this.state.videoHeight}}>
                                    <div style={{
                                        background: '#000 url(http://vjs.zencdn.net/v/oceans.png) no-repeat',
                                        backgroundSize: 'contain', backgroundPosition: 'center',
                                        width: this.state.videoWidth - 48 - 8, height: this.state.videoHeight - 48
                                    }}></div>
                                </Card>
                            </Col>
                        </Row>
                        <Card >
                            <Progress onProgress={this.onProgress} />
                        </Card>

                    </Layout>

                    <Layout className="list-content">
                        <Header className="list-header">
                            <Button type="primary" onClick={this.showModal}>添加视频</Button>
                            <Button type="danger" disabled={!this.state.deleteBtnEnable} onClick={this.deleteClick}
                                    style={{marginLeft: 16}}>删除视频</Button>
                        </Header>
                        <Content >
                            <Table
                                className="bg-white"
                                rowKey="_id"
                                rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.items}
                                pagination={{
                                    showSizeChanger: true,
                                    onChange: this.onPageChange,
                                    pageSizeOptions: ["2", "3", "4", "5"],
                                    defaultPageSize: 10, total: this.state.total,
                                    hideOnSinglePage: true
                                }} size="middle"/>

                            <Modal
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                className="modify"
                                title="添加人像"
                                visible={this.state.visible}
                                footer={null}
                            >
                                <Row >
                                    <Col offset={2} span={4} className="title">描述</Col>
                                    <Col offset={2} span={13}>
                                        <Input
                                            value={this.state.newItem.desc}
                                            onChange={(e) => {
                                                let item = this.state.newItem;
                                                item.desc = e.target.value;
                                                this.setState({newItem: item});
                                            }}/>
                                    </Col>
                                </Row>
                                <Row><Col span={24}>&nbsp;</Col></Row>
                                <Row >
                                    <Col offset={2} span={4} className="title">上传人像</Col>
                                    <Col offset={2} span={13}>
                                        <Upload
                                            action={Config.server + `/face/api/catalog/source?cid=${this.state.cid}&desc=${this.state.newItem.desc}`}
                                            listType="picture-card"
                                            fileList={this.state.fileList}
                                            onChange={this.handleChange}
                                        >
                                            {this.state.fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </Col>
                                </Row>


                            </Modal>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
}