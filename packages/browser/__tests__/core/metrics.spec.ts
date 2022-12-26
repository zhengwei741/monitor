import { Metrics } from "../../src/core/metrics";
import { BehaviorMetrics } from "../../src/types";

describe("metrics.ts", () => {
  const browserError = new Metrics();

  it("metrics includes", () => {
    const behaviorMetrics: BehaviorMetrics = {
      type: "behavior",
      subtype: "pv",
      meta: {
        pageInfo: 10000,
        originInformation: "",
      },
    };

    let includes = browserError.includes(behaviorMetrics);

    expect(includes).toBeFalsy();
  });
});
