/**
 * 全局actions
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 全局actions
 * @copyright lijian
 */

import Cookies from "js-cookie";
import { SET_TOKEN, SET_MENU_PERMISSIONS, SET_BTN_PERMISSIONS } from "@store-m/auth/mutation-types";
import { SET_USERINFO } from "@store-m/user/mutation-types";
import { SET_SUB_MENU } from "@store-m/menu/mutation-types";
import { SET_LATEST_VERSION } from "@store-m/app/mutation-types";
import { deBase64, enBase64, md5 } from "@utils/crypto";
const COOKIE_ID = md5("lijian"); // 云印token
const USERINFO = "pdp.lijian"; // 用户信息+token
/**
 * 设置最新版本
 * @param {Object} param0
 * @param {String} v 版本号
 */
export const setLatestVersion = ({ commit }, v = "") => {
	commit(`app/${SET_LATEST_VERSION}`, v);
	localStorage.setItem("LATEST_VERSION", v);
};

/**
 * 设置用户信息缓存
 * @param {Object} info 用户信息
 */
const setLocalStorage = function(info = null) {
	if (info && info.token) {
		localStorage.setItem(USERINFO, enBase64(JSON.stringify(info)));
	} else {
		localStorage.removeItem(USERINFO);
	}
};

/**
 * 获取登录信息
 * @param {Object} context
 */
export const getInfo = ({ commit }) => {
	let cookieData = Cookies.get(COOKIE_ID);
	let localData = localStorage.getItem(USERINFO); // 登录信息
	if (cookieData && localData) {
		cookieData = deBase64(cookieData);
		localData = JSON.parse(deBase64(localData));
		if (cookieData === localData.token) {
			commit(`user/${SET_USERINFO}`, localData);
			commit(`auth/${SET_TOKEN}`, localData.token);
			commit(`auth/${SET_MENU_PERMISSIONS}`, localData.user.menuPermissionIds);
			commit(`auth/${SET_BTN_PERMISSIONS}`, localData.user.btnPermissionIds);
			setLocalStorage(localData);
		} else {
			console.log("cookie不一样");
		}
	}
};

/**
 * 设置登录信息
 * @param {Object} context
 * @param {Object} info 登录信息
 * @returns {Promise} 返回promise
 */
export const setInfo = ({ commit }, info = {}) => {
	return new Promise((resolve, reject) => {
		try {
			if (info && info.token) {
				// 缓存时间 1天失效
				let millisecond = new Date().getTime();
				let expiresTime = new Date(millisecond + 60 * 1000 * 60 * 24);
				Cookies.set(COOKIE_ID, enBase64(info.token), {
					path: "/",
					expires: expiresTime
				});
				commit(`user/${SET_USERINFO}`, info);
				commit(`auth/${SET_TOKEN}`, info.token);
				setLocalStorage(info);
			} else {
				// 退出登录
				setLocalStorage();
			}
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * 设置子菜单
 * @param {Object} context
 * @param {Object} path 路径
 */
export const setSubMenu = ({ commit }, path) => {
	commit(`menu/${SET_SUB_MENU}`, path);
};
