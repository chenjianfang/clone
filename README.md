### Usage
需要在ES6 babel/polyfill环境下运行。抛出两个函数，分别为cloneDeep和clone。支持复制的类型：[Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Map', 'Number', 'Object', 'RegExp', 'Set', 'String', 'Symbol'];
```
	// @example
	import { cloneDeep, clone } from './deepClone';
	const deepBackup = cloneDeep({ a, 1: b: 2 }, true); // 深度复制
	const cloneBackup = clone({ a, 1: b: 2 }, true); // 浅复制
```
### Test
 <a href="" target="_blank">test demo</a>

### Tips
 暂不支持复制buffer类型数据