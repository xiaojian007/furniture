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
				<el-button
					type="primary"
					size="small"
					:loading="querying"
					@click="$refs.editRole.load()"
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
								<template v-if="field.prop === 'extendedState'">
									{{ enumExpandState.obj[scope.row[field.prop]] | nullValue }}
								</template>
								<template v-else-if="field.prop === 'reportPrice'">
									{{ enumOfferType.obj[scope.row[field.prop]] | nullValue }}
								</template>
								<template v-else-if="field.prop === 'createTime'">
									<div v-html="formatDateOutput(scope.row[field.prop])"></div>
								</template>
								<template v-else-if="field.prop === 'operation'">
									<el-button
										type="text"
										@click="$refs.editRole.load(scope.row.id)"
									>
										修改
									</el-button>
									<el-button type="text" @click="deleteRole(scope.row.id)">
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
				:current-page="page.currentPage"
				:page-sizes="PAGE_SIZES"
				:page-size="page.pageSize"
				layout="total, sizes, prev, pager, next"
				prev-text="上一页"
				next-text="下一页"
				:total="page.totalCount"
			>
			</el-pagination>
		</div>
		<EditRole ref="editRole" @success="query"></EditRole>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditRole from "./components/DialogEditRole";

	export default {
		mixins: [listMixin],
		components: { EditRole },
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
						prop: "supplierId",
						align: "center",
						label: "编号",
						width: 80
					},
					{
						show: true,
						prop: "creator",
						align: "center",
						label: "角色名称",
						width: 130
					},
					{
						show: true,
						prop: "companyName",
						align: "center",
						label: "角色描述",
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
				this.params.currentPage = 1;
				this.query();
			},
			query() {
				let that = this;
				that.querying = true;
				that.loading = true;
				setTimeout(() => {
					let list = [
						{
							id: 270,
							supplierId: 60,
							extendedState: 3,
							reportPrice: 3,
							commentPurpose: "测试",
							comments: "测",
							creatorId: 2061,
							creator: "黄庆鸿",
							deleted: 0,
							updateTime: null,
							createTime: "2020-03-10 11:26:07",
							companyName: "上海乐盈纸业",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 268,
							supplierId: 1124,
							extendedState: 5,
							reportPrice: 3,
							commentPurpose: "同时咯啦咯",
							comments: "统计咯聚咯某家了",
							creatorId: 2061,
							creator: "黄庆鸿",
							deleted: 0,
							updateTime: null,
							createTime: "2020-03-09 14:17:57",
							companyName: "岳阳立华包装材料科技",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 258,
							supplierId: 417,
							extendedState: 3,
							reportPrice: 3,
							commentPurpose: "sd2222",
							comments: "df222\n34\n34\n3\n434\n34",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: "2020-02-27 17:39:53",
							createTime: "2020-02-27 17:39:42",
							companyName: "上海联合包装装潢",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 257,
							supplierId: 417,
							extendedState: 3,
							reportPrice: 3,
							commentPurpose: "sdas",
							comments: "sad",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: null,
							createTime: "2020-02-27 17:36:26",
							companyName: "上海联合包装装潢",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 256,
							supplierId: 417,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "拜访目的",
							comments: "拜访结果",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: null,
							createTime: "2020-02-27 17:33:19",
							companyName: "上海联合包装装潢",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 255,
							supplierId: 417,
							extendedState: 3,
							reportPrice: 1,
							commentPurpose: "太阳LOL",
							comments: "头像log",
							creatorId: 2061,
							creator: "黄庆鸿",
							deleted: 0,
							updateTime: "2020-01-19 15:23:16",
							createTime: "2020-01-18 18:56:41",
							companyName: "上海联合包装装潢",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 253,
							supplierId: 323,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "这是拜访目的",
							comments: "这是采访结果",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: null,
							createTime: "2020-01-18 17:45:08",
							companyName: "上海瑞邦纸品包装",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 251,
							supplierId: 60,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "15464",
							comments: "宁静和你聊213123\n11\n213213\n\nwew",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: "2020-01-10 19:31:50",
							createTime: "2020-01-10 19:31:31",
							companyName: "上海乐盈纸业",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 250,
							supplierId: 60,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "15464",
							comments: "宁静和你聊213123\n\n213213\n\nwew",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: null,
							createTime: "2020-01-10 19:30:35",
							companyName: "上海乐盈纸业",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 249,
							supplierId: 60,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "15464",
							comments: "宁静和你聊\n\nwew",
							creatorId: 43,
							creator: "冯露露",
							deleted: 0,
							updateTime: "2020-01-10 19:28:41",
							createTime: "2020-01-10 17:43:13",
							companyName: "上海乐盈纸业",
							extendedStateStr: null,
							reportPriceStr: null
						}
					];
					this.list = list;
					that.querying = false;
					that.loading = false;
				}, 1000);
			},
			deleteRole(id) {
				let that = this;
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
					that.loading = true;
					that.querying = true;
					console.log(id);
					// orderReview({id: id}, () => {
					//     that.$message.success('已接单', that)
					//     that.query()
					//     that.loading = false
					//     that.querying = false
					// }, (data) => {
					//     that.loading = false
					//     that.querying = false
					//     that.$alert(data.resultMsg, '温馨提示', {
					//         confirmButtonText: '知道了'
					//     })
					// }, (data) => {
					//     that.loading = false
					//     that.querying = false
					//     that.$alert(data.resultMsg, '温馨提示', {
					//         confirmButtonText: '知道了'
					//     })
					// })
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
