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
			:rules="rules"
			@submit.native.prevent
			label-width="100px"
		>
			<!-- 基础信息 -->
			<el-row>
				<el-col :span="12">
					<el-form-item label="商品标题:" size="small" prop="name">
						<el-input
							v-model="form.name"
							maxlength="40"
							placeholder="请输入商品标题"
						></el-input>
					</el-form-item>
					<el-form-item label="商品简称:" size="small" prop="shortName">
						<el-input
							v-model="form.shortName"
							maxlength="20"
							placeholder="请输入商品简称"
						></el-input>
					</el-form-item>
					<el-form-item label="商品类型:" size="small" prop="typeId">
						<el-cascader
							:options="commodityTypeList"
							v-model="form.typeId"
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
					<!-- <el-form-item label="商品价格:" size="small" prop="price">
						<el-input
							v-model="form.price"
							maxlength="10"
							placeholder="请输入商品价格区间"
						></el-input>
					</el-form-item> -->
				</el-col>
				<el-col :span="12">
					<el-form-item label="市场价格:" size="small" prop="originalPrice">
						<el-input
							v-model="form.originalPrice"
							placeholder="请输入市场价格"
						></el-input>
					</el-form-item>
					<el-form-item label="是否精选:" size="small">
						<el-select v-model="form.isPerfect" placeholder="默认不精选">
							<el-option
								v-for="item in enumCommodityPerfectStatus.arr"
								:key="item.value"
								:label="item.text"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品状态:" size="small">
						<el-select v-model="form.publishStatus" placeholder="默认下架">
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
					<el-form-item label="缩略图:" size="small" prop="smallImage">
						<ComUploadSinglePicture
							:styleBox="true"
							ref="commodityTypeSinglePic"
							@change="changeSinglePicture"
						></ComUploadSinglePicture>
					</el-form-item>
				</el-col>
				<el-col :span="19">
					<el-form-item label="商品图片:" size="small" prop="uploadImage">
						<ComUploadMultiPicture
							ref="commodityTypeMultPic"
							@imagePreview="imagePreview"
							@uploadStart="uploadBefore"
							@uploadSuccess="uploadSuccess"
							:styleBox="true"
							@change="changeMultiPicture"
							:maxCount="5"
							:hideUpload="true"
						></ComUploadMultiPicture>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- sku -->

			<el-row>
				<el-col :span="14">
					<el-form-item label="属性类型:" size="small" prop="selectSkuParentIdList">
						<el-select
							v-model="form.selectSkuParentIdList"
							filterable
							multiple
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
					<el-form-item label="规格(SKU):" size="small" prop="checkBoxSkuAttr">
						<div class="specification-list">
							<template v-if="selectCheckedType.length > 0">
								<div
									class="specification-item"
									v-for="(item, index) in selectCheckedType"
									:key="index"
								>
									<h5>{{ item.name }}</h5>
									<div class="specification-check">
										<el-checkbox-group
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
										class="dialog-input-center"
										type="number"
										maxlength="20"
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
										class="dialog-input-center"
										maxlength="10"
										type="number"
										v-model="scope.row.attributeStock"
									></el-input>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-col>
			</el-row>
			<!-- 富文本 -->
			<el-form-item label="商品内容:" size="small" prop="detail">
				<Tinymce v-model="form.detail" ref="detail"></Tinymce>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small" @click="close">关闭</el-button>
			<el-button type="primary" size="small" @click="submit" :loading="submitting">
				提交
			</el-button>
		</div>
		<ComImage ref="image"></ComImage>
	</el-dialog>
</template>

<script>
	import Tinymce from "@com/tinymce";
	import formMixin from "@mixins/form.mixin";
	import { positiveRealNumber } from "@common/validator";
	import { getALLProductQuery, addAndUpdateProduct } from "@api/commodity/product";
	import { enumCommodityPublishStatus, enumCommodityPerfectStatus } from "@common/enums/index";
	export default {
		mixins: [formMixin],
		components: { Tinymce },
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
				modifyCalcSkuList: [], // 修改时sku列表  用于修改时排除已有选项
				rules: {
					name: [{ required: true, message: "商品标题不能为空", trigger: "blur" }],
					shortName: [{ required: true, message: "商品简称不能为空", trigger: "blur" }],
					typeId: [{ required: true, message: "请选择商品类别", trigger: "change" }],
					selectSkuParentIdList: [
						{ required: true, message: "请选择属性类型", trigger: "change" }
					],
					checkBoxSkuAttr: [
						{ required: true, message: "请选择商品规格", trigger: "change" }
					],
					smallImage: [{ required: true, message: "缩略图不能为空", trigger: "blur" }],
					detail: [{ required: true, message: "商品详细不能为空", trigger: "blur" }],
					uploadImage: [
						{ required: true, message: "商品详情图片不能为空", trigger: "blur" }
					],
					price: [
						{
							required: true,
							validator: positiveRealNumber({
								field: "商品价格",
								minimum: 0,
								decimals: 4
							}),
							trigger: "blur"
						}
					],
					originalPrice: [
						{
							required: true,
							validator: positiveRealNumber({
								field: "商品价格",
								decimals: 4
							}),
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			// 选择sku
			changeCheckedSku() {
				let item = this.form.checkBoxSkuAttr;
				let checkedSkuList = []; // 选中的数组集合
				this.skuTypeList.forEach(skuTypeItem => {
					if (skuTypeItem.child) {
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
					}
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
							// 判断名称和sku名称都存在
							// if (
							// 	updateSku.attributeNameList ===
							// 		this.modifyCalcSkuList[i].attributeNameList &&
							// 	updateSku.attributeIds === this.modifyCalcSkuList[i].attributeIds
							// ) {
							// 	skuItem = this.modifyCalcSkuList[i];
							// }
							if (updateSku.attributeIds === this.modifyCalcSkuList[i].attributeIds) {
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
			// 图片预览
			imagePreview(url, list) {
				if (url) {
					url = url.split(";");
					this.$refs.image.preview(url || "", list);
				}
			},
			close() {
				let that = this;
				that.$nextTick(() => {
					if (that.$refs.commodityTypeMultPic) {
						that.$refs.commodityTypeMultPic.data = [];
					}
					if (that.$refs.commodityTypeSinglePic) {
						that.$refs.commodityTypeSinglePic.data = "";
					}
				});
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
					this.title = "修改商品";
				} else {
					this.title = "新增商品";
				}
				this.query(); // 获取类别信息
			},
			submit() {
				let that = this;
				that.$refs.form.validate(valid => {
					if (valid) {
						let typeFirstId = that.form.typeId[0];
						let typeSecondId = that.form.typeId[1];
						let typeFirstName = "";
						let typeSecondName = "";
						let commodityTypeList = that.commodityTypeList || [];
						commodityTypeList.forEach(item => {
							if (item.typeVoList) {
								item.typeVoList.forEach(itemChild => {
									if (typeSecondId === itemChild.typeId) {
										typeSecondName = itemChild.typeName;
										typeFirstName = item.typeName;
									}
								});
							} else {
								typeFirstName = item.typeName;
							}
						});
						let formData = {
							typeFirstId: typeFirstId, // 一级类型id
							typeFirstName: typeFirstName, // 一级名称
							typeSecondId: typeSecondId, // 二级类型id
							typeSecondName: typeSecondName, //二级名称
							detail: that.form.detail, // 想想
							isPerfect: that.form.isPerfect || 0,
							name: that.form.name,
							originalPrice: that.toDecimal(that.form.originalPrice),
							productImage: that.form.uploadImage.join(","),
							publishStatus: that.form.publishStatus || 0,
							shortName: that.form.shortName,
							smallImage: that.form.smallImage
						};
						let skuAttributeDtoList = [];
						let stock = 0;

						let priceList = [];
						that.calcSkuList.forEach(item => {
							let skuAttributeItem = {
								attributeIds: item.attributeIds,
								attributeNameList: item.attributeNameList,
								attributePrice: that.toDecimal(item.attributePrice),
								attributeStock: item.attributeStock
							};
							priceList.push(Number(item.attributePrice));
							stock = stock + Number(item.attributeStock);
							skuAttributeDtoList.push(skuAttributeItem);
						});
						formData["stock"] = stock;
						formData["price"] =
							Math.min.apply(Math, priceList) + "-" + Math.max.apply(Math, priceList);
						formData["skuAttributeDtoList"] = skuAttributeDtoList;
						formData["skuIds"] = that.form.checkBoxSkuAttr.join(",");
						if (that.form.productId > 0) {
							formData["productId"] = that.form.productId;
						}
						console.log("formDataformDataformData", formData);
						addAndUpdateProduct(formData)
							.then(data => {
								if (data.succeed) {
									that.close();
									that.$message.success(
										that.form.productId > 0 ? "修改成功" : "添加成功",
										that
									);
									that.$emit("success");
								} else {
									that.$message.warning(
										data.body.message || that.MSG_UNKNOWN,
										that
									);
								}
							})
							.catch(err => {
								that.$message.warning(err.body.message || that.MSG_UNKNOWN, that);
							})
							.finally(() => {
								that.submitting = false;
							});
					} else {
						console.log("Failure of form validation!!");
					}
				});
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
						that.$nextTick(() => {
							that.$refs.detail.initFormTinymce();
						});
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
			},
			uploadBefore() {
				console.log("上传之前");
				this.submitting = true;
			},
			uploadSuccess() {
				console.log("上传成功");
				this.submitting = false;
			},
			changeMultiPicture(key, value, list) {
				console.log(key, value, list);
				this.form.uploadImage = value || [];
			},
			changeSinglePicture(key, value) {
				console.log(key, value);
				this.form.smallImage = value;
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
</style>
