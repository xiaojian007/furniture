/**
 * 定义取消请求插件需要使用的动态vuex状态
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 定义取消请求插件需要使用的动态vuex状态
 * @copyright ininin.com
 */

/* eslint-disable no-shadow */
import { UPDATE_CURRENT_ROUTE } from "./mutation-types";

const state = {
	currentRouteName: null
};

const mutations = {
	[UPDATE_CURRENT_ROUTE](state, name) {
		state.currentRouteName = name;
	}
};

export default {
	namespaced: true,
	state,
	mutations
};
