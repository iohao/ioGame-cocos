
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SceneUtils
 * DateTime = Sun Dec 19 2021 22:20:39 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = SceneUtils.ts
 * FileBasenameNoExtension = SceneUtils
 * URL = db://assets/script/utils/SceneUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

export default class SceneUtils {
    /**加载场景 */
    public static loadScene(sceneName: string) {
        director.loadScene(sceneName);
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
