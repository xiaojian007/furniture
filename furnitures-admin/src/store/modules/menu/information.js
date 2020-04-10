/**
 * 咨讯
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 咨讯路由创建
 * @copyright ininin.com
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
	}
];
