/** 深拷贝、浅拷贝，支持的类型如下：
 * ['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Map', 'Number', 'Object', 'RegExp', 'Set', 'String', 'Symbol']
 * @type {string}
 */
const argsTag = 'Arguments';
const functionTag = 'Function';
const arrayTag = 'Array';
const boolTag = 'Boolean';
const dateTag = 'Date';
const mapTag = 'Map';
const numberTag = 'Number';
const objectTag = 'Object';
const regexpTag = 'RegExp';
const setTag = 'Set';
const stringTag = 'String';
const symbolTag = 'Symbol';

class BaseUtil {
    // 判断value是否符合深拷贝的类型
    static isObject(value) {
        const type = typeof value;
        return value !== null && (type === 'object' || type === 'function');
    }

    // 获取值类型
    static getTag(value) {
        return Object.prototype.toString.call(value).slice(8, -1);
    }

    // 数组浅复制
    static copyArray(value) {
        return value.map(item => item);
    }

    // 对象浅复制
    static copyObject(value) {
        return Object.assign({}, value);
    }

    // 正则复制
    static cloneRegExp(regexp) {
        const reFlags = /\w*$/;
        const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
    }

    // Symbol复制  可以改为和Number复制一样，因为symbol是一种基本数据类型
    static cloneSymbol(symbol) {
        return Object(Symbol.prototype.valueOf.call(symbol));
    }

    // 其他类型拷贝初始值
    static initCloneByTag(object, tag) {
        const Ctor = object.constructor;
        switch (tag) {
            case boolTag:
            case dateTag:
                return new Ctor(+object);
            case mapTag:
                return new Ctor();

            case numberTag:
            case stringTag:
                return new Ctor(object);

            case regexpTag:
                return BaseUtil.cloneRegExp(object);

            case setTag:
                return new Ctor();

            case symbolTag:
                return BaseUtil.cloneSymbol(object);
            default:
                // no default
        }
    }
}
class Clone extends BaseUtil {
    copy(value, isDeep) {
        let result;
        const tag = BaseUtil.getTag(value);
        const isArr = arrayTag === tag;


        if (!BaseUtil.isObject(value)) return value;

        if (isArr) {
            // 数组类型
            result = new Array(value.length);
            if (!isDeep) {
                // 数组浅复制
                return BaseUtil.copyArray(value);
            }
        } else if ([objectTag, argsTag].includes(tag)) {
            // Arguments当对象处理
            result = {};
            if (!isDeep) {
                return BaseUtil.copyObject(value);
            }
        } else if (tag === functionTag) {
            return value; // lodash对于函数的复制是直接返回空对象。函数本来就是一个功能，为啥要复制！所以这里直接返回。
        } else {
            result = BaseUtil.initCloneByTag(value, tag);
        }

        if (tag === mapTag) {
            value.forEach((subValue, key) => {
                result.set(key, this.copy(subValue, isDeep));
            });
            return result;
        }
        if (tag === setTag) {
            value.forEach((subValue) => {
                result.add(this.copy(subValue, isDeep));
            });
            return result;
        }
        const props = isArr ? value : Object.keys(Object(value));
        props.forEach((key, index) => {
            if (isArr) {
                result[index] = this.copy(key, isDeep);
            } else {
                result[key] = this.copy(value[key], isDeep);
            }
        });
        return result;
    }
}
let cloneEntity;

// 深拷贝
function cloneDeep(value) {
    if (!cloneEntity) cloneEntity = new Clone();
    return cloneEntity.copy(value, true);
}
// 浅拷贝
function clone(value) {
    if (!cloneEntity) cloneEntity = new Clone();
    return cloneEntity.copy(value, false);
}

/* 深拷贝 */
const obj = { a: 2, b: 3 };
const arr = [2, 3, 4, 5];
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
const bool = false;
const num = 33;

const complexObj = {
    a: 2,
    b: 3,
    obj: {
        d: 'dd',
        e: [5, 6, 7]
    }
};

const obj1 = cloneDeep(obj, true);
const arr1 = cloneDeep(arr, true);
const map1 = cloneDeep(map, true);
const bool1 = cloneDeep(bool, true);
const num1 = cloneDeep(num, true);
const complexObj1 = cloneDeep(complexObj, true);
console.log(obj1);
console.log(arr1);
console.log(map1);
console.log(bool1);
console.log(num1);
complexObj1.obj.e.push('dfaf');
console.log(complexObj);
console.log(complexObj1);

/* 浅拷贝 */

const obj2 = clone(obj, true);
const arr2 = clone(arr, true);
const map2 = clone(map, true);
const bool2 = clone(bool, true);
const num2 = clone(num, true);
const complexObj2 = clone(complexObj, true);
console.log(obj2);
console.log(arr2);
console.log(map2);
console.log(bool2);
console.log(num2);
complexObj2.obj.e.push('dfaf');
console.log(complexObj);
console.log(complexObj2);
