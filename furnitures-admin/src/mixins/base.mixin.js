/**
 * 页面通用方法mixins
 * @author lijian
 * @since 2020-02-14
 * @version 1.0.0
 * @description 页面通用方法mixins
 */

export default {
	computed: {
		// 是否保持缓存
		isKeepAlive() {
			console.log("base.mixin:isKeepAlive=>", this.$route.meta.keepAlive);
			return this.$route.meta.keepAlive;
		}
	},
	methods: {
		/**
		 * 初始化 需重写
		 * @method query
		 */
		init() {},
		/**
		 * 查询方法 需重写
		 * @method query
		 */
		query() {}
	}
};
