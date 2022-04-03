import { _decorator, Component, Node, Asset, Prefab, Label, instantiate, director, EventTouch, Event, Vec2, Vec3, Director, PhysicsSystem, url, resources, loader, AssetManager, assetManager, Sprite, SpriteFrame, ImageAsset, Texture2D, SceneAsset, AudioSource, AudioClip, UITransform } from 'cc';
import SoundMgr from '../mgr/SoundMgr';
import SocketClient from '../net/socket/SocketClient';
import AssetUtils from '../utils/AssetUtils';
import BundleUtils from '../utils/BundleUtils';
import CocosUtils from '../utils/CocosUtils';
import LogUtils from '../utils/LogUtils';
import SceneUtils from '../utils/SceneUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Main
 * DateTime = Sat Nov 13 2021 19:16:13 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = main.ts
 * FileBasenameNoExtension = main
 * URL = db://assets/script/scene/main.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('MainScene')
export class MainScene extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    board: Node = null;

    @property(Prefab)
    brick: Prefab = null;

    @property(SpriteFrame)
    spf: SpriteFrame = null;

    @property(AudioClip)
    music_bg: AudioClip = null;

    start() {
        this._init();
    }

    async _init() {
        // let node: Node = new Node("bgMusic");
        // node.addComponent(AudioSource);
        // node.parent = this.node;
        // let audioSource: AudioSource = node.getComponent(AudioSource);
        // audioSource.clip = this.music_bg;
        // audioSource.loop = true;
        // audioSource.volume = 1;
        // audioSource.play();
    }




    async onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);


        // LogUtils.log(this.getComponent(UITransform));
        // director.getCollisionManager().enabled = true;
        // director.getPhysicsManager().enabled = true;

        // let ddz = await BundleUtils.loadBundle("ddz");
        // console.log(ddz)
        // let bundle = await CocosUtils.getBundle("ddz")
        // bundle.load("prefabs/brick", Prefab, () => { }, (err, asset: any) => {
        //     console.log(asset)
        // })
        // let res = await BundleUtils.loadBundleSync(ddz, "images/appicon", ImageAsset);
        // let res = await BundleUtils.loadBundleSync(ddz, "prefabs/brick", Prefab);
        // let sprite: Sprite = this.node.getChildByName("Sprite").getComponent(Sprite);
        // let res = await CocosUtils.loadRemotePic("http://127.0.0.1:9999/appicon.png");
        // let texture = new Texture2D();
        // texture.image = res;
        // let spf = new SpriteFrame();
        // spf.texture = texture
        // sprite.spriteFrame = spf;
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    touchStart() {
        // SoundMgr.ins.playSound("audio/click")
    }

    touchMove(e: EventTouch) {
        let delta: Vec2 = e.getDelta()
        let pos = this.board.getPosition();
        let x = pos.x + delta.x * 2;
        let y = pos.y;
        this.board.setPosition(new Vec3(x, y, 0));
    }

    touchEnd() {

    }

    async onClickLoadDDZ() {
        // let ddz = await BundleUtils.loadBundle("http://127.0.0.1:9999/ddz");
        let ddz = await BundleUtils.loadBundle("ddz");
        let scene: SceneAsset = await BundleUtils.loadBundleScene(ddz, "scene/ddzGame");
        scene && SceneUtils.loadScene(scene.name);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
