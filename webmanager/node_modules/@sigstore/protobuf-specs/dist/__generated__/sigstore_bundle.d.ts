import { Envelope } from "./envelope";
import { MessageSignature, PublicKeyIdentifier, RFC3161SignedTimestamp, X509Certificate, X509CertificateChain } from "./sigstore_common";
import { TransparencyLogEntry } from "./sigstore_rekor";
/**
 * Various timestamped counter signatures over the artifacts signature.
 * Currently only RFC3161 signatures are provided. More formats may be added
 * in the future.
 */
export interface TimestampVerificationData {
    /**
     * A list of RFC3161 signed timestamps provided by the user.
     * This can be used when the entry has not been stored on a
     * transparency log, or in conjunction for a stronger trust model.
     * Clients MUST verify the hashed message in the message imprint
     * against the signature in the bundle.
     */
    rfc3161Timestamps: RFC3161SignedTimestamp[];
}
/**
 * VerificationMaterial captures details on the materials used to verify
 * signatures. This message may be embedded in a DSSE envelope as a signature
 * extension. Specifically, the `ext` field of the extension will expect this
 * message when the signature extension is for Sigstore. This is identified by
 * the `kind` field in the extension, which must be set to
 * application/vnd.dev.sigstore.verificationmaterial;version=0.1 for Sigstore.
 * When used as a DSSE extension, if the `public_key` field is used to indicate
 * the key identifier, it MUST match the `keyid` field of the signature the
 * extension is attached to.
 */
export interface VerificationMaterial {
    /**
     * The key material for verification purposes.
     *
     * This allows key material to be conveyed in one of three forms:
     *
     * 1. An unspecified public key identifier, for retrieving a key
     *    from an out-of-band mechanism (such as a keyring);
     *
     * 2. A sequence of one or more X.509 certificates, of which the first member
     *    MUST be a leaf certificate conveying the signing key. Subsequent members
     *    SHOULD be in issuing order, meaning that `n + 1` should be an issuer for `n`.
     *
     *    Signers MUST NOT include root CA certificates in bundles, and SHOULD NOT
     *    include intermediate CA certificates that appear in an independent root of trust
     *    (such as the Public Good Instance's trusted root).
     *
     *    Verifiers MUST validate the chain carefully to ensure that it chains up
     *    to a CA certificate that they independently trust. Verifiers SHOULD
     *    handle old or non-complying bundles that have superfluous intermediate and/or
     *    root CA certificates by either ignoring them or explicitly considering them
     *    untrusted for the purposes of chain building.
     *
     * 3. A single X.509 certificate, which MUST be a leaf certificate conveying
     *    the signing key.
     *
     * When used with the Public Good Instance (PGI) of Sigstore for "keyless" signing
     * via Fulcio, form (1) MUST NOT be used, regardless of bundle version. Form (1)
     * MAY be used with the PGI for self-managed keys.
     *
     * When used in a `0.1` or `0.2` bundle with the PGI and "keyless" signing,
     * form (2) MUST be used.
     *
     * When used in a `0.3` bundle with the PGI and "keyless" signing,
     * form (3) MUST be used.
     */
    content?: {
        $case: "publicKey";
        publicKey: PublicKeyIdentifier;
    } | {
        $case: "x509CertificateChain";
        x509CertificateChain: X509CertificateChain;
    } | {
        $case: "certificate";
        certificate: X509Certificate;
    } | undefined;
    /**
     * An inclusion proof and an optional signed timestamp from the log.
     * Client verification libraries MAY provide an option to support v0.1
     * bundles for backwards compatibility, which may contain an inclusion
     * promise and not an inclusion proof. In this case, the client MUST
     * validate the promise.
     * Verifiers SHOULD NOT allow v0.1 bundles if they're used in an
     * ecosystem which never produced them.
     */
    tlogEntries: TransparencyLogEntry[];
    /**
     * Timestamp may also come from
     * tlog_entries.inclusion_promise.signed_entry_timestamp.
     */
    timestampVerificationData: TimestampVerificationData | undefined;
}
export interface Bundle {
    /**
     * MUST be application/vnd.dev.sigstore.bundle.v0.3+json when
     * when encoded as JSON.
     * Clients must to be able to accept media type using the previously
     * defined formats:
     * * application/vnd.dev.sigstore.bundle+json;version=0.1
     * * application/vnd.dev.sigstore.bundle+json;version=0.2
     * * application/vnd.dev.sigstore.bundle+json;version=0.3
     */
    mediaType: string;
    /**
     * When a signer is identified by a X.509 certificate, a verifier MUST
     * verify that the signature was computed at the time the certificate
     * was valid as described in the Sigstore client spec: "Verification
     * using a Bundle".
     * <https://docs.google.com/document/d/1kbhK2qyPPk8SLavHzYSDM8-Ueul9_oxIMVFuWMWKz0E/edit#heading=h.x8bduppe89ln>
     * If the verification material contains a public key identifier
     * (key hint) and the `content` is a DSSE envelope, the key hints
     * MUST be exactly the same in the verification material and in the
     * DSSE envelope.
     */
    verificationMaterial: VerificationMaterial | undefined;
    content?: {
        $case: "messageSignature";
        messageSignature: MessageSignature;
    } | //
    /**
     * A DSSE envelope can contain arbitrary payloads.
     * Verifiers must verify that the payload type is a
     * supported and expected type. This is part of the DSSE
     * protocol which is defined here:
     * <https://github.com/secure-systems-lab/dsse/blob/master/protocol.md>
     * DSSE envelopes in a bundle MUST have exactly one signature.
     * This is a limitation from the DSSE spec, as it can contain
     * multiple signatures. There are two primary reasons:
     * 1. It simplifies the verification logic and policy
     * 2. The bundle (currently) can only contain a single
     *    instance of the required verification materials
     * During verification a client MUST reject an envelope if
     * the number of signatures is not equal to one.
     */
    {
        $case: "dsseEnvelope";
        dsseEnvelope: Envelope;
    } | undefined;
}
export declare const TimestampVerificationData: MessageFns<TimestampVerificationData>;
export declare const VerificationMaterial: MessageFns<VerificationMaterial>;
export declare const Bundle: MessageFns<Bundle>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
