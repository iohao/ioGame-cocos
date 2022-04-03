import { Asset, assetManager, instantiate, js, Prefab, Texture2D } from "cc";
import AssetUtils from "../utils/AssetUtils";
import EventMgr from "./EventMgr";

/**
 * 动态资源管理
 * 内部实现了引用计数，使用时无需额外维护引用及依赖引用的计数器
 */
export default class ResMgr {
    private static _inst: ResMgr = null;
    public static get inst() {
        if (this._inst === null) {
            this._inst = new ResMgr();
        }
        return this._inst;
    }

    /** 
     * 采用计数管理的办法, 管理form所依赖的资源
     */
    private _prefabDepends: { [key: string]: Array<string> } = js.createMap();
    private _dynamicTags: { [key: string]: Array<string> } = js.createMap();

    private _tmpAssetsDepends: string[] = [];                                       // 临时缓存
    private _assetsReference: { [key: string]: number } = js.createMap();          // 资源引用计数

    /** 加载窗体 */
    public async loadForm(fid: string) {
        let { res, deps } = await this._loadResWithReference<Prefab>(fid, Prefab);
        this._prefabDepends[fid] = deps;
        return instantiate(res);
    }

    /** 销毁窗体 */
    // public destoryForm(com: UIBase) {
    //     if (!com) return;
    //     EventMgr.targetOff(com);

    //     // 销毁依赖的资源
    //     this._destoryResWithReference(this._prefabDepends[com.fid]);

    //     this._prefabDepends[com.fid] = null;
    //     delete this._prefabDepends[com.fid];

    //     // 销毁node
    //     com.node.destroy();
    // }

    /** 动态资源管理, 通过tag标记当前资源, 统一释放 */
    public async loadDynamicRes<T>(url: string, type: typeof Asset, tag: string) {
        let { res, deps } = await this._loadResWithReference<T>(url, type);
        if (!this._dynamicTags[tag]) {
            this._dynamicTags[tag] = [];
        }
        this._dynamicTags[tag].push(...deps);
        return res;
    }

    /** 销毁动态资源  */
    public destoryDynamicRes(tag: string) {
        if (!this._dynamicTags[tag]) {       // 销毁
            return false;
        }
        this._destoryResWithReference(this._dynamicTags[tag])

        this._dynamicTags[tag] = null;
        delete this._dynamicTags[tag];

        return true;
    }


    /** 加载资源并添加引用计数 */
    private async _loadResWithReference<T>(url: string, type: typeof Asset) {
        let res = await AssetUtils.loadResSync<T>(url, type, this._addTmpAssetsDepends.bind(this));
        if (!res) {
            this._clearTmpAssetsDepends();
            return {
                res,
                deps: null
            };
        }
        this._clearTmpAssetsDepends();
        let deps = assetManager.dependUtil.getDepsRecursively(res['_uuid']) || [];
        deps.push(res['_uuid']);
        this.addAssetsDepends(deps);

        return {
            res: res,
            deps: deps
        };
    }

    /** 更加引用销毁资源 */
    private _destoryResWithReference(deps: string[]) {
        let _toDeletes = this.removeAssetsDepends(deps);
        this._destoryAssets(_toDeletes);
        return true;
    }

    /** 添加资源计数 */
    private addAssetsDepends(deps: Array<string>) {
        for (let s of deps) {
            if (this._checkIsBuiltinAssets(s)) continue;
            if (this._assetsReference[s]) {
                this._assetsReference[s] += 1;
            } else {
                this._assetsReference[s] = 1;
            }
        }
    }
    /** 删除资源计数 */
    private removeAssetsDepends(deps: Array<string>) {
        let _deletes: string[] = [];
        for (let s of deps) {
            if (!this._assetsReference[s] || this._assetsReference[s] === 0) continue;
            this._assetsReference[s]--;
            if (this._assetsReference[s] === 0) {
                _deletes.push(s);
                delete this._assetsReference[s];                  // 删除key;
            }
        }
        return _deletes;
    }
    private _destoryAssets(urls: string[]) {
        for (const url of urls) {
            this._destoryAsset(url);
        }
    }
    /** 销毁资源 */
    private _destoryAsset(url: string) {
        if (this._checkIsBuiltinAssets(url)) return;
        assetManager.assets.remove(url);               // 从缓存中清除
        let asset = assetManager.assets.get(url);      // 销毁该资源
        asset && asset.destroy();
        assetManager.dependUtil['remove'](url);        // 从依赖中删除
    }

    /** 临时添加资源计数 */
    private _addTmpAssetsDepends(completedCount: number, totalCount: number, item: any) {
        let deps = (assetManager.dependUtil.getDepsRecursively(item.uuid) || []);
        deps.push(item.uuid);
        this.addAssetsDepends(deps);

        this._tmpAssetsDepends.push(...deps);
    }
    /** 删除临时添加的计数 */
    private _clearTmpAssetsDepends() {
        for (let s of this._tmpAssetsDepends) {
            if (!this._assetsReference[s] || this._assetsReference[s] === 0) continue;
            this._assetsReference[s]--;
            if (this._assetsReference[s] === 0) {
                delete this._assetsReference[s];           // 这里不清理缓存
            }
        }
        this._tmpAssetsDepends = [];
    }

    /** 检查是否是builtin内的资源 */
    private _checkIsBuiltinAssets(url: string) {
        let asset = assetManager.assets.get(url);
        if (asset && asset['_name'].indexOf("builtin") != -1) {
            return true;
        }
        return false;
    }

    /** 计算当前纹理数量和缓存 */
    public computeTextureCache() {
        let cache = assetManager.assets;
        let totalTextureSize = 0;
        let count = 0;
        cache.forEach((item: Asset, key: string) => {
            let type = (item && item['__classname__']) ? item['__classname__'] : '';
            if (type == 'Texture2D') {
                let texture = item as Texture2D;
                let textureSize = texture.width * texture.height * ((texture['_native'] === '.jpg' ? 3 : 4) / 1024 / 1024);
                // debugger
                totalTextureSize += textureSize;
                count++;
            }
        });
        return `缓存 [纹理总数:${count}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
    }

}