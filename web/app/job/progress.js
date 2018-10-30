/**
 * Created by yanggang on 2017/3/6.
 */
import React from 'react';
import Config from 'config';
import {Link} from 'react-router-dom';
import {Layout, Modal, Upload, Table, Breadcrumb, Button, Row, Col, Card, Input, Icon} from 'antd';
import {VideoStore, VideoActions} from './reflux.js';

const {Header, Content} = Layout;
import './progress.less';

export default class progress extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            video: {length: 10},
            onProgress : props.onProgress,
            frames: [
                {time: 5, progress: 50},
                {time: 6, progress: 60},
                {time: 8, progress: 80}
            ]
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onProgress=(frames)=>{
      console.log('frames', frames);
      // 调用父窗体改滚动条
      this.state.onProgress(frames.time);
    };

    render() {
        return (<div className="progress-bg">
                {
                    this.state.frames.map((item, index)=>{
                       return  <div key={item.time} onClick={this.onProgress.bind(this,item)} className="bar" style={{left: item.progress + '%'}}></div>
                    })
                }
            </div>
        );
    }
}