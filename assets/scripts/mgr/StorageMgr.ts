import { Enum, sys } from "cc";
import CommonUtils from "../utils/CommonUtils";

const enum StorageKey {
    SUBGAMEUPDATE = "SUBGAMEUPDATE"
};

/**用户唯一标识 */
const device: string = "";
/**
 * 本地localStorage缓存统一读写封装
 */
export default class StorageMgr {

    public static saveItem(key: string, val: string) {
        if (val === null || val === undefined) val = ''
        sys.localStorage.setItem(`${device}${key}`, val)
    }

    public static loadItem(key: string) {
        let val = sys.localStorage.getItem(`${device}${key}`)
        if (val === null || val === undefined) val = ''
        return val
    }

    /**子游戏更新数据*/
    public static set subGameUpdate(subGameUpdate: string) {
        this.saveItem(StorageKey.SUBGAMEUPDATE, subGameUpdate);
    }
    public static get subGameUpdate(): string {
        let bundleData = this.loadItem(StorageKey.SUBGAMEUPDATE);
        return bundleData || JSON.stringify({});
    }
}
