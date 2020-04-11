/**
 * list页面通用方法mixins
 * @author shlijian@ininin.com
 * @since 2020-02-14
 * @version 1.0.0
 * @description list页面通用方法mixins
 * @copyright ininin.com
 */

import baseMixin from "@mixins/base.mixin";
import { PAGE_SIZES } from "@common/constant";
import { formatDateOutput } from "@utils/formatter";
import { mapState } from "vuex";

export default {
	props: {},
	mixins: [baseMixin],
	data() {
		return {
			loading: true, //页面是否加载完毕（首次）
			querying: false, //查询是否结束
			editable: false, //是否可编辑
			fields: [],
			list: [], //数据集合
			total: 0, //总条数
			curRow: {}, //当前选中行,
			primaryKey: "id", //主键：ID
			downloadUrl: "", //导出URL
			params: {
				pageNum: 1,
				pageSize: PAGE_SIZES[0]
			}
		};
	},
	computed: {
		...mapState(["app", "auth"])
	},
	mounted() {
		this.query();
	},
	methods: {
		formatDateOutput,
		/**
		 * 查询列表
		 */
		query() {
			// 待重写
			console.log("TODO Overwrite");
		},
		/**
		 * 搜索，重置当前页为第一页
		 */
		search() {
			this.params.pageNum = 1;
			this.query();
		},
		/**
		 * 重置表单
		 */
		reset() {
			if (this.defaultRange) {
				this.defaultRange = [];
			}
			if (this.$refs.form) {
				this.$refs.form.resetFields();
			}
			if (this.form) {
				Object.keys(this.form).forEach(key => {
					if (typeof this.form[key] !== "object") {
						this.form[key] = "";
					}
				});
			}
		},
		setParams(params) {
			this.setFormData(this.params, params);
			console.log(this.params, "setParams");
			this.search();
		},
		imagePreview(url) {
			if (this.$refs.image) {
				this.$refs.image.preview(url);
			}
		},
		setSettings(fields) {
			//this.$refs.table && this.$refs.table.doLayout()
			let list = this.list;
			this.fields = [];
			this.list = [];
			setTimeout(() => {
				this.fields = fields;
				this.list = list;
			}, 100);
		},
		/**
		 * 改变每页展示条数
		 * @param {Number} val 页码
		 */
		changePageSize(val) {
			this.params.pageSize = val;
			this.params.pageNum = 1;
			this.query();
		},
		/**
		 * 改变当前页
		 * @param {Number} val 页码
		 */
		changeCurrentPage(val) {
			this.params.pageNum = val;
			this.query();
		},
		/**
		 * 设置当前行
		 * @param {Number} currentRow
		 */
		currentChange(currentRow) {
			this.curRow = currentRow || {};
		},
		/**
		 * 导出文件名
		 */
		downloadFileName() {
			console.log("TODO Overwrite");
		},
		/**
		 * 导出
		 */
		download() {
			if (this.$refs.download && this.downloadUrl) {
				if (this.list.length > 0) {
					this.$refs.download.query(
						this.downloadUrl,
						this.downloadFileName,
						JSON.parse(JSON.stringify(this.fields)),
						this.params
					);
				} else {
					this.$alert("没有可导出的数据，请修改查询条件后再导出！", "温馨提示", {
						confirmButtonText: "知道了"
					});
				}
			}
		},
		/**
		 * 编辑
		 * @param {Object} [data] 当前行数据
		 */
		edit(data) {
			if (this.$refs.edit) {
				this.$refs.edit.query(data);
			}
		},
		/**
		 * 筛选
		 * @param {Object} data
		 * @param {Object} fields
		 */
		filterSearch(data, fields) {
			if (this.$refs.filterSearch) {
				this.$refs.filterSearch.query(this.params, data, fields);
			}
		}
	}
};
