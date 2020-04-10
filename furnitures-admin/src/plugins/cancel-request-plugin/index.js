/**
 * 定义取消请求插件
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 定义取消请求插件，到处use方法
 * @copyright ininin.com
 */

import axios from "axios";
import axiosModules from "./axios-modules";
import { UPDATE_CURRENT_ROUTE } from "./axios-modules/mutation-types";
import { enBase64 } from "@utils/crypto";
import { filterParams } from "@api/utils";
const CancelToken = axios.CancelToken;
/**
 * 根据请求配置生成一个key
 * @method getConfigKey
 * @param {config} config  请求配置
 * @returns {String} 返回key
 */
const getConfigKey = config => {
	const { url = "", method = "get", baseURL = "", data } = config;
	let params = filterParams(config.params, method === "get");
	return enBase64(
		method + url.replace(baseURL, "") + JSON.stringify(params),
		JSON.stringify(data)
	);
};

/**
 * 注册取消请求处理类
 * @constructor
 * @param {Axios} instance  axios 实例
 * @param {Vuex} store vuex 实例
 * @param {Router} router vue-router 实例
 */
class CancelRequest {
	constructor(instance, store, router) {
		this.instance = instance;
		this.store = store;
		this.router = router;
		this.vuexModuleName = String(new Date().getTime() + Math.random());
		this.pending = new Map(); //用于分组（分组依据：当前路由名称）存储每个ajax请求的取消函数和ajax标识
		this.init();
	}
	init() {
		const that = this;
		/* 注册store模块 */
		this.store.registerModule(this.vuexModuleName, {
			...axiosModules,
			actions: {
				/**
				 * 监控路由变化
				 * @param {*} param0
				 * @param {*} param1
				 */
				changeRoute({ commit }, { to, from }) {
					if (from && from.name) {
						that.removeGroupPending(from.name);
					}
					commit(UPDATE_CURRENT_ROUTE, to.name);
				}
			}
		});
		/* 注册store模块 */
		/* 初始化路由跳转导航守卫*/
		this.router.beforeEach((to, from, next) => {
			this.store.dispatch(`${this.vuexModuleName}/changeRoute`, {
				to,
				from
			});
			next();
		});
		/* 初始化路由跳转导航守卫*/
		/* 初始化请求模块 */
		this.instance.interceptors.request.use(
			config => {
				const name = this.store.state[this.vuexModuleName].currentRouteName;
				this.removePending({ name, config }); // 移除重复请求
				config.cancelToken = this.generateCancel(name, config);
				return config;
			},
			error => {
				Promise.reject(error);
			}
		);
		// 添加respone拦截器
		this.instance.interceptors.response.use(
			response => {
				const name = this.store.state[this.vuexModuleName].currentRouteName;
				this.removePending({ name, config: response.config });
				return response || {};
			},
			error => {
				if (axios.isCancel(error)) {
					return new Promise(() => {});
				} else {
					return Promise.reject(error.response);
				}
			}
		);
		/* 初始化请求模块 */
	}

	/**
	 * 添加指定分组的缓存路由
	 * @param {Object} opts
	 * @param {String} opts.name 分组名称（路由名称）
	 * @param {String} opts.key 缓存key
	 * @param {Function} opts.cancel 取消請求的方法
	 */
	addPending = ({ name, key, cancel }) => {
		if (!this.pending.has(name)) {
			this.pending.set(name, new Map());
		}
		let group = this.pending.get(name);
		group.set(key, cancel);
	};

	/**
	 * 移除指定分组的指定配置的请求
	 * @param {Object} opts
	 * @param {String} opts.name 分组名称（路由名称）
	 * @param {config} opts.config 请求配置
	 * @returns {Boolean} 是否成功移除
	 */
	removePending = ({ name, config }) => {
		if (!this.pending.has(name)) {
			return false;
		}
		let group = this.pending.get(name);
		const key = getConfigKey(config);
		if (!group.has(key)) {
			return false;
		}
		const cancel = group.get(key);
		typeof cancel === "function" && cancel();
		return group.delete(key);
	};

	/**
	 * 移除指定分组的请求
	 * @param {String} name 分组名称
	 */
	removeGroupPending = name => {
		if (!this.pending.has(name)) {
			return;
		}
		let group = this.pending.get(name);
		const values = group.values();
		for (let cancel of values) {
			typeof cancel === "function" && cancel();
		}
		group.clear();
	};
	/**
	 * 生成 cancelToken
	 * @param {String} name 分组名称（路由名称）
	 * @param {config} config 请求配置
	 * @returns {cancelToken} cancelToken
	 */
	generateCancel = (name, config) => {
		return new CancelToken(cancel => {
			this.addPending({ name, key: getConfigKey(config), cancel });
		});
	};
}
/**
 * 注册取消请求处理
 * @method use
 * @param {Axios} instance  axios 实例
 * @param {Vuex} store vuex 实例
 * @param {Router} router vue-router 实例
 * @returns {CancelRequest} 实例
 */
export default function use(instance, store, router) {
	return new CancelRequest(instance, store, router);
}
