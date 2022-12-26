import CryptoJS from "crypto-js";

export interface CrypotoType {
  encrypt: (word: string) => string;
  decrypt: (word: string) => string;
}

const key = CryptoJS.enc.Utf8.parse("123456789asdfghj"); // 十六位十六进制数作为密钥

/* 加密 */
export function encrypt(word: string) {
  return CryptoJS.AES.encrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

/* 解密 */
export function decrypt(word: string) {
  return CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}
