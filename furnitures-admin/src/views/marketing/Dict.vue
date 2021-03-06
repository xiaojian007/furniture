<template>
	<div class="list-panel" v-loading="loading">
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
								<template v-if="field.prop === 'operation'">
									<el-button type="text" @click="deleteInfo(scope.row.dictId)">
										删除
									</el-button>
									<el-button type="text" @click="updateInfo(scope.row)">
										置顶
									</el-button>
								</template>
								<template v-else-if="field.prop === 'dictValue'">
									<el-image
										style="width: 100px; height: 100px"
										:src="scope.row.dictValue"
										:preview-src-list="[scope.row.dictValue]"
									>
									</el-image>
								</template>
								<template v-else-if="field.prop === 'updateTime'">
									<div v-html="formatDateOutput(scope.row[field.prop])"></div>
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
		<EditInfo ref="edit" @success="query"></EditInfo>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditInfo from "./components/DialogEditDict";
	import { deteleDict, getDictList, updateDict } from "@api/marketing/index";

	export default {
		mixins: [listMixin],
		components: { EditInfo },
		data() {
			return {
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {
					startTime: "", //开始时间
					endTime: "", //结束时间
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "dictKey",
						align: "center",
						label: "数据字典Key",
						width: 130
					},
					{
						show: true,
						prop: "dictValue",
						align: "center",
						label: "数据字典Value",
						width: 130
					},

					{
						show: true,
						prop: "updateName",
						align: "center",
						label: "更新人",
						width: 80
					},
					{
						show: true,
						prop: "updateTime",
						align: "center",
						label: "更新时间",
						width: 80
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
					this.params.pageNum = 1;
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
					dictCode: "banner_image"
				};
				getDictList(paramsData)
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
			deleteInfo(id) {
				let that = this;
				that.$confirm("确认删除改该精选图片吗？", "提示", {
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					customClass: "custom-confirm custom-confirm-danger", // 图标样式
					confirmButtonClass: "el-button--primary", // 确认按钮样式
					closeOnClickModal: that.CONFIRM_MODAL_CLOSE, // 是否可以点击空白关闭
					closeOnPressEscape: that.CONFIRM_ESC_CLOSE, // 是否可以esc关闭
					showClose: false // 是否显示关闭按钮
				}).then(() => {
					that.querying = true;
					deteleDict({ dictId: id })
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
			},
			updateInfo(row) {
				let that = this;
				let params = {
					dictCode: row.dictCode,
                    dictKey: row.dictKey,
                    dictId: row.dictId,
					dictValue: row.dictValue
				};
				updateDict(params)
					.then(data => {
						if (data.succeed) {
							that.$message.success("已置顶", that);
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
