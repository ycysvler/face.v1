/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import {Layout, Popover, Menu, Table,  Button} from 'antd';
import {FaceStore, FaceActions} from './reflux.js';
const {Header, Content,Sider} = Layout;

export default class FaceSelect extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribe = FaceStore.listen(this.onStatusChange.bind(this));
        this.state = {cid:props.id,groupitems:[],faceitems: [], menuSelectedKeys:[], deleteBtnEnable: false, newItem: {},fileList:[]};
    }

    componentDidMount() {
        FaceActions.group();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange = (type, data) => {
        if (type === 'list') {
            this.setState({faceitems: data.list, deleteBtnEnable: false, total: data.total});
        }
        if (type === 'group') {
            if(this.state.faceitems.length === 0){
                FaceActions.list(data.list[0]['id']);
                this.state.menuSelectedKeys = [data.list[0]['id']];
            }
            this.setState({groupitems: data.list});
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
            title: '人像',
            width:60,
            dataIndex: 'name',
            render: (value, item) => {
                return <Popover
                    content={<img style={{height:160}} src={Config.server + "/face/api/catalog/source/" + item._id}></img>}
                >
                    <img style={{height:32}} src={Config.server + "/face/api/catalog/source/" + item._id}></img>
                </Popover>
            },
        },
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
            title: '描述',
            dataIndex: 'desc',
        }];

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.state.selectedRowKeys = selectedRowKeys;
            if (selectedRowKeys.length > 0) {
                this.setState({deleteBtnEnable: true, selectedRowKeys: selectedRowKeys});
            } else {
                this.setState({deleteBtnEnable: false, selectedRowKeys: selectedRowKeys});
            }

            if(this.props.onFaceSelect){
                let ids = [];
                selectedRows.map((row)=>{
                    ids.push(row._id);
                });
                this.props.onFaceSelect(ids);
            }
        },
        onSelect: (record, selected, selectedRows) => {
            //console.log(record, selected, selectedRows);
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

    handleChange =(info)=>{
        let fileList = info.fileList;
        this.setState({ fileList:fileList});
        if(info.file.status === "done"){
            this.state.visible = false;
            this.state.fileList = [];
            this.state.newItem = {};
            FaceActions.list(this.state.cid);
        }
    };

    menuClick = (e) => {
        this.setState({menuSelectedKeys:[e.key]});
        FaceActions.list(e.key);
    };

    render() {

        return (<Layout>
                <Layout className="list-content">
                    <Sider style={{background:'#fff'}} width="180">
                        <Menu mode="inline" onClick={this.menuClick} selectedKeys={this.state.menuSelectedKeys}>
                            {
                                this.state.groupitems.map((item)=>{
                                    return <Menu.Item key={item.id}>{item.name}</Menu.Item>
                                })
                            }
                        </Menu>
                    </Sider>
                    <Content >
                        <Table
                            bordered={false}
                            className="bg-white"
                            rowKey="_id"
                            rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.faceitems}
                            pagination={{
                                showSizeChanger: true,
                                onChange: this.onPageChange,
                                pageSizeOptions: ["2", "3", "4", "5"],
                                defaultPageSize: 10, total: this.state.total,
                                hideOnSinglePage: true
                            }} size="middle"/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}