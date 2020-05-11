/**
 * 佣金
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 佣金路由创建
 * @copyright ininin.com
 */
import permission from "@config/config.permission";
export default [
	{
		path: "commiss-list",
		name: "commiss-list",
		component: () => import(/* webpackChunkName: "commiss-list" */ "@views/commission/index"),
		meta: {
			label: "佣金列表",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
