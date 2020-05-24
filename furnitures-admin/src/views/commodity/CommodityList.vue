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
						<!-- <li v-if="props.data.id">
							{{ props.data.sss === 1 ? "置顶" : "取消置顶" }}
						</li> -->
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
										<el-button type="text" @click="$refs.seeCommdity.add(scope.row.productId)">
											查看
										</el-button>
										<el-button
											type="text"
											@click="$refs.editCommdity.add(scope.row.productId)"
										>
											修改
										</el-button>
										<el-button
											type="text"
											@click="deleteProductItem(scope.row.productId)"
										>
											删除
										</el-button>
									</template>
									<template v-else-if="field.prop === 'isPerfect'">
										<el-switch
											:value="scope.row.isPerfect == 1"
											@change="
												(val, id) =>
													changeFeatured(val, scope.row.productId)
											"
										>
										</el-switch>
									</template>
									<template v-else-if="field.prop === 'publishStatus'">
										<el-switch
											:value="scope.row.publishStatus == 1"
											@change="
												(val, id) =>
													changePutShelves(val, scope.row.productId)
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
		<EditCommodityType ref="editCommdityType" @success="queryCommodityTree"></EditCommodityType>
		<EditCommodity
			ref="editCommdity"
			:treeList="productTreeList"
			@success="queryCommodityList"
		></EditCommodity>
        <SeeCommodity
			ref="seeCommdity"
			:treeList="productTreeList"
		></SeeCommodity>
	</div>
</template>

<script>
	import listMixin from "@mixins/list.mixin";
	import CommodityTypeTree from "./components/CommodityTypeTree";
	import EditCommodityType from "./components/DialogEditCommodityType";
	import EditCommodity from "./components/DialogEditCommodity";
	import SeeCommodity from "./components/DialogEditCommoditySee";
	import {
		getProductAndProductType,
		getProductTypeList,
		getProductList,
		deleteProductType,
		deteleProduct,
		updateFeaturedAndPutShelves
	} from "@api/commodity/product";
	import { enumCommodityPublishStatus, enumCommodityPerfectStatus } from "@common/enums/index";

	export default {
		mixins: [listMixin],
		components: { CommodityTypeTree, EditCommodityType, EditCommodity, SeeCommodity },
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
					hasSecond: true,
					typeSecondId: "",
					typeFirstId: "",
					publishStatus: "", // 商品状态
					isPerfect: "", // 是否精选
					searchKey: "" //关键字
				},
				page: {},
				fields: [
					{
						show: true,
						prop: "productId",
						align: "center",
						label: "编号",
						className: "t-date",
						width: 80
					},
					{
						show: true,
						prop: "name",
						align: "center",
						label: "商品名称",
						width: 130
					},
					{
						show: true,
						prop: "originalPrice",
						align: "center",
						label: "市场价格",
						width: 80
					},
					{
						show: true,
						prop: "price",
						align: "center",
						label: "商品价格(区间)",
						width: 130
					},
					{
						show: true,
						prop: "sale",
						align: "center",
						label: "销量",
						width: 100
					},
					{
						show: true,
						prop: "stock",
						align: "center",
						label: "库存",
						width: 100
					},
					{
						show: true,
						prop: "publishStatus",
						align: "center",
						label: "是否上架",
						width: 100
					},
					{
						show: true,
						prop: "isPerfect",
						align: "center",
						label: "是否精选",
						width: 80
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
				that.$confirm(value ? "是否确认上架？" : "是否确认下架？", "", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					showClose: false,
					closeOnPressEscape: false,
					closeOnClickModal: false,
					customClass: "message-custom",
					confirmButtonClass: "message-confirm",
					cancelButtonClass: "message-cancel"
				}).then(() => {
					let params = {
						productId: id,
						publishStatus: value ? 1 : 0
                    };
					updateFeaturedAndPutShelves(params)
						.then(data => {
							if (data.succeed) {
								that.$message({
									type: "success",
									message: value ? "上架成功！" : "下架成功！"
								});
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
			/**
			 * 是否精选
			 * @method changeFeatured
			 * @param {Bolean} value 打开还是关闭
			 * @param {Number} id 点击的列表数据id
			 *
			 */
			changeFeatured(value, id) {
				console.log(id);
				let that = this;
				that.$confirm(value ? "是否设置该产品为精选产品？" : "是否取消该精选产品？", "", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					showClose: false,
					closeOnPressEscape: false,
					closeOnClickModal: false,
					customClass: "message-custom",
					confirmButtonClass: "message-confirm",
					cancelButtonClass: "message-cancel"
				}).then(() => {
					let params = {
						productId: id,
						isPerfect: value ? 1 : 0
					};
					updateFeaturedAndPutShelves(params)
						.then(data => {
							if (data.succeed) {
								that.$message({
									type: "success",
									message: value ? "上架成功！" : "下架成功！"
								});
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
			/**
			 * 删除产品
			 * @method deleteProductItem
			 * @param {Number} id 商品id
			 *
			 */
			deleteProductItem(id) {
				let that = this;
				that.$confirm("确认删除改商品？", "提示", {
					confirmButtonText: "确认",
					cancelButtonText: "取消",
					customClass: "custom-confirm custom-confirm-danger", // 图标样式
					confirmButtonClass: "el-button--primary", // 确认按钮样式
					closeOnClickModal: that.CONFIRM_MODAL_CLOSE, // 是否可以点击空白关闭
					closeOnPressEscape: that.CONFIRM_ESC_CLOSE, // 是否可以esc关闭
					showClose: false // 是否显示关闭按钮
				}).then(() => {
					that.querying = true;
					deteleProduct({ productId: id })
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
			// 点击产品类别 获取列表
			handleNodeClick(data) {
				if (data.data.id !== 0 && data.data.parentId !== 0) {
					this.params.typeFirstId = data.data.parentId;
					this.params.typeSecondId = data.data.id;
				} else {
					this.params.typeFirstId = data.data.id == 0 ? '' : data.data.id;
				}
				this.params.pageNum = 1;
				this.queryCommodityList();
			},
			// 添加产品类别
			handleAddTree(data, node) {
				console.log(data.id);
				this.$refs.editCommdityType.add("0", node);
			},
			// 修改产品类别
			handleRenameTree(data, node) {
				if (data.id == 0) {
					this.$message.warning("根目录无法修改！");
					return;
				}
				console.log(data.id);
				this.$refs.editCommdityType.add("1", node);
			},
			// 删除产品类别
			handleDelTree(nodeData, node) {
				let that = this;
				console.log(node);
				if (nodeData.children.length > 0) {
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
							deleteProductType({ typeId: nodeData.id })
								.then(data => {
									if (data.succeed) {
										that.$message.success("删除成功！", that);
										that.queryCommodityTree();
									} else {
										that.$message.warning(
											data.body.message || "删除失败！",
											that
										);
									}
								})
								.catch(err => {
									that.$message.warning(err.body.message || "删除失败！", that);
								})
								.finally(() => {
									that.querying = false;
								});
						})
						.catch(() => {});
					return false;
				}
			},
			//回车搜索
			enterSearch() {
				let that = this;
				if (that.searchKey !== that.params.searchKey) {
					this.params.pageNum = 1;
					this.queryCommodityList();
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
				this.params.pageNum = 1;
				this.queryCommodityList();
			},
			// 获取产品tree和产品列表
			query() {
				let that = this;
				that.querying = true;
				that.loading = true;
				getProductAndProductType(this.params)
					.then(res => {
						if (res[0].succeed && res[1].succeed) {
							let treeList = res[0].body || [];
							that.getTreeList(treeList);
							that.list = res[1].body.list || [];
							that.page.totalCount = res[1].body.total;
						} else {
							let message = "";
							if (res[0].succeed) {
								message = res[1].message;
							} else {
								message = res[0].message;
							}
							that.$message.warning(message || that.MSG_UNKNOWN, that);
							console.log("err", getProductAndProductType);
						}
						that.querying = false;
						that.loading = false;
					})
					.catch(err => {
						that.$message.warning(err[0].message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.querying = false;
						that.loading = false;
					});
			},
			// 产品类型数据重组
			getTreeList(array) {
				let that = this;
				let productTreeList = [];
				array.forEach(item => {
					let productTreeItem = {
						parentId: 0,
						typeLevel: 1,
						id: item.typeId,
						label: item.typeName
					};
					let productTreeChild = [];
					item.typeVoList.forEach(itemChild => {
						productTreeChild.push({
							parentId: item.typeId,
							id: itemChild.typeId,
							typeLevel: 2,
							label: itemChild.typeName
						});
					});
					productTreeItem["children"] = productTreeChild;
					productTreeList.push(productTreeItem);
				});

				that.productTreeList = [
					{
						id: 0,
						label: "全部类别",
						children: productTreeList,
						typeLevel: 0,
						parentId: 0
					}
				];
			},
			// 获取产品tree
			queryCommodityTree() {
				let that = this;
				that.queryingTree = true;

				getProductTypeList({})
					.then(data => {
						if (data.succeed) {
							let list = data.body || [];
							that.getTreeList(list);
						} else {
							that.$message.warning(data.body.message || that.MSG_UNKNOWN, that);
						}
					})
					.catch(err => {
						that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.queryingTree = false;
					});
			},
			// 获取产品列表
			queryCommodityList() {
				let that = this;
				that.queryingTree = true;
				that.loading = true;
				getProductList(this.params)
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
						that.loading = false;
						that.queryingTree = false;
					});
			}
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
