/**
 * Predefined variables
 * Name = ISocket
 * DateTime = Sat Nov 27 2021 13:11:01 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = ISocket.ts
 * FileBasenameNoExtension = ISocket
 * URL = db://assets/script/net/socket/ISocket.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

export default interface ISocket {
    onopen(event: Event): void
    onclose(event: CloseEvent): void
    onmessage(event: MessageEvent): void
    onerror(event: Event): void
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
