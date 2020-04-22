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
			<el-form-item label="角色名称：" size="small" prop="roleName">
				<el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
			</el-form-item>
			<el-form-item label="角色描述：" size="small" prop="roleCode">
				<el-input v-model="form.roleCode" placeholder="请输入角色描述"></el-input>
			</el-form-item>
			<el-form-item label="可用权限：" size="small">
				<el-tree
					:data="treeData"
					show-checkbox
					node-key="permissionId"
					ref="tree"
					style="margin-top: 5px"
					:default-expanded-keys="defaultKeys"
					:default-checked-keys="defaultKeys"
					:props="defaultProps"
				>
				</el-tree>
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
	import { addAndUpdateRole } from "@api/users/role";

	export default {
		mixins: [formMixin],
		data() {
			return {
				form: {
					roleId: "", //角色id
					roleName: "", //角色名称
					roleDesc: [], //权限id
					roleCode: "" //角色描述
				},
				defaultProps: {
					//资源树节点
					children: "children",
					label: "label"
				},
				treeData: [
					{
						id: 1,
						label: "全部",
						children: [
							{
								id: 3,
								label: "二级 2-1",
								children: [
									{
										id: 4,
										label: "三级 3-1-1"
									},
									{
										id: 5,
										label: "三级 3-1-2"
									}
								]
							},
							{
								id: 2,
								label: "二级 2-2",
								children: [
									{
										id: 6,
										label: "三级 3-2-1"
									},
									{
										id: 7,
										label: "三级 3-2-2"
									}
								]
							}
						]
					}
				], //资源树
				defaultKeys: [],
				rules: {
					roleName: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					roleCode: [
						{
							required: true,
							message: "不能为空",
							trigger: "blur"
						}
					],
					roleDesc: [
						{
							required: true,
							message: "不能为空",
							trigger: "change"
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
						that.submitting = true;
						let formData = {
							roleName: that.form.roleName, //角色名称
							roleCode: that.form.roleCode, //角色描述
							roleDesc: '0'
						};
						if (that.form.roleId > 0) {
							formData["roleId"] = that.form.roleId;
						}
						addAndUpdateRole(formData)
							.then(data => {
								if (data.succeed) {
									that.visible = false;
									that.$message.success("添加成功", that);
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
								that.$message.warning(
									err.body.message || that.MSG_UNKNOWN,
									that
								);
							})
							.finally(() => {
								that.submitting = false;
							});
					} else {
						console.log("Failure of form validation!!");
					}
				});
			},
			query() {}
		}
	};
</script>
