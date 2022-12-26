import { Metrics } from "./metrics";

export interface Sender {
  send: (metrics: Metrics) => void;
  // flush: () => void;
}

export type CreaterSender = (options: CreaterSenderOptions) => Sender;

export interface RequestData {
  method?: string;
  data?: Metrics[];
  headers?: { [key: string]: string };
}

export interface CreaterSenderOptions {
  url: string;
  buffSize?: number;
  onBeforSend?: (metrics: Metrics[]) => Metrics[];
  headers?: { [key: string]: string };
}
