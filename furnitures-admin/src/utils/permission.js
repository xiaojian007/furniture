/**
 * 权限验证相关的工具函数
 * @author shlijian@ininin.com
 * @since 2020-03-12
 * @version 1.0.0
 * @description 权限验证相关的工具函数
 * @copyright ininin.com
 */

/**
 * 验证是否有权限
 * @param {Array} auth 需要的权限
 * @param {Object} pms 权限map
 * @returns {Boolean} 是否有权限
 */
export const hasPermission = (auth, pms) => {
	if (auth && pms) {
		// 判断权限  默认 0
		let defaultPms = auth.some(item => {
			return item === 0;
		});
		if (defaultPms) {
			return true;
		}
		auth = Array.isArray(auth) ? auth : [auth];
		return auth.some(key => pms[key]);
	} else {
		return true;
	}
};
