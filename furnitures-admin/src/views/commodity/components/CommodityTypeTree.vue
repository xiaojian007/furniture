<template>
	<div class="tree">
		<el-tree
			:ref="treeRef"
			:empty-text="''"
			:data="data"
			auto-expand-parent
			:highlight-current="true"
			node-key="id"
			:props="defaultProps"
			:default-expanded-keys="defaultExpandedKeys"
			:expand-on-click-node="!isCheck && !isMenu"
			@node-click="handleNodeClick"
			@node-expand="handleExpand"
			@node-collapse="handleCollapse"
		>
			<span
				slot-scope="{ node, data }"
				:class="`${isCheck && data.check ? 'tree-active' : ''} custom-tree-node`"
			>
				<i class="icon-file"></i>
				<span
					>{{ data.label }}
					<span class="tree-use-count" v-if="isCount">（{{ data.number }}）</span>
				</span>
				<div class="tree-operation">
					<el-popover
						:ref="`popover-${data.$treeNodeId}`"
						placement="right-start"
						trigger="hover"
						class="tree-popover-icon"
						popper-class="tree-popover"
						:visible-arrow="false"
					>
						<slot name="menu" :node="node" :data="data" />
						<i
							class="tree-menu-icon"
							slot="reference"
							v-if="isMenu"
							@click.stop="handleTreeMenu(data)"
						></i>
					</el-popover>
				</div>
				<i v-if="isCheck && data.check" class="icon-check el-icon-check"></i>
			</span>
		</el-tree>
	</div>
</template>
<script>
	export default {
		name: "tree",
		props: {
			data: {
				type: Array,
				default: () => []
			},
			treeRef: {
				type: String,
				default: "tree"
			},
			// 是否展示右侧菜单按钮
			isMenu: {
				type: Boolean,
				default: true
			},
			// 是否需要选中状态且展示勾选
			isCheck: {
				type: Boolean,
				default: true
			},
			// 是否展示人数
			isCount: {
				type: Boolean,
				default: true
			},
			// 勾选是是否关联父子节点
			isRelation: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				treeNodeId: "",
				defaultProps: {
					children: "children",
					label: "label"
				},
				defaultExpandedKeys: [0],
				idArr: [],
				isNodeClick: true,
				currentNode: {},
				selectList: [],
				flatTreeData: []
			};
		},
		watch: {
			// data: list => {
			// 	if (!this.defaultExpandedKeys.length) {
			// 		this.defaultExpandedKeys = [list[0].id];
			// 	}
			// 	this.treeNodeId = "";
			// }
		},
		methods: {
			// 部门右侧菜单
			handleTreeMenu(data) {
				this.handleClosePopover(data);
			},
			// 节点展开时
			handleExpand(data) {
				// 默认展开节点追加id
				this.defaultExpandedKeys.push(data.id);
				// 关闭旧的popover
				this.handleClosePopover(data, true);
			},
			// 节点关闭时
			handleCollapse(data) {
				this.handleClosePopover(data, true);

				// let index = this.defaultExpandedKeys.indexOf(data.id);
				// if (index > -1) {
				// 	this.defaultExpandedKeys = [...delete this.defaultExpandedKeys[index]];
				// 	this.handleClosePopover(data, true);
				// }
			},
			/*
			 * 点击出现新的popover时关闭旧的 popover
			 * close 强制关闭
			 */
			handleClosePopover(data, close) {
				let el = this.$refs[`popover-${this.treeNodeId}`];
				if (this.treeNodeId && el && (this.treeNodeId !== data.$treeNodeId || close)) {
					el.doClose();
				}
				this.treeNodeId = data.$treeNodeId;
			},
			// 设置默认展开节点
			setDefaultExpandedKeys(data) {
				if (data) {
					this.defaultExpandedKeys = [...new Set(this.defaultExpandedKeys.concat(data))];
				} else {
					this.defaultExpandedKeys = [this.data[0].id];
				}
			},
			// 勾选中节点 自定义勾选样式
			handleNodeClick(data, node) {
				this.handleClosePopover(data, true);
				if (this.isCheck) {
					this.$refs[this.treeRef].setChecked(data.id, !data.check);
					this.$set(data, "check", !data.check);
					if (this.isRelation) {
						this.handleRecursiveChild(node);
						this.handleRecursiveParent(node);
					}
					this.handleSelect(data, data.check);
					console.log(this.selectList);
				}
				this.currentNode = data;
				// @handleNodeClick 回调函数
				this.$emit("handleNodeClick", {
					data,
					ref: this.$refs[this.treeRef],
					selectList: [...this.selectList]
				});
			},
			// 取消选中节点
			handleCancelCheck(data) {
				let node = this.$refs[this.treeRef].getNode(data);
				this.handleNodeClick(data, node);
			},
			// 递归子节点并选中
			handleRecursiveChild(node) {
				if (node.childNodes && node.childNodes.length) {
					let isCheck = node.data.check,
						childNodes = node.childNodes;
					childNodes.forEach(item => {
						this.$set(item.data, "check", isCheck);
						this.handleSelect(item.data, isCheck);
						this.handleRecursiveChild(item);
					});
				}
			},
			// 递归父节点并选中
			handleRecursiveParent(node) {
				if (node.parent) {
					let siblingsNode = node.parent.childNodes || [];
					let isCheck = !siblingsNode.filter(item => !item.data.check).length;
					this.$set(node.parent.data, "check", isCheck);
					this.handleSelect(node.parent.data, isCheck);
					this.handleRecursiveParent(node.parent);
				}
			},
			// 平展部门树结构数据
			handleFlatTreeData(data, arr = []) {
				data.forEach(item => {
					arr.push(item);
					if (item.children) {
						this.handleFlatTreeData(item.children, arr);
					}
				});
				return arr;
			},
			// 统计已选中的节点
			handleSelect(data, check) {
				if (check) {
					this.selectList.push(data);
				} else {
					let index = this.selectList.findIndex(_ => _.id === data.id);
					this.selectList.splice(index, 1);
				}
			}
		}
	};
</script>
<style lang="less" scoped>
	@image: "../../../assets/img";
	.tree {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 500px;
		min-height: 200px;
		overflow: auto;

		& .el-tree {
			color: #333;
			font-size: 14px;
			background: transparent;
		}

		.tree-operation {
			opacity: 0;
		}
	}

	.tree-use-count {
		color: #4285f4;
	}

	.tree /deep/ .el-tree-node__expand-icon {
		&::before {
			content: "" !important;
			display: inline-block;
			width: 16px;
			height: 16px;
			background: url("@{image}/file-add.png");
		}
	}

	.tree /deep/ .el-tree-node__expand-icon.expanded {
		&::before {
			background: url("@{image}/file-reduce.png");
		}
	}

	.tree /deep/ .el-tree-node__expand-icon.is-leaf {
		&::before {
			opacity: 0;
			visibility: hidden;
		}
	}

	.tree /deep/ .el-tree-node__content {
		position: relative;
		padding: 3px 0;
	}

	.tree /deep/ .el-tree-node__content:hover {
		background: #f5f7fa;
		.tree-operation {
			opacity: 1;
		}
	}

	.tree .custom-tree-node {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tree .icon-file {
		display: inline-block;
		width: 20px;
		height: 20px;
		margin: 0 10px 0 4px;
		background-image: url("@{image}/file.png");
		background-size: 20px 20px;
		background-repeat: no-repeat;
		position: relative;
	}

	.tree .icon-check {
		position: absolute;
		top: 50%;
		right: 5px;
		transform: translateY(-50%);
	}

	.tree .tree-active {
		color: #4285f4;
	}

	.tree-menu-icon {
		position: absolute;
		top: 2px;
		right: 0;
		display: inline-block;
		width: 2px;
		height: 10px;
		padding: 10px 0 10px 20px;
	}

	.el-tree-node .tree-menu-icon {
		background: url("@{image}/ellipsis-deep.png") no-repeat 5px center;
	}

	.el-tree-node__children .tree-menu-icon {
		background: url("@{image}/ellipsis.png") no-repeat 5px center;
	}
</style>
