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
									<el-button type="text" @click="$refs.edit.add(scope.row.id)">
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
		<EditProductType ref="edit" @success="query"></EditProductType>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import EditProductType from "./components/DialogEditProductType";

	export default {
		mixins: [listMixin],
		components: { EditProductType },
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
						label: "类型名称",
						width: 130
					},
					{
						show: true,
						prop: "companyName",
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
				setTimeout(() => {
					let list = [
						{
							id: 270,
							supplierId: 60,
							extendedState: 3,
							reportPrice: 3,
							comments: "测",
							creatorId: 2061,
							creator: "尺寸",
							deleted: 0,
							updateTime: "2020-01-10 19:28:41",
							createTime: "2020-03-10 11:26:07",
							companyName: "180,170,160,150",
							extendedStateStr: null,
							reportPriceStr: null
						},
						{
							id: 249,
							supplierId: 60,
							extendedState: 4,
							reportPrice: 3,
							commentPurpose: "15464",
							creatorId: 43,
							creator: "颜色",
							updateTime: "2020-01-10 19:28:41",
							createTime: "2020-01-10 17:43:13",
							companyName: "黄色,蓝色,白色,黑色",
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
