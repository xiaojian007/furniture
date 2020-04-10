/**
 * 表单提交通用方法mixins
 * @author lijian
 * @since 2020-03-03
 * @version 1.0.0
 * @description 表单提交通用方法mixins
 */

export default {
	props: {
		//一级tab页签
		topTab: {
			type: Object,
			default: function() {
				return {};
			}
		},
		//一级tab页签名称
		topTabName: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			domId: this.uuid(),
			title: "",
			loading: true,
			visible: false,
			editable: false, //是否不可编辑
			submitting: false,
			currentInputIndex: 0,
			inputDropDownVisible: false
		};
	},
	methods: {
		/**
		 * 初始化表单
		 */
		load() {
			console.log("TODO Overwrite");
		},
		/**
		 * 提交表单
		 */
		submit() {
			console.log("TODO Overwrite");
		},
		maxHeight() {
			return Math.max(window.document.documentElement.clientHeight - 275, 320);
		},
		/**
		 * 查询表单数据
		 */
		query() {
		},
		close() {
			this.visible = false;
			this.submitting = false;
			this.currentInputIndex = 0;
		},
		reset() {
			let that = this;
			if (that.defaultRange) {
				that.defaultRange = [];
			}
			if (that.$refs.form) {
				if (that.form.staTime) {
					that.form.staTime = "";
				}
				if (that.form.endTime) {
					that.form.endTime = "";
				}
				that.$refs.form.resetFields();
			}
			if (this.form) {
				Object.keys(this.form).forEach(key => {
					if (typeof this.form[key] !== "object") {
						this.form[key] = "";
					}
				});
			}
		},
		removeTab() {
			this.$emit("removeTab", this.topTabName);
		},
		imagePreview(url) {
			if (this.$refs.image) {
				this.$refs.image.preview(url);
			}
		},
		getFocusIndex(node) {
			let focusIndex;
			Object.keys(this.$refs).forEach(key => {
				key = String(key);
				let input = this.$refs[key];
				if (Array.isArray(input)) {
					input = input[0];
				}
				if (input) {
					input = input.$el;
				}
				if (key.indexOf("input") === 0 && input) {
					/*1：没有关系，两个节点不属于同一个文档。
                    2：第一节点（P1）位于第二个节点后（P2）。
                    4：第一节点（P1）定位在第二节点（P2）前。
                    8：第一节点（P1）位于第二节点内（P2）。
                    16：第二节点（P2）位于第一节点内（P1）。
                    32：没有关系，或是两个节点是同一元素的两个属性。
                    注释：返回值可以是值的组合。例如，返回 20 意味着在 p2 在 p1 内部（16），并且 p1 在 p2 之前（4）。*/
					//console.log('compareDocumentPosition=>', this.$refs[key].$el, this.$refs[key].$el.compareDocumentPosition(node))
					if (input.compareDocumentPosition(node) === 20) {
						focusIndex = key.split("-")[1];
					}
				}
			});
			return focusIndex;
		},
		focus(e) {
			let target = e.target || e.srcElement;
			if (target) {
				let index = parseInt(this.getFocusIndex(target), 10);
				if (index === 0 || index > 0) {
					this.currentInputIndex = index;
				}
				console.log("focus=>index", index, target);
			}
		},
		inputInit() {
			this.setInputFocus(0);
		},
		switchInput() {
			if (this.inputDropDownVisible) {
				return;
			}
			let index = parseInt(String(this.currentInputIndex), 10);
			const nextIndex = () => {
				index += 1;
				let refName = ["input", index].join("-");
				let input = this.$refs[refName];
				if (
					index < 1000 &&
					((input && input.$el && input.$el.classList.contains("is-disabled")) || !input)
				) {
					nextIndex();
				}
			};
			nextIndex();
			this.setInputFocus(index);
		},
		visibleChange(state) {
			this.inputDropDownVisible = state;
		},
		setInputFocus(index) {
			this.currentInputIndex = index;
			let refName = ["input", index].join("-");
			let input = this.$refs[refName];
			if (Array.isArray(input)) {
				input = input[0];
			}
			if (input && input.focus) {
				input.focus();
				//input.select && input.select()
			}
		},
		//数字验证
		inputNumber(e, field, form) {
			if (form) {
				let target = e.target || e.srcElement;
				let val = target.value;
				this.$nextTick(() => {
					form[field] = String(val).replace(/[^0-9.-]+/gi, "");
					console.log(val, form[field], "111111");
				});
			}
		},
        //数字验证保留两位小数
        keepTwoNumber(e, field, form) {
            if (form) {
                let target = e.target || e.srcElement;
                let val = target.value;
                this.$nextTick(() => {
                    form[field] = String(val).replace(/[^0-9.-]+/gi, "");
                    if (!/^\d+(\.\d{0,2})?$/gi.test(form[field])) {
                        form[field] = form[field].substring(0,form[field].length - 1)
                    }
                });
            }
        }
	}
};
