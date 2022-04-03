
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SysConfig
 * DateTime = Thu Jan 13 2022 13:40:45 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = SysConfig.ts
 * FileBasenameNoExtension = SysConfig
 * URL = db://assets/script/data/SysConfig.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export class SysConfig {
    public static wsUrl: string = "ws://127.0.0.1:10088/websocket"; // "ws://82.157.123.54:9010/ajaxchattest";
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
