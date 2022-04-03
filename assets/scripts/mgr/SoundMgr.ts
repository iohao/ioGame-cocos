import { _decorator, Component, Node, ICollisionEvent, RigidBody, Collider, ITriggerEvent, Collider2D, PhysicsSystem, Contact2DType, IPhysics2DContact, sys, AudioSource, director, game, CCObject, AudioClip } from 'cc';
import AssetUtils from '../utils/AssetUtils';
import LogUtils from '../utils/LogUtils';
const { ccclass, property } = _decorator;

@ccclass
export default class SoundMgr extends Component {

  private static _ins: SoundMgr = null;

  public static get ins(): SoundMgr {
    return this._ins;
  }

  /**背景音乐 */
  private MUSIC_AS: AudioSource = null;

  /**音效 */
  private SOUND_AS: AudioSource = null;

  /**音乐音量大小 */
  private MUSIC_VOLUME: number = 1;

  /**音效音量大小 */
  private SOUND_VOLUME: number = 1;

  onLoad() {
    if (!SoundMgr._ins) {
      SoundMgr._ins = this;
      this._init();
      game.addPersistRootNode(this.node);
    }
  }

  _init() {
    //初始化音乐音效节点
    let node_music = new Node("MUSIC_NODE");
    node_music.parent = this.node;
    this.MUSIC_AS = node_music.addComponent(AudioSource);
    this.MUSIC_AS.volume = this.MUSIC_VOLUME;

    let node_sound = new Node("SOUND_NODE");
    node_sound.parent = this.node;
    this.SOUND_AS = node_sound.addComponent(AudioSource);
    this.SOUND_AS.volume = this.SOUND_VOLUME;
  }

  /**播放背景音乐 */
  async playMusic(music: string, isLoop: boolean = true) {
    let clip: AudioClip = await AssetUtils.loadResSync(music, AudioClip);
    if (clip) {
      let music_as: AudioSource = this.MUSIC_AS;
      music_as.clip = clip;
      music_as.loop = isLoop;
      music_as.play();
    } else {
      LogUtils.error("加载资源失败", music);
    }
  }

  /**播放音效 */
  async playSound(sound: string) {
    let clip: AudioClip = await AssetUtils.loadResSync(sound, AudioClip);
    if (clip) {
      let music_as: AudioSource = this.SOUND_AS;
      music_as.clip = clip;
      music_as.play();
    } else {
      LogUtils.error("加载资源失败", sound);
    }
  }

  /**播放按钮音效 */
  async playButtonSound(sound: string = "audio/click") {
    let clip: AudioClip = await AssetUtils.loadResSync(sound, AudioClip);
    if (clip) {
      let music_as: AudioSource = this.SOUND_AS;
      music_as.clip = clip;
      music_as.play();
    } else {
      LogUtils.error("加载资源失败", sound);
    }
  }

  /**设置音乐音量 */
  setMusicVolume(volume: number = 1) {
    this.MUSIC_VOLUME = volume;
    this.MUSIC_AS.volume = volume;
  }

  /**设置音效音量 */
  setSoundVolume(volume: number = 1) {
    this.SOUND_VOLUME = volume;
    this.SOUND_AS.volume = volume;
  }

  /**停止播放背景音乐 */
  stopMusic() {
    this.MUSIC_AS.stop();
  }

  /**暂停播放背景音乐 */
  pauseMusic() {
    this.MUSIC_AS.pause();
  }

}
