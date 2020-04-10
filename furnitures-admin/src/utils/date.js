/**
 * 时间相关的通用函数
 * @author szyeliming@ininin.com
 * @since 2020-02-12
 * @version 1.0.0
 * @description 时间相关的通用函数
 * @copyright ininin.com
 */

import { zeroPadding } from "./index";
/**
 * 获取当前时间戳
 * @method getUnix
 * @returns {String} 时间戳
 */
export const getUnix = () => new Date().getTime();
/**
 * 获取今天0点0分0秒的时间戳
 * @method getTodayUnix
 * @returns {String} 时间戳
 */
export const getTodayUnix = () => {
	let date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
};

/**
 * 获取今年1月1日0点0分0秒的时间戳
 * @method getYearUnix
 * @returns {String} 时间戳
 */
export const getYearUnix = () => {
	let date = new Date();
	date.setMonth(0);
	date.setDate(1);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
};
/**
 * 获取标准年月
 * @method getFormatDate
 * @param {Date} time 时间戳
 * @param {String} fmt 格式化时间
 * @returns {String} 格式化后的时间字符串
 */
export const getFormatDate = (time, fmt = "yyyy-MM-dd hh:mm:ss") => {
	let date = new Date(time);
	const dateObj = {
		yyyy: date.getFullYear(),
		MM: zeroPadding(date.getMonth() + 1),
		dd: zeroPadding(date.getDate()),
		hh: zeroPadding(date.getHours()),
		mm: zeroPadding(date.getMinutes()),
		ss: zeroPadding(date.getSeconds())
	};
	return fmt.replace(/^(yyyy)|(MM)|(dd)|(hh)|(mm)|(ss)$/g, key => {
		return dateObj[key];
	});
};
/**
 * 转换时间
 * @method getFormatTime
 * @param {Date} timestamp 时间戳
 * @returns {String} 时间戳
 */
export const getFormatTime = timestamp => {
	let now = getUnix();
	let timer = (now - timestamp) / 1000;
	const D_DAYS = parseInt(timer / 86400, 10);
	const D_HOURS = parseInt(timer / 3600, 10);
	const D_MINUTES = parseInt(timer / 60, 10);
	const D_SECONDS = parseInt(timer, 10);

	if (D_DAYS > 0 && D_DAYS < 3) {
		return D_DAYS + "天前";
	} else if (D_DAYS <= 0 && D_HOURS > 0) {
		return D_HOURS + "小时前";
	} else if (D_HOURS <= 0 && D_MINUTES > 0) {
		return D_MINUTES + "分钟前";
	} else if (D_SECONDS < 60) {
		if (D_SECONDS <= 0) {
			return "刚刚";
		} else {
			return D_SECONDS + "秒前";
		}
	} else if (D_DAYS >= 3 && D_DAYS < 30) {
		return getFormatDate(timestamp, "MM-dd hh:mm");
	} else {
		return getFormatDate(timestamp, "yyyy-MM-dd hh:mm");
	}
};

/**
 * 格式化日期对象
 * @param {Date} date 日期对象
 * @param {String} fmt 格式
 * @example
 * Utils.Date.format(date, 'yyyy-mm-dd hh:ii:ss');
 * @returns {String} 格式化日期字符串
 */
export const format = (date, fmt)=> {
	date = date || new Date();
	fmt = fmt || "yyyy-mm-dd";
	let o = {
		"m+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"i+": date.getMinutes(), //分
		"s+": date.getSeconds() //秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
			);
		}
	}
	return fmt;
}
/**
 * 获取日期段
 * @param {Number} [num=0] 数字，负数表示上月/周/num天内
 * @param {Number|String} [mode=day] year：年，month：月，week：周，day：日
 * @param {Boolean} [oneDay=false] 指定为某一天
 * @example
 * Utils.Date.getDateRange(-1, 'month') // => 上月
 * Utils.Date.getDateRange(0, 'month') // => 本月
 * Utils.Date.getDateRange(-1, 'week') // => 上周
 * Utils.Date.getDateRange(0, 'week') // => 本周
 * Utils.Date.getDateRange(0, 'day') // => 今天
 * Utils.Date.getDateRange(-2, 'day', true) // => 昨天
 * Utils.Date.getDateRange(-7, 'day') // => 最近7天
 * Utils.Date.getDateRange(-30, 'day') // => 最近30天
 * @constructor
 * @returns {Object} 结果
 */
let dayMillisecond = 864e5; //一天的毫秒数
export const getDateRange = (num, mode, oneDay) => {
	var _this = this;
	num = parseFloat(num) || 0;
	mode = mode || "day";
	var date = new Date();
	var dateTime = date.getTime();
	var startDate = dateTime; //起始时间
	var endDate = dateTime; //结束时间
	if (mode == "week") {
		//上周/本周
		num = 7 * num;
		var weekTime = dateTime + num * dayMillisecond;
		var week = date.getDay() || 7; //星期几
		startDate = weekTime - (week - 1) * dayMillisecond;
		endDate = startDate + 6 * dayMillisecond;
	} else if (mode == "month") {
		//上月/本月
		var monthDate = new Date(date.getFullYear(), date.getMonth() + num, 1);
		startDate = monthDate.getTime();
		monthDate.setDate(_this.getMonthDays(monthDate.getMonth() + 1, monthDate.getFullYear()));
		endDate = monthDate.getTime();
	} else {
		//num天内
		if (num < 0) {
			//向前
			num++; //去掉今天
			startDate = dateTime + num * dayMillisecond;
			endDate = oneDay ? startDate : dateTime;
		} else if (num > 0) {
			//向后
			num--; //去掉今天
			endDate = dateTime + num * dayMillisecond;
			startDate = oneDay ? endDate : dateTime;
		}
	}
	let startDateObj = new Date(startDate);
	startDateObj.setHours(0);
	startDateObj.setMinutes(0);
	startDateObj.setSeconds(0);
	let startDateEndObj = new Date(startDate);
	startDateEndObj.setHours(23);
	startDateEndObj.setMinutes(59);
	startDateEndObj.setSeconds(59);
	let endDateObj = new Date(endDate);
	endDateObj.setHours(23);
	endDateObj.setMinutes(59);
	endDateObj.setSeconds(59);
	let todayEndObj = new Date(dateTime);
	todayEndObj.setHours(23);
	todayEndObj.setMinutes(59);
	todayEndObj.setSeconds(59);
	return {
		startDate: format(new Date(startDate)),
		startDateObj,
		startDateEndObj,
		endDate: format(new Date(endDate)),
		endDateObj,
		today: format(new Date(dateTime)),
		todayObj: new Date(dateTime),
		todayEndObj
	};
};

