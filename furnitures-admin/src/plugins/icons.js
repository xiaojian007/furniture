/**
 * 引入图标组件
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 引入图标组件
 * @copyright lijian
 */

/* eslint-disable no-undef */
import Vue from "vue";
import IconSvg from "@com/IconSvg"; // svg component

// register globally
Vue.component("icon-svg", IconSvg);

const req = require.context("@assets/img/icons", false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
