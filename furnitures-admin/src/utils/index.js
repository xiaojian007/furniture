/**
 * 通用工具函数
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 通用工具函数
 * @copyright lijian
 */

/**
 * 补零
 * @method zeroPadding
 * @param {Number} num
 * @returns {String} 补零后的字符串
 */
export const zeroPadding = num => {
	return num < 10 ? `0${num}` : String(num);
};
/**
 * 获取指定数据的数据类型
 * @method getDataType
 * @param {any} value 数据
 * @returns {String} 数据类型
 */
export const getDataType = value =>
	Object.prototype.toString
		.call(value)
		.substr(8)
		.slice(0, -1)
		.toLowerCase();

/**
 * 兼容获取图片url
 * @method getPicBaseUrl
 * @param {String} url url数据
 * @returns {String} 图片url
 */
export const getPicBaseUrl = (url) => {
	const rules = [
		{
			rule: /^http(s?):/,
			reCharacter: ""
		},
		{
			rule: /\?.*$/,
			reCharacter: ""
		}
	];
	url = rules.reduce((str, { rule, reCharacter }) => {
		return str.replace(rule, reCharacter);
	}, String(url || ""));
	return `${url}`;
};

/**
 * 生成唯一标识id
 * @method uuid
 */
export const uuid = (() => {
	let _timestamp = 0;
	return len => {
		let timestamp = new Date().getTime() || 0,
			chars = "abcdefghijklmnopqrstuvwxyz",
			id = "";
		_timestamp = _timestamp == timestamp ? timestamp + 1 : timestamp;
		timestamp = "" + _timestamp;
		len = len || 16;
		for (let i = 0; i < len; i++) {
			let k = timestamp.charAt(i);
			if (k === "") {
				k = Math.floor(Math.random() * 26);
			}
			id += chars.charAt(k) || "x";
		}
		return id;
	};
})();

/**
 * 兼容的获取当前样式的任意属性值
 * @method getStyle
 * @param {Element} element dom元素
 * @returns {Object} 样式属性对象
 */
export function getStyle(element) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(element, null);
	} else {
		return element.currentStyle;
	}
}

/**
 * 获取对应的属性的值
 * @method getStyleAttr
 * @param {Element} element  dom元素
 * @param {string} attr 元素属性
 * @returns {String} 样式属性
 */
export function getStyleAttr(element, attr) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(element, null)[attr];
	} else {
		return element.currentStyle[attr];
	}
}

/**
 * 格式化常量配置
 * @method setEnumAndArray
 * @param {Array} parts 部件
 * @returns {Object} EnumAndArray
 */
export const setEnumAndArray = parts => {
	let obj = {},
		arr = [];
	parts.forEach(part => {
		let value = part,
			text = part;
		if (typeof part === "object") {
			value = part.k;
			text = part.v;
		}
		arr.push({ value, text });
		obj[value] = text;
	});
	return { arr, obj };
};

/**
 * 模拟延时
 * @method delay
 * @param {Number} time 毫秒为单位
 * @returns {Promise} Promise
 */
export const delay = time => {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
};
