<template>
	<el-upload
		ref="upload"
		:class="{ 'single-uploader': !styleBox, 'single-uploader-box': styleBox }"
		:accept="accept"
		:action="QINIU_UP"
		name="file"
		:disabled="disabled"
		:data="{ title: '' }"
		:auto-upload="false"
		:show-file-list="false"
		:on-change="uploadChange"
		:on-error="uploadError"
		:on-success="uploadSuccess"
		:before-upload="beforeUpload"
		:on-preview="picturePreview"
	>
		<img v-if="url" :src="url" @click="imagePreview(url)" class="single-img" />
		<i v-if="!disabled" class="el-icon-plus single-uploader-icon"></i>
		<i
			v-if="url && !disabled"
			class="el-icon-circle-close single-uploader-icon"
			@click.stop="clear"
		></i>
	</el-upload>
</template>
<script>
	import { md5 } from "@utils/crypto";

	export default {
		// 声明 props
		props: {
			accept: {
				type: String,
				default: "image/jpeg,image/png,image/bmp,image/gif"
			},
			styleBox: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				data: null,
				url: "",
				thumbnail: "?imageMogr2/thumbnail/!160x100r/auto-orient/gravity/Center/crop/160x100"
			};
		},
		watch: {
			data() {
				let that = this;
                that.url = that.data || "";
				that.$emit("change", that.getKey(), that.getKey(true));
			}
		},
		methods: {
			clear() {
				this.setUrl("");
				this.url = "";
			},
			setUrl(url) {
				let that = this;
				url = url.replace(/\?.*$/, "").replace(/^.+\//, "");
				that.url = url;
				that.$emit("change", that.getKey(), that.getKey(true), "SET_URL");
			},
			getKey(hasDomain) {
				let that = this;
				let key = "";
				if (hasDomain) {
					key = that.url.replace(/\?.*$/, "");
				} else {
					key = that.url.replace(/\?.*$/, "").replace(/^.+\//, "");
				}
				return key;
			},
			setFormData(file) {
				let upKey = md5([new Date().getTime(), Math.random()].join(""));
				this.$refs.upload.data.title = file.name;
				if (file) {
					file.UP_KEY = upKey;
				}
			},
			uploadChange(file, fileList) {
				let that = this;
				let bool = fileList.find(o => {
					return o.raw && o.uid === file.uid;
				});
				if (bool && !file.UP_KEY) {
					this.setFormData(file);

					setTimeout(function() {
						that.$refs.upload.submit();
					}, 100);
				}
			},
			uploadError() {
				this.$message.error("上传出错，请重新上传！");
			},
			uploadSuccess(res) {
				let that = this;
				if (res) {
					that.url = res.body;
					that.$emit("change", that.getKey(), that.getKey(true), "UPLOAD");
				}
			},
			beforeUpload(file) {
				let isImg = /^image\/\w+$/i.test(file.type);
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isImg) {
					this.$message.error("只能上传 JPG、PNG、GIF 格式!");
					return false;
				}
				if (!isLt2M) {
					this.$message.error("上传头像图片大小不能超过 2MB!");
					return false;
				}
				return isImg; //isJPG && isLt2M;
			},
			picturePreview(file) {
				this.$emit("imagePreview", file.url);
			},
			imagePreview(url) {
				this.$emit("imagePreview", url);
			}
		}
	};
</script>
<style lang="less">
	.single-pic {
		.el-form-item__content {
			clear: both;
			margin: 0 0 0 15px !important;
		}
	}

	.single-uploader-box {
		// width: 100%;
		// height: 200px;
		width: 90px;
		height: 90px;
		display: table;
		table-layout: fixed;

		.el-upload {
			width: 100%;
			height: 100%;
			background: rgba(191, 191, 191, 0.1);
			border: 1px dashed rgba(191, 191, 191, 1);
			position: relative;
			overflow: hidden;
			cursor: pointer;
			display: table-cell;
			text-align: center;
			vertical-align: middle;
		}

		.el-upload:hover {
			border-color: #20a0ff;

			.single-img + .single-uploader-icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.25);
				display: block;
			}
		}

		.single-img {
			max-width: 100%;
			max-height: 100px;
			vertical-align: top;
		}

		.single-img + .single-uploader-icon {
			display: none;
		}

		.single-uploader-icon {
			position: absolute;
			top: 0;
			left: 0;
			font-size: 0;
			width: 100%;
			height: 100%;
			line-height: 100px;
			background: url(../../assets/img/plus.png) center no-repeat;

			&.el-icon-circle-close {
				color: #fff;
				left: auto;
				right: 0;
				width: 18px;
				height: 18px;
				font-size: 14px;
				line-height: 18px;
				background: #5b7ff9;
				border-radius: 10px;
			}
		}
	}
</style>
