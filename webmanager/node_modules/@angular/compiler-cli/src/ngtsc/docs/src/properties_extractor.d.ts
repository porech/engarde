/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ClassDeclaration } from '../../reflection';
import { MemberEntry, MemberTags, MethodEntry, PropertyEntry } from './entities';
/** A class member declaration that is *like* a property (including accessors) */
type PropertyDeclarationLike = ts.PropertyDeclaration | ts.AccessorDeclaration;
/** Type representing either a class declaration ro an interface declaration. */
export type ClassDeclarationLike = ts.ClassDeclaration | ts.InterfaceDeclaration;
/** Type representing either a class or interface member. */
type MemberElement = ts.ClassElement | ts.TypeElement;
/** Type representing a signature element of an interface. */
type SignatureElement = ts.CallSignatureDeclaration | ts.ConstructSignatureDeclaration;
/**
 * Type representing either:
 */
type MethodLike = ts.MethodDeclaration | ts.MethodSignature;
/**
 * Type representing either a class property declaration or an interface property signature.
 */
type PropertyLike = PropertyDeclarationLike | ts.PropertySignature;
/** Extractor to pull info for API reference documentation for a TypeScript class or interface. */
export declare abstract class PropertiesExtractor {
    protected declaration: {
        name: ts.Identifier;
    } & ClassDeclarationLike;
    protected typeChecker: ts.TypeChecker;
    constructor(declaration: {
        name: ts.Identifier;
    } & ClassDeclarationLike, typeChecker: ts.TypeChecker);
    /** Extract docs info specific to classes. */
    extract(): {
        members: MemberEntry[];
        generics: import("./entities").GenericEntry[];
    };
    /** Extracts doc info for a class's members. */
    protected extractAllClassMembers(): MemberEntry[];
    /** Extract docs for a class's members (methods and properties).  */
    protected extractClassMember(memberDeclaration: MemberElement): MemberEntry | undefined;
    /** Extract docs for all call signatures in the current class/interface. */
    protected extractSignatures(): MemberEntry[];
    /** Extracts docs for a class method. */
    protected extractMethod(methodDeclaration: MethodLike): MethodEntry;
    /** Extracts docs for a signature element (usually inside an interface). */
    protected extractSignature(signature: SignatureElement): MethodEntry;
    /** Extracts doc info for a property declaration. */
    protected extractClassProperty(propertyDeclaration: PropertyLike): PropertyEntry;
    /** Extracts doc info for an accessor member (getter/setter). */
    protected extractGetterSetter(accessor: ts.AccessorDeclaration): PropertyEntry;
    protected extractConstructor(constructorDeclaration: ts.ConstructorDeclaration): MethodEntry;
    protected extractInterfaceConformance(declaration: ClassDeclaration & ClassDeclarationLike): string[];
    /** Gets the tags for a member (protected, readonly, static, etc.) */
    protected getMemberTags(member: MethodLike | PropertyLike | ts.ConstructorDeclaration): MemberTags[];
    /** Computes all signature declarations of the class/interface. */
    private computeAllSignatureDeclarations;
    /** Gets all member declarations, including inherited members. */
    private getMemberDeclarations;
    /** The result only contains properties, method implementations and abstracts */
    private filterMethodOverloads;
    /** Get the tags for a member that come from the declaration modifiers. */
    private getMemberTagsFromModifiers;
    /** Gets the doc tag corresponding to a class member modifier (readonly, protected, etc.). */
    private getTagForMemberModifier;
    /**
     * Gets whether a given class member should be excluded from public API docs.
     * This is the case if:
     *  - The member does not have a name
     *  - The member is neither a method nor property
     *  - The member is private
     *  - The member has a name that marks it as Angular-internal.
     *  - The member is marked as internal via JSDoc.
     */
    private isMemberExcluded;
    /** Gets whether a class member is a method, property, or accessor. */
    private isDocumentableMember;
    /** Check if the parameter is a constructor parameter with a public modifier */
    private isPublicConstructorParameterProperty;
    /** Gets whether a member is a property. */
    private isProperty;
    /** Gets whether a member is a method. */
    private isMethod;
    /** Gets whether the given signature declaration is documentable. */
    private isDocumentableSignature;
    /**
     * Check wether a member has a private computed property name like [ɵWRITABLE_SIGNAL]
     *
     * This will prevent exposing private computed properties in the docs.
     */
    private hasPrivateComputedProperty;
}
export {};
