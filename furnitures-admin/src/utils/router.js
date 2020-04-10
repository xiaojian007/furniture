/**
 * 路由处理类
 * @summary 路由处理类
 * @namespace router
 * @author shlijian@
 * @version 1.0.0
 * @since 2020/03/05
 * @constructor
 */

import { hasPermission } from "./permission";

/**
 * 获取菜单权限
 * @param {Object} item 菜单
 * @param {Boolean} bool 是否隐藏hide=true的菜单
 * @param {Object} permissions 权限map
 * @returns {*} 是否显示菜单
 */
export const isMenuShow = (item, bool = true, permissions) => {
	if (bool && item.hide) {
		return false;
	} else {
		let privileges = item.meta ? item.meta.auth || [] : [];
		const getPrivileges = o => {
			if (Array.isArray(o.children)) {
				o.children.forEach(row => {
					privileges = privileges.concat(row.meta ? row.meta.auth || [] : []);
					getPrivileges(row);
				});
			}
		};
		getPrivileges(item);
		return hasPermission(privileges, permissions);
	}
};
/**
 * 获取重定向路径
 * @param {Array} menuItems 菜单
 * @param {String} rootPath 根路径
 * @param {Object} permissions 权限map
 * @returns {string} 重定向路径
 */
export const getRedirectPath = (menuItems, rootPath = null, permissions) => {
	let parts = [];
	if (rootPath != null) {
		parts.push(rootPath);
	}
	const getItem = list => {
		if (Array.isArray(list)) {
			let show = false;
			list.forEach(item => {
				if (isMenuShow(item, true, permissions) && !show) {
					show = true;
					if (item.path) {
						parts.push(item.path);
					}
					if (!item.redirect) {
						getItem(item.children);
					}
				}
			});
		}
	};
	getItem(menuItems);
	return parts.join("/");
};
