export type Schema = {
    error?: string;
    info?: {
        [key: string]: any;
    };
    success: boolean;
    target?: Target;
    [property: string]: any;
};
export type Target = {
    configuration?: string;
    project?: string;
    target?: string;
    [property: string]: any;
};
