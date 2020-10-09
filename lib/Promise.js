/*
    自定义Promise函数模块:IIFE
*/
(function (window) {
    // Promise构造函数
    // excutor执行器函数
    function Promise(excutor) {
        function resolve(value) {}
        function reject(reason) {}
        //  立即同步执行excutor
        excutor(resolve, reject);
    }
    /* 
        Promise原型对象then方法
        指定成功和失败的回调函数，
        返回一个新的Promise对象
    */
    Promise.prototype.then = function (onResolved, onRejected) {};

    /* 
        Promise原型对象catch方法
        指定失败的回调函数，
        返回一个新的Promise对象
    */
    Promise.prototype.catch = function (onRejected) {};

    /* 
        Promise函数对象的方法resolve
        返回一个指定结果value的成功的promise
    */
    Promise.resolve = function (value) {};

    /* 
        Promise函数对象的方法reject
        返回一个指定结果reason的失败的promise
    */
    Promise.reject = function (reason) {};

    /* 
        Promise函数对象的方法all
        返回一个promise，只有当所有promises都成功时才成功，否则失败
    */
    Promise.all = function (promises) {};

    /* 
        Promise函数对象的方法race
        器结果由第一个完成的promise决定
    */
    Promise.race = function (promises) {};

    // 向外暴漏Promise函数
    window.Promise = Promise;
})(window);
