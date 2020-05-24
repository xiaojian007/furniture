/**
 * 注册过滤器
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 引入js-cookie
 * @copyright lijian
 */
import Vue from "vue";
// eslint-disable-next-line
const modulesFiles = require.context("./", true, /\.js$/);
modulesFiles.keys().forEach(modulePath => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
	if (moduleName !== "index") {
		const filter = modulesFiles(modulePath)[moduleName];
		// register filter, you can user it through 'FileName'
		Vue.filter(moduleName, filter);
	}
});
