const sleep = function (time = 500) {
  return new Promise((reolve) => {
    setTimeout(() => {
      reolve(true);
    }, time);
  });
};

Object.defineProperty(window, "performance", {
  value: {
    getEntriesByType: jest.fn().mockReturnValue([{ type: "navigation" }]),
    measure: jest.fn(),
  },
});

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
