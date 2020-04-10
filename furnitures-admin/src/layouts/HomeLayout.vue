<template>
	<div class="layout-home-main">
		<HeaderBar />
		<section class="app-body">
			<div class="app-warp">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</div>
		</section>
	</div>
</template>
<script>
	import HeaderBar from "./components/HeaderBar";

	export default {
		name: "home-layout",
		components: { HeaderBar },
		data() {
			return {};
		}
	};
</script>
