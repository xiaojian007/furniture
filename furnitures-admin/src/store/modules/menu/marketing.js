/**
 * 营销
 * @author lijian
 * @since 2020-02-24
 * @version 1.0.0
 * @description 营销路由创建
 * @copyright lijian
 */
import permission from "@config/config.permission";
export default [
	// {
	// 	path: "marketing-list",
	// 	name: "marketing-list",
	// 	component: () =>
	// 		import(/* webpackChunkName: "marketing-list" */ "@views/marketing/MiniPhoto.vue"),
	// 	meta: {
	// 		label: "小程序精选",
	// 		icon: "role",
	// 		auth: [permission.VALUE_CHAIN_LOOK]
	// 	}
    // },
    {
		path: "dict-list",
		name: "dict-list",
		component: () =>
			import(/* webpackChunkName: "dict-list" */ "@views/marketing/Dict.vue"),
		meta: {
			label: "精选轮播图",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
