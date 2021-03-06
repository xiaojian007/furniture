/**
 * 咨讯
 * @author lijian
 * @since 2020-02-24
 * @version 1.0.0
 * @description 咨讯路由创建
 * @copyright lijian
 */
import permission from "@config/config.permission";
export default [
	{
		path: "info-list",
		name: "info-list",
		component: () => import(/* webpackChunkName: "info-list" */ "@views/information/index.vue"),
		meta: {
			label: "咨讯列表",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
    },
    {
		path: "VI",
		name: "VI",
		component: () => import(/* webpackChunkName: "info-list" */ "@views/information/VI.vue"),
		meta: {
			label: "VI列表",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
    {
		path: "aout",
		name: "aout",
		component: () => import(/* webpackChunkName: "info-list" */ "@views/information/About.vue"),
		meta: {
			label: "关于我们",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
