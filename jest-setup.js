module.exports = async () => {
  // mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    code: 0,
    data: {
      testData: "testData",
    },
  });

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
  // mock XMLHttpRequest
  global.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

  // mock navigator
  global.navigator.sendBeacon = jest.fn().mockResolvedValue({ test: "test" });

  global.sleep = function (time = 500) {
    return new Promise((reolve) => {
      setTimeout(() => {
        reolve(true);
      }, time);
    });
  };
};
