import { createFetchSender, createXHRSender } from "../../src/core/sender";

global.fetch = jest.fn().mockImplementationOnce(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        code: 0,
        data: {
          testData: "testData",
        },
      }),
  })
);

const xhrMockClass = () => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  addEventListener: jest.fn((eventName, fn) => {
    if (eventName === "readystatechange") {
      fn();
    }
  }),
  readyState: 4,
  response: {
    httpTestData: "httpTestData",
  },
});

// @ts-ignore
global.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

describe("sender.ts", () => {
  let beforSend = false;

  it("createFetchSender", async () => {
    const options = {
      buffSize: 10,
      url: "127.0.0.1:8080",
      onBeforSend(data) {
        beforSend = true;
        return data || {};
      },
    };

    const sender = createFetchSender(options);

    const res = await sender.send();

    const { data } = await res.json();

    expect(beforSend).toBeTruthy();

    expect(data.testData).toEqual("testData");
  });

  it("createXHRSender", async () => {
    const options = {
      buffSize: 10,
      url: "127.0.0.1:8080",
      onBeforSend(data) {
        beforSend = true;
        return data || {};
      },
    };

    const sender = createXHRSender(options);

    const response = await sender.send();

    expect(beforSend).toBeTruthy();

    expect(response.httpTestData).toEqual("httpTestData");
  });
});
