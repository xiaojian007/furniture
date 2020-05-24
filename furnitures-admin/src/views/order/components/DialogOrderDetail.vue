<template>
	<el-dialog
		width="1200px"
		:id="domId"
		:title="title"
		:visible.sync="visible"
		:close-on-click-modal="DIALOG_MODAL_CLOSE"
		:close-on-press-escape="DIALOG_ESC_CLOSE"
		@close="close"
	>
		<div class="form-edit form-edit-table">
			<div class="title">基础信息</div>
			<el-row class="form-detail">
				<el-col :span="12">
					<div class="el-form-item">
						<label class="el-form-item__label">订购人:</label>
						<div class="el-form-item__content">
							{{ orderInfo.receiver }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">订购人手机号:</label>
						<div class="el-form-item__content">
							{{ orderInfo.receiverPhone }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">地址:</label>
						<div class="el-form-item__content">
							{{ orderInfo.addressName || "-" }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">备注:</label>
						<div class="el-form-item__content">
							{{ orderInfo.memo || "-" }}
						</div>
					</div>
                    <div class="el-form-item">
						<label class="el-form-item__label">备注:</label>
						<div class="el-form-item__content">
							{{ enumOrderStatus.obj[orderInfo.orderStatus] }}
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="el-form-item">
						<label class="el-form-item__label">应付价格:</label>
						<div class="el-form-item__content">
							{{ orderInfo.totalPreAmount || "-" }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">实付金额:</label>
						<div class="el-form-item__content">
							{{ orderInfo.totalRealAmount || "-" }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">物流:</label>
						<div class="el-form-item__content">
							{{ orderInfo.deliveryCompany || "-" }}
						</div>
					</div>
					<div class="el-form-item">
						<label class="el-form-item__label">物流单号:</label>
						<div class="el-form-item__content">
							{{ orderInfo.deliverySn || "-" }}
						</div>
					</div>
				</el-col>
			</el-row>

			<div class="title">订单信息</div>
			<el-table
				border
				:highlight-current-row="true"
				style="width: 100%"
				:data="orderItemList"
			>
				<el-table-column :resizable="false" prop="serialNumber" align="center" label="序号">
					<template slot-scope="scope">
						<div class="tc">{{ scope.$index + 1 }}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column
					:resizable="false"
					prop="productName"
					align="center"
					label="产品类型"
				>
				</el-table-column> -->
				<el-table-column
					:resizable="false"
					prop="productName"
					align="center"
					label="产品名称"
				>
				</el-table-column>
				<el-table-column
					:resizable="false"
					prop="productSkuName"
					align="center"
					label="规格"
				>
				</el-table-column>
				<el-table-column :resizable="false" prop="itemPrice" align="center" label="单价">
				</el-table-column>
				<el-table-column :resizable="false" prop="itemQuantity" align="center" label="数量">
				</el-table-column>
				<el-table-column :resizable="false" prop="itemTotalPrice" align="center" label="总价">
                    <template slot-scope="scope">
						<div class="tc">{{ scope.row.itemQuantity*scope.row.itemPrice }}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div slot="footer">
			<el-button @click="close" size="small" :loading="submitting">关 闭</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import formMixin from "@mixins/form.mixin";
	import { getOrderDetail } from "@api/order/order";
    import { enumOrderStatus } from "@common/enums/index";

	export default {
		mixins: [formMixin],
		data() {
			return {
                enumOrderStatus,
				// 收货货信息
				orderInfo: {
					receiver: "", // 收货人
                    receiverPhone: "", // 收货人手机号
                    addressName: "", // 收货地址
					orderNo: "", //订单号
					deliveryCompany: "", //物流公司
					deliverySn: "", //物流单号
					memo: "", //订单备注
					orderStatus: "", // 订单状态
					totalPreAmount: "", //应付总价格
					totalRealAmount: "" // 实付金额
				},
				orderItemList: []
			};
		},
		methods: {
			close() {
				let that = this;
				that.visible = false;
			},
			load(id) {
				let that = this;
				getOrderDetail({ orderId: id })
					.then(data => {
                        let detail = data.body || {}
						if (data.succeed) {
							that.orderItemList = data.body.orderItemList || [];
							that.orderInfo = {
								receiver: detail.receiveAddress.receiver, // 收货人
                                receiverPhone: detail.receiveAddress.receiverPhone, // 收货人手机号
                                addressName: detail.receiveAddress.addressName,
								orderNo: detail.orderNo, //订单号
								deliveryCompany: detail.deliveryCompany, //物流公司
								deliverySn: detail.deliverySn, //物流单号
								memo: detail.memo, //订单备注
								orderStatus: detail.orderStatus, // 订单状态
								totalPreAmount: detail.totalPreAmount, //应付总价格
								totalRealAmount: detail.totalRealAmount // 实付金额
							};
							that.visible = true;
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
			}
		}
	};
</script>

<style lang="less" scoped>
	.form-edit {
		.title {
			padding: 20px 0 26px;
			font-size: 18px;
			line-height: 25px;
			color: #333;
			font-weight: bold;
		}

		.title:first-child {
			padding: 0 0 20px;
		}

		.el-form-item__label {
			width: 120px;
		}

		/deep/ .purchase-table .el-table {
			.el-table__body {
				td {
					padding: 0;
				}
			}
		}

		.el-form-item--small.el-form-item {
			margin: 0;
		}
		/deep/ .el-form-item__content {
			margin-bottom: 3px;
		}
		/deep/ .el-form-item {
			margin-bottom: 0;
		}
	}
</style>
