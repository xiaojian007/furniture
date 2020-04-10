<template>
	<div id="app" class="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>
<script>
	import { queryVersionJson } from "@api/version";
	import { version as currentVersion } from "@/../package.json";
	import { mapActions, mapState } from "vuex";

	export default {
		data() {
			return {
				sleep: 50000, // 轮询时间
				currentVersion, // 当前版本
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
			this.autoUpdateVersion();
		},
		mounted() {
		},
		methods: {
			...mapActions(["setLatestVersion"]),
			/**
			 * 自动更新
			 * @method autoUpdateVersion
			 */
			autoUpdateVersion() {
				if (this.autoUpdateTimer) {
					clearTimeout(this.autoUpdateTimer);
				}
				queryVersionJson()
					.then(res => {
						if (
							res &&
							res.body &&
							res.body.version &&
							this.currentVersion !== res.body.version
						) {
							this.setLatestVersion(res.body.version);
						}
					})
					.finally(() => {
						this.autoUpdateTimer = setTimeout(() => {
							this.autoUpdateVersion();
						}, this.sleep);
					});
			}
		}
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
