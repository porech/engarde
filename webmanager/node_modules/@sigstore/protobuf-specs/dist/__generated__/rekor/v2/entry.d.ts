import { DSSELogEntryV002, DSSERequestV002 } from "./dsse";
import { HashedRekordLogEntryV002, HashedRekordRequestV002 } from "./hashedrekord";
/**
 * Entry is the message that is canonicalized and uploaded to the log.
 * This format is meant to be compliant with Rekor v1 entries in that
 * the `apiVersion` and `kind` can be parsed before parsing the spec.
 * Clients are expected to understand and handle the differences in the
 * contents of `spec` between Rekor v1 (a polymorphic OpenAPI defintion)
 * and Rekor v2 (a typed proto defintion).
 */
export interface Entry {
    kind: string;
    apiVersion: string;
    spec: Spec | undefined;
}
/** Spec contains one of the Rekor entry types. */
export interface Spec {
    spec?: {
        $case: "hashedRekordV002";
        hashedRekordV002: HashedRekordLogEntryV002;
    } | {
        $case: "dsseV002";
        dsseV002: DSSELogEntryV002;
    } | undefined;
}
/** Create a new HashedRekord or DSSE */
export interface CreateEntryRequest {
    spec?: {
        $case: "hashedRekordRequestV002";
        hashedRekordRequestV002: HashedRekordRequestV002;
    } | {
        $case: "dsseRequestV002";
        dsseRequestV002: DSSERequestV002;
    } | undefined;
}
export declare const Entry: MessageFns<Entry>;
export declare const Spec: MessageFns<Spec>;
export declare const CreateEntryRequest: MessageFns<CreateEntryRequest>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
