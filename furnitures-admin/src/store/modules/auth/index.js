/**
 * auth状态
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description app状态管理
 * * -------------------------
 * @author shlijian@ininin.com * @since 2020-02-11
 * @version 1.0.1
 * @description 添加
 * @copyright ininin.com
 */

/* eslint-disable no-shadow */
import { SET_TOKEN, SET_MENU_PERMISSIONS, SET_BTN_PERMISSIONS } from "./mutation-types";


/**
 * 权限Ids转换成map对象
 * @param {String} ids 权限ids ,分割
 * @returns {Object} 权限map对象
 */
const permissionIdsToMap = (ids = "") =>
	ids.split(",").reduce((permissions, permission) => {
		if (!permissions[permission]) {
			if (typeof Object.defineProperty === "function") {
				Object.defineProperty(permissions, permission, {
					value: true,
					enumerable: true, //能在for-in循环中遍历出来或在Object.keys中列举出来
					configurable: false, //该属性描述符不能被改变，也不能被删除
					writable: false //不能被赋值运算符改变
				});
			} else {
				permissions[permission] = true;
			}
		}
		return permissions;
    }, {});


const state = {
	token: "", //登录权限
	btnPermissions: {}, //按钮权限
	menuPermissions: {} //菜单权限
};

const mutations = {
	[SET_TOKEN](state, token) {
		if (token) {
			state.token = token;
		} else {
			state.token = "";
        }
    },
    [SET_MENU_PERMISSIONS](state, permissionIds = "") {
		state.menuPermissions = permissionIdsToMap(permissionIds);
		console.log("menuPermissions", state.menuPermissions);
	},
	[SET_BTN_PERMISSIONS](state, permissionIds = "") {
		state.btnPermissions = permissionIdsToMap(permissionIds);
		console.log("menuPermissions", state.btnPermissions);
	}
};

export default {
	namespaced: true,
	state,
	mutations
};
