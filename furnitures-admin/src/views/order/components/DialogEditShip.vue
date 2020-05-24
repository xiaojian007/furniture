<template>
	<el-dialog
		:id="domId"
		:title="title"
		width="480px"
		:visible.sync="visible"
		:close-on-click-modal="DIALOG_MODAL_CLOSE"
		:close-on-press-escape="DIALOG_ESC_CLOSE"
		:modal-append-to-body="false"
		:append-to-body="true"
		@close="close"
	>
		<el-form
			class="form-edit"
			ref="form"
			:model="form"
			:rules="rules"
			@submit.native.prevent
			label-width="95px"
		>
			<el-form-item label="物流名称：" size="small" prop="deliveryCompany">
				<el-input v-model="form.deliveryCompany" placeholder="请输入物流名称"></el-input>
			</el-form-item>
			<el-form-item label="物流单号：" size="small" prop="deliverySn">
				<el-input v-model="form.deliverySn" placeholder="请输入物流单号"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button type="primary" size="small" @click="submit" :loading="submitting">
				提交
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";
	import { updateOrder } from "@api/order/order";

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					orderId: "",
					deliveryCompany: "", //物流公司
					deliverySn: "" //物流单号
				},
				rules: {
					deliveryCompany: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					deliverySn: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			close() {
				this.reset();
				this.visible = false;
				this.submitting = false;
			},
			load(row = {}) {
				this.visible = true;
				if (row.orderId > 0) {
					this.title = "修改用户";
					this.form.orderId = row.orderId;
				} else {
					this.title = "新增用户";
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						that.submitting = true;
						let formData = {
							deliveryCompany: that.form.deliveryCompany, //角色id
                            deliverySn: that.form.deliverySn,
                            orderStatus: 2
						};
						if (that.form.orderId > 0) {
							formData["orderId"] = that.form.orderId;
						}
						updateOrder(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success("添加成功", that);
									that.$emit("success");
									that.visible = false;
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
								that.submitting = false;
							});
					} else {
						console.log("Failure of form validation!!");
					}
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.el-select {
		width: 100%;
	}
</style>
