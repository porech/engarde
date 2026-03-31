export type Schema = {
    currentDirectory: string;
    id: number;
    info: {
        [key: string]: any;
    };
    options?: {
        [key: string]: any;
    };
    target?: Target;
    workspaceRoot: string;
    [property: string]: any;
};
export type Target = {
    configuration?: string;
    project: string;
    target: string;
    [property: string]: any;
};
