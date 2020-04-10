<template>
    <el-dialog
        top="0"
        :append-to-body="true"
        :visible.sync="visible"
        custom-class="view-picture-dialog"
        :close-on-click-modal="DIALOG_MODAL_CLOSE"
        :close-on-press-escape="DIALOG_ESC_CLOSE">
        <div class="img-box" @click="close">
            <img @click.stop :src="imgUrl.indexOf('data:image')===-1?QINIU_DOWNLOAD+imgUrl+thumbnail:imgUrl">
        </div>
    </el-dialog>
</template>
<script>
    export default {
        // 声明 props
        props: {
            'data': {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                visible: false,
                thumbnail: '?imageMogr2/auto-orient/thumbnail/1920x>',
                imgUrl: ''
            }
        },
        methods: {
            close() {
                this.visible = false
            },
            preview(url) {
                if (url) {
                    this.imgUrl = url.replace(this.QINIU_DOWNLOAD, '').replace(/\?.*$/, '')
                    this.visible = true
                }
            }
        }
    }
</script>
<style lang="less">
    .view-picture-dialog {
        width: 100%;
        margin: 0;
        height: 100%;
        box-shadow: none;
        background: transparent;
        border-radius: 0;
        overflow: hidden;

        .el-dialog__header {
            padding: 0;

            .el-dialog__title {
                display: none;
            }

            .el-dialog__headerbtn {
                position: fixed;
                top: 10px;
                right: 20px;
                width: 40px;
                height: 40px;
                font-size: 30px;
                line-height: 40px;
                border-radius: 20px;
            }
        }

        .el-dialog__body {
            width: 100%;
            height: 100%;
            padding: 0;
            text-align: center;
            overflow-x: hidden;
            overflow-y: auto;

            .img-box {
                width: 100%;
            }

            img {
                max-width: 100%;
            }
        }
    }
</style>
