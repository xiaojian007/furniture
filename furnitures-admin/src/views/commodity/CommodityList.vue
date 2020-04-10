<template>
	<div class="list-panel" v-loading="loading">
		<div class="commodity-tree">
			<div class="tree-block" v-loading="queryingTree">
				<div class="tree-title">产品类别管理</div>
				<CommodityTypeTree
					:data="productTreeList"
					:isCheck="false"
					@handleNodeClick="handleNodeClick"
				>
					<ul slot="menu" slot-scope="props">
						<li
							@click="handleAddTree(props.data, props.node)"
							v-if="props.data.children"
						>
							新增
						</li>
						<li v-if="props.data.id">
							{{ props.data.sss === 1 ? "置顶" : "取消置顶" }}
						</li>
						<li
							@click="handleRenameTree(props.data, props.node)"
							v-if="props.data.id !== 0"
						>
							修改
						</li>
						<li
							@click="handleDelTree(props.data, props.node)"
							v-if="props.data.id !== 0"
						>
							删除
						</li>
					</ul>
				</CommodityTypeTree>
			</div>
		</div>
		<div class="commodity-list">
			<div class="list-search">
				<el-form ref="form" :inline="true" :model="params" class="form-search">
					<div class="input-search">
						<el-form-item label="商品状态：" size="small">
							<el-select
								v-model="params.publishStatus"
								@change="query"
								clearable
								placeholder="请选择"
								class="visit-person"
							>
								<el-option
									v-for="item in commodityPublishStatus"
									:key="item.value"
									:label="item.text"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否精选：" size="small">
							<el-select
								v-model="params.isPerfect"
								@change="query"
								clearable
								placeholder="请选择"
								class="visit-person"
							>
								<el-option
									v-for="item in commodityPerfectStatus"
									:key="item.value"
									:label="item.text"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item size="small" label="">
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
						@click="$refs.editCommdity.add()"
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
										<el-button type="text">
											查看
										</el-button>
										<el-button
											type="text"
											@click="$refs.editCommdity.add(scope.row.id)"
										>
											修改
										</el-button>
										<el-button type="text">
											删除
										</el-button>
									</template>
									<template v-else-if="field.prop === 'extendedState'">
										<el-switch
											:value="scope.row.extendedState === 3"
											@change="
												(val, id) => changePutShelves(val, scope.row.id)
											"
										>
										</el-switch>
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
		</div>
		<EditCommodityType ref="editCommdityType" @success="queryCommodityTree"></EditCommodityType>
		<EditCommodity ref="editCommdity" @success="queryCommodityList"></EditCommodity>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import CommodityTypeTree from "./components/CommodityTypeTree";
	import EditCommodityType from "./components/DialogEditCommodityType";
	import EditCommodity from "./components/DialogEditCommodity";
	import { enumCommodityPublishStatus, enumCommodityPerfectStatus } from "@common/enums/index";

	export default {
		mixins: [listMixin],
		components: { CommodityTypeTree, EditCommodityType, EditCommodity },
		data() {
			return {
				commodityPublishStatus: [{ value: "", text: "全部" }].concat(
					enumCommodityPublishStatus.arr
				),
				commodityPerfectStatus: [{ value: "", text: "全部" }].concat(
					enumCommodityPerfectStatus.arr
				),
				queryingTree: false, // tree Loading
				productTreeList: [], // 产品tree
				searchKey: "", //回车值是否变化
				list: [], //账号list
				params: {
					publishStatus: "", // 商品状态
					isPerfect: "", // 是否精选
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "supplierId",
						align: "center",
						label: "编号",
						className: "t-date",
						width: 80
					},
					{
						show: true,
						prop: "commentPurpose",
						align: "center",
						label: "商品名称",
						width: 130
					},
					{
						show: true,
						prop: "creator",
						align: "center",
						label: "价格",
						width: 80
					},
					{
						show: true,
						prop: "extendedState",
						align: "center",
						label: "是否上架",
						width: 100
					},
					{
						show: true,
						prop: "reportPrice",
						align: "center",
						label: "置顶",
						width: 80
					},
					{
						show: true,
						prop: "creatorId",
						align: "center",
						label: "销量"
					},
					{
						show: true,
						prop: "createTime",
						align: "center",
						label: "修改时间",
						width: 180
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
			/**
			 * 是否上架
			 * @method changePutShelves
			 * @param {Bolean} value 打开还是关闭
			 * @param {Number} id 点击的列表数据id
			 *
			 */
			changePutShelves(value, id) {
				console.log(id);
				let that = this;
				that.$confirm(value ? "是否确认开通云图推送？" : "是否确认关闭云图推送？", "", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					showClose: false,
					closeOnPressEscape: false,
					closeOnClickModal: false,
					customClass: "message-custom",
					confirmButtonClass: "message-confirm",
					cancelButtonClass: "message-cancel"
				}).then(() => {
					// switchPush(
					// 	{ id: id },
					// 	() => {
					// 		that.$message({
					// 			type: "success",
					// 			message: value ? "云图推送开通成功！" : "云图推送关闭成功！"
					// 		});
					// 		that.search();
					// 	},
					// 	() => {
					// 		that.$alert(
					// 			"操作失败：请检查账号与钉钉手机号码是否一致！",
					// 			"温馨提示",
					// 			{
					// 				confirmButtonText: "知道了"
					// 			}
					// 		);
					// 	},
					// 	data => {
					// 		that.$alert(data.resultMsg || that.MSG.unknown, "温馨提示", {
					// 			confirmButtonText: "知道了"
					// 		});
					// 	}
					// );
				});
			},
			// 点击产品类别 获取列表
			handleNodeClick(data) {
				if (data.data.id == 0) {
					this.params.parentCategoryId = "";
				} else {
					this.params.parentCategoryId = data.data.id;
				}
				this.params.currentPage = 1;
				// this.queryProductList()
			},
			// 添加产品类别
			handleAddTree(data, node) {
				this.$refs.editCommdityType.add("0", node);
				console.log(data, node);
			},
			// 修改产品类别
			handleRenameTree(data, node) {
				if (data.id == 0) {
					this.$message.warning("根目录无法修改！");
					return;
				}
				this.$refs.editCommdityType.add("1", node);
				console.log(data, node);
			},
			// 删除产品类别
			handleDelTree(nodeData, node) {
				let that = this;
				console.log(nodeData, node);
				if (nodeData.number > 0) {
					that.$message.warning("需要先删除本产品下的类型，再删除该类型！");
					return false;
				} else {
					this.$confirm("删除后将无法恢复数据，您确认删除此类型嘛？", "提示", {
						confirmButtonText: "确认删除",
						cancelButtonText: "取消",
						customClass: "custom-confirm custom-confirm-edition", // 图标样式
						confirmButtonClass: "el-button--primary", // 确认按钮样式
						closeOnClickModal: that.CONFIRM_MODAL_CLOSE, // 是否可以点击空白关闭
						closeOnPressEscape: that.CONFIRM_ESC_CLOSE, // 是否可以esc关闭
						showClose: false // 是否显示关闭按钮
					})
						.then(() => {
							that.querying = true;
							// deleteProductType(
							//     { id: nodeData.id },
							//     () => {
							//         that.message.success(that, "删除成功");
							//         that.querying = false;
							//         that.queryProductTreeList();
							//     },
							//     (data) => {
							//         that.querying = false;
							//         that.$alert(
							//             data.resultMsg || that.MSG_UNKNOWN,
							//             "温馨提示",
							//             {
							//                 confirmButtonText: "知道了",
							//             }
							//         );
							//     },
							//     (data) => {
							//         that.querying = false;
							//         that.$alert(
							//             data.resultMsg || that.MSG_UNKNOWN,
							//             "温馨提示",
							//             {
							//                 confirmButtonText: "知道了",
							//             }
							//         );
							//     }
							// );
						})
						.catch(() => {});
					return false;
				}
			},
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
			// 获取产品tree和产品列表
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
						}
					];
					let productTreeLists = [
						{
							id: 344,
							parentId: 341,
							label: "类别1",
							number: 3,
							children: [
								{
									id: 348,
									parentId: 344,
									label: "类别1-1",
									number: 7
								},
								{
									id: 349,
									parentId: 344,
									label: "类别1-2",
									number: 7
								},
								{
									id: 350,
									parentId: 344,
									label: "类别1-3",
									number: 7
								}
							]
						},
						{
							id: 34,
							parentId: 31,
							label: "类别2",
							number: 3,
							children: [
								{
									id: 38,
									parentId: 34,
									label: "类别2-1",
									number: 7
								},
								{
									id: 39,
									parentId: 34,
									label: "类别2-2",
									number: 7
								},
								{
									id: 40,
									parentId: 34,
									label: "类别2-3",
									number: 7
								}
							]
						}
					];
					that.productTreeList = [
						{
							id: 0,
							label: "全部类别",
							number: 99,
							children: productTreeLists,
							parentId: null
						}
					];
					this.list = list;
					that.querying = false;
					that.loading = false;
				}, 1000);
			},
			// 获取产品tree
			queryCommodityTree() {},
			// 获取产品列表
			queryCommodityList() {}
		}
	};
</script>
<style lang="less" scoped>
	.list-panel {
		display: flex;
		flex-direction: row;
		padding-left: 15px;

		.commodity-tree {
			display: flex;
			flex-direction: column;
			width: 260px;
			padding-right: 20px;

			.tree-block {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 15px 15px;
				border-radius: 3px;
				background: #fff;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				overflow-x: auto;
			}

			.tree-title {
				color: #333333;
				font-size: 18px;
				line-height: 44px;
				border-bottom: 1px solid #ccc;
			}
		}

		.commodity-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.list-search {
			.el-select {
				width: 80px;
			}
		}
	}
</style>

<style lang="less" scope>
	.el-tree-node__content {
		height: 32px;
		padding-right: 10px !important;
	}

	.custom-tree-node {
		.el-button {
			margin: 0;
			padding: 8px 0;
		}
	}

	.btn-set-department {
		margin-right: 10px;
	}

	.el-popper.tree-popover {
		min-width: 0;
		box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
		border: 1px solid #979797;
		border-radius: 2px;
	}

	.el-popper.tree-popover ul {
		color: #777;
		font-size: 14px;
		cursor: pointer;
	}

	.el-popper.tree-popover ul li {
		padding: 0 10px;
		margin-bottom: 8px;
	}

	.el-popper.tree-popover ul li:last-child {
		margin-bottom: 0;
	}
</style>
