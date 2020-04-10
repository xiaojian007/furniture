<template>
	<svg class="svg-icon" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script>
	export default {
		name: "icon-svg",
		props: {
			name: {
				type: String,
				required: true
			}
		},
		computed: {
			iconName() {
				return `#${this.name}`;
			}
		}
	};
</script>

<style>
	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>
