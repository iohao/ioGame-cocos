export default class EventMgr {
    private static _ins: EventMgr;
    public static get ins(): EventMgr {
        return this._ins == null ? this._ins = new EventMgr() : this._ins;
    }

    private m_events: Array<any> = new Array();
    //brief 注册事件
    // @param id 事件id
    // @param handle 处理函数
    public reg(id: string, handle: Function, target: any) {
        var ev = this._checkId(id, false);
        ev.handles.push({ "target": target, "handle": handle });
    }


    //brief 注销事件
    // @param id 事件id
    // param handle 处理函数
    public unreg(id: string, handle: Function, target: any) {
        if (!(id && handle && target && this.m_events[id])) {
            return;
        }
        var handles = this.m_events[id].handles;
        for (var i = 0; i < handles.length; ++i) {
            if (handles[i].target == target && handles[i].handle == handle) {
                handles.splice(i, 1);
                break;
            }
        }
    }

    //@brief post an event
    // @param id 事件id
    // @param arg 事件参数，类型不限
    public post(id: string, arg = null) {
        //注意table.insert插入的值不能为null
        if (arg == null) { arg = []; };

        if (this.m_events[id] == null) {
            this._checkId(id, false);
        }
        this.m_events[id].params.push(arg);
        var handles = this.m_events[id].handles;
        var params = this.m_events[id].params;

        if (this.m_events[id].once) {
            this.m_events[id].handles = [];
        }
        this.m_events[id].params = [];

        for (var i = 0; i < params.length; ++i) {
            var param = params[i];
            // var tmpHandles = cc.clone(handles);
            for (var j = 0; j < handles.length; ++j) {
                var target = handles[j].target;
                var handle = handles[j].handle;
                handle.call(target, this.m_events[id], param);
            }
        }
    }

    //内部函数
    private _newEvent(_id, _once) {
        return {
            id: _id,
            params: [],
            handles: [],
            once: _once,
            name: null,
            delay: false
        }
    }

    public _checkId(id, once) {
        if (once == null) { once = false; }

        if (this.m_events[id] == null) {
            this.m_events[id] = this._newEvent(id, once);
        }
        else {
            if (this.m_events[id].once != once) {
                this.m_events[id].once = once;
            }
        }
        return this.m_events[id];
    }

}