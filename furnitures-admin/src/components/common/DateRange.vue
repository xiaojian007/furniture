<template>
	<el-date-picker
		:size="size"
		:editable="false"
		:clearable="clearable"
		:range-separator="rangeSeparator"
		:picker-options="options"
		v-model="dateRange"
		:align="align"
		:value-format="valueFormat"
		:format="showFormat"
		type="daterange"
		start-placeholder="开始日期"
		end-placeholder="结束日期"
		style="width: 100%"
		@change="change"
	/>
</template>

<script>
	import { getDateRange, getYearUnix } from "@utils/date";
	export default {
		// 声明 props
		props: {
			size: {
				type: String,
				default: "small"
			},
			clearable: {
				type: Boolean,
				default: true
			},
			value: {
				type: Array,
				default: () => []
			},
			rangeSeparator: {
				type: String,
				default: "至"
			},
			valueFormat: {
				type: String,
				default: "yyyy-MM-dd"
			},
			showFormat: {
				type: String,
				default: "yyyy-MM-dd"
			},
			align: {
				type: String,
				default: "left"
			}
		},
		watch: {
			value(value) {
				this.dateRange = value;
			}
		},
		data() {
			var that = this;
			const range = getDateRange(0, "week");
			let defaultRange = that.value || [range.startDateObj, range.todayObj];
			if (defaultRange && !defaultRange[0]) {
				defaultRange = [];
			}
			return {
				dateRange: defaultRange || [],
				options: {
					disabledDate(time) {
						let staTime = getYearUnix("2018-01-01");
						return time.getTime() < staTime;
					},
					shortcuts: [
						{
							text: "今天",
							onClick(picker) {
								const dateRange = getDateRange(0, "day");
								that.dateRange = dateRange;
								picker.$emit("pick", [
									dateRange.startDateObj,
									dateRange.endDateObj
								]);
							}
						},
						{
							text: "昨天",
							onClick(picker) {
								const dateRange = getDateRange(-2, "day");
								that.dateRange = dateRange;
								picker.$emit("pick", [
									dateRange.startDateObj,
									dateRange.startDateObj
								]);
							}
						},
						{
							text: "最近三天",
							onClick(picker) {
								const dateRange = getDateRange(-3, "day");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "最近7天",
							onClick(picker) {
								const dateRange = getDateRange(-7, "day");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "最近30天",
							onClick(picker) {
								const dateRange = getDateRange(-30, "day");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "本周",
							onClick(picker) {
								const dateRange = getDateRange(0, "week");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "上周",
							onClick(picker) {
								const dateRange = getDateRange(-1, "week");
								that.dateRange = dateRange;
								picker.$emit("pick", [
									dateRange.startDateObj,
									dateRange.endDateObj
								]);
							}
						},
						{
							text: "最近三周",
							onClick(picker) {
								const dateRange = getDateRange(-2, "week");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "本月",
							onClick(picker) {
								const dateRange = getDateRange(0, "month");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						},
						{
							text: "上月",
							onClick(picker) {
								const dateRange = getDateRange(-1, "month");
								that.dateRange = dateRange;
								picker.$emit("pick", [
									dateRange.startDateObj,
									dateRange.endDateObj
								]);
							}
						},
						{
							text: "最近三月",
							onClick(picker) {
								const dateRange = getDateRange(-2, "month");
								that.dateRange = dateRange;
								picker.$emit("pick", [dateRange.startDateObj, dateRange.todayObj]);
							}
						}
					]
				}
			};
		},
		methods: {
			change() {
				this.$emit("input", this.dateRange);
				this.$emit("change", this.dateRange);
			}
		}
	};
</script>
