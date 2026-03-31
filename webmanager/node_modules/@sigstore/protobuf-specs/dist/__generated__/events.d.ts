import { Any } from "./google/protobuf/any";
export interface CloudEvent {
    /** Required Attributes */
    id: string;
    /** URI-reference */
    source: string;
    specVersion: string;
    type: string;
    /** Optional & Extension Attributes */
    attributes: {
        [key: string]: CloudEvent_CloudEventAttributeValue;
    };
    /** -- CloudEvent Data (Bytes, Text, or Proto) */
    data?: {
        $case: "binaryData";
        binaryData: Buffer;
    } | {
        $case: "textData";
        textData: string;
    } | {
        $case: "protoData";
        protoData: Any;
    } | undefined;
}
export interface CloudEvent_AttributesEntry {
    key: string;
    value: CloudEvent_CloudEventAttributeValue | undefined;
}
export interface CloudEvent_CloudEventAttributeValue {
    attr?: {
        $case: "ceBoolean";
        ceBoolean: boolean;
    } | {
        $case: "ceInteger";
        ceInteger: number;
    } | {
        $case: "ceString";
        ceString: string;
    } | {
        $case: "ceBytes";
        ceBytes: Buffer;
    } | {
        $case: "ceUri";
        ceUri: string;
    } | {
        $case: "ceUriRef";
        ceUriRef: string;
    } | {
        $case: "ceTimestamp";
        ceTimestamp: Date;
    } | undefined;
}
export interface CloudEventBatch {
    events: CloudEvent[];
}
export declare const CloudEvent: MessageFns<CloudEvent>;
export declare const CloudEvent_AttributesEntry: MessageFns<CloudEvent_AttributesEntry>;
export declare const CloudEvent_CloudEventAttributeValue: MessageFns<CloudEvent_CloudEventAttributeValue>;
export declare const CloudEventBatch: MessageFns<CloudEventBatch>;
interface MessageFns<T> {
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}
export {};
