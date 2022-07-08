/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
export declare const nextTime: ((callback: IdleRequestCallback, options?: IdleRequestOptions | undefined) => number) & typeof requestIdleCallback;
export declare function getPageURL(): string;
export declare function onAfterLoad(callback: () => any): void;
export declare const getErrorUid: (input: string) => string;
