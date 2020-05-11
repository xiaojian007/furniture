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
			<el-form-item label="用户姓名：" size="small" prop="userName">
				<el-input v-model="form.userName" placeholder="请输入用户姓名"></el-input>
			</el-form-item>
			<el-form-item label="用户账号：" size="small" prop="remark">
				<el-input v-model="form.remark" placeholder="请输入用户手机号"></el-input>
			</el-form-item>
			<!-- <el-form-item label="邮箱：" size="small">
				<el-input v-model="form.remark" placeholder="请输入用户邮箱"></el-input>
			</el-form-item> -->
			<el-form-item label="初始密码：" size="small">
				<el-input value="123456" disabled placeholder="请输入用户邮箱"></el-input>
			</el-form-item>
			<el-form-item label="角色：" size="small" prop="roleId">
				<el-select v-model="form.roleId" placeholder="请选择角色">
					<el-option
						v-for="item in roleList"
						:key="item.value"
						:label="item.text"
						:value="item.value"
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
	import { addAndUpdateUser } from "@api/users/user";

	export default {
		mixins: [formMixin],
		props: {
			roleList: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		data() {
			return {
				form: {
					userId: "",
					roleId: "", //用户id
					userName: "" //用户名称
				},
				rules: {
					userName: [
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
                    this.form.userId = id;
					this.query(); // 获取用户信息
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
                            roleId: that.form.roleId, //角色id
                            mobile: that.form.mobile,
							userName: that.form.userName
						};
						if (that.form.userId > 0) {
							formData["userId"] = that.form.userId;
						}
                        addAndUpdateUser({userInfoDto: formData})
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
								that.$message.warning(
									err.body.message || that.MSG_UNKNOWN,
									that
								);
							})
							.finally(() => {
								that.submitting = false;
							});
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
