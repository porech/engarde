import { ListrPromptAdapter, ListrTaskEventType, ListrTaskState } from "listr2";

//#region src/prompt.ts
var ListrInquirerPromptAdapter = class extends ListrPromptAdapter {
	prompt;
	signal = new AbortController();
	/**
	* Get the current running instance of `inquirer`.
	*/
	get instance() {
		return this.prompt;
	}
	/**
	* Create a new prompt with `inquirer`.
	*/
	async run(prompt, ...[config, context]) {
		context ??= {};
		context.output ??= this.wrapper.stdout(ListrTaskEventType.PROMPT);
		context.signal ??= this.signal.signal;
		this.reportStarted();
		this.task.on(ListrTaskEventType.STATE, (event) => {
			if (event === ListrTaskState.SKIPPED && this.prompt) this.cancel();
		});
		this.prompt = prompt(config, context);
		let result;
		try {
			result = await this.prompt;
			this.reportCompleted();
		} catch (e) {
			this.reportFailed();
			throw e;
		}
		return result;
	}
	/**
	* Cancel the ongoing prompt.
	*/
	cancel() {
		if (!this.prompt) return;
		this.reportFailed();
		this.signal.abort("Prompt was cancelled");
	}
};

//#endregion
export { ListrInquirerPromptAdapter };