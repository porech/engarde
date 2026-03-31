//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const listr2 = __toESM(require("listr2"));

//#region src/prompt.ts
var ListrInquirerPromptAdapter = class extends listr2.ListrPromptAdapter {
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
		context.output ??= this.wrapper.stdout(listr2.ListrTaskEventType.PROMPT);
		context.signal ??= this.signal.signal;
		this.reportStarted();
		this.task.on(listr2.ListrTaskEventType.STATE, (event) => {
			if (event === listr2.ListrTaskState.SKIPPED && this.prompt) this.cancel();
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
exports.ListrInquirerPromptAdapter = ListrInquirerPromptAdapter;