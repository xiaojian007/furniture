<template>
	<div :class="{ fullscreen: fullscreen }" class="tinymce-container editor-container">
		<textarea :id="tinymceId" class="tinymce-textarea" style="width:auto;" />
	</div>
</template>

<script>
	import plugins from "./plugins";
	import toolbar from "./toolbar";
	import fontFormats from "./fontFormats";
	import axios from "axios";
	// upload image plugins
	import tinymceImagePlugin from "./image";

	const filterWord = html => {
		html = html.replace(/<\/?SPANYES[^>]*>/gi, "");
		html = html.replace(/<\\?\?xml[^>]*>/gi, "");
		return html;
	};
	let tinymce = window.tinymce || {};
	export default {
		name: "Tinymce",
		props: {
			id: {
				type: String,
				default: function() {
					return "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "");
				}
			},
			value: {
				type: String,
				default: ""
			},
			toolbar: {
				type: Array,
				required: false,
				default() {
					return [];
				}
			},
			menubar: {
				type: String,
				default: "file edit insert view format table"
			},
			height: {
				type: Number,
				required: false,
				default: 300
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				hasChange: false,
				hasInit: false,
				tinymceId: this.id,
				fullscreen: false
			};
		},
		watch: {
			value(val) {
				// debugger;
				if (!this.hasChange && this.hasInit) {
					this.$nextTick(() =>
						tinymce.get(this.tinymceId).setContent(filterWord(val) || "")
					);
				}
			},
			language() {
				this.destroyTinymce();
				this.$nextTick(() => this.initTinymce());
			},
			disabled() {
				this.destroyTinymce();
				this.$nextTick(() => this.initTinymce());
			}
		},
		created() {
			tinymce = window.tinymce || {};
		},
		mounted() {
			tinymceImagePlugin();
			// this.initTinymce();
		},
		// activated() {
		// 	this.initTinymce();
		// },
		deactivated() {
			this.destroyTinymce();
		},
		destroyed() {
			this.destroyTinymce();
		},
		methods: {
			initTinymce() {
				const _this = this;
				// const tinymce1 = tinymce.get(this.tinymceId);
				// if (tinymce1) {
				// 	tinymce1.destroy();
				// }
				tinymce.init({
					language: "zh_CN",
					language_url: `/static/tinymce4.7.5/langs/zh_CN.js`,
					// theme_url: '/static/tinymce4.7.5/theme/modern/theme.min.js',
					// skin_url: '/static/tinymce4.7.5/skins/skin.min.css',
					// content_css: '/static/tinymce4.7.5/skins/content.min.css',
					selector: `#${this.tinymceId}`,
					height: this.height,
					object_resizing: false,
					plugins,
					readonly: this.disabled,
					toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
					menubar: this.menubar,
					contextmenu: "link inserttable | cell row column deletetable",
					// end_container_on_empty_block: true,
					// powerpaste_word_import: 'clean',
					fontsize_formats: "12px 14px 16px 18px 20px 24px 36px",
					fullpage_default_font_size: "16px",
					font_formats: fontFormats,
					fullpage_default_font_family: "arial, Chinese Quote;",
					branding: false,
					resize: false,
					// images_upload_handler: this.handleImageUpload,
					init_instance_callback: editor => {
						if (_this.value) {
							console.log("init_instance_callback", _this.value);
							editor.setContent(filterWord(_this.value));
						}
						_this.hasInit = true;
						editor.on("NodeChange Change KeyUp SetContent", () => {
							_this.hasChange = true;
							_this.$emit("input", filterWord(editor.getContent()));
						});
					},
					setup(editor) {
						editor.on("FullscreenStateChanged", e => {
							_this.fullscreen = e.state;
						});
					},
					imageSelectorCallback: this.imageUploadCallback
				});
			},
			destroyTinymce() {
				const tinymce1 = tinymce.get(this.tinymceId);
				if (this.fullscreen) {
					tinymce1.execCommand("mceFullScreen");
				}
				if (tinymce1) {
					tinymce1.destroy();
				}
			},
			setContent(value) {
				console.log("setContent000000", value);
				tinymce.get(this.tinymceId).setContent(value);
			},
			getContent() {
				return tinymce.get(this.tinymceId).getContent();
			},
			// 实例化
			initFormTinymce() {
				// debugger
				console.log("initFormTinymce");
				this.destroyTinymce();
				this.$nextTick(() => this.initTinymce());
			},
			imageUploadCallback(file, success) {
				const formData = new FormData();
				formData.append("file", file);
				axios
					.post("//47.101.209.229:8080/upload/image", formData)
					.then(response => {
						if (response.data && response.data.code === "200") {
							const hash = response.data.body;
                            const url = hash;
							success(url);
						} else {
							console.log(response.data.message);
							this.message.warning(this, "上传失败");
						}
					})
					.catch(err => {
						console.log(err.resultMsg);
						this.message.warning(this, "上传失败");
					});
			}
		}
	};
</script>

<style scoped lang="less">
	.tiny-container {
		position: relative;
	}

	.tinymce-container {
		position: relative;
	}

	.tinymce-container /deep/ .mce-fullscreen {
		z-index: 10000;
	}

	.tinymce-textarea {
		visibility: hidden;
		z-index: -1;
	}
</style>
