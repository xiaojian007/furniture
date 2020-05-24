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
			label-width="130px"
		>
			<el-form-item label="数据字典Key：" size="small" prop="dictKey">
				<el-input v-model="form.dictKey" placeholder="请输入数据字典Key"></el-input>
			</el-form-item>
			<el-form-item label="数据字典Value：" size="small" prop="dictValue">
				<ComUploadSinglePicture
					:styleBox="true"
					ref="commodityTypeSinglePic"
					@change="changeSinglePicture"
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
	import Tinymce from "@com/tinymce";
	import { enumCommodityPerfectStatus } from "@common/enums/index";
	import { addAndUpdateDict } from "@api/marketing/index";

	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				enumCommodityPerfectStatus,
				form: {
					dictKey: "", // 标题
					dictValue: ""
				},
				params: {
					roleId: ""
				},
				rules: {
					dictKey: [
						{
							required: true,
							message: "序号不能为空",
							trigger: "blur"
						}
					],
					dictValue: [
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
				that.$nextTick(() => {
					if (that.$refs.commodityTypeSinglePic) {
						that.$refs.commodityTypeSinglePic.data = null;
					}
				});
				that.reset();
				that.visible = false;
				that.submitting = false;
			},
			load(dictCode = 0) {
				let that = this;
				if (dictCode > 0) {
					that.form.dictCode = dictCode;
					that.title = "修改数据字典";
				} else {
					that.title = "新增数据字典";
					that.visible = true;
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						that.submitting = true;
						let formData = {
							dictValue: that.form.dictValue,
							dictKey: that.form.dictKey,
							dictCode: "banner_image"
						};
						if (that.form.dictCode > 0) {
							formData["dictCode"] = that.form.dictCode;
						}
						addAndUpdateDict(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success(
										that.form.dictCode > 0 ? "修改成功" : "添加成功",
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
			changeSinglePicture(key, value) {
				console.log(key, value);
				this.form.dictValue = value;
			}
		}
	};
</script>
