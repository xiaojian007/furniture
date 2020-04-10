/**
 * 订单板块路由
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 订单板块路由创建
 * @copyright ininin.com
 */
import permission from "@config/config.permission";
export default [
	{
		path: "roles-list",
		name: "roles-list",
		component: () => import(/* webpackChunkName: "order-list" */ "@views/user/RolesList.vue"),
		meta: {
			label: "角色列表",
			icon: "role",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "user-list",
		name: "user-list",
		component: () => import(/* webpackChunkName: "order-list" */ "@views/user/UserList.vue"),
		meta: {
			label: "用户列表",
            icon: "user",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "applets-list",
		name: "applets-list",
		component: () => import(/* webpackChunkName: "applets-list" */ "@views/user/AppletsList.vue"),
		meta: {
			label: "小程序用户",
			icon: "mini-product",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
