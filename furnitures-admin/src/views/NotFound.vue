<template>
	<div class="list-panel">
		<div class="no-find">
			<img src="../assets/img/404_logo.png" alt="" />
			<p class="text">您好，{{user.userName || user.userName}}，您访问的页面不存在</p>
			<el-button round size="small" @click="goBack">返回首页</el-button>
		</div>
	</div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        components: {},
        data() {
            return {}
        },
        computed: {
			...mapState(["user"])
        },
        methods: {
            goBack() {
				this.$router.replace("/");
			}
        }
    }
</script>
<style lang="less" scoped>
	.list-panel {
		flex: 1;
        display: flex;
        min-height: 600px;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
        color: #333;
        height: 100%;

		.no-find {
			font-size: 18px;
			font-weight: bold;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			img {
				width: 431px;
				display: block;
			}
			.text {
                display: block;
                margin: 40px 0;
            }
            /deep/ .el-button{
                width: 236px;
                line-height: 40px;
                border-radius: 5px;
                background: #067DE8;
                color: #fff;
                font-size: 26px;
                border: 0;
                font-weight: normal;
            }
		}
	}
</style>
