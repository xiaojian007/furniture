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
		path: "commodity-list",
		name: "commodity-list",
		component: () =>
			import(/* webpackChunkName: "commodity-list" */ "@views/commodity/CommodityList.vue"),
		meta: {
			label: "商品列表",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "product-type",
		name: "product-type",
		component: () =>
			import(/* webpackChunkName: "product-type" */ "@views/commodity/ProductType.vue"),
		meta: {
			label: "商品SKU",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
