import axios from "axios";
import { checkParams, generateModuleRequest } from "./utils";

/**生成模块请求方法 */
const { get, request } = generateModuleRequest("");

//导出excel
// export const downloadExcel = (params,success,failure,error) => {
// 	return importExcel(params,success,failure,error);
// };
// console.log()
// debugger
export const downloadExcel = (params, success, failure, error) => {
	//success('//alpha.wq.ininin.com/order/requirement_order/1002/download_quotation2order', params)
	//success(http.defaults.baseURL + params.downloadUrl, params)
	//params.url = '//alpha.wq.ininin.com/order/requirement_order/1002/download_quotation2order'
	// 发送post请求
	request({
		method: params.method || "post",
		url: params.url, // 请求地址
		data: params.params, // 参数
		responseType: "blob" // 表明返回服务器返回的数据类型
	})
		.then(res => {
			// 处理返回的文件流
			let data = res.data || {};

			/*data.body.list.forEach((item) => {
            if (item.callType == 1) {
                item.callType = '数据中心'
            } else if (item.callType == 2) {
                item.callType = '微信服务'
            } else {
                item.callType = 'OCR服务'
            }
            if (item.isSuccess) {
                item.isSuccess = '成功'
            } else {
                item.isSuccess = '失败'
            }
        })*/
			if (data) {
				let blob = data;
				//let blob = new Blob([data])
				//let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
				//将 Blob对象 读成字符串
				let reader = new FileReader();
				reader.onload = function() {
					let json = {};
					try {
						json = JSON.parse(reader.result);
					} catch (ex) {
						console.log("Blob");
					}
					if (json && json.resultCode != null) {
						failure(json, params);
					} else {
						let fileName = [params.fileName, "xlsx"].join(".");
						let aLink = document.createElement("a");
						if (window.navigator && window.navigator.msSaveOrOpenBlob) {
							// IE10+下载
							window.navigator.msSaveBlob(blob, fileName);
						} else if (
							"download" in aLink &&
							window.URL &&
							window.URL.createObjectURL
						) {
							// 非IE下载
							aLink.download = fileName;
							aLink.style.display = "none";
							aLink.href = window.URL.createObjectURL(blob);
							document.body.appendChild(aLink);
							aLink.click();
							window.URL.revokeObjectURL(aLink.href); // 释放URL 对象
							document.body.removeChild(aLink);
						} else {
							window.alert("该浏览器不支持导出功能，请更换其他浏览器！");
						}
						success(data, params);
					}
				};
				reader.readAsText(blob, "utf-8");
			} else {
				failure(data, params);
			}
		})
		.catch(function(res) {
			// error callback
			error({}, params);
			console.log(res.config && res.config.url, res.response || res.message);
		});
};

/**
 * 根据token查询用户信息（用户登录）
 * @method queryUserLoginInfo
 * @param {Object} params 参数
 * @returns {Promise} 返回一个promise
 */
export const queryUserLoginInfo = params => {
	const valid = checkParams(params, {
		token: {
			type: "string",
			required: true
		}
	});
	return !valid.isPassed
		? valid.error
		: get("../organization/user/select/current_user", null, { "X-Auth-Token": params.token });
};

/**
 * 获取七牛Token
 * @method query1
 * @param {Object} params
 * @returns {Promise} 返回一个promise
 */
export const queryUploadToken = params => {
	return get("user/system_config", params);
};

/**
 * 四级联动获取
 * @param {Object} params 参数
 * @param {Function} success 成功
 * @param {Function} failure 失败
 * @param {Function} error 访问异常
 */
// export const queryProvinceCity = (params, success, failure, error) => {
//     // if (Array.isArray(success)) {
//     //     success = failure = error = success[0]
//     // }
//     axios.get('v1/supplier/get_town', params).then(function(res) {
//         // success callback
//         let data = res.data.resultData
//         if (res ed) {
//             success(data)
//         } else {
//             failure(data)
//         }
//     }).catch(function(res) {
//         // error callback
//         error({}, params)
//         console.log(res.config && res.config.url, res.response || res.message)
//     })
// }

export const queryProvinceCity = params => {
	return get("v1/supplier/get_town", params);
};

/**
 * 查询 version.json
 * @param {Object} params 参数
 * @param {Function} success 成功
 * @param {Function} failure 失败
 * @param {Function} error 访问异常
 */
export const getVersionJson = (params, success, failure, error) => {
	if (Array.isArray(success)) {
		success = failure = error = success[0];
	}
	const domain = [window.location.protocol, window.location.host].join("//");
	const version = new Date().getTime();
	params = params || {};
	params.v = version;
	params.frequency = true; //频繁访问类接口
	axios
		.get(`${domain}/static/version.json`, { params })
		.then(function(res) {
			 // success callback
             res.succeed = res.status === 200
             let data = res.data || {}
             if (res.succeed) {
                 success(data, params)
             } else {
                 failure(data, params)
             }
		})
		.catch(function(res) {
			// error callback
			error({}, params);
			console.log(res.config && res.config.url, res.response || res.message);
		});
};
