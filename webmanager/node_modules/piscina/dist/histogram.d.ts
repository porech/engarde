import { RecordableHistogram } from 'node:perf_hooks';
export type PiscinaHistogramSummary = {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
};
export type PiscinaHistogram = {
    runTime: PiscinaHistogramSummary;
    waitTime: PiscinaHistogramSummary;
    resetRunTime(): void;
    resetWaitTime(): void;
};
export declare class PiscinaHistogramHandler {
    #private;
    constructor();
    get runTimeSummary(): PiscinaHistogramSummary;
    get waitTimeSummary(): PiscinaHistogramSummary;
    get runTimeCount(): number;
    recordRunTime(value: number): void;
    recordWaitTime(value: number): void;
    resetWaitTime(): void;
    resetRunTime(): void;
    static createHistogramSummary(histogram: RecordableHistogram): PiscinaHistogramSummary;
    static toHistogramIntegerNano(milliseconds: number): number;
}
