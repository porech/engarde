import { Worker, MessagePort } from 'node:worker_threads';
import { EventEmitterAsyncResource } from 'node:events';
import { version } from '../package.json';
import type { Transferable, ResourceLimits, EnvSpecifier } from './types';
import { kQueueOptions, kTransferable, kValue } from './symbols';
import { TaskQueue, ArrayTaskQueue, FixedQueue, PiscinaTask, TransferList, TransferListItem } from './task_queue';
import { PiscinaLoadBalancer } from './worker_pool';
import { AbortSignalAny } from './abort';
import { PiscinaHistogram } from './histogram';
interface Options {
    filename?: string | null;
    name?: string;
    minThreads?: number;
    maxThreads?: number;
    idleTimeout?: number;
    maxQueue?: number | 'auto';
    concurrentTasksPerWorker?: number;
    atomics?: 'sync' | 'async' | 'disabled';
    resourceLimits?: ResourceLimits;
    argv?: string[];
    execArgv?: string[];
    env?: EnvSpecifier;
    workerData?: any;
    taskQueue?: TaskQueue;
    niceIncrement?: number;
    trackUnmanagedFds?: boolean;
    closeTimeout?: number;
    recordTiming?: boolean;
    loadBalancer?: PiscinaLoadBalancer;
    workerHistogram?: boolean;
}
interface FilledOptions extends Options {
    filename: string | null;
    name: string;
    minThreads: number;
    maxThreads: number;
    idleTimeout: number;
    maxQueue: number;
    concurrentTasksPerWorker: number;
    atomics: Options['atomics'];
    taskQueue: TaskQueue;
    niceIncrement: number;
    closeTimeout: number;
    recordTiming: boolean;
    workerHistogram: boolean;
}
interface RunOptions {
    transferList?: TransferList;
    filename?: string | null;
    signal?: AbortSignalAny | null;
    name?: string | null;
}
interface CloseOptions {
    force?: boolean;
}
export default class Piscina<T = any, R = any> extends EventEmitterAsyncResource {
    #private;
    constructor(options?: Options);
    run(task: T, options?: RunOptions): Promise<R>;
    close(options?: CloseOptions): Promise<void>;
    destroy(): Promise<void>;
    [Symbol.dispose](): void;
    [Symbol.asyncDispose](): Promise<void>;
    get maxThreads(): number;
    get minThreads(): number;
    get options(): FilledOptions;
    get threads(): Worker[];
    get queueSize(): number;
    get completed(): number;
    get histogram(): PiscinaHistogram;
    get utilization(): number;
    get duration(): number;
    get needsDrain(): boolean;
    static get isWorkerThread(): boolean;
    static get workerData(): any;
    static get version(): string;
    static get Piscina(): typeof Piscina;
    static get FixedQueue(): typeof FixedQueue;
    static get ArrayTaskQueue(): typeof ArrayTaskQueue;
    static move(val: Transferable | TransferListItem | ArrayBufferView | ArrayBuffer | MessagePort): ArrayBuffer | ArrayBufferView<ArrayBufferLike> | MessagePort | Transferable;
    static get transferableSymbol(): symbol;
    static get valueSymbol(): symbol;
    static get queueOptionsSymbol(): symbol;
}
export declare const move: typeof Piscina.move;
export declare const isWorkerThread: boolean;
export declare const workerData: any;
export { Piscina, PiscinaTask, TaskQueue, kTransferable as transferableSymbol, kValue as valueSymbol, kQueueOptions as queueOptionsSymbol, version, FixedQueue };
