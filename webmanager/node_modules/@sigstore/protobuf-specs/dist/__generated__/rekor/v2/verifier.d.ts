import { PublicKeyDetails, X509Certificate } from "../../sigstore_common";
/** PublicKey contains an encoded public key */
export interface PublicKey {
    /** DER-encoded public key */
    rawBytes: Buffer;
}
/** Either a public key or a X.509 cerificiate with an embedded public key */
export interface Verifier {
    verifier?: //
    /** DER-encoded public key. Encoding method is specified by the key_details attribute */
    {
        $case: "publicKey";
        publicKey: PublicKey;
    } | //
    /** DER-encoded certificate */
    {
        $case: "x509Certificate";
        x509Certificate: X509Certificate;
    } | undefined;
    /** Key encoding and signature algorithm to use for this key */
    keyDetails: PublicKeyDetails;
}
/** A signature and an associated verifier */
export interface Signature {
    content: Buffer;
    verifier: Verifier | undefined;
}
export declare const PublicKey: MessageFns<PublicKey>;
export declare const Verifier: MessageFns<Verifier>;
export declare const Signature: MessageFns<Signature>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
