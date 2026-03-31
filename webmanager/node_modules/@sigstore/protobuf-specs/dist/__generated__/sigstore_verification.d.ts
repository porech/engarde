import { Bundle } from "./sigstore_bundle";
import { HashOutput, ObjectIdentifierValuePair, PublicKey, SubjectAlternativeName } from "./sigstore_common";
import { TrustedRoot } from "./sigstore_trustroot";
/** The identity of a X.509 Certificate signer. */
export interface CertificateIdentity {
    /** The X.509v3 issuer extension (OID 1.3.6.1.4.1.57264.1.1) */
    issuer: string;
    san: SubjectAlternativeName | undefined;
    /**
     * An unordered list of OIDs that must be verified.
     * All OID/values provided in this list MUST exactly match against
     * the values in the certificate for verification to be successful.
     */
    oids: ObjectIdentifierValuePair[];
}
export interface CertificateIdentities {
    identities: CertificateIdentity[];
}
export interface PublicKeyIdentities {
    publicKeys: PublicKey[];
}
/**
 * A light-weight set of options/policies for identifying trusted signers,
 * used during verification of a single artifact.
 */
export interface ArtifactVerificationOptions {
    /**
     * At least one identity MUST be provided. Providing zero identities
     * is an error. If at least one provided identity is found as a
     * signer, the verification is considered successful.
     */
    signers?: {
        $case: "certificateIdentities";
        certificateIdentities: CertificateIdentities;
    } | //
    /**
     * To simplify verification implementation, the logic for
     * bundle verification should be implemented as a
     * higher-order function, where one of argument should be an
     * interface over the set of trusted public keys, like this:
     * `Verify(bytes artifact, bytes signature, string key_id)`.
     * This way the caller is in full control of mapping the
     * identified (or hinted) key in the bundle to one of the
     * trusted keys, as this process is inherently application
     * specific.
     */
    {
        $case: "publicKeys";
        publicKeys: PublicKeyIdentities;
    } | undefined;
    /**
     * Optional options for artifact transparency log verification.
     * If none is provided, the default verification options are:
     * Threshold: 1
     * Online verification: false
     * Disable: false
     */
    tlogOptions?: ArtifactVerificationOptions_TlogOptions | undefined;
    /**
     * Optional options for certificate transparency log verification.
     * If none is provided, the default verification options are:
     * Threshold: 1
     * Disable: false
     */
    ctlogOptions?: ArtifactVerificationOptions_CtlogOptions | undefined;
    /**
     * Optional options for certificate signed timestamp verification.
     * If none is provided, the default verification options are:
     * Threshold: 0
     * Disable: true
     */
    tsaOptions?: ArtifactVerificationOptions_TimestampAuthorityOptions | undefined;
    /**
     * Optional options for integrated timestamp verification.
     * If none is provided, the default verification options are:
     * Threshold: 0
     * Disable: true
     */
    integratedTsOptions?: ArtifactVerificationOptions_TlogIntegratedTimestampOptions | undefined;
    /**
     * Optional options for observed timestamp verification.
     * If none is provided, the default verification options are:
     * Threshold 1
     * Disable: false
     */
    observerOptions?: ArtifactVerificationOptions_ObserverTimestampOptions | undefined;
}
export interface ArtifactVerificationOptions_TlogOptions {
    /** Number of transparency logs the entry must appear on. */
    threshold: number;
    /** Perform an online inclusion proof. */
    performOnlineVerification: boolean;
    /** Disable verification for transparency logs. */
    disable: boolean;
}
export interface ArtifactVerificationOptions_CtlogOptions {
    /**
     * The number of ct transparency logs the certificate must
     * appear on.
     */
    threshold: number;
    /** Disable ct transparency log verification */
    disable: boolean;
}
export interface ArtifactVerificationOptions_TimestampAuthorityOptions {
    /** The number of signed timestamps that are expected. */
    threshold: number;
    /** Disable signed timestamp verification. */
    disable: boolean;
}
export interface ArtifactVerificationOptions_TlogIntegratedTimestampOptions {
    /** The number of integrated timestamps that are expected. */
    threshold: number;
    /** Disable integrated timestamp verification. */
    disable: boolean;
}
export interface ArtifactVerificationOptions_ObserverTimestampOptions {
    /**
     * The number of external observers of the timestamp.
     * This is a union of RFC3161 signed timestamps, and
     * integrated timestamps from a transparency log, that
     * could include additional timestamp sources in the
     * future.
     */
    threshold: number;
    /** Disable observer timestamp verification. */
    disable: boolean;
}
export interface Artifact {
    data?: //
    /** Location of the artifact */
    {
        $case: "artifactUri";
        artifactUri: string;
    } | //
    /** The raw bytes of the artifact */
    {
        $case: "artifact";
        artifact: Buffer;
    } | //
    /**
     * Digest of the artifact. SHOULD NOT be used when verifying an
     * in-toto attestation as the subject digest cannot be
     * reconstructed. This option will not work with Ed25519
     * signatures, use Ed25519Ph or another algorithm instead.
     */
    {
        $case: "artifactDigest";
        artifactDigest: HashOutput;
    } | undefined;
}
/**
 * Input captures all that is needed to call the bundle verification method,
 * to verify a single artifact referenced by the bundle.
 */
export interface Input {
    /**
     * The verification materials provided during a bundle verification.
     * The running process is usually preloaded with a "global"
     * dev.sisgtore.trustroot.TrustedRoot.v1 instance. Prior to
     * verifying an artifact (i.e a bundle), and/or based on current
     * policy, some selection is expected to happen, to filter out the
     * exact certificate authority to use, which transparency logs are
     * relevant etc. The result should b ecaptured in the
     * `artifact_trust_root`.
     */
    artifactTrustRoot: TrustedRoot | undefined;
    artifactVerificationOptions: ArtifactVerificationOptions | undefined;
    bundle: Bundle | undefined;
    /**
     * If the bundle contains a message signature, the artifact must be
     * provided.
     */
    artifact?: Artifact | undefined;
}
export declare const CertificateIdentity: MessageFns<CertificateIdentity>;
export declare const CertificateIdentities: MessageFns<CertificateIdentities>;
export declare const PublicKeyIdentities: MessageFns<PublicKeyIdentities>;
export declare const ArtifactVerificationOptions: MessageFns<ArtifactVerificationOptions>;
export declare const ArtifactVerificationOptions_TlogOptions: MessageFns<ArtifactVerificationOptions_TlogOptions>;
export declare const ArtifactVerificationOptions_CtlogOptions: MessageFns<ArtifactVerificationOptions_CtlogOptions>;
export declare const ArtifactVerificationOptions_TimestampAuthorityOptions: MessageFns<ArtifactVerificationOptions_TimestampAuthorityOptions>;
export declare const ArtifactVerificationOptions_TlogIntegratedTimestampOptions: MessageFns<ArtifactVerificationOptions_TlogIntegratedTimestampOptions>;
export declare const ArtifactVerificationOptions_ObserverTimestampOptions: MessageFns<ArtifactVerificationOptions_ObserverTimestampOptions>;
export declare const Artifact: MessageFns<Artifact>;
export declare const Input: MessageFns<Input>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
