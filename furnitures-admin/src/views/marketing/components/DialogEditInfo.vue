<template>
	<el-dialog
		:id="domId"
		:title="title"
		width="600px"
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
			<el-form-item label="封面图片：" size="small" prop="articleImage">
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
				提交
			</el-button>
		</div>
		<ComImage></ComImage>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";
	import Tinymce from "@com/tinymce";
	import { enumCommodityPerfectStatus } from "@common/enums/index";
	import { addAndUpdateArticle } from "@api/information/information";

	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				enumCommodityPerfectStatus,
				form: {
					articleId: "", //id
					articleTitle: "" // 标题
				},
				params: {
					roleId: ""
				},
				rules: {
					articleTitle: [
						{
							required: true,
							message: "文章标题不能为空",
							trigger: "blur"
						}
					],
					articleImage: [
						{
							required: true,
							message: "请上传图片",
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			close() {
				let that = this;
				this.reset();
				that.$nextTick(() => {
					if (that.$refs.commodityTypeMultPic) {
						that.$refs.commodityTypeMultPic.data = [];
					}
				});
				this.visible = false;
				this.submitting = false;
			},
			load(id = 0) {
				if (id > 0) {
					this.form.articleId = id;
					this.title = "修改文章";
					this.query();
				} else {
					this.title = "新增文章";
					this.visible = true;
					this.$nextTick(() => {
						this.$nextTick(() => {
							if (this.$refs.commodityTypeSinglePic) {
								this.$refs.commodityTypeSinglePic.data = "";
							}
						});
						if (this.$refs.content) {
							this.$refs.content.initFormTinymce();
						}
					});
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						that.submitting = true;
						let formData = {
							articleImage: that.form.articleImage,
							articleContent: that.form.articleContent,
							articleTitle: that.form.articleTitle,
							articleStatus: that.form.articleStatus
						};
						if (that.form.articleId > 0) {
							formData["articleId"] = that.form.articleId;
						}
						addAndUpdateArticle(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success(
										that.form.articleId > 0 ? "修改成功" : "添加成功",
										that
									);
									that.close();
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
			},
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
				this.form.uploadImage = value || [];
			}
		}
	};
</script>
