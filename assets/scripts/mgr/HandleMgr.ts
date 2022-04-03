import IHandler from "../net/handler/IHandler";

export default class HandleMgr {
	private static handlers: Array<any> = new Array<any>();

	public static init(): void {
	}

	/**注册回调*/
	public static addHandler(cmd: number, subCmd: number, handler: IHandler): void {
		if (HandleMgr.handlers[cmd] == undefined)
			HandleMgr.handlers[cmd] = new Array<IHandler>();
		HandleMgr.handlers[cmd][subCmd] = handler;
	}

	/**获取回调接口*/
	public static getHandler(cmd: number, subCmd: number): IHandler {
		var handler: IHandler;
		if (HandleMgr.handlers[cmd] && HandleMgr.handlers[cmd][subCmd])
			handler = HandleMgr.handlers[cmd][subCmd];
		if (handler == null) {
			console.log("cmd is null", cmd, subCmd);
		}
		return handler;
	}

	//消息分发
	public static packageHandler(cmd: number, subCmd: number, data: Uint8Array) {
		let handler = this.getHandler(cmd, subCmd);
		if (handler)
			handler.execute(data);
	}
}