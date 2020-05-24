<template>
	<el-dialog
		:id="domId"
		:title="title"
		width="960px"
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
			@submit.native.prevent
			label-width="100px"
		>
			<!-- 基础信息 -->
			<el-row>
				<el-col :span="12">
					<el-form-item label="商品标题:" size="small">
						<el-input
							v-model="form.name"
                            :disabled="disabled"
							maxlength="20"
							placeholder="请输入商品标题"
						></el-input>
					</el-form-item>
					<el-form-item label="商品简称:" size="small">
						<el-input
							v-model="form.shortName"
							maxlength="10"
                            :disabled="disabled"
							placeholder="请输入商品简称"
						></el-input>
					</el-form-item>
					<el-form-item label="商品类型:" size="small">
						<el-cascader
							:options="commodityTypeList"
							v-model="form.typeId"
                            :disabled="disabled"
							placeholder="请选择商品类型"
							:props="{
								value: 'typeId',
								expandTrigger: 'hover',
								children: 'typeVoList',
								label: 'typeName'
							}"
						>
							<template slot-scope="{ node, data }">
								<span>{{ data.typeName }}</span>
							</template>
						</el-cascader>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="市场价格:" size="small">
						<el-input
							v-model="form.originalPrice"
                            :disabled="disabled"
							placeholder="请输入市场价格"
						></el-input>
					</el-form-item>
					<el-form-item label="是否精选:" size="small">
						<el-select v-model="form.isPerfect" placeholder="默认不精选"
                            :disabled="disabled">
							<el-option
								v-for="item in enumCommodityPerfectStatus.arr"
								:key="item.value"
								:label="item.text"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品状态:" size="small"
                            >
						<el-select v-model="form.publishStatus" placeholder="默认下架" :disabled="disabled">
							<el-option
								v-for="item in enumCommodityPublishStatus.arr"
								:key="item.value"
								:label="item.text"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 图片 -->
			<el-row>
				<el-col :span="5">
					<el-form-item label="缩略图:" size="small">
						<el-image
							style="width: 100px; height: 100px"
							:src="form.smallImage"
							:preview-src-list="[form.smallImage]"
						>
						</el-image>
					</el-form-item>
				</el-col>
				<el-col :span="19">
					<el-form-item label="商品图片:" size="small">
                        <el-image
							style="width: 100px; height: 100px"
							:src="form.uploadImage[0]"
							:preview-src-list="form.uploadImage"
						>
						</el-image>
                    </el-form-item>
				</el-col>
			</el-row>
			<!-- sku -->

			<el-row>
				<el-col :span="14">
					<el-form-item label="属性类型:" size="small">
						<el-select
							v-model="form.selectSkuParentIdList"
							filterable
							multiple
                            :disabled="disabled"
							@change="changeSkuType"
						>
							<el-option
								v-for="(item, index) in skuTypeList"
								:key="index"
								:label="item.name"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="规格(SKU):" size="small">
						<div class="specification-list">
							<template v-if="selectCheckedType.length > 0">
								<div
									class="specification-item"
									v-for="(item, index) in selectCheckedType"
									:key="index"
								>
									<h5>{{ item.name }}</h5>
									<div class="specification-check">
										<el-checkbox-group :disabled="disabled"
											v-model="form.checkBoxSkuAttr"
											@change="changeCheckedSku"
										>
											<el-checkbox
												v-for="(itemChild, itemIndex) in item.child"
												:label="itemChild.id"
												:key="itemIndex"
												>{{ itemChild.name }}</el-checkbox
											>
										</el-checkbox-group>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="no-data">请选择属性类型</div>
							</template>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<div class="all-sku-list">
						<el-table
							:data="calcSkuList"
							border
							style="width: 100%"
							height="100%"
							empty-text="请选择规格(SKU)"
						>
							<el-table-column label="规格" align="center" :resizable="false">
								<template slot-scope="scope">
									{{ scope.row.attributeNameList }}
								</template>
							</el-table-column>
							<el-table-column
								label="单价"
								align="center"
								:resizable="false"
								width="90px"
							>
								<template slot-scope="scope">
									<el-input
										size="small"
                                        :disabled="disabled"
										class="dialog-input-center"
										maxlength="4"
										v-model="scope.row.attributePrice"
									></el-input>
								</template>
							</el-table-column>
							<el-table-column
								label="库存"
								align="center"
								:resizable="false"
								width="90px"
							>
								<template slot-scope="scope">
									<el-input
										size="small"
                                        :disabled="disabled"
										class="dialog-input-center"
										maxlength="4"
										v-model="scope.row.attributeStock"
									></el-input>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-col>
			</el-row>
			<!-- 富文本 -->
			<el-form-item label="商品内容:" size="small">
				<div class="content" v-html="form.detail"></div>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import formMixin from "@mixins/form.mixin";
	import { getALLProductQuery } from "@api/commodity/product";
	import { enumCommodityPublishStatus, enumCommodityPerfectStatus } from "@common/enums/index";
	export default {
		mixins: [formMixin],
		props: {
			treeList: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		data() {
			return {
				enumCommodityPublishStatus,
                enumCommodityPerfectStatus,
                disabled: true, // 不可以编辑
				form: {
					productId: "", //id
					name: "", //商品名称
					shortName: "", // 商品简称
					typeId: [], // 商品类型
					typeName: "", // 类别名称
					smallImage: "", // 缩略图
					uploadImage: [], // 商品图片 轮播
					price: "", // 商品价格
					publishStatus: "", // 商品状态 0：下架 1：上架
					isPerfect: "", // 是否精选 0：否 1：是
					originalPrice: "", //市场价格
					detail: "", // 商品详情
					selectSkuParentIdList: [], // 选择的sku属性类型 id数组
					checkBoxSkuAttr: [] // 选中的商品规格（sku）数组
				},
				commodityTypeList: [], // 商品类别
				calcSkuList: [], // 选中后生成的sku
				selectCheckedType: [], // 选择的sku属性类型 id
				skuTypeList: [], // 商品sku list
				checkedSkuList: [], // 选中的id集合进行 不分层
				modifyCalcSkuList: [] // 修改时sku列表  用于修改时排除已有选项
			};
		},
		methods: {
			// 选择sku
			changeCheckedSku() {
				let item = this.form.checkBoxSkuAttr;
				let checkedSkuList = []; // 选中的数组集合
				this.skuTypeList.forEach(skuTypeItem => {
					skuTypeItem.child.forEach(skuItem => {
						let hasSku = item.some(checkedId => {
							return checkedId === skuItem.id;
						});
						if (hasSku) {
							checkedSkuList.push({
								id: skuItem.id,
								name: skuItem.name,
								parentId: skuTypeItem.id,
								parentName: skuTypeItem.name
							});
						}
					});
				});
				this.checkedSkuList = checkedSkuList;
				// 选中的数据进行类型分类
				let dest = this.sortParentList(checkedSkuList);
				let skuList = [];
				dest.forEach(destItem => {
					let skuItem = [];
					destItem.child.forEach(sku => {
						skuItem.push(sku.id);
					});
					skuList.push(skuItem);
				});
				let calcList = this.calcDescartes(skuList); // 笛卡尔积算法，可用于商品SKU计算
				let calcSkuList = []; // 选中后生成的sku
				calcList.forEach(cale => {
					let nameList = [];
					if (Array.isArray(cale)) {
						checkedSkuList.forEach(listItem => {
							let isName = cale.some(caleItem => {
								return caleItem === listItem.id;
							});
							if (isName) {
								nameList.push(listItem.name);
							}
						});
					} else {
						checkedSkuList.forEach(listItem => {
							if (cale === listItem.id) {
								nameList.push(listItem.name);
							}
						});
					}
					calcSkuList.push({
						attributeNameList: nameList.toString().replace(/,/g, "&"), // 名称
						attributeIds: cale.toString(), // id
						attributePrice: "", //价格
						attributeStock: "" // 库存
					});
				});
				if (this.form.productId > 0) {
					let updateCalcSkuList = [];
					// sku修改
					calcSkuList.forEach(updateSku => {
						let skuItem = {};
						for (let i = 0; i < this.modifyCalcSkuList.length; i++) {
							if (
								updateSku.attributeNameList ===
									this.modifyCalcSkuList[i].attributeNameList &&
								updateSku.attributeIds === this.modifyCalcSkuList[i].attributeIds
							) {
								skuItem = this.modifyCalcSkuList[i];
							}
						}
						console.log(skuItem);
						if (skuItem.attributeIds) {
							updateCalcSkuList.push({
								attributeNameList: skuItem.attributeNameList, // 名称
								attributeIds: skuItem.attributeIds, // id
								attributePrice: skuItem.attributePrice, //价格
								attributeStock: skuItem.attributeStock // 库存
							});
						} else {
							updateCalcSkuList.push({
								attributeNameList: updateSku.attributeNameList, // 名称
								attributeIds: updateSku.attributeIds, // id
								attributePrice: updateSku.attributePrice, //价格
								attributeStock: updateSku.attributeStock // 库存
							});
						}
					});
					console.log(this.calcSkuList, updateCalcSkuList);
					this.calcSkuList = updateCalcSkuList;
				} else {
					// 新增
					this.calcSkuList = calcSkuList;
				}
			},
			// 选中数组进行父子组合
			sortParentList(array) {
				let map = {},
					dest = [];
				for (let i = 0; i < array.length; i++) {
					let ai = array[i];
					if (!map[ai.parentId]) {
						dest.push({
							parentId: ai.parentId,
							name: ai.parentName,
							child: [ai]
						});
						map[ai.parentId] = ai;
					} else {
						for (let j = 0; j < dest.length; j++) {
							let dj = dest[j];
							if (dj.parentId == ai.parentId) {
								dj.child.push(ai);
								break;
							}
						}
					}
				}
				return dest;
			},
			//JavaScript 笛卡尔积算法，可用于商品 SKU 计算
			calcDescartes(array) {
				if (array.length < 2) {
					return array[0] || [];
				}
				return [].reduce.call(array, (col, set) => {
					var res = [];
					col.forEach(c => {
						set.forEach(s => {
							var t = [].concat(Array.isArray(c) ? c : [c]);
							t.push(s);
							res.push(t);
						});
					});
					return res;
				});
			},
			//属性类型 选中
			changeSkuType(typeIdList) {
				let selectCheckedType = [];
				typeIdList.forEach(typeId => {
					this.skuTypeList.forEach(item => {
						if (typeId === item.id) {
							selectCheckedType.push(item);
						}
					});
				});
				this.selectCheckedType = selectCheckedType;
			},
			close() {
				let that = this;
				that.visible = false;
				that.submitting = false;
			},
			add(id = 0) {
				this.reset();
				this.form.typeId = [];
				this.form.selectSkuParentIdList = [];
				this.form.checkBoxSkuAttr = [];
				this.form.uploadImage = [];
				this.commodityTypeList = []; // 商品类别
				this.calcSkuList = []; // 选中后生成的sku
				this.selectCheckedType = []; // 选择的sku属性类型 id
				this.skuTypeList = []; // 商品sku list
				this.checkedSkuList = []; // 选中的id集合进行 不分层
				if (id > 0) {
					this.form.productId = id;
					this.title = "查看商品";
				}
				this.query(); // 获取类别信息
			},
			query() {
				let that = this;
				that.submitting = true;
				getALLProductQuery({ productId: that.form.productId, hasSecond: true })
					.then(res => {
						if (that.form.productId > 0) {
							if (res[0].succeed && res[1].succeed && res[2].succeed) {
								let commodityTypeList = res[0].body || [];
								that.commodityTypeList = commodityTypeList;
								let skuTypeArr = res[1].body || [];
								that.skuTypeList = that.setDetailData(skuTypeArr);
								let detail = res[2].body;
								that.form = {
									productId: detail.productId, //id
									name: detail.name, //商品名称
									shortName: detail.shortName, // 商品简称
									typeName: detail.typeName, // 类别名称
									smallImage: detail.smallImage || "", // 缩略图
									uploadImage: !detail.productImage
										? []
										: detail.productImage.split(","), // 商品图片 轮播
									price: detail.price, // 商品价格
									publishStatus: detail.publishStatus, // 商品状态 0：下架 1：上架
									isPerfect: detail.isPerfect, // 是否精选 0：否 1：是
									originalPrice: detail.originalPrice, //市场价格
									detail: detail.detail, // 商品详情
									typeId: [detail.typeFirstId, detail.typeSecondId] // 商品类型
								};
								that.calcSkuList = detail.allAttrList || []; // skulist
								that.modifyCalcSkuList = detail.allAttrList || []; // 修改时sku列表  用于修改时排除已有选项
								let attrList = detail.attrList || [];

								let selectSkuParentIdList = [];
								let checkBoxSkuAttr = [];
								attrList.forEach(item => {
									selectSkuParentIdList.push(item.skuId);
									let productSkuAttrList = item.productSkuAttrList || [];
									productSkuAttrList.forEach(itemChild => {
										checkBoxSkuAttr.push(itemChild.skuId);
									});
								});
								that.form.checkBoxSkuAttr = checkBoxSkuAttr;
								that.form.selectSkuParentIdList = selectSkuParentIdList;
								// 显示规格(SKU)
								let selectCheckedType = [];
								selectSkuParentIdList.forEach(typeId => {
									this.skuTypeList.forEach(item => {
										if (typeId === item.id) {
											selectCheckedType.push(item);
										}
									});
								});
								this.selectCheckedType = selectCheckedType;

								that.$nextTick(() => {
									if (that.$refs.commodityTypeMultPic) {
										that.$refs.commodityTypeMultPic.data =
											that.form.uploadImage || [];
									}
									if (that.$refs.commodityTypeSinglePic) {
										that.$refs.commodityTypeSinglePic.data =
											that.form.smallImage || "";
									}
								});
								that.visible = true;
							} else {
								that.$message.warning("获取商品详情失败，请联系管理员", that);
							}
						} else {
							if (res[0].succeed && res[1].succeed) {
								let skuTypeArr = res[1].body || [];
								that.skuTypeList = that.setDetailData(skuTypeArr);
								let commodityTypeList = res[0].body || [];
								that.commodityTypeList = commodityTypeList;
								that.visible = true;
							} else {
								that.$message.warning("获取商品详情失败，请联系管理员", that);
							}
						}
					})
					.catch(() => {
						that.$message.warning(that.MSG_UNKNOWN, that);
					})
					.finally(() => {
						that.submitting = false;
					});
			},
			setDetailData(array) {
				let skuTypeList = [];
				array.forEach(skuType => {
					let skuTypeItem = {
						id: skuType.skuId,
						name: skuType.skuName
					};
					if (skuType.attributeDtoList && skuType.attributeDtoList.length > 0) {
						let child = [];
						skuType.attributeDtoList.forEach(sku => {
							child.push({
								id: sku.skuId,
								name: sku.skuName
							});
						});
						skuTypeItem["child"] = child;
					}
					skuTypeList.push(skuTypeItem);
				});
				return skuTypeList;
			}
		}
	};
</script>

<style scoped lang="less">
	/deep/ .el-cascader,
	/deep/.el-select {
		width: 100%;
	}
	.specification-list {
		height: 370px;
		overflow: auto;
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 15px;
		color: #333;
		h5 {
			color: #333;
			font-size: 16px;
			margin-bottom: 10px;
		}
		.no-data {
			text-align: center;
			margin: 150px 0;
			color: #909399;
		}
	}
	.sku-list {
		position: relative;
		.sku-item {
			position: relative;
			border: 1px solid #ccc;
			border-radius: 6px;
			margin-bottom: 15px;
			padding: 15px 30px;
			box-sizing: border-box;
		}
	}
	.sku2-list {
		margin: 10px 0 0;
		.sku2-item {
			position: relative;
			width: 160px;
			display: inline-block;
			margin-right: 10px;
			margin-bottom: 10px;
			.sku2-detele {
				position: absolute;
				z-index: 1;
				right: 5px;
				top: 8px;
				width: 20px;
				height: 20px;
				cursor: pointer;
				font-size: 16px;
				color: #f00;
			}
		}
		.sku2-add {
			vertical-align: middle;
			padding: 5px;
			font-size: 22px;
		}
	}
	.all-sku-list {
		margin-left: 40px;
		/deep/.el-table__body-wrapper {
			max-height: 400px;
			min-height: 400px;
			overflow-y: auto;
		}

		/deep/.el-table {
			td {
				padding: 5px 0;
			}
		}
    }
    .content{
        max-height: 500px;
        overflow: auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding:10px 20px;
    }
    /deep/.el-input.is-disabled .el-input__inner{
        color: #333;
    }
</style>
