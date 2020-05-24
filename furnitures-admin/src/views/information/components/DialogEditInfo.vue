<template>
	<el-dialog
		:id="domId"
		:title="title"
		width="1000px"
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
			<el-form-item label="文章标题：" size="small" prop="articleTitle">
				<el-input v-model="form.articleTitle" placeholder="请输入文章标题"></el-input>
			</el-form-item>
			<el-form-item label="是否发布:" size="small">
				<el-select v-model="form.articleStatus" placeholder="默认不发布" style="width: 100%">
					<el-option
						v-for="item in enumCommodityPerfectStatus.arr"
						:key="item.value"
						:label="item.text"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="封面图片：" size="small" prop="articleImage">
				<ComUploadSinglePicture
					:styleBox="true"
					ref="commodityTypeSinglePic"
					@change="changeSinglePicture"
				></ComUploadSinglePicture>
			</el-form-item>

			<!-- 富文本 -->
			<el-form-item label="资讯内容:" size="small" prop="articleContent">
				<Tinymce v-model="form.articleContent" ref="content"></Tinymce>
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
	import { addAndUpdateArticle, getArticleDetail } from "@api/information/information";

	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				enumCommodityPerfectStatus,
				form: {
					articleId: "", //id
					articleTitle: "", // 标题
					articleStatus: 0, // 文章状态 0：未发布 1:已发布
					articleImage: "", //图片
					articleContent: ""
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
				this.reset();
				if (this.$refs.commodityTypeSinglePic) {
					this.$refs.commodityTypeSinglePic.data = "";
				}
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
			query() {
				let that = this;
				that.$nextTick(() => {
					getArticleDetail({ articleId: that.form.articleId })
						.then(data => {
							if (data.succeed) {
								that.setFormData(that.form, data.body);
								that.$nextTick(() => {
									that.$refs.content.initFormTinymce();
									if (that.$refs.commodityTypeSinglePic) {
										that.$refs.commodityTypeSinglePic.data =
											that.form.articleImage || "";
									}
								});
								that.visible = true;
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
				});
			},
			changeSinglePicture(key, value) {
				console.log(key, value);
				this.form.articleImage = value;
			}
		}
	};
</script>
