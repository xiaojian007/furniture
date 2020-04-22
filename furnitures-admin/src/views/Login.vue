<template>
	<div class="login" @keyup.enter="login">
		<main ref="main">
			<div class="login-title">欢迎进入xxxx系统</div>
			<div class="login-box">
				<el-form :model="form" :rules="rules" ref="form">
					<el-form-item prop="account" class="height50">
						<el-input
							type="text"
							v-model="form.account"
							auto-complete="off"
							class="height50 login-input-bg"
							placeholder="请输入账号"
						></el-input>
					</el-form-item>
					<el-form-item prop="password" class="margin8 height50">
						<el-input
							type="password"
							v-model="form.password"
							auto-complete="off"
							class="height50 login-input-bg"
							placeholder="请输入密码"
						></el-input>
					</el-form-item>
					<el-form-item class="margin15">
						<el-row>
							<el-col :span="12"> </el-col>
						</el-row>
					</el-form-item>
					<el-form-item class="login-btn height50">
						<el-button type="primary" @click="login" :loading="submitting"
							>登录</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</main>
	</div>
</template>

<script>
	import { mapActions } from "vuex";
	import SpiderAnimation from "@assets/js/spiderAnimation.js"; // 动效js
	import { submitLogin } from "@api/user";
	import { md5 } from "@utils/crypto";
	export default {
		data() {
			return {
				form: {
					account: "17621962518",
					password: "123456"
				},
				submitting: false,
				rules: {
					account: [{ required: true, message: "请输入账号", trigger: "blur" }],
					password: [{ required: true, message: "请输入登录密码", trigger: "blur" }]
				}
			};
		},
		mounted() {
			this.initAnimation();
		},
		methods: {
			...mapActions(["setInfo"]),
			// 左右上角动态效果
			initAnimation() {
				let spiderAnimation = new SpiderAnimation(),
					params = {
						el: this.$refs.main,
						width: 500,
						count: 40,
						color: ["#eaeaea", "#9fc8ff", "#b8eaff"]
					};
				spiderAnimation.init(params);
			},
			/**
			 * 登录
			 * @method login
			 */
			login() {
				this.submitting = true;
				let params = {
					mobile: this.form.account,
					password: md5(md5(this.form.password))
				};
				submitLogin(params)
					.then(data => {
						console.log(data);
						let user = {
							token: new Date().getTime().toString(),
							user: {
								userName: this.form.account,
								userId: 1,
								menuPermissionIds: "22,32,44,33,33,233,44,1,2,3,4,5",
								btnPermissionIds: "02,3,4,5,3,4"
							}
						};
						this.setInfo(user)
							.then(() => {
								this.submitting = false;
								this.$router.push({ path: "/" });
							})
							.catch(err => {
								this.submitting = false;
								console.log(err);
							});
						this.submitting = false;
					})
					.catch(err => {
						this.submitting = false;
						console.log(err);
					});
				// 写死用户
				setTimeout(() => {
					this.setInfo({
							token: new Date().getTime().toString(),
							user: {
								userName: this.form.account,
								userId: 1,
								menuPermissionIds: "22,32,44,33,33,233,44,1,2,3,4,5",
								btnPermissionIds: "02,3,4,5,3,4"
							}
						})
						.then(() => {
							this.submitting = false;
							this.$router.push({ path: "/" });
						})
						.catch(err => {
							this.submitting = false;
							console.log(err);
						});
				}, 600);
			}
		}
	};
</script>

<style lang="less">
	body {
		position: relative;
	}

	.login {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;

		main {
			width: 400px;
			height: 384px;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;

			.login-title {
				font-size: 24px;
				color: rgba(51, 51, 51, 1);
				text-align: center;
				width: 100%;
				font-weight: 600;
				line-height: 33px;
				height: 33px;
				position: absolute;
				top: -50px;
				left: 0;
				z-index: 100;
			}

			.login-box {
				position: absolute;
				bottom: 0;
				left: 0;
				z-index: 100;
				width: 100%;
				padding: 30px 40px 40px 40px;
				box-sizing: border-box;
				background: #fff;
				box-shadow: 0px 0px 16px 2px rgba(0, 0, 0, 0.1);
				border-radius: 5px;

				input {
					box-shadow: 0 0 0px 1000px #f6f6f6 inset !important;
				}

				.el-tabs__item {
					font-size: 18px;
					color: #333333;
				}

				.el-tabs__nav-scroll {
					.el-tabs__nav {
						margin: 0 76px !important;
					}
				}

				.el-tabs__item:hover {
					color: #000;
				}

				.el-tabs__nav-wrap::after {
					height: 0px;
				}

				.el-tabs__item.is-active {
					color: #346fff;
				}

				.el-tabs__header {
					margin-bottom: 21px;
				}

				.el-tabs__active-bar {
					background-color: #346fff;
				}

				.height50 {
					height: 50px;

					.el-input__inner {
						height: 50px;
					}
				}

				.login-btn {
					margin: 56px 0 0;

					button {
						background: linear-gradient(
							220deg,
							rgba(9, 167, 255, 1) 0%,
							rgba(106, 40, 255, 1) 100%
						);
						border-radius: 5px;
						height: 50px;
						width: 100%;
					}
				}

				.el-form-item {
					margin-bottom: 20px;
				}

				.margin8 {
					margin-bottom: 8px;
				}

				.margin18 {
					margin-bottom: 15px;
				}

				.login-input-bg {
					background: #f6f6f6;
				}

				.splice-line {
					width: 1px;
					height: 12px;
					margin: 14px 8px;
					background: rgba(216, 216, 216, 1);
				}

				.floatRight {
					float: right;
					cursor: pointer;
					color: #9b9b9b;
				}

				.el-checkbox__label {
					color: #9b9b9b;
				}
			}
		}
		#pane-scanLogin {
			text-align: center;
			position: relative;
			top: -30px;
		}
	}
</style>
