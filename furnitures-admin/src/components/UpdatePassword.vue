<template>
	<el-dialog
		:id="domId"
		title="修改密码"
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
			label-width="110px"
			@submit.native.prevent
		>
			<el-form-item label="原密码：" size="small" prop="oldPassword">
				<el-input
					v-model="form.oldPassword"
					type="password"
					placeholder="请输入新密码"
				></el-input>
			</el-form-item>
			<el-form-item label="新密码：" size="small" prop="password">
				<el-input
					v-model="form.password"
					type="password"
					placeholder="请输入新密码"
				></el-input>
			</el-form-item>
			<el-form-item label="确认新密码：" size="small" prop="newPassword">
				<el-input
					v-model="form.newPassword"
					type="password"
					placeholder="请确认新密码"
				></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button
				type="primary"
				size="small"
				@click="$refs.resetPw.submit()"
				:loading="$refs.resetPw && $refs.resetPw.submitting"
				>确认修改
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			let validatePass = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("密码不能为空"));
				} else if (value.toString().length < 6 || value.toString().length > 18) {
					callback(new Error("不包含空格，必须为6-20个字符"));
				} else {
					callback();
				}
			};
			let okValidatePass = (rule, value, callback) => {
				if (this.form.password !== this.form.newPassword) {
					callback(new Error("两次输入密码不一致"));
				} else {
					callback();
				}
			};
			return {
				domId: this.uuid(),
				visible: false,
				form: {
					oldPassword: "",
					password: "",
					newPassword: ""
				},
				rules: {
					oldPassword: [{ required: true, validator: validatePass, trigger: "blur" }],
					password: [{ required: true, validator: validatePass, trigger: "blur" }],
					newPassword: [{ required: true, validator: okValidatePass, trigger: "blur" }]
				}
			};
		},
		methods: {
			close() {
				this.visible = false;
				this.submitting = false;
			},
			load() {
				this.visible = true;
				this.$nextTick(() => {
					let that = this;
					that.$refs.form.resetFields();
				});
			}
		}
	};
</script>
