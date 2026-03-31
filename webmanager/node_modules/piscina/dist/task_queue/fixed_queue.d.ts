import type { Task } from './common';
import { TaskQueue } from '.';
declare class FixedCircularBuffer {
    bottom: number;
    top: number;
    list: Array<Task | undefined>;
    next: FixedCircularBuffer | null;
    isEmpty(): boolean;
    isFull(): boolean;
    push(data: Task): void;
    shift(): Task | null;
    remove(task: Task): void;
}
export declare class FixedQueue implements TaskQueue {
    #private;
    head: FixedCircularBuffer;
    tail: FixedCircularBuffer;
    constructor();
    isEmpty(): boolean;
    push(data: Task): void;
    shift(): Task | null;
    remove(task: Task): void;
    get size(): number;
}
export {};
