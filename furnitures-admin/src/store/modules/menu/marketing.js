/**
 * 营销
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 营销路由创建
 * @copyright ininin.com
 */
import permission from "@config/config.permission";
export default [
	{
		path: "marketing-list",
		name: "marketing-list",
		component: () =>
			import(/* webpackChunkName: "marketing-list" */ "@views/commodity/CommodityList.vue"),
		meta: {
			label: "小程序精选",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	},
	{
		path: "sku-type",
		name: "sku-type",
		component: () =>
			import(/* webpackChunkName: "sku-type" */ "@views/commodity/SkuType.vue"),
		meta: {
			label: "商品SKU",
			icon: "role",
			auth: [permission.VALUE_CHAIN_LOOK]
		}
	}
];
