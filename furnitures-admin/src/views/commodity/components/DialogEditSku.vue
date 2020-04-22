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
			label-width="100px"
		>
			<el-form-item label="SKU属性值:" size="small" prop="skuName">
				<el-input v-model="form.skuName" placeholder="请输入SKU名称"></el-input>
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
	import { addAndUpdateSkuType, getSkuType } from "@api/commodity/sku";

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					parentId: "",
					skuName: "",
					skuId: "" //类型id
				},
				rules: {
					skuName: [
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
			add(parentId, id = 0) {
				this.visible = true;
				this.form.parentId = parentId;
				if (id > 0) {
					this.title = "修改SKU";
					this.form.skuId = id;
					this.query(); // 获取角色信息
				} else {
					this.title = "新增SKU";
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						let formData = {
							parentId: that.form.parentId,
							skuName: that.form.skuName,
							skuLevel: 2
						};
						if (that.form.skuId > 0) {
							formData["skuId"] = that.form.skuId;
						}
						addAndUpdateSkuType(formData)
							.then(data => {
								if (data.succeed) {
									that.$message.success(
										that.form.skuId > 0 ? "修改成功" : "添加成功",
										that
									);
									that.visible = false;
									that.$emit("success");
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
			},
			query() {
				let that = this;
				that.submitting = true;
				getSkuType({ skuId: this.form.skuId })
					.then(data => {
						if (data.succeed) {
							that.form.skuName = data.body.skuName;
							this.visible = true;
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
	.type-item {
		position: relative;
		width: 49%;
		float: left;
		&:nth-child(2n-1) {
			margin-right: 2%;
		}
		span {
			position: absolute;
			right: 10px;
			top: 5px;
			font-size: 22px;
			color: #f00;
			cursor: pointer;
		}
	}

	.add {
		vertical-align: top;
	}
</style>
