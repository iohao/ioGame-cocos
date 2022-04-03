import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("PoolMgr")
export class PoolMgr extends Component {
    public static handle = new Map<string, Node[]>()

    public static getNode(prefab: Prefab, parent: Node = null) {
        const name = prefab.data.name
        //log(`当前预制体名称：${name}`)
        let node: Node = null
        if (this.handle.has(name) && this.handle.get(name).length) {
            node = this.handle.get(name).pop()
            //log(`当前预制体${name}从对象池获取`)
        } else {
            node = instantiate(prefab) as Node
        }
        parent && (node.parent = parent)
        node.active = true
        return node
    }

    public static setNode(target: Node) {
        if (!target) {
            //log('target has been recycled .......')
            return
        }

        target.active = false;
        if (target.parent) {
            target.removeFromParent();
        }
        target.active = true

        const name = target.name
        if (this.handle.has(name)) {
            this.handle.get(name).push(target)
        } else {
            this.handle.set(name, [target])
        }
    }

    public static clearNode(name: string) {
        //log(`当前预制体${name}从对象次清除`)
        if (this.handle.has(name)) this.handle.delete(name)
    }

    /**清楚对象池全部对象 */
    public static clear() {
        this.handle.clear()
    }
}
