
import { _decorator, Component, Node, js } from 'cc';
import CommonUtils from '../utils/CommonUtils';
import LogUtils from '../utils/LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Http
 * DateTime = Sat Dec 04 2021 09:41:03 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = http.ts
 * FileBasenameNoExtension = http
 * URL = db://assets/script/net/http.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

/**上传文件 */
export function upload(file: File) {
    // 使用表单设置文件，发送上传消息到服务器
    let forms = new FormData();
    forms.append("file", file);// 必填，key不限制必须"file"，根据nestjs服务器逻辑填写
    forms.append('fileName', file.name);// 选填，根据nestjs服务器逻辑填写
    forms.append('targetPath', 'test');// 选填，根据nestjs服务器逻辑填写
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304) {
                LogUtils.log(xhr.response)
            }
        } else {
            LogUtils.log(xhr.status)
        }
    }
    xhr.open('POST', 'http://localhost:443/api/v1/upload', true);
    // xhr.setRequestHeader 的问题卡了好久，
    // nestjs那边一直报错，nestjs的文档要求是 multipart/form-data 格式，
    // 但是要是你自己设置的话会导致 Boundary 丢失，nestjs 的multer中间件解析错误，报错"Multipart: Boundary not found"，
    // 所以不设置"multipart/form-data"，自动生成就好，可以在network里查看发送的消息头已经自动添加好了"Content-Type"，
    // 网上各路大神各种花式解决方案，都未解决我的困惑，最后参考这个链接解决，跪谢https://blog.csdn.net/yun_hou/article/details/97004557
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");// multer不会处理非"multipart/form-data"表单
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    // console.log(forms);// 打印不出来什么的，所以放弃吧
    xhr.addEventListener("progress", function (evt) {
        LogUtils.log('xxx progress', evt);// 上传进度，我只看到打印一次
    }, false);
    xhr.send(forms);
}

/**网络请求 */
export function sendRequest(url: string, data: any, method: string = 'GET', contentType: string = 'application/x-www-form-urlencoded;charset=UTF-8'): Promise<any> {
    return new Promise((resolve) => {
        var isTimeout = false;//是否超时
        var timeoutTimer = null;
        timeoutTimer = setTimeout(function () {
            //LogUtil.log(`网络超时。。。。。。${url}`)
            isTimeout = true;
            xhr.abort();//请求中止
            resolve({ code: 504, msg: '网络超时，请重试' });
        }, 5000);
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (isTimeout) {
                    return;
                }
                clearTimeout(timeoutTimer);
                let retStr: string = xhr.responseText
                //LogUtil.log('ddddddd', 'onreadystatechange----------', retStr)
                if (CommonUtils.isJsonString(retStr)) {
                    resolve(JSON.parse(retStr));
                } else resolve(retStr)
            }
        };
        xhr.open(method, method === 'POST' ? url : `${url}?${CommonUtils.objectToParams(data)}`, true);
        xhr.setRequestHeader('Content-Type', contentType)
        xhr.send(method === 'POST' ? js.isString(data) ? data : CommonUtils.objectToParams(data) : null);
    })
}


// export default class Http {

// }

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
