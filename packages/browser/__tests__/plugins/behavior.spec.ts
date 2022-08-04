import { ClickPlugin, StayTimePlugin } from "../../src/plugins/behavior";

const addDiv = () => {
  const div = document.createElement("div");
  div.style.width = "100px";
  div.style.height = "100px";
  div.innerText = "xxxx";
  document.body.append(div);
  return div;
};

const sleep = function (time = 500) {
  return new Promise((reolve) => {
    setTimeout(() => {
      reolve(true);
    }, time);
  });
};

describe("error.ts", () => {
  it("behavior_click", async () => {
    let behaviorMetrics: { [key: string]: any } = {};
    const sdk = {
      capture(metrics) {
        behaviorMetrics = metrics;
      },
    };

    const div = addDiv();

    ClickPlugin.method(sdk);

    const click = new MouseEvent("click", { bubbles: true });

    div.dispatchEvent(click);

    expect(behaviorMetrics.type).toBe("behavior");
    expect(behaviorMetrics.subType).toBe("click-behavior-record");

    expect(behaviorMetrics.meta.outerHTML).toBe(
      '<div style="width: 100px; height: 100px;"></div>'
    );
    expect(behaviorMetrics.meta.target).toBe(`DIV`);
  });

  it("behavior_stayTime", async () => {
    let behaviorMetrics: { [key: string]: any } = {};
    const sdk = {
      appKey: "xxx",
      capture(metrics) {
        behaviorMetrics = metrics;
      },
    };

    StayTimePlugin.method(sdk);

    await sleep(500);

    window.location.hash = "xxx";

    await sleep(600);

    window.history.go(-1);

    await sleep(700);

    window.dispatchEvent(new Event("unload"));

    expect(behaviorMetrics.type).toBe("behavior");
    expect(behaviorMetrics.subType).toBe("stay-time");

    expect(behaviorMetrics.meta.routeList).toHaveLength(3);

    expect(behaviorMetrics.meta.routeList[0].dulation).toBeGreaterThan(400);

    expect(behaviorMetrics.meta.routeList[1].dulation).toBeGreaterThan(500);

    expect(behaviorMetrics.meta.routeList[2].dulation).toBeGreaterThan(600);
  });
});
