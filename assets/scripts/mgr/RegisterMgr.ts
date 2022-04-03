import CmdData, { HallCmdData, LoginVerifyCmd, LoginVerifySubCmd } from "../net/cmd/CmdData";
import LoginVerifyHandler from "../net/handler/LoginVerifyHandler";
import HandleMgr from "./HandleMgr";

export default class RegisterMgr {

  private static _ins: RegisterMgr;

  public static get ins(): RegisterMgr {
    if (!this._ins) this._ins = new RegisterMgr();
    return this._ins;
  }

  //注册协议
  public registCmd(): void {
    HandleMgr.addHandler(LoginVerifyCmd, LoginVerifySubCmd, new LoginVerifyHandler())
  }

}
