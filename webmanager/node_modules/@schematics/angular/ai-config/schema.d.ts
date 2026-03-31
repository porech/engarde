/**
 * Generates AI configuration files for Angular projects. This schematic creates
 * configuration files that help AI tools follow Angular best practices, improving the
 * quality of AI-generated code and suggestions.
 */
export type Schema = {
    /**
     * Specifies which AI tools to generate configuration files for. These file are used to
     * improve the outputs of AI tools by following the best practices.
     */
    tool?: Tool[];
};
export declare enum Tool {
    Claude = "claude",
    Copilot = "copilot",
    Cursor = "cursor",
    Gemini = "gemini",
    Jetbrains = "jetbrains",
    None = "none",
    Windsurf = "windsurf"
}
