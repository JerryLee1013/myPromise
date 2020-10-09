/*
    自定义Promise函数模块:IIFE
*/
(function (window) {
    const PENDING = "pending";
    const RESOLVED = "resolved";
    const REJECTED = "rejected";
    // Promise构造函数
    // excutor执行器函数
    function Promise(excutor) {
        this.status = PENDING; //  给promise对象执行status属性，初始值为pending
        this.data = undefined; //  给promise对象指定一个用于村塾结果数据的属性
        this.callbacks = []; //  每个元素的结构:{onResolved(){}, onRejected(){}}

        resolve = (value) => {
            // 如果当前状态不是pending，直接结束
            if (this.status !== PENDING) {
                return;
            }
            // 将状态改为resolved
            this.status = RESOLVED;
            //保存value数据
            this.data = value;
            //如果有待执行的回调函数，立即异步执行回调onResolved
            if (this.callbacks.length > 0) {
                //  模拟执行异步操作，将onResolved(value)放入回调队列
                setTimeout(() => {
                    this.callbacks.forEach((callbacksObj) => {
                        callbacksObj.onResolved(value);
                    });
                });
            }
        };
        reject = (reason) => {
            // 如果当前状态不是pending，直接结束
            if (this.status !== PENDING) {
                return;
            }
            // 将状态改为rejected
            this.status = REJECTED;
            //保存value数据
            this.data = reason;
            //如果有待执行的回调函数，立即异步执行回调onRejected
            if (this.callbacks.length > 0) {
                setTimeout(() => {
                    this.callbacks.forEach((callbacksObj) => {
                        callbacksObj.onRejected(reason);
                    });
                });
            }
        };

        try {
            //  立即同步执行excutor
            excutor(resolve, reject);
        } catch (error) {
            //  如果抛出异常
            reject(error);
        }
    }
    /* 
        Promise原型对象then方法
        指定成功和失败的回调函数，
        返回一个新的Promise对象
    */
    Promise.prototype.then = function (onResolved, onRejected) {
        onResolved =
            typeof onResolved === "function" ? onResolved : (value) => value;
        // 指定默认失败的回调，实现错误，异常传透的关键
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (reason) => {
                      throw reason;
                  };
        const self = this;
        return new Promise((resolve, reject) => {
            function handle(callback) {
                try {
                    const result = callback(self.data);
                    if (result instanceof Promise) {
                        // 3.如果函数返回时promise，return的promise就是这个promise的结果
                        result.then(resolve, reject);
                    } else {
                        // 2.如果回调函数返回不是promise，return的promise就会成功，value就是返回值
                        resolve(result);
                    }
                } catch (error) {
                    // 1.如果抛出异常，return的promise就会失败，reason就额是error
                    reject(error);
                }
            }

            if (self.status === PENDING) {
                // 将回调函数保存起来
                self.callbacks.push({
                    onResolved(value) {
                        handle(onResolved);
                    },
                    onRejected(reason) {
                        handle(onRejected);
                    },
                });
            } else if (self.status === RESOLVED) {
                setTimeout(() => {
                    handle(onResolved);
                });
            } else {
                setTimeout(() => {
                    handle(onRejected);
                });
            }
        });
    };

    /* 
        Promise原型对象catch方法
        指定失败的回调函数，
        返回一个新的Promise对象
    */
    Promise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    /* 
        Promise函数对象的方法resolve
        返回一个指定结果value的成功的promise
    */
    Promise.resolve = function (value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(resolve, reject);
            } else {
                resolve(value);
            }
        });
    };

    /* 
        Promise函数对象的方法reject
        返回一个指定结果reason的失败的promise
    */
    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    };

    /* 
        Promise函数对象的方法all
        返回一个promise，只有当所有promises都成功时才成功，否则失败
    */
    Promise.all = function (promises) {
        const values = new Array(promises.length); // 用来保存所有成功value的数组
        let count = 0;
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(
                    (value) => {
                        count++;
                        values[index] = value;
                        //  如果全部成功，将return的promise改为成功
                        if (count === promises.length) {
                            resolve(values);
                        }
                    },
                    (reason) => {
                        reject(reason);
                    }
                );
            });
        });
    };

    /* 
        Promise函数对象的方法race
        器结果由第一个完成的promise决定
    */
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(
                    (value) => {
                        resolve(value);
                    },
                    (reason) => {
                        reject(reason);
                    }
                );
            });
        });
    };

    /*
        返回一个Promise对象，它再指定的事件后才确定结果
    */
    Promise.resolveDelay = function (value, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value instanceof Promise) {
                    value.then(resolve, reject);
                } else {
                    resolve(value);
                }
            }, time);
        });
    };

    /*
        返回一个Promise对象，它再指定的事件后才失败
    */
    Promise.rejectDelay = function (reason, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(reason);
            }, time);
        });
    };

    // 向外暴漏Promise函数
    window.Promise = Promise;
})(window);
