<template>
	<div id="app" class="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>
<script>
	import { mapState } from "vuex";
	import version from "./version";

	export default {
		data() {
			return {
				sleep: 50000, // 轮询时间
				autoUpdateTimer: null // 自动更新轮询器
			};
		},
		computed: {
			...mapState({
				user: ["user"]
			}),
			isToken() {
				return this.hasToken;
			},
			isPermission() {
				return this.hasPermission;
			}
		},
		created() {
            version.autoUpdateVersion();
		},
		mounted() {},
		methods: {}
	};
</script>

<style lang="less" scoped>
	.app {
		height: 100%;
		width: 100%;

		.nodata-loading {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
