<template>
	<div class="app-header">
		<div class="header-left">
			<router-link to="/">
				<span class="slogan">xxx管理系统</span>
			</router-link>
		</div>
		<div class="header-right">
			<div class="user-img">
				<template v-if="user.headImage">
					<img :src="getPicBaseUrl(user.headImage, true) + THUMBNAIL_CROP" />
				</template>
				<template v-else>
					<img
						src="../../assets/img/portrait.png"
						style="width: 120%; height: 120%; margin: -10%"
					/>
				</template>
			</div>
			<el-dropdown @command="handleCommand" trigger="hover">
				<div class="el-dropdown-link">
					<div v-if="user.userName" class="user-info">
						<span class="nick1">
							{{ user.nickName || '某某某' }}
						</span>
						<span class="nick2">
							{{ user.userName }}
						</span>
					</div>
					<i class="el-icon-arrow-down el-icon--right header-icon-right"></i>
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="1">修改密码</el-dropdown-item>
					<el-dropdown-item command="0">安全退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<div class="header-main">
			<NavMenu />
		</div>

		<UpdatePassword ref="updatePassword"></UpdatePassword>
	</div>
</template>

<script>
	import NavMenu from "./NavMenu";
	import UpdatePassword from "../../components/UpdatePassword";
	import { mapState, mapActions } from "vuex";

	export default {
		name: "header-bar",
		components: { NavMenu, UpdatePassword },
		data() {
			return {};
		},
		computed: {
			...mapState({
				user: "user"
			})
		},
		methods: {
			...mapActions(["setInfo"]),
			handleCommand(name) {
				let val = parseInt(name, 10);
				if (val === 1) {
					this.$refs.updatePassword.load();
				} else if (val === 0) {
					this.logout();
				} else {
					//this.$router.push({name})
				}
			},
			logout() {
				setTimeout(() => {
					this.setInfo({});
					window.location.replace("/" + window.location.search);
				}, 100);
			}
		}
	};
</script>

<style lang="less" scoped>
	.app-header {
		width: 100%;
		height: 54px;
		box-sizing: border-box;
		overflow: visible;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
		background: #fff;
		color: #23294e;

		.header-left {
			line-height: 54px;
			font-weight: bold;
			padding: 0 30px;
			float: left;

			.logo {
				font-size: 40px;
				padding-right: 10px;
				vertical-align: top;
				background: linear-gradient(
					246deg,
					rgba(7, 210, 255, 1) 0%,
					rgba(51, 111, 255, 1) 100%
				);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}

			.slogan {
				font-size: 22px;
				vertical-align: top;
				color: #23294e;
			}
		}
		.header-main {
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;
		}
		.header-main + .header-right .user-info {
			color: #333;
		}

		.header-main + .header-right .el-dropdown-it {
			color: #333;
		}

		.header-right {
			padding: 4px 0 0 15px;
			white-space: nowrap;
			float: right;
			position: relative;

			.item {
				margin-top: 8px;
				margin-right: 22px;

				.el-badge__content {
					border: none;
					background-color: #ff2929;
				}
			}

			.el-dropdown {
				padding: 7px 5px;
				display: inline-block;
				vertical-align: middle;
			}

			.el-dropdown-link {
				text-align: center;
				white-space: nowrap;
				cursor: pointer;
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.user-img {
				color: #f1c900;
				font-size: 32px;
				width: 40px;
				height: 40px;
				display: inline-block;
				vertical-align: middle;
				border-radius: 100%;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					border: none;
				}
			}
			.user-info {
				display: flex;
				flex-direction: column;
				vertical-align: middle;
				font-size: 14px;
				color: #333;
				margin-left: 5px;

				.nick1 {
                    font-size: 14px;
                    line-height: 18px;
				}

				.nick2 {
					font-size: 12px;
				}

				.ip {
					color: rgba(76, 86, 97, 0.6);
				}

				.el-dropdown-it {
					display: inline-block;
					padding: 0 3px;

					&:hover {
						background-color: transparent;
					}
				}
			}

			.el-icon--right {
				color: #333;
			}
		}
	}
</style>
