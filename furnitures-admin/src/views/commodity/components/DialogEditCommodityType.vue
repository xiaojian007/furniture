<template>
	<el-dialog
		:id="domId"
		:title="title"
		width="800px"
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
			<el-form-item label="类别名称：" size="small" prop="roleName">
				<el-input v-model="form.roleName" placeholder="请输入类别名称"></el-input>
			</el-form-item>
			<el-form-item label="类别图片：" size="small">
				<ComUploadSinglePicture
					:styleBox="true"
					ref="commodityTypeSinglePic"
					@change="changeSinglePicture"
				></ComUploadSinglePicture>
			</el-form-item>
			<el-form-item label="类别轮播：" size="small" v-if="isNoCarouselPic">
				<ComUploadMultiPicture
					ref="commodityTypeMultPic"
					@imagePreview="imagePreview"
					@uploadStart="uploadBefore"
					@uploadSuccess="uploadSuccess"
					:styleBox="true"
					@change="changeMultiPicture"
					:maxCount="5"
					:hideUpload="true"
				></ComUploadMultiPicture>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button type="primary" size="small" @click="submit" :loading="submitting">
				提交sss
			</el-button>
		</div>
		<ComImage ref="image"></ComImage>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";

	export default {
		mixins: [formMixin],
		data() {
			return {
				isNoCarouselPic: true, // 是否需要添加轮播图
				form: {
					roleId: "", //类别id
					roleName: "", //类别名称
					resourceIdList: [], //权限id
					remark: "" //类别描述
				},
				params: {
					roleId: ""
				},
				defaultKeys: [],
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
			// 图片预览
			imagePreview(url, list) {
				if (url) {
					url = url.split(";");
					this.$refs.image.preview(url || "", list);
				}
			},
			close() {
				this.reset();
				this.visible = false;
				this.submitting = false;
			},
			add(id = 0, node) {
                console.log(node)
				this.visible = true;
				if (id > 0) {
					this.title = "修改类型";
					this.query(); // 获取类别信息
				} else {
					this.title = "新增类型";
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
			uploadBefore() {
				console.log("上传之前");
				this.submitting = true;
			},
			uploadSuccess() {
				console.log("上传成功");
				this.submitting = false;
			},
			changeMultiPicture(key, value, list) {
				console.log(key, value, list);
			},
			changeSinglePicture(key, value) {
				console.log(key, value);
			}
		}
	};
</script>
