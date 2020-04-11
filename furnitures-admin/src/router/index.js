/**
 * 路由定义
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 路由定义
 * @copyright ininin.com
 */

import Vue from "vue";
import Router from "vue-router";
import store from "@store/";
// 路由进度条
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
// 个性化配置进度条外观
NProgress.configure({
	easing: "ease", // 动画方式
	speed: 500, // 递增进度条的速度
	showSpinner: false, // 是否显示加载ico
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.1 // 初始化时的最小百分比
});

Vue.use(Router);

const routes = store.getters["menu/routes"];
const router = new Router({
	routes
});
/**
 * 检查新版本：有新版本则刷新页面
 */
router.beforeResolve(function(to, from, next) {
	const latestVersion = store.state.app.latestVersion;
	if (latestVersion) {
		const path = to.path || "/";
		const domain = [window.location.protocol, window.location.host].join("//");
		window.location.href = [domain, `?v=${latestVersion}`, `#${path}`].join("");
	}
	next();
});
router.beforeEach((to, from, next) => {
	NProgress.start();
	// 设置标题
	let title = "";
	if (to.meta) {
		title = to.meta.title || "纸业销售统计";
	} else {
		title = "纸业销售统计";
	}
	document.title = title;
	// 判断是否有token
	const token = store.state.auth.token;
	if (!token && to.name !== "login") {
		store.dispatch("setInfo", null);
		next({
			name: "login"
		});

		NProgress.done();
	} else {
		next();

		NProgress.done();
	}
});
router.afterEach(() => {
	NProgress.done();
});
export default router;