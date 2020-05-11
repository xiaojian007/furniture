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
							<label class="el-form-item__label">订单人:</label>
							<div class="el-form-item__content">{{ receiptInfo.orderer }}</div>
						</div>
						<div class="el-form-item">
							<label class="el-form-item__label">订购人手机号:</label>
							<div class="el-form-item__content">
								{{ receiptInfo.orderNumber }}
							</div>
						</div>
						<div class="el-form-item">
							<label class="el-form-item__label">地址:</label>
							<div class="el-form-item__content">
								{{ receiptInfo.address || "-" }}
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="el-form-item">
							<label class="el-form-item__label">金额:</label>
							<div class="el-form-item__content">
								{{ receiptInfo.totalPrice || "-" }}
							</div>
						</div>
						<div class="el-form-item">
							<label class="el-form-item__label">物流:</label>
							<div class="el-form-item__content">
								{{ receiptInfo.logisticsName || "-" }}
							</div>
						</div>
						<div class="el-form-item">
							<label class="el-form-item__label">物流单号:</label>
							<div class="el-form-item__content">
								{{ receiptInfo.logisticsNumber || "-" }}
							</div>
						</div>
					</el-col>
				</el-row>

				<div class="title">订单信息</div>
				<el-table
					border
					:highlight-current-row="true"
					style="width: 100%"
					:data="reviewRecordList"
				>
					<el-table-column
						:resizable="false"
						prop="serialNumber"
						align="center"
						label="序号"
					>
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="productCategories"
						align="center"
						label="产品分类"
					>
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="productSeries"
						align="center"
						label="系列"
					>
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="productName"
						align="center"
						label="产品名称"
					>
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="specification"
						align="center"
						label="产品规格"
					>
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="unitPrice"
						align="center"
						label="产品单价"
					>
					</el-table-column>
					<el-table-column :resizable="false" prop="quantity" align="center" label="数量">
					</el-table-column>
					<el-table-column
						:resizable="false"
						prop="totalPrice"
						align="center"
						label="总价"
					>
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

	export default {
		mixins: [formMixin],
		data() {
			return {
				// 收货货信息
				receiptInfo: {
					orderer: "", //订单人
					orderNumber: "", //订单人手机号
					address: "", // 地址
					logisticsName: "", // 物流名称
					logisticsNumber: "", // 物流单号
					totalPrice: "" // 金额
				},
				reviewRecordList: []
			};
		},
		methods: {
			close() {
				let that = this;
				that.visible = false;
			},
			load(id) {
				let that = this;
				setTimeout(() => {
					console.log(id);
					that.reviewRecordList = [
						{
							serialNumber: 1,
							productCategories: "热销金宝",
							productName: "XXXXXX",
							productSeries: "休息休息系列",
							specification: "2000*33333",
							unitPrice: 222,
							quantity: 1,
							totalPrice: 222
						},
						{
							serialNumber: 2,
							productCategories: "热销金宝",
							productName: "XXXXXX",
							productSeries: "休息休息系列",
							specification: "2000*33333",
							unitPrice: 222,
							quantity: 1,
							totalPrice: 222
						},
						{
							serialNumber: 3,
							productCategories: "热销金宝",
							productName: "XXXXXX",
							productSeries: "休息休息系列",
							specification: "2000*33333",
							unitPrice: 222,
							quantity: 1,
							totalPrice: 222
						}
					];

					that.receiptInfo = {
						orderer: "李健", //订单人
						orderNumber: "19988888888", //订单人手机号
						address: "地球陈点点点", // 地址
						logisticsName: "顺丰", // 物流名称
						logisticsNumber: "SF1008610086", // 物流单号
						totalPrice: "2000000" // 金额
					};

					that.visible = true;
				}, 500);
				// getSigningDetail(
				// 	{ id: id },
				// 	data => {
				// 		that.title = "签收";
				// 		that.form = {
				// 			submissionTime: new Date(), // 签收时间
				// 			shipmentOrderDetailList: [
				// 				{
				// 					id: "",
				// 					submissionQuantity: ""
				// 				}
				// 			],
				// 			certificate: data.certificate || "" //回单图片连接
				// 		};
				// 		that.setFormData(that.receiptInfo, Object.assign({}, data));
				// 		that.reviewRecordList = data.reviewRecord || [];
				// 		let imageList = [];
				// 		if (that.form.certificate !== "") {
				// 			imageList = that.form.certificate.split(",");
				// 		}
				// 		that.$nextTick(() => {
				// 			if (that.$refs.pic) {
				// 				that.$refs.pic.data = imageList;
				// 			}
				// 		});
				// 		that.visible = true;
				// 		// 添加form
				// 		that.shipmentOrderDetailList = data.shipmentOrderDetailList || [];
				// 		// 设置验证
				// 		let purchaseOrderList = [];
				// 		that.shipmentOrderDetailList.forEach(item => {
				// 			purchaseOrderList.push({
				// 				id: item.id,
				// 				submissionQuantity: item.shipQuantity
				// 			});
				// 		});
				// 		that.form.shipmentOrderDetailList = purchaseOrderList;
				// 		that.setRules();
				// 	},
				// 	err => {
				// 		that.submitting = false;
				// 		that.$alert(err.resultMsg, "温馨提示", {
				// 			confirmButtonText: "知道了"
				// 		});
				// 	},
				// 	err => {
				// 		that.submitting = false;
				// 		that.$alert(err.resultMsg || that.MSG_UNKNOWN, "温馨提示", {
				// 			confirmButtonText: "知道了"
				// 		});
				// 	}
				// );
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
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
	}
</style>
