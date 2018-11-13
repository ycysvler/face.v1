#coding=utf-8
# -*- coding: UTF-8 -*-
import sys
import mongodb
import bson.binary
import config
import time
import os 
import datetime 
import argparse 
import json 
import urllib
from multiprocessing import Process, Pipe
sys.path.append("./dll")

reload(sys)
sys.setdefaultencoding('utf-8') 

# http 
from flask import Flask,request ,Response

# process pipe 
pip_video_web, pip_video_service = Pipe()
pip_job_web, pip_job_service = Pipe()
pip_image_web, pip_image_service = Pipe()

# service process
def videoService():
    pip = pip_video_service
    while True:
    	params = pip.recv()
    	print 'videoService params ' , params 
    	pip.send({"code":200, "cotent":"video " + params["id"]})

def jobService():
    pip = pip_job_service
    while True:
    	params = pip.recv()
    	print 'jobService params ' , params 
    	pip.send({"code":200, "cotent":"job " + params["id"]})

def imageService():
    pip = pip_image_service
    while True:
    	params = pip.recv()
    	print 'imageService params ' , params 
    	pip.send({"code":200, "cotent":"image " + params["id"]})

# 下面是Http处理部分
app = Flask(__name__)


# new video
@app.route('/video/frame')
def videoFrame():
    pip = pip_video_web;
    id = request.args.get("id");
    print "/video/new", id
    # web process call service process
    pip.send({"id":id});
    result = pip.recv()
    return Response(json.dumps(result),mimetype='application/json')

# new catalog image
@app.route('/catalog/image')
def catalogImage():
    pip = pip_image_web;
    id = request.args.get("id")
    print "/catalog/image", id
    pip.send({"id":id})
    result = pip.recv()
    return Response(json.dumps(result),mimetype='application/json')  

# new query job
@app.route('/job')
def newJob():
    pip = pip_job_web;
    id = request.args.get("id")
    print "/job", id
    pip.send({"id":id})
    result = pip.recv()
    return Response(json.dumps(result),mimetype='application/json')  
  

# http server progress, port = 4003
def webService():
    app.run(debug=False, host='0.0.0.0', port=4003)

if __name__ == '__main__':
# 启动计算集成等待努力工作
    webProcess = Process(target=webService) 
    webProcess.start()

    videoProcess = Process(target=videoService) 
    videoProcess.start()

    jobProcess = Process(target=jobService) 
    jobProcess.start()
 
    imageProcess = Process(target=imageService) 
    imageProcess.start()
     
 
