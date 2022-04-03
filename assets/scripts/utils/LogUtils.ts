
import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LogUtils
 * DateTime = Sat Nov 13 2021 21:45:49 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = LogUtils.ts
 * FileBasenameNoExtension = LogUtils
 * URL = db://assets/script/utils/LogUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

export default class LogUtils {

    public static isDebug: boolean = true;

    public static log(message?: any, ...optionalParams: any) {
        if (!this.isDebug) return;
        console.log(message, ...optionalParams);
    }

    public static error(message?: any, ...optionalParams: any) {
        if (!this.isDebug) return;
        console.error(message, ...optionalParams);
    }
    public static warn(message?: any, ...optionalParams: any) {
        if (!this.isDebug) return;
        console.warn(message, ...optionalParams);
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
