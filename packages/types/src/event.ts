import { SdkInfo } from "./sdkInfo";
import { Breadcrumb } from "./breadcrumb";
import { Metrics } from "./metrics";

export interface Event {
  data?: Metrics;
  sdkInfo?: SdkInfo;
  event_id?: string;
  timestamp?: number;
  breadcrumbs?: Breadcrumb[];
}
