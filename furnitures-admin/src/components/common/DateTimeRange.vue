<template>
    <el-date-picker
        :editable="false"
        :clearable="clearable"
        :default-time="defaultTime"
        :picker-options="options"
        :range-separator="'至'"
        v-model="dateRange"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        placeholder="请选择日期范围"
        style="width: 100%"
        @change="change"/>
</template>

<script>
    export default {
        // 声明 props
        props: {
            clearable: {
                type: Boolean,
                default: false
            },
            defaultRange: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            let that = this
            return {
                dateRange: that.defaultRange,
                defaultTime: ['00:00:00', that.Date.format(new Date(), 'hh:ii:ss')],
                options: {
                    // disabledDate(time) {
                    //     const dateRange = that.Date.getDateRange(0, 'day')
                    //     return (time.getTime() > dateRange.todayObj.getTime())
                    // },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.startDateEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.startDateEndObj])
                        }
                    }, {
                        text: '三天内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-3, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '7天内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-7, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '30天内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-30, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '60天内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-60, 'day')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'week')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-1, 'week')
                            //that.setDateRange(dateRange.startDateObj, dateRange.endDateObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.endDateObj])
                        }
                    }, {
                        text: '三周内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'week')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(0, 'month')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-1, 'month')
                            //that.setDateRange(dateRange.startDateObj, dateRange.endDateObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.endDateObj])
                        }
                    }, {
                        text: '三月内',
                        onClick(picker) {
                            const dateRange = that.Date.getDateRange(-2, 'month')
                            //that.setDateRange(dateRange.startDateObj, dateRange.todayEndObj)
                            picker.$emit('pick', [dateRange.startDateObj, dateRange.todayEndObj])
                        }
                    }]
                }
            }
        },
        watch: {
            defaultRange() {
                let that = this
                if (that.defaultRange && that.defaultRange[0]) {
                    that.dateRange = that.defaultRange
                } else {
                    that.dateRange = []
                }
            }
        },
        methods: {
            /*setDateRange(startDate, endDate) {
                debugger
                this.dateRange = [this.Date.format(startDate, 'yyyy-MM-dd HH:mm:ss'), this.Date.format(endDate, 'yyyy-MM-dd HH:mm:ss')]
            },*/
            change() {
                this.$emit('change', this.dateRange)
            }
        }
    }
</script>
