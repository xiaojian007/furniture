/**
 * vue项目配置文件
 * @author lijian
 * @since 2020-02-21
 * @version 1.0.0
 * @description vue项目配置文件
 * @copyright lijian
 */

/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const env = process.env.NODE_ENV;

/** 更新版本号 */
if (env === "production") {
	const now = new Date();
	const Y = now
		.getFullYear()
		.toString()
		.substr(-2);
	const M = now.getMonth() + 1;
	const h = now.getHours();
	const m = now.getMinutes();
	const s = now.getSeconds();
	const currentVersion = [Y, M, [h, m, s].join("")].join(".");
	const setVersion = jsonPath => {
		const filePath = path.join(__dirname, jsonPath);
		let json = fs.readFileSync(filePath);
		json = JSON.parse(json);
		json.version = currentVersion;
		fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
	};
	["./package.json", "./public/static/version.json"].forEach(jsonPath => {
		setVersion(jsonPath);
	});
}

module.exports = {
	publicPath: process.env.VUE_APP_API_MODE === "dev" ? "/txhaian/" : "/txhaian/",
	productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
	chainWebpack: config => {
		config.resolve.alias.set("@", path.resolve(__dirname, "src"));
		config.resolve.alias.set("@config", path.resolve(__dirname, "src/config"));
		config.resolve.alias.set("@api", path.resolve(__dirname, "src/api"));
		config.resolve.alias.set("@assets", path.resolve(__dirname, "src/assets"));
		config.resolve.alias.set("@common", path.resolve(__dirname, "src/common"));
		config.resolve.alias.set("@com", path.resolve(__dirname, "src/components"));
		config.resolve.alias.set("@filters", path.resolve(__dirname, "src/filters"));
        config.resolve.alias.set("@layouts", path.resolve(__dirname, "src/layouts"));
		config.resolve.alias.set("@mixins", path.resolve(__dirname, "src/mixins"));
		config.resolve.alias.set("@router", path.resolve(__dirname, "src/router"));
		config.resolve.alias.set("@views", path.resolve(__dirname, "src/views"));
		config.resolve.alias.set("@utils", path.resolve(__dirname, "src/utils"));
		config.resolve.alias.set("@store", path.resolve(__dirname, "src/store"));
		config.resolve.alias.set("@store-m", path.resolve(__dirname, "src/store/modules"));
		config.resolve.alias.set("@plugins", path.resolve(__dirname, "src/plugins"));

		/**** svg图标处理 添加压缩loader "image-webpack-loader" */
		// 修改svg-loader 不包含icons列表
		config.module
			.rule("svg")
			.exclude.add(path.resolve(__dirname, "src/assets/img/icons"))
			.end()
			.use("image-webpack")
			.loader("image-webpack-loader")
			.tap((options = {}) =>
				Object.assign(options, {
					disable: false
				})
			)
			.end();
		// 添加 svg-sprite-loader
		config.module
			.rule("svg-sprite")
			.test(/\.(svg)(\?.*)?$/)
			.include.add(path.resolve(__dirname, "src/assets/img/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.tap((options = {}) =>
				Object.assign(options, {
					symbolId: "[name]"
				})
			)
			.end()
			.use("image-webpack")
			.loader("image-webpack-loader")
			.tap((options = {}) =>
				Object.assign(options, {
					disable: false
				})
			)
			.end();
    },
	devServer: {
		port: 8888 // 端口
	}
};
