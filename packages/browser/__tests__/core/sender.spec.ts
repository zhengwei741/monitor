import { createrBrowserSender } from "../../src/core/sender";

describe("sender.ts", () => {
  it("sender创建并正常发送请求", async () => {
    const onBeforSend = jest.fn().mockResolvedValue({
      name: "李四",
    });

    const sender = createrBrowserSender({
      url: "127.0.0.1:8080",
      onBeforSend,
      buffSize: 30,
    });

    sender.send({ name: "张三" });

    // sender 默认3秒后上报
    await global.sleep(4000);

    // onBeforSend 至少执行一次
    expect(onBeforSend).toHaveBeenCalled();
  });

  it("sender 超过并发数量立即发送请求", async () => {
    const onBeforSend = jest.fn().mockResolvedValue({
      name: "李四",
    });
    const sender = createrBrowserSender({
      url: "127.0.0.1:8080",
      buffSize: 2,
      onBeforSend,
    });
    sender.send({ name: "张三" });
    sender.send({ name: "张三" });
    sender.send({ name: "张三" });

    await global.sleep(1000);

    // onBeforSend 至少执行一次
    expect(onBeforSend).toHaveBeenCalled();
  });
});
