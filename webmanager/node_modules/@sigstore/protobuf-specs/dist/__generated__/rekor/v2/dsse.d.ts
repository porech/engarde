import { Envelope } from "../../envelope";
import { HashOutput } from "../../sigstore_common";
import { Signature, Verifier } from "./verifier";
/** A request to add a DSSE v0.0.2 entry to the log */
export interface DSSERequestV002 {
    /** A DSSE envelope */
    envelope: Envelope | undefined;
    /** All necessary verification material to verify all signatures embedded in the envelope */
    verifiers: Verifier[];
}
export interface DSSELogEntryV002 {
    /** The hash of the DSSE payload */
    payloadHash: HashOutput | undefined;
    /** Signatures and their associated verification material used to verify the payload */
    signatures: Signature[];
}
export declare const DSSERequestV002: MessageFns<DSSERequestV002>;
export declare const DSSELogEntryV002: MessageFns<DSSELogEntryV002>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
