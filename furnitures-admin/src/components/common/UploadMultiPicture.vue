<template>
	<!--accept="image/*"-->
	<el-upload
		ref="upload"
		class="card-uploader"
		:class="{ hide: hideUpload }"
		:accept="accept"
		:action="QINIU_UP"
		list-type="picture-card"
		:disabled="disabled"
		name="file"
		:data="{ token: '', key: '' }"
		:multiple="multiple"
		:file-list="list"
		:auto-upload="false"
		:on-change="uploadChange"
		:on-error="uploadError"
		:on-success="uploadSuccess"
		:before-upload="beforeUpload"
		:on-preview="picturePreview"
		:on-remove="remove"
	>
		<!--        <i class="el-icon-upload"><span class="upload-text">请上传图片</span></i>-->
		<i class="el-icon-plus"></i>
	</el-upload>
</template>
<script>
	import { queryUploadToken } from "@api/common";

	export default {
		// 声明 props
		props: {
			accept: {
				type: String,
				default: "image/jpeg,image/png,image/bmp,image/gif"
			},
			multiple: {
				type: Boolean,
				default: false
			},
			maxCount: {
				type: Number,
				default: 20
			},
			thumbnailSize: {
				type: String,
				default: "100x100"
			},
			disabled: {
				type: Boolean,
				default: false
			},
			hideUpload: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				data: null,
				list: [],
				picThumbnail: `?imageMogr2/thumbnail/!${this.thumbnailSize}r/auto-orient/gravity/Center/crop/${this.thumbnailSize}`
			};
		},
		watch: {
			data: function() {
				let that = this;
				let data = that.data || [];
				that.list = [];
				if (Array.isArray(data)) {
					data.forEach(function(key) {
						if (key) {
							that.list.push({
								name: "",
								url: that.getPicBaseUrl(key, true) + that.picThumbnail
							});
						}
					});
				}
				that.$emit("change", that.getKeys(), that.getKeys(true), that.list);
			}
		},
		methods: {
			getKeys(hasDomain) {
				let that = this;
				let parts = [];
				if (hasDomain) {
					that.list.forEach(function(item) {
						parts.push(item.url.replace(/\?.*$/, ""));
					});
				} else {
					that.list.forEach(function(item) {
						parts.push(that.getPicBaseUrl(item.url, false));
					});
				}
				return parts;
			},
			setFormData(data, file) {
				if (data && data.qiniuUpToken) {
					this.$refs.upload.data.token = data.qiniuUpToken;
					let upKey = this.md5([new Date().getTime(), Math.random()].join(""));
					this.$refs.upload.data.key = upKey;
					if (file) {
						file.UP_KEY = upKey;
					}
				}
			},
			uploadChange(file, fileList) {
				let bool = fileList.find(o => {
					return o.raw && o.uid === file.uid;
				});
				if (bool && !file.UP_KEY) {
					this.getUploadToken(file);
				}
			},
			uploadError() {
				this.$emit("uploadError", this);
				this.$message.error("上传出错，请重新上传！");
			},
			uploadSuccess(res, file, fileList) {
				console.log(fileList);
				let that = this;
				if (res) {
					// that.list.push({
					//     name: file.name || '',
					//     url: that.getPicBaseUrl(res.key, true) + that.picThumbnail
					// })
					file.base = file.raw;
					file.url = that.getPicBaseUrl(res.key, true) + that.picThumbnail;
					/*  因为绑定了file-lis 所以 fileList被修改为this.list
                    如果不把fileList赋值回去, 多图上传的第二次成功回调不会进来 */
					that.list = fileList;
					that.$emit("change", that.getKeys(), that.getKeys(true), that.list);
					that.$emit("uploadSuccess", that);
				}
			},
			beforeUpload(file) {
				this.$emit("uploadStart", this);
				let isImg = /^image\/\w+$/i.test(file.type);
				let isLt2M = file.size / 1024 / 1024 < 2;

				if (!isImg) {
					this.$message.error("只能上传 JPG、PNG、GIF 格式！");
					return false;
				}
				if (!isLt2M) {
					this.$message.error("上传头像图片大小不能超过 2MB!");
					return false;
				}
				console.log("beforeUpload", this.maxCount, this.list.length);
				if (this.maxCount > 0 && this.list.length >= this.maxCount) {
					this.$message.error("最多可上传 " + this.maxCount + " 张图片！");
					console.log("beforeUpload", this.maxCount, this.list.length);
					return false;
				}
				return isImg && isLt2M;
			},
			picturePreview(file) {
				this.$emit("imagePreview", file.url, this.list);
			},
			remove(file, fileList) {
				let that = this;
				console.log(file, fileList);
				that.list.forEach(function(item, index) {
					if (item.url === file.url) {
						that.list.splice(index, 1);
					}
				});
				fileList.forEach(function(item, index) {
					if (item.url === file.url) {
						fileList.splice(index, 1);
					}
				});
				that.$emit("change", that.getKeys(), that.getKeys(true), that.list);
			},
			getUploadToken(file) {
				let that = this;
				queryUploadToken(
					that.params,
					data => {
						that.setFormData(data, file);
						setTimeout(function() {
							that.$refs.upload.submit();
						}, 100);
					},
					data => {
						that.$alert(data.resultMsg, "温馨提示", {
							confirmButtonText: "知道了"
						});
					},
					data => {
						that.$alert(data.resultMsg || "网络繁忙，111请稍后再试！", "温馨提示", {
							confirmButtonText: "知道了"
						});
					}
				);
			}
		}
	};
</script>
<style lang="less" scoped>
	.hide .el-upload--picture-card {
		display: none;
	}
	.card-uploader {
		margin-right: -10px;
		/*height:90px;*/
		/deep/ .el-upload {
			/*width: 180px;*/
			/*height: 110px;*/
			/*line-height: 110px;*/
			width: 90px;
			height: 90px;
			background: rgba(191, 191, 191, 0.1);
			border: 1px dashed rgba(191, 191, 191, 1);
			border-radius: 3px;
			.el-icon-plus {
				height: 100%;
				display: flex;
				align-items: center;
				margin-left: 30px;

				.upload-text {
					margin-left: 6px;
					font-size: 14px;
					text-align: center;
				}
			}
		}

		/deep/ .el-upload-list {
			.el-upload-list__item {
				width: 90px;
				height: 90px;
			}

			.el-icon-close {
				display: none !important;
			}

			.el-icon-close-tip {
				display: none !important;
			}
		}

		/deep/ .el-upload-list__item-actions {
			.el-upload-list__item-delete {
				position: absolute;
				top: auto;
				bottom: 0;
				right: 5px;
				font-size: 12px;
				line-height: 24px;
			}
		}
		/deep/ .el-upload-list__item-status-label {
			display: none;
		}
	}
</style>
