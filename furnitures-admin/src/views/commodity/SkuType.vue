<template>
	<div class="list-panel" v-loading="loading">
		<div class="list-search">
			<el-form ref="form" :inline="true" :model="params" class="form-search">
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
				<el-button type="primary" size="small" :loading="querying" @click="$refs.edit.add()"
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
								<template v-if="field.prop === 'attributeDtoList'">
									<router-link
										:to="{
											path: '/commodity/sku-list',
											query: { skuId: scope.row.skuId }
										}"
									>
										{{ scope.row.attributeDtoList.length }}
									</router-link>
								</template>
								<template v-else-if="field.prop === 'operation'">
									<el-button type="text" @click="edit(scope.row)">
										修改
									</el-button>
									<el-button type="text" @click="deleteSkuType(scope.row)">
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
		<EditSkuType ref="edit" @success="query"></EditSkuType>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditSkuType from "./components/DialogEditSkuType";
	import { getSkuTypeList, deleteSkuType } from "@api/commodity/sku";

	export default {
		mixins: [listMixin],
		components: { EditSkuType },
		data() {
			return {
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "skuId",
						align: "center",
						label: "编号",
						width: 80
					},
					{
						show: true,
						prop: "skuName",
						align: "center",
						label: "类型名称",
						width: 130
					},
					{
						show: true,
						prop: "attributeDtoList",
						align: "center",
						label: "属性数量",
						width: 80
					},
					{
						show: true,
						prop: "updateTime",
						align: "center",
						label: "修改时间",
						width: 80
					},
					{
						show: true,
						fixed: "right",
						prop: "operation",
						align: "center",
						className: "table-operation-col",
						label: "操作",
						width: 80
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
				this.params.pageNum = 1;
				this.query();
			},
			query() {
				let that = this;
				that.querying = true;
				that.loading = true;
				getSkuTypeList(that.params)
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
			},
			edit(row) {
				let that = this;
				if (row.attributeDtoList && row.attributeDtoList.length > 0) {
					that.$message.warning("该类型下有数据下不能删除", that);
					return;
				}
				that.$refs.edit.add(row.skuId);
			},
			deleteSkuType(row) {
				let that = this;
				if (row.attributeDtoList && row.attributeDtoList.length > 0) {
					that.$message.warning("该类型下有数据下不能删除", that);
					return;
				}
				that.$confirm(
					"删除该角色后，该角色下的用户将全部被删除，确认删除改角色？",
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
					that.querying = true;
					deleteSkuType({ skuId: row.skuId })
						.then(data => {
							if (data.succeed) {
								that.$message.success("删除成功！", that);
								that.query();
							} else {
								that.$message.warning(data.message || that.MSG_UNKNOWN, that);
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
