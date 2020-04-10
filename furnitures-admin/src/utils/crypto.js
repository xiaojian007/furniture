/**
 * 加密类
 * @author shlijian@ininin.com
 * @since 2020-02-21
 * @version 1.0.0
 * @description 加密相关的公共方法
 * @copyright ininin.com
 */

import CryptoJS from "crypto-js";

/**
 * md5加密
 * @method md5
 * @param {String} text 明文
 * @param {Number} reapet 重复几次加密 可选的 默认1
 * @returns {String} 加密文本
 */
export const md5 = (text, reapet = 1) => {
	return Array.from({ length: reapet }).reduce(data => CryptoJS.MD5(data).toString(), text);
};
/**
 * Aes128 加密
 * @constructor
 * @param {密匙} key
 * @param {偏移} iv
 */
export class Aes128 {
	constructor(key, iv) {
		this.key = CryptoJS.enc.Utf8.parse(key);
		this.iv = CryptoJS.enc.Utf8.parse(iv);
	}
	/**
	 * 加密
     * @method encrypt
	 * @param {String} text  明文
	 * @returns {String} 加密文本
	 */
	encrypt(text) {
		const srcs = CryptoJS.enc.Utf8.parse(text);
		const encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
			iv: this.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return CryptoJS.enc.Base64.stringify(
			CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString())
		);
	}
	/**
	 * 解密
     * @method decrypt
	 * @param {String} ciphertext 密文
	 * @returns {String} 解密文本
	 */
	decrypt(ciphertext) {
		const encryptedHexStr = CryptoJS.enc.Hex.parse(
			CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(ciphertext))
		);
		const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
		const decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
			iv: this.iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	}
}

/**
 * base64转码
 * @method enBase64
 * @param {String} text 明文
 * @returns {String} 转码后文本
 */
export const enBase64 = text => {
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};
/**
 * base64解码
 * @method deBase64
 * @param {String} text 明文
 * @returns {String} 解码文本
 */
export const deBase64 = text => {
	return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
};
