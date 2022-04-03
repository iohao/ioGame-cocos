
import { _decorator, Component, Node, Asset, resources, Camera, Rect, RenderTexture, rect, Prefab, instantiate, sys, SpriteFrame, Texture2D, Sprite, assetManager, ImageAsset, AssetManager } from 'cc';
import CommonUtils from './CommonUtils';
import LogUtils from './LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CocosUtils
 * DateTime = Sat Nov 13 2021 19:22:23 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = CocosUtils.ts
 * FileBasenameNoExtension = CocosUtils
 * URL = db://assets/script/utils/CocosUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

export default class CocosUtils {


    // // ts 代码
    // // 展示本地图片到sprite
    // public static showImage(file: File, sprite: Sprite) {
    //     if (!file) return;
    //     // 读取文件为base64数据流
    //     CommonUtils.readFile(file, (base64: string) => {
    //         this.base64ToSpriteFrame(base64, (spriteFrame: SpriteFrame) => {
    //             if (sprite) sprite.spriteFrame = spriteFrame;
    //         });
    //     });
    // }

    // public static base64ToSpriteFrame(base64: string, callback: (this: void, spriteFrame: SpriteFrame) => void) {
    //     var img = new Image();
    //     console.warn("------------准备合成-------------")
    //     img.onload = function () {
    //         console.warn("*********img.onload**********")
    //         var texture = new Texture2D();
    //         texture.initWithElement(img);
    //         texture.handleLoadedTexture();
    //         var newframe = new SpriteFrame(texture);
    //         if (callback) callback(newframe);
    //     }
    //     img.onerror = function (err) {
    //         console.warn("------合成报错-----", err)
    //     }
    //     if ((<any>base64).startsWith !== undefined && (<any>base64).startsWith("data:image")) {
    //         img.src = base64;
    //     } else {
    //         img.src = "data:image/png;base64," + base64;
    //     }
    // }

}

