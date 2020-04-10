<template>
	<el-menu :default-active="activeIndex" class="app-menu" mode="horizontal">
		<template v-for="(item, index) in items">
			<el-menu-item v-if="isMenuShow(item)" :index="generatePath(item)" :key="index">
				<router-link :to="item.path">
					{{ item.meta && item.meta.label }}
				</router-link>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script>
	import { mapState, mapActions } from "vuex";
	import { isMenuShow } from "@/utils/router";
	export default {
		name: "app-menu",
		data() {
			return {
				activeIndex: ""
			};
		},
		computed: {
			...mapState("menu", ["items"]),
			...mapState("auth", ["menuPermissions"])
		},
		watch: {
			$route(route) {
				this.getActive(route);
			}
		},
		created() {
			this.getActive(this.$route);
		},
		methods: {
            ...mapActions(["setSubMenu"]),
            // 是否显示
            isMenuShow(item) {
				return isMenuShow(item, true, this.menuPermissions);
			},
			/**
			 * 当前路径
			 * @param {Obj} route 路由
			 */
			getActive(route) {
				let matched = route.matched;
				if (matched.length) {
					let lastMatched = matched[0];
					let parent =
						lastMatched && lastMatched.parent ? lastMatched.parent : lastMatched || "";
					let path = parent.path || route.path || "";
                    this.activeIndex = path;
					// 设置子菜单
                    this.setSubMenu(path);
				}
			},

			/**
			 * 返回路径
			 * @param {Obj} item 路由
			 * @return {String}  路由路径
			 */
			generatePath(item) {
				return item.path;
			}
		}
	};
</script>

<style lang="less" scoped>
	.app-menu.el-menu--horizontal {
		background: transparent;
		border: none;

		/*.menu-icon {
            width: 20px;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            display: inline-block;
            vertical-align: top;
        }

        .menu-icon-home {
            background-image: url(../../assets/img/sys/13.png);
        }*/

		.el-menu-item {
			color: #333;
			padding: 0;
			height: 54px;
			line-height: 54px;
			border: none;
			min-width: 60px;

			a {
				font-weight: bold;
				height: 100%;
				padding: 0 20px;
				display: block;
			}

			&.is-active,
			&:focus,
			&:hover {
				background-color: #eff3fc;
				color: #187bff;
			}
		}
	}
</style>
