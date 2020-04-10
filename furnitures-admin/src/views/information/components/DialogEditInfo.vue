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
			<el-form-item label="文章标题：" size="small" prop="roleName">
				<el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
			</el-form-item>
			<el-form-item label="详细链接：" size="small" prop="remark">
				<el-input v-model="form.remark" placeholder="请输入角色描述"></el-input>
			</el-form-item>
			<el-form-item label="封面图片：" size="small">
				<ComUploadSinglePicture
					@change="changePic(key, url)"
					@imagePreview="imagePreview"
				></ComUploadSinglePicture>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button type="primary" size="small" @click="submit" :loading="submitting">
				提交
			</el-button>
		</div>
		<ComImage></ComImage>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					roleId: "", //角色id
					roleName: "", //角色名称
					remark: "" //角色描述
				},
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
					this.title = "修改角色";
					this.query(); // 获取角色信息
				} else {
					this.title = "新增角色";
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
			query() {},
			changePic(key, url) {
				console.log(key, url);
			}
		}
	};
</script>
