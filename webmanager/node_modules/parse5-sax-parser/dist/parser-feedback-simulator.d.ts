import { Tokenizer, type TokenizerOptions, type TokenHandler, Token } from 'parse5';
/**
 * Simulates adjustments of the Tokenizer which are performed by the standard parser during tree construction.
 */
export declare class ParserFeedbackSimulator implements TokenHandler {
    private handler;
    private namespaceStack;
    inForeignContent: boolean;
    skipNextNewLine: boolean;
    tokenizer: Tokenizer;
    constructor(options: TokenizerOptions, handler: TokenHandler);
    /** @internal */
    onNullCharacter(token: Token.CharacterToken): void;
    /** @internal */
    onWhitespaceCharacter(token: Token.CharacterToken): void;
    /** @internal */
    onCharacter(token: Token.CharacterToken): void;
    /** @internal */
    onComment(token: Token.CommentToken): void;
    /** @internal */
    onDoctype(token: Token.DoctypeToken): void;
    /** @internal */
    onEof(token: Token.EOFToken): void;
    private _enterNamespace;
    private _leaveCurrentNamespace;
    private _ensureTokenizerMode;
    /** @internal */
    onStartTag(token: Token.TagToken): void;
    /** @internal */
    onEndTag(token: Token.TagToken): void;
}
