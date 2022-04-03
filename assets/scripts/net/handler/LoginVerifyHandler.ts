// import { PROTO_CESHI } from "../protocol/proto";
import LogUtils from "../../utils/LogUtils";
import { decodeLoginVerify } from "../protocol/LoginVerify";
import IHandler from "./IHandler";

export default class LoginVerifyHandler implements IHandler {
    execute(data: Uint8Array) {
        let r_msg = decodeLoginVerify(data);
        LogUtils.log("LoginVerifyHandler", r_msg);
    }
}
