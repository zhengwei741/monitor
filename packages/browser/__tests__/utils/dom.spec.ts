import { proxyDomClick } from "../../src/utils/dom";

describe("dom.ts", () => {
  it("触发代理事件", () => {
    const handler = jest.fn();

    proxyDomClick(handler);

    const event = new Event("click");
    global.dispatchEvent(event);

    expect(handler).toHaveBeenCalled();
  });
});
