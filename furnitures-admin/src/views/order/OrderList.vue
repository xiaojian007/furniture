<template>
	<div class="list-panel" v-loading="loading">
		<div class="list-search">
			<el-form ref="form" :inline="true" :model="params" class="form-search">
				<el-form-item size="small">
					<ComDateRange
						ref="input-0"
						:mode="1"
						:clearable="true"
						class="date-width"
						@change="changeDateRangeOperate"
					></ComDateRange>
				</el-form-item>
				<el-form-item label="订单状态：" size="small">
					<el-select
						v-model="params.orderStatus"
						@change="query"
						clearable
						placeholder="请选择"
						class="visit-person"
					>
						<el-option
							v-for="item in orderStatus"
							:key="item.value"
							:label="item.text"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<div class="input-search">
					<el-form-item size="small" label=" ">
						<el-input
							v-model.trim="params.searchKey"
							class="search-key"
							clearable
							placeholder="请输入订单号"
							@keyup.enter.native="enterSearch"
						></el-input>
					</el-form-item>
					<el-form-item size="small">
						<el-button type="warning" @click="search" :loading="querying"
							>查询</el-button
						>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div class="list-result">
			<div class="list-buttons">
				<el-button @click="query" size="small" :loading="querying">刷新</el-button>
			</div>
			<div class="list-table">
				<el-table
					ref="table"
					:data="list"
					height="100%"
					:highlight-current-row="true"
					class="all-width"
				>
					<!-- <el-table-column label="序号" type="index" align="center" width="80">
					</el-table-column> -->
					<template v-for="(field, colIndex) in fields">
						<el-table-column
							v-if="field.show"
							:key="colIndex"
							:fixed="
								field.fixed
									? field.prop === 'operation'
										? 'right'
										: 'left'
									: false
							"
							:prop="field.prop"
							:align="field.align"
							:label="field.label"
							:class-name="field.className"
							:min-width="field.width || 100"
						>
							<template slot-scope="scope">
								<template v-if="field.prop === 'orderTime'">
									<div v-html="formatDateOutput(scope.row[field.prop])"></div>
								</template>
								<template v-else-if="field.prop === 'orderStatus'">
									{{ enumOrderStatus.obj[scope.row[field.prop]] }}
								</template>
								<template v-else-if="field.prop === 'operation'">
									<el-button
										type="text"
										@click="$refs.oderDetail.load(scope.row.orderId)"
									>
										详情
									</el-button>
									<el-button
										v-if="scope.row.orderStatus == 1"
										type="text"
										@click="$refs.ship.load(scope.row)"
									>
										发货
									</el-button>
									<el-button
										v-if="scope.row.orderStatus == 2"
										type="text"
										@click="receipt(scope.row.orderId)"
									>
										确认收货
									</el-button>
									<el-button type="text" @click="deletesOrder(scope.row.orderId)">
										删除
									</el-button>
								</template>
								<template v-else>
									{{ scope.row[field.prop] | nullValue }}
								</template>
							</template>
						</el-table-column>
					</template>
				</el-table>
			</div>
		</div>
		<div class="list-pagination">
			<el-pagination
				small
				background
				@size-change="changePageSize"
				@current-change="changeCurrentPage"
				:current-page="page.pageNum"
				:page-sizes="PAGE_SIZES"
				:page-size="page.pageSize"
				layout="total, sizes, prev, pager, next"
				prev-text="上一页"
				next-text="下一页"
				:total="page.totalCount"
			>
			</el-pagination>
		</div>
		<EditShip ref="ship" @success="query"></EditShip>
		<OrderDetail ref="oderDetail"></OrderDetail>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditShip from "./components/DialogEditShip";
	import OrderDetail from "./components/DialogOrderDetail";
	import { getOrderList, deteleOrder, updateOrder } from "@api/order/order";
	import { enumOrderStatus } from "@common/enums/index";
	export default {
		mixins: [listMixin],
		components: { EditShip, OrderDetail },
		data() {
			return {
				enumOrderStatus,
				orderStatus: [{ value: "", text: "全部" }].concat(enumOrderStatus.arr),
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {
					startTime: "", //开始时间
					endTime: "", //结束时间
					orderStatus: "", //拜访人
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "orderId",
						align: "center",
						label: "序号",
						width: 80
					},
					{
						show: true,
						prop: "orderNo",
						align: "center",
						label: "订单号",
						width: 170
					},
					{
						show: true,
						prop: "totalPreAmount",
						align: "center",
						label: "应付金额",
						width: 90
					},
					{
						show: true,
						prop: "totalRealAmount",
						align: "center",
						label: "实付金额",
						width: 90
					},
					{
						show: true,
						prop: "orderStatus",
						align: "center",
						label: "订单状态",
						width: 100
					},
					{
						show: true,
						prop: "orderTime",
						align: "center",
						label: "下单时间",
						width: 120
					},
					// {
					// 	show: true,
					// 	prop: "receiveAddress",
					// 	align: "center",
					// 	label: "收货人",
					// 	width: 80
					// },
					// {
					// 	show: true,
					// 	prop: "receiveAddress",
					// 	align: "center",
					// 	label: "收货地址",
					// 	width: 80
					// },
					{
						show: true,
						prop: "deliverySn",
						align: "center",
						label: "物流单号"
					},
					{
						show: true,
						prop: "deliveryCompany",
						align: "center",
						label: "物流公司"
					},
					{
						show: true,
						fixed: "right",
						prop: "operation",
						align: "center",
						className: "table-operation-col",
						label: "操作",
						width: 180
					}
				]
			};
		},
		activated() {
			//被 keep-alive 缓存的组件激活时调用
			if (!this.isKeepAlive) {
				this.query();
			}
		},
		methods: {
			//回车搜索
			enterSearch() {
				let that = this;
				if (that.searchKey !== that.params.searchKey) {
					that.search();
				}
				that.searchKey = that.params.searchKey;
			},
			//时间搜索
			changeDateRangeOperate(dateRanges) {
				dateRanges = dateRanges || [];
				if (dateRanges instanceof Array) {
					this.params.startTime = dateRanges[0];
					this.params.endTime = dateRanges[1];
				}
				this.query();
			},
			query() {
				let that = this;
				that.loading = true;
				let paramsData = {
					pageNum: that.params.pageNum,
					pageSize: that.params.pageSize,
					orderStatus: that.params.orderStatus,
					startTime: that.params.startTime,
					endTime: that.params.endTime,
					orderNo: that.params.searchKey
				};
				getOrderList(paramsData)
					.then(data => {
						if (data.succeed) {
							that.list = data.body.list || [];
							that.page.totalCount = data.body.total;
						} else {
							that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.querying = false;
						that.loading = false;
					});
			},
			// 确认收货
			receipt(id) {
                let that = this;
                let formData = {
                    orderId: id,
                    orderStatus: 3
                }
				updateOrder(formData)
					.then(data => {
						if (data.succeed) {
                            that.search()
						} else {
							that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.submitting = false;
					});
			},
			deletesOrder(id) {
				let that = this;
				that.$confirm("确认删除改订单吗？", "提示", {
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					customClass: "custom-confirm custom-confirm-danger", // 图标样式
					confirmButtonClass: "el-button--primary", // 确认按钮样式
					closeOnClickModal: that.CONFIRM_MODAL_CLOSE, // 是否可以点击空白关闭
					closeOnPressEscape: that.CONFIRM_ESC_CLOSE, // 是否可以esc关闭
					showClose: false // 是否显示关闭按钮
				})
					.then(() => {
						that.querying = true;
						deteleOrder({ orderId: id })
							.then(data => {
								if (data.succeed) {
									that.$message.success("删除成功", that);
									that.query();
								} else {
									that.$message.warning(
										data.body.message || that.MSG_UNKNOWN,
										that
									);
								}
							})
							.catch(err => {
								that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
							})
							.finally(() => {
								that.querying = false;
							});
					})
					.catch(() => {});
			}
		}
	};
</script>
<style lang="less" scoped>
	.list-panel {
		.input-search {
			display: inline-block;
		}
		.date-width {
			width: 250px;
		}
		.visit-person {
			width: 100px;
		}

		.search-key {
			width: 200px;
		}

		.all-width {
			width: 100%;
		}
	}
</style>
