export type Schema = {
    /**
     * Link to schema.
     */
    $schema?: string;
    builders: {
        [key: string]: BuilderValue;
    };
    [property: string]: any;
};
export type BuilderValue = Builder | string;
/**
 * Target options for Builders.
 */
export type Builder = {
    /**
     * The builder class module.
     */
    class?: string;
    /**
     * Builder description.
     */
    description: string;
    /**
     * The next generation builder module.
     */
    implementation?: string;
    /**
     * Schema for builder option validation.
     */
    schema: string;
    [property: string]: any;
};
