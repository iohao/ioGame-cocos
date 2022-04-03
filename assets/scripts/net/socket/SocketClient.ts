
import { _decorator, Component, Node, sys, loader, url, assetManager, Asset } from 'cc';
import { SysConfig } from '../../data/SysConfig';
import CmdMgr from '../../mgr/CmdMgr';
import HandleMgr from '../../mgr/HandleMgr';
import SendMgr from '../../mgr/SendMgr';
import AssetUtils from '../../utils/AssetUtils';
import CocosUtils from '../../utils/CocosUtils';
import LogUtils from '../../utils/LogUtils';
import NetPackage from '../cmd/NetPackage';
import NetPackageHead from '../cmd/NetPackageHead';
import { decodeMyExternalMessage, MyExternalMessage } from '../protocol/MyExternalMessage';
import ISocket from './ISocket';

/**
 * Predefined variables
 * Name = SocketClient
 * DateTime = Sat Nov 27 2021 13:14:23 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = SocketClient.ts
 * FileBasenameNoExtension = SocketClient
 * URL = db://assets/script/net/socket/SocketClient.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
export default class SocketClient implements ISocket {

    private static _ins: SocketClient = null;

    //获得实例对象
    public static get ins(): SocketClient {
        return this._ins == null ? this._ins = new SocketClient() : this._ins;
    }

    // private constructor() {
    // this.SocketState = this.SocketState_NoConnect;
    // this.webScoket = null;
    // }

    //Socket连接状态定义
    public SocketState_NoConnect: number = 0;  //没有连接
    public SocketState_Connected: number = 1;  //已经连接
    public SocketState_Closing: number = 2; //正在关闭中
    public SocketState_Closed: number = 3; //已经关闭
    public SocketState: number = this.SocketState_NoConnect;
    public webScoket: WebSocket = null
    public recvBuf: Uint8Array;                //接收缓冲
    public async connect(ws: string = SysConfig.wsUrl): Promise<void> {
        if (this.SocketState != this.SocketState_Connected) {
            if (sys.isNative) {
                let cacert: Asset = await AssetUtils.loadResSync("ssl/cacert", Asset)
                let pemUrl = cacert.nativeUrl;
                // if (loader.md5Pipe) {
                //     pemUrl = loader.md5Pipe.transformURL(pemUrl);
                // }
                this.webScoket = new WebSocket(ws, null, pemUrl);
            } else {
                this.webScoket = new WebSocket(ws);
            }
            this.webScoket.binaryType = "arraybuffer";
            this.webScoket.onclose = this.onclose.bind(this);
            this.webScoket.onerror = this.onerror.bind(this);
            this.webScoket.onmessage = this.onmessage.bind(this);
            this.webScoket.onopen = this.onopen.bind(this);
        } else {
            this.onopen(null);
        }
    }


    public onopen(event: Event): void {
        this.SocketState = this.SocketState_Connected
        LogUtils.log("onopen", event)
    }

    //发送消息
    public send(pbBuff: Uint8Array): void {
        if (this.webScoket && this.webScoket.readyState === this.SocketState_Connected) {
            if (!pbBuff) {
                LogUtils.error("没有数据")
                return;
            }
            this.webScoket.send(pbBuff);
        } else {
            //网络连接异常
            // this.connect();
        }
    }

    public onmessage(event: MessageEvent): void {
        LogUtils.log("onmessage", event)
        let recvData = new Uint8Array(<ArrayBuffer>event.data);
        let data: MyExternalMessage = decodeMyExternalMessage(recvData)
        HandleMgr.packageHandler(CmdMgr.getCmd(data.cmdMerge), CmdMgr.getSubCmd(data.cmdMerge), data.dataContent);
    }


    //发送消息
    // public send(cmd: number, subCmd: number, pbBuff: Uint8Array, cmdCode: number = 1, protocolSwich: number = 0): void {
    //     if (this.webScoket && this.webScoket.readyState === this.SocketState_Connected) {
    //         if (!pbBuff) {
    //             pbBuff = new Uint8Array(0);
    //         }
    //         let ab = new ArrayBuffer(NetPackageHead.LENGTH + pbBuff.length);
    //         let dv = new DataView(ab);
    //         dv.setUint16(0, NetPackageHead.LENGTH + pbBuff.length, true);
    //         dv.setUint16(2, cmdCode, true);
    //         dv.setUint16(4, protocolSwich, true);
    //         dv.setUint32(5, CmdMgr.getMergeCmd(cmd, subCmd), true);
    //         dv.setUint16(9, 0, true);
    //         dv.setUint32(11, pbBuff.length, true);
    //         let tempUi8A = new Uint8Array(dv.buffer);
    //         tempUi8A.set(pbBuff, NetPackageHead.LENGTH);
    //         this.webScoket.send(tempUi8A);
    //     } else {
    //         //网络连接异常
    //         // this.connect();
    //     }
    // }

    // public onmessage(event: MessageEvent): void {
    //     LogUtils.log("onmessage", event)
    //     let recvData = new Uint8Array(<ArrayBuffer>event.data);
    //     if (this.recvBuf != null && this.recvBuf.byteLength > 0) {
    //         let allBuf = new Uint8Array(this.recvBuf.length + recvData.length);
    //         allBuf.set(this.recvBuf, 0);
    //         allBuf.set(recvData, this.recvBuf.length);
    //     } else {
    //         this.recvBuf = recvData;
    //     }
    //     //处理数据
    //     while (this.recvBuf.length >= NetPackageHead.LENGTH) {
    //         let packageHead = new NetPackageHead();
    //         packageHead.read(this.recvBuf);
    //         if (this.recvBuf.length >= NetPackageHead.LENGTH) {
    //             let netPackage = new NetPackage();
    //             this.recvBuf = netPackage.read(this.recvBuf);
    //             HandleMgr.packageHandler(CmdMgr.getCmd(netPackage.head.mergeCmd), CmdMgr.getSubCmd(netPackage.head.mergeCmd), netPackage.bodyBuff);
    //         }
    //     }
    // }

    //关闭close
    public close(): void {
        if (this.webScoket) this.webScoket.close();
    }


    public onclose(event: CloseEvent): void {
        LogUtils.log("onclose", event)
        this.SocketState = this.SocketState_Closed;
    }


    public onerror(event: Event): void {
        LogUtils.log("onerror", event)
        this.SocketState = this.SocketState_Closed;
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
