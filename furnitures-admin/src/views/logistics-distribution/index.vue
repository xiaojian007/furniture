<template>
	<div class="home">
		<div class="total-layout">
			<el-row :gutter="20">
				<el-col :span="6">
					<div class="total-frame">
						<img :src="imgHomeOrder" class="total-icon" />
						<div class="total-r">
							<div class="total-title">今日订单总数</div>
							<div class="total-value">200</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="total-frame">
						<img :src="imgHomeTodayAmount" class="total-icon" />
						<div class="total-r">
							<div class="total-title">今日销售总额</div>
							<div class="total-value">￥5000.00</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="total-frame">
						<img :src="imgHomeYesterdayAmount" class="total-icon" />
						<div class="total-r">
							<div class="total-title">昨日销售总额</div>
							<div class="total-value">￥5000.00</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="total-frame">
						<img :src="imgHomeYesterdayAmount" class="total-icon" />
						<div class="total-r">
							<div class="total-title">近7天销售总额</div>
							<div class="total-value">￥50000.00</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="un-handle-layout">
			<div class="layout-title">待处理事务</div>
			<div class="un-handle-content">
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">待付款订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">已完成订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">待确认收货订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">待发货订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">新缺货登记</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">待处理退款申请</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">已发货订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">待处理退货订单</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="un-handle-item">
							<span class="font-medium">广告位即将到期</span>
							<span style="float: right" class="color-danger">(10)</span>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>

		<div class="overview-layout">
			<el-row :gutter="20">
				<el-col :span="12">
					<div class="out-border">
						<div class="layout-title">商品总览</div>
						<div style="padding: 40px">
							<el-row>
								<el-col :span="6" class="color-danger overview-item-value"
									>100</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>400</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>50</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>500</el-col
								>
							</el-row>
							<el-row class="font-medium">
								<el-col :span="6" class="overview-item-title">已下架</el-col>
								<el-col :span="6" class="overview-item-title">已上架</el-col>
								<el-col :span="6" class="overview-item-title">库存紧张</el-col>
								<el-col :span="6" class="overview-item-title">全部商品</el-col>
							</el-row>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="out-border">
						<div class="layout-title">用户总览</div>
						<div style="padding: 40px">
							<el-row>
								<el-col :span="6" class="color-danger overview-item-value"
									>100</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>200</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>1000</el-col
								>
								<el-col :span="6" class="color-danger overview-item-value"
									>5000</el-col
								>
							</el-row>
							<el-row class="font-medium">
								<el-col :span="6" class="overview-item-title">今日新增</el-col>
								<el-col :span="6" class="overview-item-title">昨日新增</el-col>
								<el-col :span="6" class="overview-item-title">本月新增</el-col>
								<el-col :span="6" class="overview-item-title">会员总数</el-col>
							</el-row>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="chart-box">
			<div ref="chart" class="chart-box-inner"></div>
		</div>
	</div>
</template>

<script>
	import imgHomeOrder from "@assets/img/home_order.png";
	import imgHomeTodayAmount from "@assets/img/home_today_amount.png";
	import imgHomeYesterdayAmount from "@assets/img/home_yesterday_amount.png";
	import echarts from "echarts";
	export default {
		data() {
			return {
				imgHomeOrder,
				imgHomeTodayAmount,
				imgHomeYesterdayAmount,
				data: [],
				list: [], //数据
				chart: null, //图表
				option: {}, //图表参数
				isFirstRender: true //是否为首次渲染
			};
		},
		activated() {
			//被 keep-alive 缓存的组件激活时调用
			if (!this.isKeepAlive) {
				this.init();
			}
		},
		computed: {},

		methods: {
			/**
			 * 初始化图表
			 */
			init() {
				this.$nextTick(() => {
					if (this.$refs.chart) {
						this.chart = echarts.init(this.$refs.chart);
					}
					this.setOption();
				});
			},
			/**
			 * 渲染图表
			 * @param {object} option 参数
			 */
			render(option) {
				this.$nextTick(() => {
					if (this.chart) {
						this.chart.setOption(option);
					}
				});
			},

			setOption() {
				const that = this;
				that.chart.clear();

				that.option = {
					backgroundColor: "#05224d",
					tooltip: {},
					grid: {
						top: "8%",
						left: "1%",
						right: "1%",
						bottom: "8%",
						containLabel: true
					},
					legend: {
						itemGap: 50,
						data: ["下单数", "下单金额"],
						textStyle: {
							color: "#f9f9f9",
							borderColor: "#fff"
						}
					},
					xAxis: [
						{
							type: "category",
							boundaryGap: true,
							axisLine: {
								//坐标轴轴线相关设置。数学上的x轴
								show: true,
								lineStyle: {
									color: "#f9f9f9"
								}
							},
							axisLabel: {
								//坐标轴刻度标签的相关设置
								textStyle: {
									color: "#d1e6eb",
									margin: 15
								}
							},
							axisTick: {
								show: false
							},
							data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"]
						}
					],
					yAxis: [
						{
							type: "value",
							min: 0,
							// max: 140,
							splitNumber: 7,
							splitLine: {
								show: true,
								lineStyle: {
									color: "#0a3256"
								}
							},
							axisLine: {
								show: false
							},
							axisLabel: {
								margin: 20,
								textStyle: {
									color: "#d1e6eb"
								}
							},
							axisTick: {
								show: false
							}
						}
					],
					series: [
						{
							name: "注册总量",
							type: "line",
							// smooth: true, //是否平滑曲线显示
							// 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
							showAllSymbol: true,
							symbol: "emptyCircle",
							symbolSize: 6,
							lineStyle: {
								normal: {
									color: "#28ffb3" // 线条颜色
								},
								borderColor: "#f0f"
							},
							label: {
								show: true,
								position: "top",
								textStyle: {
									color: "#fff"
								}
							},
							itemStyle: {
								normal: {
									color: "#28ffb3"
								}
							},
							tooltip: {
								show: false
							},
							areaStyle: {
								//区域填充样式
								normal: {
									//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
									color: new echarts.graphic.LinearGradient(
										0,
										0,
										0,
										1,
										[
											{
												offset: 0,
												color: "rgba(0,154,120,1)"
											},
											{
												offset: 1,
												color: "rgba(0,0,0, 0)"
											}
										],
										false
									),
									shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
									shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
								}
							},
							data: [393, 438, 485, 631, 689, 824, 987]
						},
						{
							name: "最新注册量",
							type: "bar",
							barWidth: 20,
							tooltip: {
								show: false
							},
							label: {
								show: true,
								position: "top",
								textStyle: {
									color: "#fff"
								}
							},
							itemStyle: {
								normal: {
									// barBorderRadius: 5,
									// color: new echarts.graphic.LinearGradient(
									//     0, 0, 0, 1,
									//     [{
									//             offset: 0,
									//             color: '#14c8d4'
									//         },
									//         {
									//             offset: 1,
									//             color: '#43eec6'
									//         }
									//     ]
									// )
									color: function(params) {
										var colorList = [
											"#0ec1ff",
											"#10cdff",
											"#12daff",
											"#15ebff",
											"#17f8ff",
											"#1cfffb",
											"#1dfff1"
										];
										return colorList[params.dataIndex];
									}
								}
							},
							data: [200, 382, 102, 267, 186, 315, 316]
						}
					]
				};

				that.render(that.option);
			},

			//刷新图表（调用接口）
			refresh(params = {}) {
				const that = this;
				that.params = params;
				if (that.chart) {
					that.chart.showLoading({
						text: "loading",
						color: "#4cbbff",
						textColor: "#4cbbff",
						maskColor: "rgba(0, 0, 0, 0.3)"
					});
				}
			},
			/**
			 * 重置图表
			 */
			resize() {
				const that = this;
				that.$nextTick(() => {
					that.chart.resize();
				});
			}
		}
	};
</script>

<style scoped lang="less">
	.chart-box {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.chart-box-inner {
		width: 100%;
        height: 500px;
        margin-top: 20px;
	}
	.home {
		padding: 0 20px;
	}
	.total-layout {
		margin-top: 20px;

		.total-frame {
			display: flex;
			align-items: center;
			border: 1px solid #dcdfe6;
			padding: 20px;

			.total-icon {
				color: #409eff;
				width: 60px;
				height: 60px;
				margin-right: 10px;
			}
			.total-r {
				flex: 1;
				.total-title {
					font-size: 16px;
					color: #909399;
				}

				.total-value {
					font-size: 18px;
					color: #606266;
				}
			}
		}
	}

	.un-handle-layout {
		margin-top: 20px;
		border: 1px solid #dcdfe6;

		.un-handle-content {
			padding: 20px 40px;
		}

		.un-handle-item {
			border-bottom: 1px solid #ebeef5;
			padding: 10px;
		}
	}

	.overview-layout {
		margin-top: 20px;
		.out-border {
			border: 1px solid #dcdfe6;
		}

		.overview-item-value {
			font-size: 24px;
			text-align: center;
		}

		.overview-item-title {
			margin-top: 10px;
			text-align: center;
		}
	}
	.layout-title {
		color: #606266;
		padding: 15px 20px;
		background: #f2f6fc;
		font-weight: bold;
	}
</style>
