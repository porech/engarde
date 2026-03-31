import { HashOutput } from "../../sigstore_common";
import { Signature } from "./verifier";
/** A request to add a hashedrekord v0.0.2 to the log */
export interface HashedRekordRequestV002 {
    /** The hashed data */
    digest: Buffer;
    /** A single signature over the hashed data with the verifier needed to validate it */
    signature: Signature | undefined;
}
export interface HashedRekordLogEntryV002 {
    /** The hashed data */
    data: HashOutput | undefined;
    /** A single signature over the hashed data with the verifier needed to validate it */
    signature: Signature | undefined;
}
export declare const HashedRekordRequestV002: MessageFns<HashedRekordRequestV002>;
export declare const HashedRekordLogEntryV002: MessageFns<HashedRekordLogEntryV002>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
