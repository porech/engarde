/**
 * All input types of builders that perform operations on one or multiple sub-builders.
 */
export type Schema = {
    builders?: Builder[];
    targets?: Target[];
    [property: string]: any;
};
export type Builder = {
    builder: string;
    options?: {
        [key: string]: any;
    };
    [property: string]: any;
};
export type Target = {
    overrides?: {
        [key: string]: any;
    };
    target: string;
    [property: string]: any;
};
