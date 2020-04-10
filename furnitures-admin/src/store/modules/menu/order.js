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
		path: "order-list",
        name: "order-list",
		component: () => import(/* webpackChunkName: "order-list" */ "@views/order/OrderList.vue"),
		meta: {
            label: "订单列表",
            icon: "icon-visitList",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "distribution-list",
        name: "distribution-list",
		component: () =>
			import(/* webpackChunkName: "distribution-list" */ "@views/order/DistributionList.vue"),
		meta: {
			label: "退货列表",
            icon: "icon-visitList",
            auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
