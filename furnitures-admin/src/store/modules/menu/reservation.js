/**
 * 预约
 * @author lijian
 * @since 2020-02-24
 * @version 1.0.0
 * @description 预约路由创建
 * @copyright lijian
 */
import permission from "@config/config.permission";
export default [
	{
		path: "resere-list",
		name: "resere-list",
		component: () => import(/* webpackChunkName: "resere-list" */ "@views/reservation/index.vue"),
		meta: {
			label: "客户列表",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
