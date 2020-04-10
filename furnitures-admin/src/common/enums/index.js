/**
 * 枚举定义
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 枚举定义
 * @copyright ininin.com
 */

import { setEnumAndArray } from "@utils";

/**
 * 审核状态
 */
export const enumApprovalStatus = setEnumAndArray([
	{ k: 1, v: "申请账期" },
	{ k: 2, v: "待审核" },
	{ k: 3, v: "审核中" },
	{ k: 4, v: "已退回" },
	{ k: 5, v: "退回后提交" },
	{ k: 6, v: "已通过" },
	{ k: 7, v: "已拒绝" }
]);

//拓展状态
export const enumExpandState = setEnumAndArray([
    {k: 4, v: '未拓展'},
    {k: 3, v: '拓展中'},
    {k: 5, v: '有意向'},
    {k: 1, v: '已合作'},
    {k: 2, v: '不合作'}
])
//是否保价
export const enumOfferType = setEnumAndArray([
    {k: 1, v: '已报价'},
    {k: 3, v: '未报价'}
])

//商品状态
export const enumCommodityPublishStatus = setEnumAndArray([
    {k: 0, v: '下架'},
    {k: 1, v: '上架'}
])
//是否精选
export const enumCommodityPerfectStatus = setEnumAndArray([
    {k: 0, v: '否'},
    {k: 1, v: '是'}
])

