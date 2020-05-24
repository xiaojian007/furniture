/**
 * 路由菜单定义
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description 路由菜单定义
 * @copyright lijian
 */
/* eslint-disable no-shadow */
import { SET_SUB_MENU } from "./mutation-types";
import permission from "@config/config.permission";
import logisticsDistribution from "./logistics-distribution"; // 首页
import order from "./order"; // 订单
import user from "./user"; // 用户
import information from "./information"; // 咨讯
import commodity from "./commodity"; // 商品
import reservation from "./information"; // 预约
import commission from "./commission"; // 佣金
import marketing from "./marketing"; // 营销
const state = {
	items: [
		{
            path: "/",
            meta: {
                label: '首页',
                auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Empty.vue"),
			children: logisticsDistribution
		},
		{
            path: "/marketing",
            meta: {
                label: '营销',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: marketing
        },
		{
            path: "/commodity",
            meta: {
                label: '商品管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: commodity
        },
		{
            path: "/order",
            meta: {
                label: '订单管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: order
        },
        {
            path: "/reservation",
            meta: {
                label: '预约管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: reservation
        },
        {
            path: "/commission",
            meta: {
                label: '佣金管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: commission
        },
        {
            path: "/information",
            meta: {
                label: '咨讯管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: information
        },
		{
            path: "/user",
            meta: {
                label: '系统管理',
				auth: [permission.VALUE_CHAIN_LOOK]
            },
			component: () => import("@layouts/Home.vue"),
			children: user
		},
		{
			path: "/login",
			hide: true,
			name: "login",
			meta: {
                title: "登录",
                label: '用户'
			},
			component: () => import(/* webpackChunkName: "login" */ "@views/Login.vue")
		},
		{
			path: "*",
			hide: true,
			meta: {
                title: "页面不存在",
                label: '用户'
			},
            component: () => import("@layouts/HomeLayout.vue"),
            children: [
                {
                    path: "info-list",
                    name: "info-list",
                    component: () => import(/* webpackChunkName: "not-found" */ "@views/NotFound.vue"),
                    meta: {
                        label: "404",
                        icon: "role",
                        auth: [permission.VALUE_CHAIN_LOOK]
                    }
                }
            ]
		},
		{
			path: "/not-permission",
			hide: true,
			meta: {
                title: "没权限访问",
                label: '用户'
			},
			component: () => import(/* webpackChunkName: "not-permission" */ "@views/NotFound.vue")
		}
    ],
    subMenu: []
};

const getters = {
	routes(s) {
		return s.items.slice(0);
	}
};

const mutations = {
    [SET_SUB_MENU](state, path) {
        // 筛选当前菜单
        let menu = state.items.filter(o => {
            return o.path === path
        })[0] || {}
        state.subMenu = menu.children || []
    }
}

export default {
	namespaced: true,
	state,
    getters,
    mutations
};
