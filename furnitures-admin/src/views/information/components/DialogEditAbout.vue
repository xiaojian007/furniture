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
		<el-form class="form-edit" ref="form" :model="form" :rules="rules" @submit.native.prevent>
			<!-- 富文本 -->
			<template v-if="isEdit">
				<el-form-item size="small">
					<div class="content" v-html="form.dictValue"></div>
				</el-form-item>
			</template>
			<template v-else>
				<el-form-item size="small" prop="dictValue">
					<Tinymce v-model="form.dictValue" ref="content"></Tinymce>
				</el-form-item>
			</template>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<template v-if="!isEdit">
				<el-button type="primary" size="small" @click="submit" :loading="submitting">
					提交
				</el-button>
			</template>
		</div>
		<ComImage></ComImage>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";
	import Tinymce from "@com/tinymce";
	import { enumCommodityPerfectStatus } from "@common/enums/index";
	import { updateAbout } from "@api/information/about";

	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				enumCommodityPerfectStatus,
				form: {
					dictCode: "about",
					dictId: 0,
					dictKey: "",
					dictValue: ""
				},
				isEdit: false,
				rules: {
					dictValue: [
						{
							required: true,
							message: "内容不能为空",
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
			load(row, bool = false) {
				this.title = "修改";
				this.visible = true;
				this.form.dictKey = row.dictKey;
				this.form.dictValue = row.dictValue;
				this.form.dictId = row.dictId;
				this.isEdit = bool;
				if (!bool) {
					this.$nextTick(() => {
						this.$refs.content.initFormTinymce();
					});
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						that.submitting = true;
						let formData = {
							dictCode: "about",
							dictId: that.form.dictId,
							dictKey: that.form.dictKey,
							dictValue: that.form.dictValue
						};
						if (that.form.articleId > 0) {
							formData["articleId"] = that.form.articleId;
						}
						updateAbout(formData)
							.then(data => {
								if (data.succeed) {
									that.$message.success("修改成功", that);
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
			}
		}
	};
</script>

<style lang="less" scoped>
	.content {
		max-height: 500px;
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px 20px;
	}
</style>
