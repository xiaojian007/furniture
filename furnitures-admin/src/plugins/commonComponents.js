/**
 * 注册公共组件
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 引入js-cookie
 * @copyright ininin.com
 */
import Vue from "vue";

// https://webpack.js.org/guides/dependency-management/#requirecontext
// eslint-disable-next-line
const modulesFiles = require.context("@com/common", true, /\.vue$/);

modulesFiles.keys().forEach(modulePath => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
	const component = modulesFiles(modulePath).default;
	// register global components, you can user it through 'ComFileName'
	Vue.component("Com" + moduleName, component);
});
