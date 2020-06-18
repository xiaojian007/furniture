<template>
	<div class="list-panel" v-loading="loading">
		<div class="list-result">
			<div class="list-buttons">
				<el-button @click="query" size="small" :loading="querying">刷新</el-button>
			</div>
			<div class="list-table">
				<el-table
					ref="table"
					:data="list"
					type="expand"
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
								<template v-if="field.prop === 'logSpentTime'">
									<div v-html="formatDateOutput(scope.row[field.prop])"></div>
								</template>
								<template v-else-if="field.prop === 'logResMsg'">
									<JsonData :json="scope.row.logResMsg"></JsonData>
								</template>
								<template v-else-if="field.prop === 'logHttpRes'">
									<JsonData :json="scope.row.logHttpRes"></JsonData>
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
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import { getOperationLog } from "@api/users/operation-log";
	import JsonData from "./components/DialogJsonData";

	export default {
		mixins: [listMixin],
		components: { JsonData },
		data() {
			return {
				jsonData: {},
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {},
				page: {},
				fields: [
					{
						show: true,
						prop: "logSpentTime",
						align: "center",
						label: "请求时间",
						className: "t-date",
						width: 50
					},
					{
						show: true,
						prop: "logMethodName",
						align: "center",
						label: "请求名称",
						width: 100
					},
					{
						show: true,
						prop: "logHttpRes",
						align: "center",
						label: "请求传参"
					},
					{
						show: true,
						prop: "logHttpType",
						align: "center",
						label: "请求方式",
						width: 80
					},
					{
						show: true,
						prop: "logResMsg",
						align: "center",
						label: "返回参数"
					},
					{
						show: true,
						prop: "logMethodPath",
						align: "center",
						label: "请求路径"
                    },
					{
						show: true,
						prop: "logHttpIp",
						align: "center",
						label: "请求IP"
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
					pageSize: that.params.pageSize
				};
				getOperationLog(paramsData)
					.then(data => {
						if (data.succeed) {
							let list = [];
							that.page.totalCount = data.body.total;
							data.body.list.forEach(item => {
								let items = {
									logId: item.logId,
									logHttpIp: item.logHttpIp,
									logHttpRes: item.logHttpRes ? JSON.parse(item.logHttpRes || "{}") : {},
									logResMsg: item.logResMsg ? JSON.parse(item.logResMsg || "{}") : {},
									logSpentTime: item.logSpentTime,
									logTraceId: item.logTraceId,
                                    logHttpType: item.logHttpType,
                                    logMethodPath: item.logMethodPath,
									logMethodName: item.logMethodName
                                };
								list.push(items);
							});
                            that.list = list;
						} else {
							that.$message.warning(data.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.querying = false;
						that.loading = false;
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
