import { BrowserSDK } from "../../src/core/sdk";
import Pkg from "../../package.json";

describe("sdk.ts", () => {
  it("正常创建sdk", async () => {
    const url = "127.0.0.1";
    const appId = "appId";
    const beforeSend = jest.fn().mockResolvedValue({
      name: "李四",
    });
    const options = {
      appId,
      url,
      behavior: true,
      plugins: [
        {
          name: "test_plugin",
          method() {
            console.log("test");
          },
        },
      ],
      beforeSend,
    };
    const SDK = new BrowserSDK(options);

    // @ts-ignore
    expect(SDK.url).toEqual(url);
    // @ts-ignore
    expect(SDK.appId).toEqual(appId);
    // @ts-ignore
    expect(SDK.plugins["test_plugin"]).not.toBeNull();
    // @ts-ignore
    expect(SDK.options).toEqual(options);
    // @ts-ignore
    expect(SDK.sdkInfo.name).toEqual(Pkg.name);
    // @ts-ignore
    expect(SDK.sdkInfo.version).toEqual(Pkg.version);
    // @ts-ignore
    expect(SDK.sender).not.toBeNull();

    SDK.capture({ type: "behavior", subtype: "click-behavior-record" });

    await global.sleep(4000);

    expect(beforeSend).toHaveBeenCalled();
  });
});
