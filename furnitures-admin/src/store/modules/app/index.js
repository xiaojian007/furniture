/**
 * app状态管理
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description app状态管理
 * @copyright ininin.com
 */

import { SET_LATEST_VERSION } from "./mutation-types";

const stateObj = {
	latestVersion: "" //最新版本，不为空则有最新版本，需要更新
};

const mutations = {
	[SET_LATEST_VERSION](state, value) {
		state.latestVersion = value;
	}
};

export default {
	namespaced: true,
	state: stateObj,
	mutations
};
