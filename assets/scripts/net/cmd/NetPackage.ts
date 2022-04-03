import NetPackageHead from "./NetPackageHead";

export default class NetPackage {

	public head: NetPackageHead;
	public bodyBuff: Uint8Array

	public toUnity8Array(): Uint8Array {
		var buf = new Uint8Array(NetPackageHead.LENGTH + this.bodyBuff.length);
		buf.set(this.head.toByteArray(), 0);
		buf.set(this.bodyBuff, NetPackageHead.LENGTH);
		return buf;
	}

	public read(data: Uint8Array): Uint8Array {
		this.head = new NetPackageHead();
		this.head.read(data);
		data = data.subarray(NetPackageHead.LENGTH, data.length);
		this.bodyBuff = data.subarray(NetPackageHead.LENGTH, this.head.dataLen);
		return data.subarray(this.head.dataLen, data.length);
	}
}