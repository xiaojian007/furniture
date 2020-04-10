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
			<el-form-item label="用户姓名：" size="small" prop="roleName">
				<el-input v-model="form.roleName" placeholder="请输入用户姓名"></el-input>
			</el-form-item>
			<el-form-item label="用户账号：" size="small" prop="remark">
				<el-input v-model="form.remark" placeholder="请输入用户手机号"></el-input>
			</el-form-item>
			<el-form-item label="邮箱：" size="small">
				<el-input v-model="form.remark" placeholder="请输入用户邮箱"></el-input>
			</el-form-item>
			<el-form-item label="初始密码：" size="small">
				<el-input value="123456" disabled placeholder="请输入用户邮箱"></el-input>
			</el-form-item>
			<el-form-item label="角色：" size="small" prop="roleId">
				<el-select v-model="form.roleId" placeholder="请选择角色">
					<el-option
						v-for="item in roleList"
						:key="item.id"
						:label="item.value"
						:value="item.id"
					>
					</el-option>
				</el-select>
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
					roleId: "", //用户id
					roleName: "", //用户名称
					resourceIdList: [], //权限id
					remark: "" //用户描述
				},
				roleList: [
					{
						id: 1,
						value: "业务员"
					},
					{
						id: 2,
						value: "业务员1"
					},
					{
						id: 3,
						value: "业务员2"
					}
				],
				params: {
					roleId: ""
				},
				rules: {
					roleName: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					remark: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					roleId: [
						{
							required: true,
							message: "不能为空",
							trigger: "change"
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
				if (id > 0) {
					this.title = "修改用户";
					this.query(); // 获取用户信息
				} else {
					this.title = "新增用户";
				}
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
			},
			query() {}
		}
	};
</script>

<style lang="less" scoped>
	.el-select {
		width: 100%;
	}
</style>
