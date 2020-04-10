/**
 * 入口文件
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 入口文件
 * @copyright ininin.com
 */

import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/";
import utils from "@plugins/utils.js";
import "@plugins/element-ui.js";
import "@plugins/icons.js";
import "./filters";
import "@assets/css/layout.less";
import "@/themes/default/index.css";
import "./plugins/commonComponents";
import constants from "./plugins/constants";
Vue.use(constants);
Vue.use(utils, { store });
Vue.config.productionTip = false;

store.dispatch("getInfo");

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
