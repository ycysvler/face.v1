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
            frames: []
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(newProps){
        if(newProps.frames.length > 0 && newProps.duration > 0){
            this.state.duration = newProps.duration;
            let items = [];

            for(let item of newProps.frames){
                // 这里有个问题，这个视频的长度是多少
                item.progress = item.time * 100 / this.state.duration;
                items.push(item);
            }

            this.setState({frames:items});
        }
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
                       return  <div key={index} onClick={this.onProgress.bind(this,item)} className="bar" style={{left: item.progress + '%'}}></div>
                    })
                }
            </div>
        );
    }
}