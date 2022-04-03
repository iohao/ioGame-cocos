
import { _decorator, Component, Node, sys, Vec2 } from 'cc';
import MYMD5 from './MYMD5';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CommonUtils
 * DateTime = Sat Nov 13 2021 19:20:59 GMT+0800 (中国标准时间)
 * Author = 孟凡雷
 * FileBasename = CommonUtils.ts
 * FileBasenameNoExtension = CommonUtils
 * URL = db://assets/script/utils/CommonUtils.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

export default class CommonUtils {
    /**等待时间 调用函数前要加await*/
    public static sleepSync(time: number): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, time * 1000);
        })
    }

    /**复制到剪切板 */
    public static pcopyClipBoard(str: string) {
        //console.log('str')
        if (sys.isBrowser) {
            let textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea["select"]();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                document.body.removeChild(textArea);
            } catch (err) {
                document.body.removeChild(textArea);
            }
        }
    }

    /**
     * 获取随机整数 getRandomInt(3,6)返回3~6之间的任意整数
     * @param start 起始值
     * @param end 终止值
     * @returns 随机整数
     */
    public static randomInt(start: number, end: number) {
        return (Math.round(Math.random() * (end - start)) + start);
    }

    /**
     * 获取一个伪随机整数
     * @param seed 随机种子
     * @param key key
     */
    public static pseudoRandomInt(seed: number, key: number): number {
        return Math.ceil((((seed * 9301 + 49297) % 233280) / 233280) * key);
    }

    /**
     * 随机取数组的某个元素
     * @param _arr 
     */
    public static randomFromArray(_arr: any[] = []) {
        return _arr.length ? _arr[Math.floor(Math.random() * _arr.length)] : null
    }

    /**
     * 获取字符串长度，中文、大写字母占2， 其他占1 (Egret中文英文字符都是占1)
     * @param str 字符串
     * @return 长度
     */
    public static randomStr(len: number = 0, str: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678"): string {
        let randomStr = "";
        for (var i = 0; i < len; i++) {
            let index = Math.floor(Math.random() * len);
            randomStr += str[index];
        }
        return randomStr;
    }

    /**
     * &符号连接起来的参数字符串转换为 {key: value}
     * @param params eg: a=1&b=2
     * @returns 
     */
    public static paramsToJson(params: any = ''): any {
        var _result = {}, _pairs, _pair, _query, _key, _value;

        if (typeof (params) === 'object') { return params; }

        _query = params || window.location.search;
        _query = _query.replace(/['"<>;?]/g, '');
        _pairs = _query.split('&');

        _pairs.forEach((keyVal) => {
            _pair = keyVal.split('=');
            _key = _pair[0];
            _value = _pair.slice(1).join('=');
            _result[decodeURIComponent(_key)] = decodeURIComponent(_value);
        });

        return _result;
    }

    /**
     * 转换为 &连接的参数字符串
     * @param json eg: {key: value}
     * @param decodeUri 
     * @returns 
     */
    public static objectToParams(json: any, decodeUri?: boolean): string {
        var param = '';
        for (var o in json) {
            if (o) {
                var v = typeof (json[o]) === 'object' ? JSON.stringify(json[o]) : json[o];
                if (!param) param += o + '=' + v;
                else param += '&' + o + '=' + v;
            }
        }

        if (decodeUri) {
            param = decodeURIComponent(param);
        }
        return param;
    }

    /**判断字符串是否为JSON */
    public static isJsonString(str: string): boolean {
        let flag = false
        try {
            let o = JSON.parse(str)
            flag = typeof (o) === 'object'
        } catch (e) {
        }
        return flag
    }

    /** 时间戳(Timestamp) 转 时间 (Date) */
    public static dateYYYYMMDD(timestamp: number | string) {
        var now = timestamp ? new Date(timestamp) : new Date(),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    }

    /**
     * 获取两点间的角度
     * @param p1 点1
     * @param p2 点2
     */
    public static getAngle(p1: Vec2, p2: Vec2): number {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
    }

    /**
     * 获取两点间的距离
     * @param p1 点1
     * @param p2 点2
     */
    public static getDistance(p1: Vec2, p2: Vec2): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    /**
     * 将角度转为弧度
     * @param angle 角度
     */
    public static angleToRadian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * ’{0}xxxxxxx{1}...‘ 类似的这种模板字符串的占位内容的动态替换
     * @param params 
     * @returns 
     */
    public static format(...params: any) {
        for (var a = arguments[0], b = 1; b < arguments.length; b++) a = a.replace(RegExp("\\{" + (b - 1) + "\\}", "ig"), arguments[b]);
        return a
    }

    /**
     * 对象数组 以某个属性为维度进行比较
     * @param property 比较的属性
     * @param desc 是否升序
     * @returns 
     */
    public static compare(property: string, desc: boolean) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc) {
                // 升序排列
                return value1 - value2;
            } else {
                // 降序排列
                return value2 - value1;
            }
        }
    }

    /**
     * 版本比较
     * @param versionA 1.0.2
     * @param versionB 1.0.21
     * @returns 
     */
    public static versionCompare(versionA: string, versionB: string) {
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        //长度相等时
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || '0');
            if (a !== b) {
                return a - b;
            }
        }
        //目前暂时游戏未采用长度不等的方式
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }

    // 选择本地文件，以下callback为函数回调参数
    public static openLocalFile(callback: (file: File) => void) {
        let inputEl: HTMLInputElement = <HTMLInputElement>document.getElementById('file_input');// 类型转行 HTMLInputElement ，方便下面的 inputEl.files 调用
        if (!inputEl) {
            // 只创建一次
            console.log('xxxxxx createElement input');
            inputEl = document.createElement('input');
            inputEl.id = 'file_input';
            inputEl.setAttribute('id', 'file_input');
            inputEl.setAttribute('type', 'file');
            inputEl.setAttribute('class', 'fileToUpload');
            inputEl.style.opacity = '0';// 不可见
            inputEl.style.position = 'absolute';
            document.body.appendChild(inputEl);
        }
        // 这个和 inputEl.onchange 的效果是一样的，2选1就可以了
        // inputEl.addEventListener('change', (event) => {
        //    console.log('xxx onchange1', event, inputEl.value);
        // });
        inputEl.onchange = (event) => {
            // console.log('xxx onchange2', event, inputEl.files);
            let files = inputEl.files;// 我在Mac上测试，每次只能选一个文件
            if (files && files.length > 0) {
                var file = files[0];
                if (callback) callback(file);
            }
        }
        inputEl.click();// 模拟点击，触发文件选择弹出框，据说有的浏览器不支持，chrome是没问题的
    }


    // 读取文件为base64数据流
    public static readFile(file: File, callback: (base64: string) => void) {
        var reader = new FileReader();
        reader.onload = function (event2) {
            if (callback) {
                if (reader.readyState == FileReader.DONE) {
                    // console.log('xxx FileReader', event2, reader.result);
                    callback(reader.result.toString());
                } else {
                    console.error('FileReader read error', event2, reader.result);
                    callback(null);
                }
            }
        };
        // reader.readAsText(file);//作为字符串读出
        reader.readAsDataURL(file);
        //reader.readAsText(file,'gb2312');//默认是用utf-8格式输出的，想指定输出格式就再添加一个参数，像txt的ANSI格式只能用国标才能显示出来
    }
    // 
}

