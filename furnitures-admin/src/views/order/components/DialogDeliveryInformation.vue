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
			<el-form-item label="物流：" size="small" prop="logisticsName">
				<el-input v-model="form.logisticsName" maxlength="20" placeholder="请输入物流名称"></el-input>
			</el-form-item>
			<el-form-item label="物流单号：" size="small" prop="logisticsNumber">
				<el-input v-model="form.logisticsNumber" maxlength="20" placeholder="请输入物流单号"></el-input>
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

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					id: "",
					logisticsName: "", //用户id
					logisticsNumber: "" //用户名称
                },
                titie: '发货信息',
				rules: {
					logisticsName: [
						{
							required: true,
							message: "名称不能为空",
							trigger: "blur"
						}
					],
					logisticsNumber: [
						{
							required: true,
							message: "单号不能为空",
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
			load(id = 0) {
                this.visible = true;
                this.form.id = id;
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						console.log(valid);
						that.visible = false;
						that.$message.success("提交成功", that);
						that.$emit("success");
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
