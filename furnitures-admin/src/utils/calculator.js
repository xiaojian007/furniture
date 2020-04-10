/**
 * 数字操作类
 * @summary 数字操作类
 * @author lijian
 * @version 1.1
 * @since 2017/7/16
 * @type {{calculator: calculator, add: add, sub: sub, mul: mul, div: div}}
 * --------------------
 * @version 1.1.1
 * @since 2020-02-21
 * @description 优化注释
 */
export default {
	_SLICE: [].slice,
	/**
	 * 加减乘除计算器
	 * @method calculator
	 * @param {Array} args 参与计算的运算数
	 * @param {String} sign 计算类型
	 * @returns {Number} {*} 计算结果
	 */
	calculator: function(args, sign) {
		var arg1 = args[0],
			arg2 = args[1];
		if (args.length < 2) {
			return arg1;
		}
		arg1 = parseFloat(arg1) || 0;
		arg2 = parseFloat(arg2) || 0;
		var arr1 = arg1.toString().split("."),
			arr2 = arg2.toString().split("."),
			r1 = arr1[1] == null ? 0 : arr1[1].length, //第一个数，小数位数
			r2 = arr2[1] == null ? 0 : arr2[1].length, //第二个数，小数位数
			x1 = parseInt(arr1[0] || 0, 10), //第一个数，小数点前面的值
			x2 = parseInt(arr1[1] || 0, 10), //第一个数，小数点后面的值
			y1 = parseInt(arr2[0] || 0, 10), //第二个数，小数点前面的值
			y2 = parseInt(arr2[1] || 0, 10), //第二个数，小数点后面的值
			m1 = Math.pow(10, r1), //第一个数，放大的倍数
			m2 = Math.pow(10, r2), //第二个数，放大的倍数
			m,
			num1,
			num2,
			result;
		x2 = x1 < 0 ? -x2 : x2;
		y2 = y1 < 0 ? -y2 : y2;
		if (sign === "*") {
			num1 = x1 * m1 + x2; //得到第一个数
			num2 = y1 * m2 + y2; //得到第二个数
		} else {
			m = Math.pow(10, Math.max(r1, r2)); //两个数同时放大的倍数
			num1 = x1 * m + (x2 * m) / m1; //得到第一个数
			num2 = y1 * m + (y2 * m) / m2; //得到第二个数
		}
		if (sign === "-") {
			//减法
			result = (num1 - num2) / m;
		} else if (sign === "*") {
			//乘法
			result = (num1 * num2) / (m1 * m2);
		} else if (sign === "/") {
			//除法
			result = num1 / num2;
		} else {
			//加法
			result = (num1 + num2) / m;
		}
		args = args.slice(2);
		args.unshift(result);
		return this.calculator(args, sign);
	},
	/**
	 * 加法
	 * @method add
	 * @example
	 * Utils.Number.add(69.6, 0); // => 69.6
	 * Utils.Number.add(69.6, 1.07, 4.5); // => 75.17
	 * @returns {Number} 计算结果
	 */
	add: function() {
		return this.calculator(this._SLICE.call(arguments, 0), "+");
	},
	/**
	 * 减法
	 * @method sub
	 * @example
	 * Utils.Number.sub(69.6, 0); // => 69.6
	 * Utils.Number.sub(69.6, 1.07, 4.5); // => 64.03
	 * @returns {Number} 计算结果
	 */
	sub: function() {
		return this.calculator(this._SLICE.call(arguments, 0), "-");
	},
	/**
	 * 乘法
	 * @method mul
	 * @example
	 * Utils.Number.mul(69.6, 0); // => 0
	 * Utils.Number.mul(69.6, 1.07, 4.5); // => 335.124
	 * @returns {Number} 计算结果
	 */
	mul: function() {
		return this.calculator(this._SLICE.call(arguments, 0), "*");
	},
	/**
	 * 除法
	 * @method div
	 * @example
	 * Utils.Number.div(69.6, 10); // => 6.96
	 * Utils.Number.div(69.6, 1.07, 4.5); // => 14.454828660436137
	 * @returns {Number} 计算结果
	 */
	div: function() {
		return this.calculator(this._SLICE.call(arguments, 0), "/");
	},
	/**
	 * 保留小数位
	 * @method fixed
	 * @param {String|Number} value 数值
	 * @param {Number} n 小数位数
	 * @example
	 * Utils.Number.fixed(69.6, 2); // => 69.60
	 * Utils.Number.fixed(69.6, 4); // => 69.6000
	 * @returns {String} 计算结果
	 */
	fixed: function(value, n) {
		n = n == null ? 2 : n;
		let num = Math.pow(10, n);
		return this.div(Math.round(this.mul(value, num)), num).toString();
	}
};
