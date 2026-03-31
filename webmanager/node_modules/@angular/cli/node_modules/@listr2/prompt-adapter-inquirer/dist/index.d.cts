import { Prompt } from "@inquirer/type";
import { ListrPromptAdapter } from "listr2";

//#region src/prompt.d.ts
declare class ListrInquirerPromptAdapter extends ListrPromptAdapter {
  private prompt;
  private signal;
  /**
   * Get the current running instance of `inquirer`.
   */
  get instance(): Promise<any>;
  /**
   * Create a new prompt with `inquirer`.
   */
  run<T extends Prompt<any, any> = Prompt<any, any>>(prompt: T, ...[config, context]: Parameters<T>): Promise<ReturnType<T>>;
  /**
   * Cancel the ongoing prompt.
   */
  cancel(): void;
}
//#endregion
export { ListrInquirerPromptAdapter };