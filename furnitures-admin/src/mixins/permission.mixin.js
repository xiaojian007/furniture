/**
 * 权限通用方法mixins
 * @author shlijian@ininin.com
 * @since 2020-03-03
 * @version 1.0.0
 * @description 权限通用方法mixins
 * @copyright ininin.com
 */

import { mapState } from "vuex";

import { hasPermission } from "@utils/permission";
export default {
	computed: {
		...mapState("auth", ["btnPermissions", "menuPermissions"])
	},
	methods: {
		btnHasAuth(permission) {
			return hasPermission(permission, this.btnPermissions);
		},
		menuHasAuth(permission) {
			return hasPermission(permission, this.menuPermissions);
		}
	}
};
