<template>
	<div class="side-bar" :class="{ expand: isExpand }">
		<div class="sidebar-head" @click="handleExpand">
			<icon-svg :name="isExpand ? 'slider-left' : 'slider-right'" />
		</div>
		<section class="sidebar-menu">
			<el-menu :default-active="activeIndex">
				<template v-for="(item, i) in subMenu">
					<template v-if="item.path && !item.hide">
						<template v-if="item.meta && menuHasAuth(item.meta.auth)">
							<el-menu-item
								v-if="isMenuShow(item)"
								:index="generatePath(item)"
								:key="i"
								:title="item.meta.label"
							>
								<router-link :to="generatePath(item)" class="side-router">
									<icon-svg class="side-icon" :name="item.meta.icon"></icon-svg>
									<span class="side-title">{{ item.meta.label }}</span>
								</router-link>
							</el-menu-item>
						</template>
					</template>
				</template>
			</el-menu>
		</section>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import permissionMixin from "@mixins/permission.mixin";
	import { isMenuShow, getRedirectPath } from "@/utils/router";
	export default {
		name: "side-bar",
		mixins: [permissionMixin],
		data() {
			return {
				isExpand: true, // 显示
				activeIndex: "" // 当前选中项
			};
		},
		computed: {
			...mapState("menu", ["subMenu"]),
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
			isMenuShow(item) {
				return isMenuShow(item, true, this.menuPermissions);
			},
			handleExpand() {
				this.isExpand = !this.isExpand;
			},
			generatePath(item) {
				return `${this.basePath}/${item.path}`;
			},
			getActive(route) {
				const matched = route.matched || [];
				const first = matched[0] || {};
				const last = matched[matched.length - 1] || {};
				const parent = last.parent ? last.parent : last || {};
				const isParent = parent.path === last.path;
				this.activeIndex = route.path;
				this.basePath = first.path || "";
				const firstPath = getRedirectPath(
					this.subMenu,
					this.basePath,
					this.menuPermissions
				);
				if (isParent && firstPath !== route.path) {
					this.$router.replace(firstPath);
					console.log("Sidebar=>", "rootPath:", this.basePath, "firstPath:", firstPath);
				}
				console.log("Sidebar=>", this.activeIndex, firstPath);
			}
		}
	};
</script>

<style scoped lang="less">
	.side-bar {
		width: 50px;
		text-align: left;
		background: rgba(19, 41, 78, 1);
		transition: width ease 0.5s;

		&.expand {
			width: 160px;

			.el-menu-item {
				.side-title {
					display: inline-block;
					opacity: 1;
				}

				.side-router {
					padding: 0 20px;
				}
			}
		}
	}

	.sidebar-head {
		display: flex;
		align-items: center;
		justify-content: center;
        height: 40px;
		margin: 0 auto;
        font-size: 30px;
		cursor: pointer;
		background: #0d203e;
	}

	.sidebar-arrow {
		width: 24px;
		height: 24px;
		cursor: pointer;
		.arrow {
			width: 28px;
			height: 28px;
		}
	}

	/deep/ .el-menu {
		background: transparent;
		border: none;

		.el-menu-item {
			height: 48px;
			line-height: 48px;
			padding: 0 !important;
			background: transparent;

			.side-router {
				display: block;
				font-size: 14px;
				height: 100%;
				padding: 0 13px;
				background: transparent;
				text-decoration: none;
				transition: padding ease 0.5s;
				color: #fff;
				&:visited {
					color: #fff;
				}

				&.router-link-active,
				&:hover {
					background-color: rgba(24, 144, 255, 1);
				}
				.side-icon {
					display: inline-block;
					font-size: 28px;
					vertical-align: middle;
					margin-right: 10px;
				}
				span {
					opacity: 0;
					transition: opacity ease 0.5s;
				}
			}
		}
	}
</style>
