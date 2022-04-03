
import { _decorator, Component, Node, ICollisionEvent, RigidBody, Collider, ITriggerEvent, Collider2D, PhysicsSystem, Contact2DType, IPhysics2DContact, sys } from 'cc';
import LogUtils from '../utils/LogUtils';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Ball
 * DateTime = Sun Nov 14 2021 13:31:36 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = Ball.ts
 * FileBasenameNoExtension = Ball
 * URL = db://assets/script/scene/Ball.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Ball')
export class Ball extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad() {
        let collider: Collider2D = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    private onCollisionEnter(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        LogUtils.log(self, other);
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
