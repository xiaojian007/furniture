/**
 * 注册全局方法
 * @author lijian
 * @since 2020-02-24
 * @version 1.0.0
 * @description 注册全局方法
 * @copyright lijian
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
			form = form || {};
			data = data || {};
			Object.keys(form).forEach(function(key) {
				let val = data[key];
				let formType = typeof form[key];
				let dataType = typeof data[key];
				if (dataType === "string") {
					val = val.trim();
				}
				if (formType !== "object" && dataType !== "object") {
					if (val == null) {
						form[key] = "";
					} else {
						form[key] = val;
					}
				}
			});
			return form;
        };
		Vue.prototype.RE = {
			uuid: /^[A-Za-z0-9]{3,20}$/,
			mobile: /^1[3456789]\d{9}$/,
			mobileTel: /^[+\-\s0-9]{6,20}$/,
			email: /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/,
			idCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
			// mobileEmail: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			bankCode: /^[\s0-9]{12,24}$/,
			qq: /^[0-9]{5,13}$/,
			pwd: /^\S{6,16}$/,
			date: /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31))|(([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
			blank: /\s+/g,
			nonempty: /^\S+$/
		};
		/**
		 * 制保留2位小数，如：2，会在2后面补上00.即2.00
		 * @param {Number} num 2
		 * @param {Number} value 几位小数。默认 两位
		 * @return {Number} s
		 */
		Vue.prototype.toDecimal = (num, value) => {
			let digits = Number(value) | 2;
			let power = Math.pow(10, digits);
			let f = parseFloat(num);
			if (isNaN(f)) {
				return false;
			}
			f = Math.round(num * power) / power;
			let s = f.toString();
			let rs = s.indexOf(".");
			if (rs < 0) {
				rs = s.length;
				s += ".";
			}
			while (s.length <= rs + digits) {
				s += "0";
			}
			return s;
		};
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
