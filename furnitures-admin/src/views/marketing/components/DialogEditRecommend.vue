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
			<el-form-item label="路径指向:" size="small" prop="typeId">
				<el-cascader
					:options="commodityTypeList"
					v-model="form.typeId"
					placeholder="请选择路径"
					:props="{
						value: 'typeId',
						expandTrigger: 'hover',
						children: 'typeVoList',
						label: 'typeName'
					}"
				>
					<template slot-scope="{ node, data }">
						<span>{{ data.typeName }}</span>
					</template>
				</el-cascader>
			</el-form-item>
			<el-form-item label="封面图片：" size="small" prop="dictValueExtra1">
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
	import { addAndUpdateDict } from "@api/marketing/index";
	import { getProductTypeList } from "@api/commodity/product";
	export default {
		mixins: [formMixin],
		components: { Tinymce },
		data() {
			return {
				commodityTypeList: [], // 商品类别
				form: {
					dictKey: "", //
					typeId: "",
					dictId: "",
					dictValueExtra1: ""
				},
				params: {
					roleId: ""
				},
				rules: {
					typeId: [
						{
							required: true,
							message: "选择路径",
							trigger: "blur"
						}
					],
					dictKey: [
						{
							required: true,
							message: "请输入关键字",
							trigger: "blur"
						}
					],
					dictValueExtra1: [
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
			load(item = {}) {
				let that = this;
				this.queryCommodityTree();
				if (item) {
					that.visible = true;
					that.form.dictCode = item.dictCode;
					that.form.dictId = item.dictId;
					that.form.dictKey = item.dictKey;
					that.$nextTick(() => {
						if (that.$refs.commodityTypeSinglePic) {
							that.$refs.commodityTypeSinglePic.data = item.dictValueExtra1;
						}
					});
					that.title = "修改";
				} else {
					that.title = "新增";
					that.visible = true;
				}
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						let typeFirstId = that.form.typeId[0];
						let typeSecondId = that.form.typeId[1];
						let typeFirstName = "";
						let typeSecondName = "";
						let commodityTypeList = that.commodityTypeList || [];
						commodityTypeList.forEach(item => {
							if (item.typeVoList) {
								item.typeVoList.forEach(itemChild => {
									if (typeSecondId === itemChild.typeId) {
										typeSecondName = itemChild.typeName;
										typeFirstName = item.typeName;
									}
								});
							} else {
								typeFirstName = item.typeName;
							}
						});
						let typeParams = {
							typeFirstId: typeFirstId, // 一级类型id
							typeFirstName: typeFirstName, // 一级名称
							typeSecondId: typeSecondId, // 二级类型id
							typeSecondName: typeSecondName //二级名称
						};

						let formData = {
							dictValue: JSON.stringify(typeParams),
							dictValueExtra1: that.form.dictValueExtra1,
							dictKey: that.form.dictKey,
							dictCode: "recommend"
						};

						if (that.form.dictId > 0) {
							formData["dictId"] = that.form.dictId;
						}
						that.submitting = true;
						addAndUpdateDict(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success(
										that.form.dictId > 0 ? "修改成功" : "添加成功",
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
			// 获取产品tree
			queryCommodityTree() {
				let that = this;
				that.queryingTree = true;

				getProductTypeList({ hasSecond: true })
					.then(data => {
						if (data.succeed) {
							let commodityTypeList = data.body || [];
							that.commodityTypeList = commodityTypeList;
						} else {
							that.$message.warning(data.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.queryingTree = false;
					});
			},

			changeSinglePicture(key, value) {
				this.form.dictValueExtra1 = value;
			}
		}
	};
</script>

<style lang="less" scoped>
	/deep/.el-cascader {
		width: 100%;
	}
</style>
