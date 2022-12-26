import { proxyHistory, proxyHash } from "../../src/utils/history";

describe("history.ts", () => {
  it("正常代理事件", () => {
    const handler = jest.fn();

    proxyHistory(handler);
    proxyHash(handler);

    const pushStateEvent = new Event("pushState");
    global.dispatchEvent(pushStateEvent);

    expect(handler).toHaveBeenCalled();

    const replaceStateEvent = new Event("replaceState");
    global.dispatchEvent(replaceStateEvent);
    expect(handler.mock.calls.length).toEqual(2);

    const popstateEvent = new Event("popstate");
    global.dispatchEvent(popstateEvent);

    expect(handler.mock.calls.length).toEqual(3);
  });
});
