import { ExceptionMetrics } from '../types';
export declare const init: (config: any) => void;
export declare function parseStackLine(line: string): {
    filename?: undefined;
    functionName?: undefined;
    lineno?: undefined;
    colno?: undefined;
} | {
    filename: string;
    functionName: string;
    lineno: number | undefined;
    colno: number | undefined;
};
export declare function parseStackFrames(stack: string): ({
    filename?: undefined;
    functionName?: undefined;
    lineno?: undefined;
    colno?: undefined;
} | {
    filename: string;
    functionName: string;
    lineno: number | undefined;
    colno: number | undefined;
})[];
export declare const reportErrorHandle: (errorMechanism: ExceptionMetrics) => void;
