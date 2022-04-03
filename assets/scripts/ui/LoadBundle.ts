
import { _decorator, Component, Node, Sprite, Label, isValid, Texture2D, SpriteFrame, sys, AssetManager, assetManager, path } from 'cc';
import StorageMgr from '../mgr/StorageMgr';
import AssetUtils from '../utils/AssetUtils';
import BundleUtils from '../utils/BundleUtils';
import LogUtils from '../utils/LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LoadBundle
 * DateTime = Wed Jan 12 2022 14:49:02 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = LoadBundle.ts
 * FileBasenameNoExtension = LoadBundle
 * URL = db://assets/script/ui/LoadBundle.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('LoadBundle')
export class LoadBundle extends Component {
    /**游戏图标 */
    @property(Sprite)
    sp_bg: Sprite = null;

    /**是否需要更新 */
    @property(Node)
    node_isUpdate: Node = null;

    /**更新进度 文字*/
    @property(Label)
    lb_update: Label = null;

    /**更新进度 图片*/
    @property(Node)
    node_update: Node = null;

    /**是否需要下载 */
    @property(Node)
    node_isDownload: Node = null;

    /**遮罩 */
    @property(Node)
    node_mask: Node = null;

    //游戏类型
    private gameType: string;
    //图片远程地址
    private gameImgUrl: string;
    //资源远程下载地址
    private remoteUrl: string;
    //bundle MD5值 用这个来区分是否需要更新
    private version: string;
    //是否需要更新
    private isUpdate: boolean = false;
    //是否需要下载
    private isDownLoad: boolean = false;
    //是否在下载中
    private isDownloading: boolean = false;



    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onLoadGame, this)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onLoadGame, this)
    }

    async init(data: BundleInfo) {
        //游戏关闭
        if (!data.swich) {
            this.node.destroy();
            return;
        }
        this.gameType = data.gameType
        this.gameImgUrl = data.gameImgUrl
        this.remoteUrl = data.remoteUrl
        this.version = data.version

        //子游戏图标
        if (data.gameImgUrl) {
            let res = await AssetUtils.loadRemotePic(data.gameImgUrl);
            if (res && isValid(this.sp_bg)) {
                let texture = new Texture2D();
                texture.image = res;
                let spf = new SpriteFrame();
                spf.texture = texture
                this.sp_bg.spriteFrame = spf;
            }
        }

        //只有原生平台需要检测更新 h5直接打到包体里 
        if (sys.isNative) {
            let bundleData = StorageMgr.subGameUpdate;
            // LogUtils.log("bundleData=============", JSON.stringify(bundleData))
            bundleData = JSON.parse(bundleData)
            //检测是否需要更新====
            if (bundleData) {
                let version = bundleData[data.gameType];
                if (!version) {
                    // LogUtils.log("本地没有游戏资源 需要下载", data.gameType)
                    bundleData[data.gameType] = "";
                    StorageMgr.subGameUpdate = JSON.stringify(bundleData);
                    this.isDownLoad = true;
                    this.node_mask.active = true;
                    this.node_isDownload.active = true;
                } else if (version != data.version) {
                    // LogUtils.log("当前版本不是最新版本 需要更新", data.gameType)
                    this.isUpdate = true;
                    this.node_mask.active = true;
                    this.node_isUpdate.active = true;
                } else {
                    // LogUtils.log("与远程版本相符 不需要下载", data.gameType)
                }
            }
        }
    }

    async onLoadGame() {
        //正在下载 点击无效
        if (this.isDownloading) return;
        let bundleName: string = this.gameType;
        //正常不会有数据  因为每次退出子游戏 都会清掉BUNDLE
        let bundle: AssetManager.Bundle = await BundleUtils.getBundle(bundleName);
        if (!bundle) {
            let options = {
                version: this.version
            }
            bundle = await BundleUtils.loadBundle(sys.isNative ? this.remoteUrl : bundleName, sys.isNative ? options : null);
        }
        if (bundle) {
            if (this.isUpdate || this.isDownLoad) {
                //需要下载========================
                //下载的资源
                let downLoadArray = []
                //资源的配置文件
                let resMap = bundle["_config"].assetInfos._map
                for (let idx in resMap) {
                    let item = resMap[idx]
                    // LogUtils.log("item.path=======", JSON.stringify(item));
                    if (item.path && item.nativeVer) {
                        //获取资源类型 mp3 png 等 资源要统一放在指定文件夹下 否则会解析不出来资源类型 
                        //暂时只有这两种资源 如出现其他资源 在加
                        let str = item.path.split('/')[0];
                        let type = ".png"
                        switch (str) {
                            case "images":
                                type = ".png"
                                break;
                            case "music":
                                type = ".mp3"
                                break;
                        }
                        //下载资源的远程路径
                        let urlRES = assetManager.utils.getUrlWithUuid(item.uuid, {
                            __nativeName__: type,
                            nativeExt: path.extname(type),
                            isNative: true
                        });

                        urlRES && downLoadArray.push(urlRES)
                        let urlJSON = assetManager.utils.getUrlWithUuid(item.uuid, {
                            isNative: false
                        });

                        urlJSON && downLoadArray.push(urlJSON)
                        // LogUtils.log("urll===========", urlRES, urlJSON)
                    }
                }
                if (downLoadArray.length > 0) {
                    this.isDownloading = true;
                    if (this.isUpdate) this.node_isUpdate.active = false;
                    if (this.isDownLoad) this.node_isDownload.active = false;
                    this.lb_update.node.active = true;
                    this.node_update.parent.active = true;
                    //下载进度
                    let onProgress = (completedCount: number, totalCount: number) => {
                        // LogUtils.log(`已经下载资源数："${completedCount}  总资源数：${totalCount}`);
                        let downloadNum = parseInt(`${(completedCount / totalCount) * 100}`)
                        this.lb_update.string = `${downloadNum}%`;
                        this.node_update.getComponent(Sprite).fillRange = downloadNum / 100;
                    }
                    let isSucc = await BundleUtils.loadBundleAnySync(downLoadArray, { __requestType__: 'url', type: null, bundle: bundle.name }, onProgress);
                    //下载结束
                    this.lb_update.node.active = false;
                    this.node_update.parent.active = false;
                    this.isDownloading = false;
                    if (isSucc) {
                        let bundleData = StorageMgr.subGameUpdate;
                        bundleData = JSON.parse(bundleData);
                        bundleData[bundleName] = this.version
                        StorageMgr.subGameUpdate = JSON.stringify(bundleData);
                        if (this.isUpdate) this.isUpdate = false;
                        if (this.isDownLoad) this.isDownLoad = false;
                        this.node_mask.active = false
                    } else {
                        //下载失败========== 换一张fail图片 玩家再次点击重新在尝试下载
                        this.isDownloading = false;
                        if (this.isUpdate) this.node_isUpdate.active = true;
                        if (this.isDownLoad) this.node_isDownload.active = true;
                    }
                } else {
                    //没有需要下载的资源  正常不会出现 出现的话 说明服务器更新配置出现问题了
                    //放开点击 让玩家可以进入游戏
                    if (this.isUpdate) this.isUpdate = false;
                    if (this.isDownLoad) this.isDownLoad = false;
                    this.node_mask.active = false
                }
                //下载结束 清掉BUNDLE  玩家再次点击 直接进入游戏
                BundleUtils.removeBundle(bundle);
            } else {
                // LogUtils.log("不需要下载 直接进入游戏================")
                //不需要下载 直接进入游戏================
                BundleUtils.loadBundleScene(bundle, bundleName)
            }
        } else {
            //加载bundle失败  请重新再试一遍 ========
            //进入之里边 应该就是远程资源出现问题了
            // LogUtils.log("加载bundle失败 请重新再试一遍 ========");
        }
    }
}

export interface BundleInfo {
    //游戏类型
    gameType: string;
    //游戏图标地址
    gameImgUrl: string;
    //远程资源地址
    remoteUrl: string;
    //版本
    version: string;
    //游戏开关
    swich: number;
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
