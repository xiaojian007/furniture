<template>
	<div class="list-panel" v-loading="loading">
		<div class="list-search">
			<el-form ref="form" :inline="true" :model="params" class="form-search">
				<el-form-item size="small">
					<ComDateRange
						ref="input-0"
						:mode="1"
						:clearable="true"
						class="date-width"
						@change="changeDateRangeOperate"
					></ComDateRange>
				</el-form-item>
				<el-form-item label="角色：" size="small">
					<el-select
						v-model="params.roleId"
						@change="query"
						clearable
						placeholder="请选择"
						class="visit-person"
					>
						<el-option
							v-for="item in roleList"
							:key="item.value"
							:label="item.text"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<div class="input-search">
					<el-form-item size="small" label=" ">
						<el-input
							v-model.trim="params.searchKey"
							class="search-key"
							clearable
							placeholder="请输入内容"
							@keyup.enter.native="enterSearch"
						></el-input>
					</el-form-item>
					<el-form-item size="small">
						<el-button type="warning" @click="search" :loading="querying"
							>查询</el-button
						>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div class="list-result">
			<div class="list-buttons">
				<el-button
					@click="$refs.edit.load()"
					type="primary"
					size="small"
					:loading="querying"
					>添加
				</el-button>

				<el-button @click="query" size="small" :loading="querying">刷新</el-button>
			</div>
			<div class="list-table">
				<el-table
					ref="table"
					:data="list"
					height="100%"
					:highlight-current-row="true"
					class="all-width"
				>
					<el-table-column label="序号" type="index" align="center" width="80">
					</el-table-column>
					<template v-for="(field, colIndex) in fields">
						<el-table-column
							v-if="field.show"
							:key="colIndex"
							:fixed="
								field.fixed
									? field.prop === 'operation'
										? 'right'
										: 'left'
									: false
							"
							:prop="field.prop"
							:align="field.align"
							:label="field.label"
							:class-name="field.className"
							:min-width="field.width || 100"
						>
							<template slot-scope="scope">
								<template v-if="field.prop === 'updateTime'">
									<div v-html="formatDateOutput(scope.row[field.prop])"></div>
								</template>
								<template v-else-if="field.prop === 'userStatus'">
									{{ scope.row.userStatus === 0 ? "未审核" : "已审核" }}
								</template>

								<template v-else-if="field.prop === 'operation'">
									<el-button
										type="text"
										@click="$refs.edit.load(scope.row)"
									>
										修改
									</el-button>
									<el-button type="text" @click="deleteUser(scope.row.userId)">
										删除
									</el-button>
								</template>
								<template v-else>
									{{ scope.row[field.prop] | nullValue }}
								</template>
							</template>
						</el-table-column>
					</template>
				</el-table>
			</div>
		</div>
		<div class="list-pagination">
			<el-pagination
				small
				background
				@size-change="changePageSize"
				@current-change="changeCurrentPage"
				:current-page="page.pageNum"
				:page-sizes="PAGE_SIZES"
				:page-size="page.pageSize"
				layout="total, sizes, prev, pager, next"
				prev-text="上一页"
				next-text="下一页"
				:total="page.totalCount"
			>
			</el-pagination>
		</div>
		<EditUser :roleList="roleList" ref="edit" @success="query"></EditUser>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditUser from "./components/DialogEditUser";
	import { getUserList, deteleUser } from "@api/users/user";
	import { getRoleList } from "@api/users/role";
	export default {
		mixins: [listMixin],
		components: { EditUser },
		data() {
			return {
				roleList: [],
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {
					startTime: "", //开始时间
					endTime: "", //结束时间
					roleId: "", //拜访人
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "userName",
						align: "center",
						label: "用户名称",
						width: 130
					},
					{
						show: true,
						prop: "mobile",
						align: "center",
						label: "手机号",
						width: 80
					},
					{
						show: true,
						prop: "roleName",
						align: "center",
						label: "角色名称",
						width: 80
					},
					{
						show: true,
						prop: "userStatus",
						align: "center",
						label: "状态",
						width: 80
					},
					{
						show: true,
						prop: "updateTime",
						align: "center",
						label: "更新时间"
					},
					{
						show: true,
						fixed: "right",
						prop: "operation",
						align: "center",
						className: "table-operation-col",
						label: "操作",
						width: 140
					}
				]
			};
		},
		activated() {
			//被 keep-alive 缓存的组件激活时调用
			if (!this.isKeepAlive) {
				this.query();
			}
		},
		methods: {
			//回车搜索
			enterSearch() {
				let that = this;
				if (that.searchKey !== that.params.searchKey) {
					that.search();
				}
				that.searchKey = that.params.searchKey;
			},
			//时间搜索
			changeDateRangeOperate(dateRanges) {
				dateRanges = dateRanges || [];
				if (dateRanges instanceof Array) {
					this.params.startTime = dateRanges[0];
					this.params.endTime = dateRanges[1];
				}
				this.query();
			},
			query() {
				let that = this;
				that.querying = true;
				that.loading = true;
				let paramsData = {
					pageNum: that.params.pageNum,
					pageSize: that.params.pageSize,
					roleId: that.params.roleId,
					startTime: that.params.startTime,
					endTime: that.params.endTime,
					searchKey: that.params.searchKey
				};
				getUserList(paramsData)
					.then(data => {
						if (data.succeed) {
							that.list = data.body.list || [];
							that.page.totalCount = data.body.total;
						} else {
							that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.querying = false;
						that.loading = false;
					});
				getRoleList({
					pageNum: 1,
					pageSize: 1000
				})
					.then(data => {
						if (data.succeed) {
							let list = data.body.list || [];
							let roleList = [];
							list.forEach(item => {
								roleList.push({
									text: item.roleName,
									value: item.roleId
								});
							});
							that.roleList = roleList;
						} else {
							that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.querying = false;
						that.loading = false;
					});
			},

			deleteUser(id) {
				let that = this;
				that.$confirm(
					"删除该用户后，该用户下的用户将全部被删除，确认删除改用户？",
					"提示",
					{
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						customClass: "custom-confirm custom-confirm-danger", // 图标样式
						confirmButtonClass: "el-button--primary", // 确认按钮样式
						closeOnClickModal: that.CONFIRM_MODAL_CLOSE, // 是否可以点击空白关闭
						closeOnPressEscape: that.CONFIRM_ESC_CLOSE, // 是否可以esc关闭
						showClose: false // 是否显示关闭按钮
					}
				).then(() => {
					that.loading = true;
					that.querying = true;
					deteleUser({ userId: id })
						.then(data => {
							if (data.succeed) {
								that.$message.success("删除成功", that);
								that.query();
							} else {
								that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
							}
						})
						.catch(err => {
							that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
						})
						.finally(() => {
							that.querying = false;
						});
				});
			}
		}
	};
</script>
<style lang="less" scoped>
	.list-panel {
		.input-search {
			display: inline-block;
		}
		.date-width {
			width: 250px;
		}
		.visit-person {
			width: 100px;
		}

		.search-key {
			width: 200px;
		}

		.all-width {
			width: 100%;
		}
	}
</style>
