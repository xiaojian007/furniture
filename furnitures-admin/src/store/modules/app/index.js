/**
 * app状态管理
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description app状态管理
 * @copyright lijian
 */

import { SET_LATEST_VERSION } from "./mutation-types";

const stateObj = {
    fullViewHeight: 320, //无分页无头部页签高度
    scrollViewHeight: 320, //无分页高度
    scrollViewHeightPaging: 320, //有分页高度
    dbTableHeight: 320, //无分页高度
    fontSize: 10, //字体大小
    latestVersion: '' //最新版本，不为空则有最新版本，需要更新
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
