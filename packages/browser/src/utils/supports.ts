import { getGlobalObject } from "@monitor/utils";

export function supportsFetch() {
  if (!("fetch" in getGlobalObject())) {
    return false;
  }

  try {
    new Headers();
    new Request("");
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}
