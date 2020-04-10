<template>
	<div class="app-main">
		<HeaderBar />
		<section class="app-body">
			<SideBar />
			<div class="app-warp">
				<BreadCrumb />
				<router-view></router-view>
				<!-- <FooterBar /> -->
			</div>
		</section>
	</div>
</template>

<script>
	import HeaderBar from "./components/HeaderBar";
	import FooterBar from "./components/FooterBar";
	import SideBar from "./components/SideBar";
	import BreadCrumb from "./components/BreadCrumb";

	export default {
		components: { HeaderBar, FooterBar, SideBar, BreadCrumb },
		data() {
			return {};
		},
		created() {},
		computed: {},
		methods: {}
	};
</script>
<style lang="less" scoped>
	.app-main {
		height: 100vh;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		// overflow: hidden;
	}

	.app-body {
		flex: 1;
		display: flex;
	}

	.app-warp {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
