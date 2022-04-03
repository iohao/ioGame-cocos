
import { _decorator, Component, Node } from 'cc';
import RegisterMgr from './mgr/RegisterMgr';
import { decodeNested, encodeNested, Nested } from './net/protocol/test';
import SocketClient from './net/socket/SocketClient';
import CommonUtils from './utils/CommonUtils';
import LogUtils from './utils/LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Main
 * DateTime = Sat Nov 13 2021 21:35:42 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = main.ts
 * FileBasenameNoExtension = main
 * URL = db://assets/script/main.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

// 
//                                  _oo8oo_
//                                 o8888888o
//                                 88" . "88
//                                 (| -_- |)
//                                 0\  =  /0
//                               ___/'==='\___
//                             .' \\|     |// '.
//                            / \\|||  :  |||// \
//                           / _||||| -:- |||||_ \
//                          |   | \\\  -  /// |   |
//                          | \_|  ''\---/''  |_/ |
//                          \  .-\__  '-'  __/-.  /
//                        ___'. .'  /--.--\  '. .'___
//                     ."" '<  '.___\_<|>_/___.'  >' "".
//                    | | :  `- \`.:`\ _ /`:.`/ -`  : | |
//                    \  \ `-.   \_ __\ /__ _/   .-` /  /
//                =====`-.____`.___ \_____/ ___.`____.-`=====
//                                  `=---=`
// 
// 
//                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//                          佛祖保佑         永无bug
//
/**启动脚本 */
export default class main {
    private static _instance = new main();
    //获得实例对象
    public static get instance(): main {
        return this._instance;
    }
    private constructor() {
        RegisterMgr.ins.registCmd();
        SocketClient.ins.connect();
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
