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
			<el-form-item label="类别名称：" size="small" prop="typeName">
				<el-input v-model="form.typeName" placeholder="请输入类别名称"></el-input>
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
				提交
			</el-button>
		</div>
		<ComImage ref="image"></ComImage>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";
	import { addAndUpdateProductType, getProductType } from "@api/commodity/product";
	export default {
		mixins: [formMixin],
		data() {
			return {
				isNoCarouselPic: true, // 是否需要添加轮播图
				form: {
					typeId: "", //类别id
					parentId: "", // 父级
					typeLevel: 0, // 分类级别
					typeName: "", //类别名称
					resourceIdList: [] //权限id
				},
				params: {
					roleId: ""
				},
				defaultKeys: [],
				rules: {
					typeName: [
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
				this.$refs.commodityTypeMultPic.data = null;
				this.$refs.commodityTypeSinglePic.data = null;
				this.visible = false;
				this.submitting = false;
			},
			add(id = 0, data) {
				if (id > 0) {
					this.title = "修改类型";
					this.form.parentId = data.data.parentId;
					this.form.typeId = data.data.id;
					this.form.typeLevel = data.data.typeLevel;
					this.query(); // 获取类别信息
				} else {
					this.title = "新增类型";
					this.form.parentId = data.data.id;
					this.form.typeLevel = data.data.typeLevel + 1;
					this.visible = true;
				}
				console.log(this.form);
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						let formData = {
							bannerImage:
								"//n.sinaimg.cn/news/1_img/upload/cf3881ab/67/w1000h667/20200408/66a8-iryninw4454635.jpg,//n.sinaimg.cn/news/1_img/upload/cf3881ab/67/w1000h667/20200408/66a8-iryninw4454635.jpg",
							parentId: that.form.parentId,
							showHome: 0, // 首页是否展示 0:否 1:是
							typeImage:
								"//n.sinaimg.cn/news/1_img/upload/cf3881ab/67/w1000h667/20200408/66a8-iryninw4454635.jpg", // 分类图片
							typeLevel: that.form.typeLevel,
							typeName: that.form.typeName
						};
						if (that.form.typeId) {
							formData["typeId"] = that.form.typeId;
						}
						that.submitting = true;
						addAndUpdateProductType(formData)
							.then(data => {
								if (data.succeed) {
									console.log(data);
									that.visible = false;
									that.$message.success(
										that.form.skutypeIdId > 0 ? "修改成功" : "添加成功",
										that
									);
									that.$emit("success");
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
					} else {
						console.log("Failure of form validation!!");
					}
				});
			},
			query() {
				let that = this;
				that.submitting = true;
				getProductType({ typeId: this.form.typeId })
					.then(data => {
						if (data.succeed) {
							that.form.typeName = data.body.typeName;
							this.visible = true;
							that.$nextTick(() => {
								if (that.$refs.commodityTypeMultPic && data.body.bannerImage) {
									that.$refs.commodityTypeMultPic.data =
										data.body.bannerImage.split(",") || null;
								}
								if (that.$refs.commodityTypeSinglePic && data.body.bannerImage) {
									that.$refs.commodityTypeSinglePic.data =
										data.body.typeImage || null;
								}
							});
						} else {
							that.$message.warning(
								data.message || "获取类别失败，请稍后重试！",
								that
							);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || "获取类别失败，请稍后重试！", that);
					})
					.finally(() => {
						that.submitting = false;
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
				let bannerImage = [];
				list.forEach(item => {
					bannerImage.push(item.url);
				});
				this.form.bannerImage = bannerImage;
				console.log(key, value, list);
			},
			changeSinglePicture(key, value) {
				this.form.typeImage = value;
				console.log(key, value);
			}
		}
	};
</script>
