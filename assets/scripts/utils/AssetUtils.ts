
import { _decorator, Component, Node, resources, Asset, Prefab, instantiate, isValid, assetManager, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AssetUtils
 * DateTime = Fri Dec 24 2021 21:25:35 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = AssetUtils.ts
 * FileBasenameNoExtension = AssetUtils
 * URL = db://assets/script/utils/AssetUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export default class AssetUtils {

    /**加载远程图片 */
    public static loadRemotePic(url: string): Promise<ImageAsset> {
        return new Promise(resolve => {
            assetManager.loadRemote(url, (err, res: ImageAsset) => {
                resolve(err ? null : res);
            })
        })
    }

    /** 加载res资源 */
    public static loadResSync<T>(url: string, type: typeof Asset, onProgress?: (completedCount: number, totalCount: number, item: any) => void): Promise<any> {
        return new Promise(resolve => {
            resources.load(url, type, onProgress, (err, asset: Asset) => {
                if (err) {
                    // LogUtils.log(err)
                    resolve(null)
                } else {
                    // LogUtils.log(asset)
                    resolve(asset)
                    this.addRef(asset);
                }
            })
        })
    }

    /**实例化动态预制体*/
    public static cloneResSync<T>(prefab: Prefab): Promise<Node> {
        return new Promise(resolve => {
            let node = null;
            if (isValid(prefab)) {
                node = instantiate(prefab);
                // this.releaseAsset(prefab);
            }
            resolve(node);
        })
    }

    /** 释放资源 */
    public static releaseAsset(assets: Asset | Asset[] | string) {
        if (typeof assets == "string") {
            assets = resources.get(assets);
        }
        this.decRes(assets);
    }

    /** 增加引用计数 */
    private static addRef(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.addRef();
            }
        } else {
            assets.addRef();
        }
    }

    /** 减少引用计数, 当引用计数减少到0时,会自动销毁 */
    private static decRes(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.decRef();
            }
        } else {
            assets.decRef();
        }
    }
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
