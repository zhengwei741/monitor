import { proxyFetch, proxyHttpRequest } from "../../src/utils/http";

describe("http.ts", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        clone: () => ({
          status: 200,
          statusText: "",
          text() {
            return Promise.resolve({});
          },
        }),
      })
    );
  });

  it("触发代理事件", async () => {
    const handler = jest.fn();

    proxyFetch(handler);
    proxyHttpRequest(handler);

    await global.fetch("127.0.0.1");

    expect(handler).toHaveBeenCalled();
  });
});
