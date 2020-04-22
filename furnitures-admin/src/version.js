import store from "./store";
import versionJson from "../package.json";
import { getVersionJson } from "@api/common";

export default {
	autoUpdateTimer: null, //自动更新轮询器
	currentVersion: versionJson.version, //当前版本
	/**
	 * 自动更新
	 */
	autoUpdateVersion() {
		if (this.autoUpdateTimer) {
			clearInterval(this.autoUpdateTimer);
		}
		const getVersion = () => {
			getVersionJson(null, [
				data => {
					if (data && data.version) {
						let latestVersion = "";
						console.log("autoUpdateVersion", this.currentVersion, data.version);
						if (this.currentVersion !== data.version) {
							latestVersion = data.version;
						}
						store.dispatch("setLatestVersion", latestVersion);
						window.localStorage.setItem("LATEST_VERSION", JSON.stringify(data));
					}
				}
			]);
		};
		getVersion();
		this.autoUpdateTimer = setInterval(getVersion, 60000);
	}
};
