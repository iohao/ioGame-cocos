
import { _decorator, Component, Node, assetManager, AssetManager, Asset, SceneAsset } from 'cc';
import LogUtils from './LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BundleUtils
 * DateTime = Sun Dec 19 2021 21:59:39 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = BundleUtils.ts
 * FileBasenameNoExtension = BundleUtils
 * URL = db://assets/script/utils/BundleUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */


export default class BundleUtils {

    /**加载bundle */
    public static loadBundle(bundleName: string, options: any = null): Promise<AssetManager.Bundle> {
        return new Promise(resolve => {
            assetManager.loadBundle(bundleName, options, (err: Error, bundle: AssetManager.Bundle) => {
                resolve(err ? null : bundle);
            })
        })
    }

    /**获取Bundle */
    public static getBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise(resolve => {
            let bundle: AssetManager.Bundle = assetManager.getBundle(bundleName);
            resolve(bundle);
        })
    }

    /**加载bundle 资源 */
    public static loadBundleSync(bundle: AssetManager.Bundle, url: string, type: typeof Asset, onProgress?: (completedCount: number, totalCount: number, item: any) => void): Promise<Asset> {
        return new Promise(resolve => {
            bundle.load(url, type, onProgress, (err, asset: Asset) => {
                resolve(err ? null : asset);
            })
        })
    }

    /**加载bundle scene */
    public static loadBundleScene(bundle: AssetManager.Bundle, sceneName: string, options?, onProgress?: (completedCount: number, totalCount: number, item: any) => void): Promise<SceneAsset> {
        return new Promise(resolve => {
            bundle.loadScene(sceneName, options, onProgress, (err, scene: SceneAsset) => {
                resolve(err ? null : scene);
            })
        })
    }

    /**移除Bundle */
    public static removeBundle(bundle: AssetManager.Bundle) {
        assetManager.removeBundle(bundle);
    }

    /**释放bundle 所有资源 */
    public static releaseBundle(bundle: AssetManager.Bundle) {
        bundle.releaseAll();
    }

    /**下载bundle资源 */
    public static loadBundleAnySync(assets: string | string[] | Record<string, any> | Record<string, any>[], options: Record<string, any>, onProgress?: (completedCount: number, totalCount: number, item: any) => void): Promise<boolean> {
        return new Promise(resolve => {
            assetManager.preloadAny(assets, options, onProgress, (err: Error, items: AssetManager.RequestItem[]) => {
                resolve(err ? false : true)
            })
        })
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
