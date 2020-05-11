/**
 * userInfo
 * * -------------------------
 * @author shlijian@ininin.com * @since 2020-02-11
 * @version 1.0.1
 * @description 添加
 * @copyright ininin.com
 */

/* eslint-disable no-shadow */
import { SET_USERINFO } from "./mutation-types";

const state = {
	token: "", //登录令牌
    userId: "", //用户名id
    mobile: "", // 手机号
	userName: "" //用户名
};

const mutations = {
	[SET_USERINFO](state, data) {
		if (data && data.token && data.user) {
			state.token = data.token;
            state.userId = data.user.userId;
            state.mobile = data.user.mobile;
			state.userName = data.user.userName;
		} else {
			state.token = "";
			state.userId = "";
			state.mobile = "";
			state.userName = "";
        }
	}
};

export default {
	namespaced: true,
	state,
	mutations
};
