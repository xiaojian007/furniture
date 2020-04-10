<template>
	<div class="breadcrumb">
		<el-breadcrumb separator="/">
			<template v-for="(item, i) in list">
				<el-breadcrumb-item :key="i">
					{{ item.meta.label }}
				</el-breadcrumb-item>
			</template>
		</el-breadcrumb>
	</div>
</template>
<script>
	import { mapState } from "vuex";

	export default {
		data() {
			return {
				list: []
				// lastIndex: 0
			};
		},
		computed: {
			...mapState(["auth"])
		},
		watch: {
			$route(route) {
				this.getList(route);
			}
		},
		created() {
			this.getList(this.$route);
		},
		methods: {
			//链接地址
			generatePath(item) {
				return `${item.path}`;
			},
			getList(route) {
				const matched = route.matched.slice(0);
				const last = matched[matched.length - 1];

				// 去掉重定向的默认页面
				if (last && last.parent && last.parent.redirect) {
					matched.pop();
				}
				this.list = matched;
			}
		}
	};
</script>
<style lang="less" scoped>
	.breadcrumb {
		padding-left: 24px;
		display: flex;
		align-items: center;
		height: 40px;
		background: rgba(250, 250, 250, 1);
		border-bottom: 1px solid rgba(232, 232, 232, 1);

		/deep/ .el-breadcrumb__item {
			.el-breadcrumb__inner {
				color: #888;
				font-weight: bold;
			}

			&:last-child {
				.el-breadcrumb__inner {
					color: #333;
				}
			}
		}
	}
</style>
