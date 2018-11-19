import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import {Layout, Menu, Modal, Upload, Table, Breadcrumb, Button, Row, Col, Input, Icon} from 'antd';
import FaceSelect from '../face/select';
import {JobStore, JobActions} from './reflux.js';

const {Header, Content, Sider} = Layout;

export default class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = JobStore.listen(this.onStatusChange.bind(this));

        this.state = {
            videoid: props.videoid,
            jobs: [],
            keyFrames: {},
            visible : false,
            newItem:{videoid: props.videoid}
        };
    }

    componentDidMount() {
        //JobActions.list(this.state.videoid);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    deleteClick = () => {
        JobActions.delete(this.state.selectedRowKeys);
    };

    onStatusChange = (type, data) => {
        if (type === 'list') {
            this.setState({jobs: data.list, deleteBtnEnable: false, total: data.total});
        }
        if (type === 'delete') {
            JobActions.list(this.state.videoid);
        }
    };

    // 取消添加组的弹窗
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    // 确定添加组的弹窗
    handleOk = (e) => {
        let item = this.state.newItem;
        JobActions.add(item);
    };

    onFaceSelect = (keys)=>{
        this.setState({'cids':keys});
    };

    columns = [
        {
            title: '状态',
            width:60,
            dataIndex: 'status',
            render: (value, item) => {
                switch(value){
                    case 1:
                        return <span>计算特征</span>
                    case 2:
                        return <span>完成</span>
                    case -1:
                        return <span>特征计算失败</span>
                    default:
                        return <span>新增</span>
                }
            },
        },
        {
            title: '名称',
            dataIndex: 'name',
            render: (text, info) => {
                return <Link to={"/main/video/info/" + info._id}>{info.name}</Link>
            },
        },
        {
            title: '描述',
            dataIndex: 'desc',

        },

    ];

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

    render() {
        return (<div >
            <div style={{borderLeft:'solid 1px #ddd'}}>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>查询任务</Breadcrumb.Item>
                    <Breadcrumb.Item>&nbsp;</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Layout className="list-content">
                <Header className="list-header">
                    <Button type="primary" onClick={()=>{this.setState({visible:true})}}>新建查询</Button>
                    <Button type="danger" disabled={!this.state.deleteBtnEnable} onClick={this.deleteClick}
                            style={{marginLeft: 16}}>删除查询</Button>
                </Header>
                <Content>
                    <Table
                        className="bg-white"
                        rowKey="_id"
                        rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.jobs}
                        pagination={{
                            defaultPageSize: 10, total: this.state.total,
                            hideOnSinglePage: true
                        }} size="middle"/>
                </Content>
            </Layout>
            <Modal
                width={700}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                className="modify"
                title="新建查询"
                visible={this.state.visible}
            >
                <Layout>
                    <Content style={{background:'#fff'}}>
                        <Row >
                            <Col  span={2} >名称</Col>
                            <Col  offset={1} span={21}>
                                <Input
                                    value={this.state.newItem.name}
                                    onChange={(e) => {
                                        let item = this.state.newItem;
                                        item.name = e.target.value;
                                        this.setState({newItem: item});
                                    }}/>
                            </Col>
                        </Row>
                        <Row><Col span={24}>&nbsp;</Col></Row>
                        <Row >
                            <Col span={2}>描述</Col>
                            <Col  offset={1} span={21}>
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
                            <Col span={2} >罪犯</Col>
                            <Col offset={1} span={21}>
                                <FaceSelect  onFaceSelect={(cids)=>{
                                    let item = this.state.newItem;
                                    item.cids = cids;
                                    this.setState({newItem: item});
                                }} />
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Modal>
        </div>)
    }
}