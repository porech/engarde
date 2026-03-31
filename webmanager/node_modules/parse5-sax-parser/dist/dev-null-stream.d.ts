import { Writable } from 'node:stream';
export declare class DevNullStream extends Writable {
    _write(_chunk: string, _encoding: string, cb: () => void): void;
}
