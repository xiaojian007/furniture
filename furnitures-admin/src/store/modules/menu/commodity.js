/**
 * 佣金
 * @author lijian
 * @since 2020-02-24
 * @version 1.0.0
 * @description 佣金路由创建
 * @copyright lijian
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
		path: "sku-type-list",
		name: "sku-type-list",
		component: () =>
			import(/* webpackChunkName: "sku-type-list" */ "@views/commodity/SkuType.vue"),
		meta: {
			label: "SKU类型",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "sku-list",
        name: "sku-list",
        hide: true,
		component: () => import(/* webpackChunkName: "sku-list" */ "@views/commodity/SkuList.vue"),
		meta: {
			label: "商品SKU",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
