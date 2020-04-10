<template>
	<div class="app-main">
		<HeaderBar />
		<section class="app-body">
			<div class="app-warp">
				<router-view></router-view>
			</div>
		</section>
	</div>
</template>

<script>
	import HeaderBar from "./components/HeaderBar";
	export default {
		components: { HeaderBar},
		data() {
			return {};
        },
        created() {
        },
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
