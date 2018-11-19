import React from 'react';
import {Layout, Menu, Button,Icon} from 'antd';
import {HashRouter as Router,Link, Switch, Route} from 'react-router-dom';
import NotFound from '../notfound';
import './main.less';
import FaceList from '../face/list';
import VideoList from '../video/list';
import VideoInfo from '../video/info';
import JobIndex from '../job/index';
import FaceGroupList from '../facegroup/list';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const {Header, Content, Sider} = Layout;

export default class CentrePlatform extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {

    }

    render=()=> {
        return (
            <Layout className="main-root">
                <Header style={{height:64}} className="header">
                    <div className="logo" >人像识别平台</div>
                    <div style={{float: 'right'}}>
                        <Layout style={{"background": "white"}}>
                            <Content>
                                <Menu mode="horizontal" >
                                    <SubMenu key="sub2" title={<span><Icon type="bulb" /><span>视频库管理</span></span>}>
                                        <Menu.Item key="monitor"><Link to='/main/video'><span>视频库</span></Link></Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="sub1" title={<span><Icon type="appstore-o" /><span>人脸库管理</span></span>}>
                                        <Menu.Item key="org"><Link to='/main/facegroup'><span>分组库</span></Link></Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Content>
                            <Sider width={160} className="box"
                                   style={{background: '#fff', height: '64px', justifyContent: 'flex-end'}}>
                                <Button style={{"background": "#fff", "border": "none"}} icon="question-circle-o"
                                        size="small" className="header-help">帮助</Button>
                            </Sider>

                        </Layout>
                    </div>
                </Header>
                <Layout >
                    <Router>
                        <Switch>
                            <Route path="/main/facegroup" component={FaceGroupList}/>
                            <Route path="/main/video/info/:id/:name" component={VideoInfo}/>
                            <Route path="/main/video" component={VideoList}/>
                            <Route path="/main/face/:id" component={FaceList}/>
                            <Route path="/main/job/:id/:name" component={JobIndex}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Router>

                </Layout>


            </Layout>
        );
    }
}

