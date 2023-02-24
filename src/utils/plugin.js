/*
 * @Author: your name
 * @Date: 2021-07-08 17:35:32
 * @LastEditTime: 2021-07-15 17:58:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \functionLibrary\plugins.js
 */
//https://github.com/kujian/30-seconds-of-code#cleanobj
const utils = {
    //返回数组中的最大值。
    // arrayMax([10, 1, 5]) -> 10
    arrayMax(arr) {
        return Math.max(...arr)
    },
    //返回数组中的最小值。
    // arrayMin([10, 1, 5]) -> 1
    arrayMin(arr) {
        return Math.min(...arr)
    },
    //将数组块划分为指定大小的较小数组。使用Array.from()创建新的数组, 这符合将生成的区块数。使用Array.slice()将新数组的每个元素映射到size长度的区块。如果原始数组不能均匀拆分, 则最终的块将包含剩余的元素。
    // chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
    chunk(arr, size) {
        return Array.from({
            length: Math.ceil(arr.length / size)
        }, (v, i) => arr.slice(i * size, i * size + size));
    },
    //返回两个数组之间的差异。从b创建Set, 然后使用Array.filter() on 只保留a b中不包含的值.
    // difference([1,2,3], [1,2,4]) -> [3]
    difference(a, b) {
        const s = new Set(b);
        return a.filter(x => !s.has(x));
    },
    //将数组向上拼合到指定深度。使用递归, 递减depth, 每层深度为1。使用Array.reduce()和Array.concat()来合并元素或数组。基本情况下, 对于等于1的depth停止递归。省略第二个元素,depth仅拼合到1的深度 (单个拼合)。
    // flattenDepth([1,[2],[[[3],4],5]], 2) -> [1,2,[3],4,5]
    //等同于es6的flat方法
    flattenDepth(arr, depth = 1) {
        depth != 1 ? arr.reduce((a, v) => a.concat(Array.isArray(v) ? flattenDepth(v, depth - 1) : v), []) :
            arr.reduce((a, v) => a.concat(v), [])
    },

    //根据给定函数对数组元素进行分组。使用Array.map()将数组的值映射到函数或属性名。使用Array.reduce()创建一个对象, 其中的键是从映射的结果生成的。
    // groupBy([6.1, 4.2, 6.3], Math.floor) -> {4: [4.2], 6: [6.1, 6.3]}
    // groupBy(['one', 'two', 'three'], 'length') -> {3: ['one', 'two'], 5: ['three']}
    groupBy(arr, func) {
        return arr.map(typeof func === 'function' ? func : val => val[func])
            .reduce((acc, val, i) => {
                acc[val] = (acc[val] || []).concat(arr[i]);
                return acc;
            }, {})
    },
    //经度验证
    validateLongitude: (value) => {
        //经度,整数部分为0-180小数部分为0到15位
        let longreg = /^[-+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,15})?|180\.0{1,10})$/
        if (!longreg.test(value)) {
            return false
        } else {
            return true
        }
    },
    //纬度验证
    validateLatitude: (value) => {
        //纬度,整数部分为0-90小数部分为0到15位
        let latreg = /^[-+]?((0|([1-8]\d?))(\.\d{1,15})?|90(\.0{1,10})?)$/
        if (!latreg.test(value)) {
            return false
        } else {
            return true
        }
    },
    //高德火星坐标系GCJ02转地球坐标系WGS84：
    transformGCJtoWGS(gcjLat, gcjLon) {
        let PI = 3.14159265358979324;
        let delta = function delta(lat, lon) {
            let a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
            let ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
            let dLat = transformLat(lon - 105.0, lat - 35.0)
            let dLon = transformLon(lon - 105.0, lat - 35.0)
            let radLat = lat / 180.0 * PI
            let magic = Math.sin(radLat)
            magic = 1 - ee * magic * magic
            let sqrtMagic = Math.sqrt(magic)
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
            return {
                'lat': dLat,
                'lon': dLon
            }
        }
        let transformLat = function transformLat(x, y) {
            let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
            ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
            ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
            ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
            return ret
        }
        let transformLon = function transformLon(x, y) {
            let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
            ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
            ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
            ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
            return ret
        }
        let d = delta(gcjLat, gcjLon)
        return {
            'lat': gcjLat - d.lat,
            'lon': gcjLon - d.lon
        }

    },
    //地球坐标系转火星坐标系
    transformWGStoGCJ(wgLat, wgLon) {
        let transformLat = function transformLat(x, y) {
            let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
            return ret;
        }
        let transformLon = function transformLon(x, y) {
            let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
            return ret;
        }
        let pi = 3.14159265358979324;
        let a = 6378245.0;
        let ee = 0.00669342162296594323;
        let mars_point = {
            lon: 0,
            lat: 0
        };
        let dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
        let dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
        let radLat = wgLat / 180.0 * pi;
        let magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        let sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        mars_point.lat = wgLat + dLat;
        mars_point.lon = wgLon + dLon;
        return mars_point
    },
    //生成一个唯一ID
    createUuid() {
        function uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    },
}
export default {
    install: (Vue) => {
        //将方法集添加到Vue实例上面去
        Vue.prototype.$utils = utils;
    },
};
export {
    utils
}