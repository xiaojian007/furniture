/**
 * 图表通用方法mixins
 * @author shlijian@ininin.com
 * @since 2020-02-14
 * @version 1.0.0
 * @description 图表通用方法mixins
 * @copyright ininin.com
 */

import echarts from "echarts";
import noData from "@assets/img/echarts/chart-no-data.png";
import "@assets/css/echarts.common.less";
const noDataImgSizeMap = {
	default: {
		width: "120px",
		height: "80px"
	},
	lg: {
		width: "260px",
		height: "174px"
	}
};
export default {
	mounted() {
		this.initChart();
		window.addEventListener("resize", this.resize);
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.resize);
	},
	methods: {
		/**
		 * 重置图表
		 * @method resize
		 */
		resize() {
			this.$nextTick(function cb() {
				this.$refs.chart && this.chart.resize();
			});
		},
		/**
		 * 初始化图标容器
		 * @method initChart
		 */
		initChart() {
			this.chart = echarts.init(this.$refs.chart);
		},
		/**
		 * 渲染无数据
		 * @method renderNull
		 * @param {String} size default|lg图片大小
		 * @param {String} msg 提示文本 默认 暂无数据
		 */
		renderNull(size = "default", msg = "暂无数据") {
			const style = noDataImgSizeMap[size];
			this.$refs.chart.removeAttribute("_echarts_instance_");
			this.$refs.chart.removeAttribute("style");
			this.$refs.chart.innerHTML = `<div class="chart-no-data"><img style='width:${style.width};height:${style.height};' src="${noData}"/><p>${msg}</p></div>`;
		}
	}
};
