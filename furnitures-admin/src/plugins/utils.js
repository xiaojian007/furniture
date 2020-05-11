/**
 * 注册全局方法
 * @author shlijian@ininin.com
 * @since 2020-02-24
 * @version 1.0.0
 * @description 注册全局方法
 * @copyright ininin.com
 */
import Calculator from "@utils/calculator";
export default {
	install(Vue, { store }) {
		console.log(store);
		Vue.prototype.Calculator = Calculator;

		/**
		 * 获取百分比值
		 * @param {Number} value 数值
		 * @return {String} 百分比 30%
		 */
		Vue.prototype.getPercentValue = function(value) {
			if (value === 0) {
				return "0%";
			}
			return Calculator.fixed(value * 100, 2) + "%";
        };
        Vue.prototype.setFormData = function(form, data) {
            form = form || {}
            data = data || {}
            Object.keys(form).forEach(function(key) {
                let val = data[key]
                let formType = typeof form[key]
                let dataType = typeof data[key]
                if (dataType === 'string') {
                    val = val.trim()
                }
                if (formType !== 'object' && dataType !== 'object') {
                    if (val == null) {
                        form[key] = ''
                    } else {
                        form[key] = val
                    }
                }
            })
            return form
        }
		//JSON解析
		Vue.prototype.jsonParse = function(str) {
			let json;
			if (typeof str !== "object") {
				try {
					json = JSON.parse(str);
				} catch (e) {
					console.log(e);
				}
			}
			return typeof str === "string" ? json : str;
		};
		// 全局消息提示
		Vue.prototype.message = {
			success: function(o, msg) {
				if (msg) {
					o.$message({
						showClose: true,
						message: msg,
						type: "success"
					});
				}
			},
			warning: function(o, msg) {
				if (msg) {
					o.$message({
						showClose: true,
						message: msg || Vue.prototype.MSG_UNKNOWN,
						type: "warning"
					});
				}
			},
			error: function(o, msg) {
				o.$message({
					showClose: true,
					message: msg || Vue.prototype.MSG_UNKNOWN,
					type: "error"
				});
			}
		};
		/**
		 * 基于时间戳生成16位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID）
		 * @method uuid
		 * @param {Number} [len] 生成字符串的位数
		 * @returns {String}
		 */
		Vue.prototype.uuid = (function() {
			let _timestamp = 0;
			return function(len) {
				let timestamp = new Date().getTime() || 0,
					chars = "abcdefghijklmnopqrstuvwxyz",
					uuid = "";
				_timestamp = _timestamp == timestamp ? timestamp + 1 : timestamp;
				timestamp = "" + _timestamp;
				len = len || 16;
				for (let i = 0; i < len; i++) {
					let k = timestamp.charAt(i);
					if (k === "") {
						k = Math.floor(Math.random() * 26);
					}
					uuid += chars.charAt(k) || "x";
				}
				return uuid;
			};
		})();

		Vue.prototype.dialogOpen = function(uuid, hasScroll) {
			const dom = document.getElementById(uuid);
			if (dom) {
				const target = dom.querySelector(".el-dialog");
				//const trigger = dom.querySelector('.el-dialog__header')
				target.style.top = 0;
				target.style.left = 0;
				target.style.margin = "15vh auto 50px";
				/*new Drag.install({
                    trigger: trigger,
                    target: target,
                    keepOrigin: false/!*,
                    //top: 0,
                    bottom: 100,
                    left: 100,
                    right: 100*!/
                });*/

				if (hasScroll) {
					let comToolBar = document.getElementById("comToolBar");
					dom.onscroll = function() {
						if (comToolBar) {
							comToolBar.triggerScroll(dom);
						}
					};
				}
			}
		};
		Vue.prototype.dialogClose = function(cn, hasScroll) {
			const dom = cn ? document.querySelector(cn) : null;
			if (dom) {
				dom.parentNode.removeChild(dom);
			}
			if (hasScroll) {
				let comToolBar = document.getElementById("comToolBar");
				if (comToolBar) {
					comToolBar.triggerScroll(null);
				}
			}
		};
	}
};
