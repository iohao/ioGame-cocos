export default class NetPackageHead {
	public static LENGTH: number = 15;

	public sumLength: number //消息总长度
	public cmdCode: number //请求命令类型 0心跳1业务 2字节
	public protocolSwich: number //协议开关 1字节
	public mergeCmd: number //mergecmd 4字节
	public responseStatus: number //2返回状态码 字节
	public dataLen: number  //请求体长度 4字节

	public toByteArray(): Uint8Array {
		var buf = new Uint8Array(8);
		var dv = new DataView(buf);
		dv.setUint16(0, this.sumLength, false);
		dv.setUint16(2, this.cmdCode, false);
		dv.setUint16(4, this.protocolSwich, false);
		dv.setUint32(5, this.mergeCmd, false);
		dv.setUint16(9, this.responseStatus, false);
		dv.setUint32(11, this.dataLen, false);
		return buf;
	}

	public read(data: Uint8Array) {
		var dv = new DataView(data.buffer);
		this.sumLength = dv.getUint16(this.sumLength, true);
		this.cmdCode = dv.getUint16(this.cmdCode, true);
		this.protocolSwich = dv.getUint16(this.protocolSwich, true);
		this.mergeCmd = dv.getUint32(this.mergeCmd, true);
		this.responseStatus = dv.getUint16(this.responseStatus, true);
		this.dataLen = dv.getUint32(this.dataLen, true);
	}
}