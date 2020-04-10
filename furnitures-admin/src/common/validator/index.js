/**
 * 表单常用验证函数
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 表单常用验证函数
 * @copyright ininin.com
 */

import { REGULARS } from "@common/constant";
import vIdCard from "./valid-id-card";
import vPositiveInteger from "./valid-positive-integer";
import vPositiveRealNumber from "./valid-positive-real-number";

/**
 * 验证整数
 * @param {Object} opts
 * @returns {void}
 */
export function positiveInteger(opts) {
    return (rule, value, callback) => {
        opts.value = value;
        opts.required = rule.required;
        let msg = vPositiveInteger(opts);
        if (value === "" && !opts.required) {
            callback();
        } else if (msg) {
            callback(new Error(msg));
        } else {
            callback();
        }
    };
}

/**
 * 验证浮点数
 * @param {Object} opts
 * @returns {void}
 */
export function positiveRealNumber(opts) {
    return (rule, value, callback) => {
        opts.value = value;
        opts.required = rule.required;
        let msg = vPositiveRealNumber(opts);
        if (value === "" && !opts.required) {
            callback();
        } else if (msg) {
            callback(new Error(msg));
        } else {
            callback();
        }
    };
}

/**
 * 验证身份证
 * @param {Object} opts
 * @returns {void}
 */
export function validIdCard(opts = { required: false }) {
    return (rule, value, callback) => {
        opts.required = rule.required;
        if (value === "" && !opts.required) {
            callback();
        } else if (!vIdCard(value)) {
            callback(new Error("请输入正确的身份证号"));
        } else {
            callback();
        }
    };
}

/**
 * 验证手机号码
 * @param {Object} opts
 * @returns {void}
 */
export function validMobile() {
    return (rule, value, callback) => {
        if (value === "" && !rule.required) {
            callback();
        } else if (!REGULARS.mobile.test(value)) {
            callback(new Error("请输入正确的手机号码"));
        } else {
            callback();
        }
    };
}

/**
 * 验证电话号码
 * @param {Object} opts
 * @returns {void}
 */
export function validMobileTel() {
    return (rule, value, callback) => {
        if (value === "" && !rule.required) {
            callback();
        } else if (!REGULARS.mobileTel.test(value)) {
            callback(new Error("请输入正确的电话号码"));
        } else {
            callback();
        }
    };
}
