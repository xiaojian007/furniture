
/**
 * 注册常量
 */
//七牛下载URL
import baseURL from "@config/config.api";
const QINIU_DOWNLOAD = "//cloud.pdp.ininin.com/";
const downloadUrl = '//wg.cloud.ininin.com/'

/**
 * 常量
 */
const constants = {
    //普通弹窗是否可以通过点击 modal 关闭 Dialog
    DIALOG_MODAL_CLOSE: false,
    //普通弹窗是否可以通过按下 ESC 关闭 Dialog
    DIALOG_ESC_CLOSE: false,
    //确认弹窗是否可以通过点击 modal 关闭 Dialog
    CONFIRM_MODAL_CLOSE: false,
    //确认弹窗是否可以通过按下 ESC 关闭 Dialog
    CONFIRM_ESC_CLOSE: false,
    //七牛上传URL
    QINIU_UP: baseURL + 'upload/image',
    QINIU_DOWNLOAD: QINIU_DOWNLOAD,
    //供应商导入模板
    EXCEL_IMPORT_SUPPLIER: downloadUrl + '9ad6024d4c81c9db93234aa8e2708dd6.xlsx',
    //默认图片优化尺寸
    THUMBNAIL: '?imageMogr2/auto-orient/thumbnail/200x100',
    THUMBNAIL_CROP: '?imageMogr2/thumbnail/!100x100r/auto-orient/gravity/Center/crop/100x100',
    //分页数量
    PAGE_SIZES: [10, 20, 30, 40],
    //分页布局
    PAGE_LAYOUT: 'total, sizes, prev, pager, next, jumper',
    //资源不存在，提示信息
    MSG_NON_EXISTENT: '您访问的资源不存在，请稍后再试！',
    //没有网络，提示信息
    MSG_NOT_NETWORK: '您的网络不稳定，请稍后再试！',
    //请求超时，提示信息
    MSG_TIMEOUT: '网络超时，请稍后再试！',
    //未知错误，提示信息
    MSG_UNKNOWN: '网络繁忙，请稍后再试！',
    //分页按钮文字
    NEXT_PAGE: '下一页',
    //分页按钮文字
    PREVIOUS_PAGE: '上一页'
}

/**
 * 在对象上设置常量
 * @param {Object} obj 对象
 * @param {String} key 常量名
 * @param {String|Array|Number} value 常量值
 */
const setConstant = (obj, key, value) => {
    if (typeof Object.defineProperty === 'function') {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true, //能在for-in循环中遍历出来或在Object.keys中列举出来
            configurable: false, //该属性描述符不能被改变，也不能被删除
            writable: false //不能被赋值运算符改变
        })
    } else {
        obj[key] = value
    }
}
export default {
    install(Vue) {
        Object.keys(constants).forEach((key) => {
            setConstant(Vue.prototype, key, constants[key])
        })
    }
}
