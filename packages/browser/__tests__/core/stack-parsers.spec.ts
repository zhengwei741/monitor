import { stackParser } from "../../src/core/stack-parsers";

describe("stack-parsers.ts", () => {
  it("stackParser1", () => {
    const stack =
      "TypeError: Object #<Object> has no method 'undef'\n" +
      "    at bar (http://path/to/file.js:13:17)\n" +
      "    at foo (http://path/to/file.js:20:5)\n" +
      "    at http://path/to/file.js:24:4";

    const frame = stackParser(stack);

    expect(frame[0].lineno).toBe(24);
    expect(frame[0].colno).toBe(4);
    expect(frame[0].functionName).toBe("?");

    expect(frame[1].lineno).toBe(20);
    expect(frame[1].colno).toBe(5);
    expect(frame[1].functionName).toBe("foo");

    expect(frame[2].lineno).toBe(13);
    expect(frame[2].colno).toBe(17);
    expect(frame[2].functionName).toBe("bar");
  });

  it("stackParser2", () => {
    const stack =
      "TypeError: Cannot read property 'error' of undefined\n" +
      "   at TESTTESTTEST.tryRender(webpack:///./~/react-transform-catch-errors/lib/index.js?:34:31)\n" +
      "   at TESTTESTTEST.proxiedMethod(webpack:///./~/react-proxy/modules/createPrototypeProxy.js?:44:30)";

    const frame = stackParser(stack);

    expect(frame[0].lineno).toBe(44);
    expect(frame[0].colno).toBe(30);
    expect(frame[0].functionName).toBe("TESTTESTTEST.proxiedMethod");

    expect(frame[1].lineno).toBe(34);
    expect(frame[1].colno).toBe(31);
    expect(frame[1].functionName).toBe("TESTTESTTEST.tryRender");
  });

  it("stackParser3", () => {
    const stack =
      "Error: test\n" +
      "    at Error (native)\n" +
      "    at s (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:29146)\n" +
      "    at Object.d [as add] (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:31:30039)\n" +
      "    at blob:http%3A//localhost%3A8080/d4eefe0f-361a-4682-b217-76587d9f712a:15:10978\n" +
      "    at blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:1:6911\n" +
      "    at n.fire (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:3019)\n" +
      "    at n.handle (blob:http%3A//localhost%3A8080/abfc40e9-4742-44ed-9dcd-af8f99a29379:7:2863)";

    const frame = stackParser(stack);

    expect(frame[0].lineno).toBe(7);
    expect(frame[0].colno).toBe(2863);
    expect(frame[0].functionName).toBe("n.handle");

    expect(frame[1].lineno).toBe(7);
    expect(frame[1].colno).toBe(3019);
    expect(frame[1].functionName).toBe("n.fire");
  });
});
