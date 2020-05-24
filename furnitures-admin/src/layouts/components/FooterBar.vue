<template>
    <footer class="app-foot">
        <!--<a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备13078924号</a> |-->
        Copyright © {{endYear}} 云印技术（深圳）有限公司 lijian 版权所有
        <!--| <a href="#" @click="$refs.agreement.load(true)">用户服务协议</a>-->
        <!--<ComUserAgreement ref="agreement"></ComUserAgreement>-->
    </footer>
</template>
<script>
    export default {
        name: 'footer-bar',
        data() {
            return {
                endYear: ''
            }
        },
        created() {
            this.getEndYear()
        },
        methods: {
            getEndYear() {
                this.endYear = Math.max(new Date().getFullYear(), 2017)
            }
        }
    }
</script>
<style lang="less">
    .app-foot {
        display: block;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
    }
</style>
