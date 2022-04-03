export default class CmdMgr {

  //获取cmd
  public static getCmd(merge: number): number {
    return merge >> 16;
  }

  //获取subCmd
  public static getSubCmd(merge: number): number {
    return merge & 0xFFFF;
  }

  //获取mergeCmd
  public static getMergeCmd(cmd: number, subCmd: number) {
    return (cmd << 16) + subCmd;
  }

}
