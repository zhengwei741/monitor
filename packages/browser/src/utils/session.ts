import { generateUUID, getTimestamp } from "@monitor/utils";
import { _global } from "./global";

const SESSION_KEY = "___SESSION_KEY__";
// session存活时长
const SURVIVIE_MILLI_SECONDS = 1800000;

function getCookieByName(name) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`));
  return result ? result[1] : undefined;
}

export function refreshSession() {
  const id = getCookieByName(SESSION_KEY) || `s_${generateUUID()}`;
  const expires = new Date(Date.now() + SURVIVIE_MILLI_SECONDS);
  document.cookie = `${SESSION_KEY}=${id};path=/;max-age=1800;expires=${expires.toUTCString()}`;
  return id;
}

export function getSessionId() {
  return getCookieByName(SESSION_KEY) || refreshSession();
}

refreshSession();

const USER_KEY = "___USER_KEY__";
export function getUserId() {
  let uid = _global.localStorage.getItem(USER_KEY);
  if (!uid) {
    uid = `u_${generateUUID()}`;
    _global.localStorage.setItem(USER_KEY, uid);
  }
  return uid;
}

export function getBaseInfo() {
  return {
    timestamp: getTimestamp(),
    sessionId: getSessionId(),
    userId: getUserId(),
  };
}
