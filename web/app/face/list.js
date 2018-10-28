/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import {Layout, Popover, Modal,Upload, Table, Breadcrumb, Button, Row, Col, Input, Icon} from 'antd';
import {FaceStore, FaceActions} from './reflux.js';
const {Header, Content} = Layout;

export default class FaceList extends React.Component {
    constructor(props) {
        super(props);
        console.log('id -> ', props.match.params.id);
        this.unsubscribe = FaceStore.listen(this.onStatusChange.bind(this));
        this.state = {cid:props.match.params.id,items: [], deleteBtnEnable: false, newItem: {},fileList:[]};
    }

    componentDidMount() {
        FaceActions.list(this.state.cid);
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
            FaceActions.list(this.state.cid);
        }
    };

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    };

    deleteClick = () => {
        console.log('selectedRowKeys', this.state.selectedRowKeys);
        FaceActions.delete(this.state.selectedRowKeys);
    };

    columns = [
        {
            title: '编号',
            dataIndex: '_id',
            width:240
        },
        {
            title: '人像',
            dataIndex: 'name',
            render: (value) => {
                return <Popover
                    content={<img style={{height:160}} src={Config.server + "/face/api/catalog/source/" + value}></img>}
                >
                    <img style={{height:32}} src={Config.server + "/face/api/catalog/source/" + value}></img>
                </Popover>
            },
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
        FaceActions.getList(pageNumber, 10);
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
        FaceActions.add(item);
        this.setState({visible: false, newItem: {}});
    };
    // 取消添加组的弹窗
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleChange =(info)=>{
        let fileList = info.fileList;
        this.setState({ fileList:fileList});
        console.log(fileList);
        if(info.file.status === "done"){
            this.state.visible = false;
            this.state.fileList = [];
            this.state.newItem = {};
            FaceActions.list(this.state.cid);
        }
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (<Layout>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item><Link to="/main/facegroup">人像库</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/main/facegroup">分组库管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{this.state.cid}</Breadcrumb.Item>
                </Breadcrumb>

                <Layout className="list-content">
                    <Header className="list-header">
                        <Button type="primary" onClick={this.showModal}>添加人像</Button>
                        <Button type="danger" disabled={!this.state.deleteBtnEnable} onClick={this.deleteClick}
                                style={{marginLeft: 16}}>删除人像</Button>
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
            </Layout>
        );
    }
}