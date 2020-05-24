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
			<el-form-item label="VR标题：" size="small" prop="vrTitle">
				<el-input v-model="form.vrTitle" placeholder="请输入VR标题"></el-input>
			</el-form-item>
			<el-form-item label="是否发布:" size="small">
				<el-select v-model="form.vrStatus" placeholder="默认不发布" style="width: 100%">
					<el-option
						v-for="item in enumCommodityPerfectStatus.arr"
						:key="item.value"
						:label="item.text"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="封面图片：" size="small" prop="vrImage">
				<ComUploadSinglePicture
					:styleBox="true"
					ref="commodityTypeSinglePic"
					@change="changeSinglePicture"
				></ComUploadSinglePicture>
			</el-form-item>

			<!-- 富文本 -->
			<el-form-item label="VR链接:" size="small" prop="vrLink">
				<el-input v-model="form.vrLink" placeholder="请输入VR标题"></el-input>
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
	import { addAndUpdateVr, getVrDetail } from "@api/information/vr";

	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				enumCommodityPerfectStatus,
				form: {
					vrId: "", //id
					vrTitle: "", // 标题
					vrStatus: 0, // 文章状态 0：未发布 1:已发布
					vrImage: "", //图片
					vrLink: ""
				},
				params: {
					roleId: ""
				},
				rules: {
					vrTitle: [
						{
							required: true,
							message: "文章标题不能为空",
							trigger: "blur"
						}
					],
					vrImage: [
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
			load(vrId = 0) {
				if (vrId > 0) {
					this.form.vrId = vrId;
					this.title = "修改VR";
					this.query();
				} else {
					this.title = "新增VR";
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
							vrImage: that.form.vrImage,
							vrLink: that.form.vrLink,
							vrTitle: that.form.vrTitle,
							vrStatus: that.form.vrStatus
						};
						if (that.form.vrId > 0) {
							formData["vrId"] = that.form.vrId;
						}
						addAndUpdateVr(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success(
										that.form.vrId > 0 ? "修改成功" : "添加成功",
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
					getVrDetail({ vrId: that.form.vrId })
						.then(data => {
							if (data.succeed) {
								that.setFormData(that.form, data.body);
								that.$nextTick(() => {
									if (that.$refs.commodityTypeSinglePic) {
										that.$refs.commodityTypeSinglePic.data =
											that.form.vrImage || "";
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
				this.form.vrImage = value;
			}
		}
	};
</script>
