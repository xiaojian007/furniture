/**
 * vuex状态管理
 * @author shlijian@lijian.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description vuex状态管理
 * @copyright lijian
 */

/* eslint-disable no-undef */
import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import app from "./modules/app";
import auth from "./modules/auth";
import user from "./modules/user";
import menu from "./modules/menu";

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== "production",
	actions,
	modules: {
		app,
		auth,
		user,
        menu
	}
});
