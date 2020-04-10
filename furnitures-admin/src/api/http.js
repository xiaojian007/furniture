/**
 * axios
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 定义http请求方法
 * @copyright ininin.com
 */

/* eslint-disable no-undef */
import axios from "axios";
import baseURL from "@config/config.api.js";
import router from "@/router";
import store from "@store/";
import { filterParams } from "./utils";
import cancelRequestPlugin from "@plugins/cancel-request-plugin";
import headers from "@config/config.axios-header";

const instance = axios.create({
	baseURL,
	timeout: 60000
});

cancelRequestPlugin(instance, store, router);

instance.defaults.withCredentials = false;
instance.defaults.headers.common["Accept"] = "application/json";
Object.assign(instance.defaults.headers.common, headers);

// 添加request拦截器
instance.interceptors.request.use(
	config => {
        const token = store.state.auth.token;
		if (token) {
            config.headers.common["X-Auth-Token"] = token;
        }
		config.params = filterParams(config.params, config.method.toUpperCase() === "GET");
		return config;
	},
	error => {
		Promise.reject(error);
	}
);
// 添加respone拦截器
instance.interceptors.response.use(
	response => {
        let data = response.data || {};
		if (data.resultCode === 200) {
			response.succeed = true;
            response = data.resultData || {};
		} else if (data.resultCode === 401) {
			// 没有登录或登录超时，请重新登录
			store.dispatch("setInfo", {});
			router.replace("/login");
		} else {
			response = data.resultData;
        }
		return response || {};
	},
	error => {
		return Promise.reject(error.response);
	}
);

// 封装get请求
export function get(url, params = {}) {
	return instance({
		url,
		method: "get",
		params
	});
}

// 封装post请求
export function post(url, data = {}) {
	return instance({
		url,
		method: "post",
		data
	});
}

// 封装put方法
export function put(url, data = {}) {
	return instance({
		url,
		method: "put",
		data
	});
}
/**
 * delete请求
 * @param {String} url
 * @param {Object} params
 * @returns {Promise} 请求Promise
 */
export function deletes(url, params = {}) {
	return instance({
		url,
		method: "delete",
		params
	});
}

export { instance };
