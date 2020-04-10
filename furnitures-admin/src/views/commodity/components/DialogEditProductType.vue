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
			<el-form-item label="SKU名称:" size="small" prop="name">
				<el-input v-model="form.name" placeholder="请输入SKU名称"></el-input>
			</el-form-item>
			<el-form-item label="类型名称:" size="small" prop="skuName">
				<div class="type-item" v-for="(item, index) in form.typeList" :key="index">
					<el-form-item
						label-width="0"
						size="small"
						:prop="'typeList.' + index + '.skuName'"
						:rules="rules.skuName"
					>
						<el-input
							v-model="item.skuName"
							placeholder="请输入SKU名称"
							maxlength="10"
						></el-input>
						<span
							class="delete el-icon-delete"
							@click="deleteType(index)"
							v-if="form.typeList.length > 1"
						></span>
					</el-form-item>
				</div>
				<el-button class="add" @click="addType" size="small" type="primary">新增</el-button>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button type="primary" size="small" @click="submit" :loading="submitting">
				提交
			</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					id: "", //类型id
					typeList: [
						{
							skuName: ""
						}
					]
				},
				params: {
					id: ""
				},
				rules: {
					name: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					skuName: [
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
			// 删除
			deleteType(item) {
				this.form.typeList.splice(item, 1);
			},
			// 添加
			addType() {
				let list = this.form.typeList;
				if (list[list.length - 1].skuName === "") {
					this.$message.warning("请填写后再添加", this);
					return;
				}
				this.form.typeList.push({
					skuName: ""
				});
			},
			close() {
				this.reset();
				this.form.typeList = [{ skuName: "" }];
				this.visible = false;
				this.submitting = false;
			},
			add(id = 0) {
				this.visible = true;
				if (id > 0) {
					this.title = "修改SKU类型";
					this.query(); // 获取角色信息
				} else {
					this.title = "新增SKU类型";
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
			query() {}
		}
	};
</script>

<style lang="less" scoped>
	.type-item {
		position: relative;
		width: 49%;
		float: left;
		&:nth-child(2n-1) {
			margin-right: 2%;
		}
		span {
			position: absolute;
			right: 10px;
			top: 5px;
			font-size: 22px;
			color: #f00;
			cursor: pointer;
		}
	}

	.add {
		vertical-align: top;
	}
</style>
