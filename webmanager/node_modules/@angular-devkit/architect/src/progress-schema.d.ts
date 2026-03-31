export type Schema = {
    builder: {
        [key: string]: any;
    };
    current?: number;
    error?: any;
    id: number;
    state: State;
    status?: string;
    target?: {
        [key: string]: any;
    };
    total?: number;
    [property: string]: any;
};
export declare enum State {
    Error = "error",
    Running = "running",
    Stopped = "stopped",
    Waiting = "waiting"
}
