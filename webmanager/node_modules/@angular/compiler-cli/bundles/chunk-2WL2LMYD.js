
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  ImportManager,
  ImportedSymbolsTracker,
  TypeScriptReflectionHost,
  getAngularDecorators,
  isAliasImportDeclaration,
  isAngularDecorator,
  loadIsReferencedAliasDeclarationPatch,
  queryDecoratorNames,
  reflectClassMember,
  tryParseInitializerBasedOutput,
  tryParseSignalInputMapping,
  tryParseSignalModelMapping,
  tryParseSignalQueryFromInitializer
} from "./chunk-NR7S7ISS.js";

// packages/compiler-cli/src/ngtsc/transform/jit/src/downlevel_decorators_transform.js
import ts from "typescript";
function isAngularDecorator2(decorator, isCore) {
  return isCore || decorator.import !== null && decorator.import.from === "@angular/core";
}
var DECORATOR_INVOCATION_JSDOC_TYPE = "!Array<{type: !Function, args: (undefined|!Array<?>)}>";
function extractMetadataFromSingleDecorator(decorator, diagnostics) {
  const metadataProperties = [];
  const expr = decorator.expression;
  switch (expr.kind) {
    case ts.SyntaxKind.Identifier:
      metadataProperties.push(ts.factory.createPropertyAssignment("type", expr));
      break;
    case ts.SyntaxKind.CallExpression:
      const call = expr;
      metadataProperties.push(ts.factory.createPropertyAssignment("type", call.expression));
      if (call.arguments.length) {
        const args = [];
        for (const arg of call.arguments) {
          args.push(arg);
        }
        const argsArrayLiteral = ts.factory.createArrayLiteralExpression(ts.factory.createNodeArray(args, true));
        metadataProperties.push(ts.factory.createPropertyAssignment("args", argsArrayLiteral));
      }
      break;
    default:
      diagnostics.push({
        file: decorator.getSourceFile(),
        start: decorator.getStart(),
        length: decorator.getEnd() - decorator.getStart(),
        messageText: `${ts.SyntaxKind[decorator.kind]} not implemented in gathering decorator metadata.`,
        category: ts.DiagnosticCategory.Error,
        code: 0
      });
      break;
  }
  return ts.factory.createObjectLiteralExpression(metadataProperties);
}
function createCtorParametersClassProperty(diagnostics, entityNameToExpression, ctorParameters, isClosureCompilerEnabled) {
  const params = [];
  for (const ctorParam of ctorParameters) {
    if (!ctorParam.type && ctorParam.decorators.length === 0) {
      params.push(ts.factory.createNull());
      continue;
    }
    const paramType = ctorParam.type ? typeReferenceToExpression(entityNameToExpression, ctorParam.type) : void 0;
    const members = [
      ts.factory.createPropertyAssignment("type", paramType || ts.factory.createIdentifier("undefined"))
    ];
    const decorators = [];
    for (const deco of ctorParam.decorators) {
      decorators.push(extractMetadataFromSingleDecorator(deco, diagnostics));
    }
    if (decorators.length) {
      members.push(ts.factory.createPropertyAssignment("decorators", ts.factory.createArrayLiteralExpression(decorators)));
    }
    params.push(ts.factory.createObjectLiteralExpression(members));
  }
  const initializer = ts.factory.createArrowFunction(void 0, void 0, [], void 0, ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.factory.createArrayLiteralExpression(params, true));
  const ctorProp = ts.factory.createPropertyDeclaration([ts.factory.createToken(ts.SyntaxKind.StaticKeyword)], "ctorParameters", void 0, void 0, initializer);
  if (isClosureCompilerEnabled) {
    ts.setSyntheticLeadingComments(ctorProp, [
      {
        kind: ts.SyntaxKind.MultiLineCommentTrivia,
        text: [
          `*`,
          ` * @type {function(): !Array<(null|{`,
          ` *   type: ?,`,
          ` *   decorators: (undefined|${DECORATOR_INVOCATION_JSDOC_TYPE}),`,
          ` * })>}`,
          ` * @nocollapse`,
          ` `
        ].join("\n"),
        pos: -1,
        end: -1,
        hasTrailingNewLine: true
      }
    ]);
  }
  return ctorProp;
}
function typeReferenceToExpression(entityNameToExpression, node) {
  let kind = node.kind;
  if (ts.isLiteralTypeNode(node)) {
    kind = node.literal.kind;
  }
  switch (kind) {
    case ts.SyntaxKind.FunctionType:
    case ts.SyntaxKind.ConstructorType:
      return ts.factory.createIdentifier("Function");
    case ts.SyntaxKind.ArrayType:
    case ts.SyntaxKind.TupleType:
      return ts.factory.createIdentifier("Array");
    case ts.SyntaxKind.TypePredicate:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.BooleanKeyword:
      return ts.factory.createIdentifier("Boolean");
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.StringKeyword:
      return ts.factory.createIdentifier("String");
    case ts.SyntaxKind.ObjectKeyword:
      return ts.factory.createIdentifier("Object");
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.NumericLiteral:
      return ts.factory.createIdentifier("Number");
    case ts.SyntaxKind.TypeReference:
      const typeRef = node;
      return entityNameToExpression(typeRef.typeName);
    case ts.SyntaxKind.UnionType:
      const childTypeNodes = node.types.filter((t) => !(ts.isLiteralTypeNode(t) && t.literal.kind === ts.SyntaxKind.NullKeyword));
      return childTypeNodes.length === 1 ? typeReferenceToExpression(entityNameToExpression, childTypeNodes[0]) : void 0;
    default:
      return void 0;
  }
}
function symbolIsRuntimeValue(typeChecker, symbol) {
  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = typeChecker.getAliasedSymbol(symbol);
  }
  return (symbol.flags & ts.SymbolFlags.Value & ts.SymbolFlags.ConstEnumExcludes) !== 0;
}
function getDownlevelDecoratorsTransform(typeChecker, host, diagnostics, isCore, isClosureCompilerEnabled, shouldTransformClass) {
  function addJSDocTypeAnnotation(node, jsdocType) {
    if (!isClosureCompilerEnabled) {
      return;
    }
    ts.setSyntheticLeadingComments(node, [
      {
        kind: ts.SyntaxKind.MultiLineCommentTrivia,
        text: `* @type {${jsdocType}} `,
        pos: -1,
        end: -1,
        hasTrailingNewLine: true
      }
    ]);
  }
  function createPropDecoratorsClassProperty(diagnostics2, properties) {
    const entries = [];
    for (const [name, decorators] of properties.entries()) {
      entries.push(ts.factory.createPropertyAssignment(name, ts.factory.createArrayLiteralExpression(decorators.map((deco) => extractMetadataFromSingleDecorator(deco, diagnostics2)))));
    }
    const initializer = ts.factory.createObjectLiteralExpression(entries, true);
    const prop = ts.factory.createPropertyDeclaration([ts.factory.createToken(ts.SyntaxKind.StaticKeyword)], "propDecorators", void 0, void 0, initializer);
    addJSDocTypeAnnotation(prop, `!Object<string, ${DECORATOR_INVOCATION_JSDOC_TYPE}>`);
    return prop;
  }
  return (context) => {
    const referencedParameterTypes = loadIsReferencedAliasDeclarationPatch(context);
    function entityNameToExpression(name) {
      const symbol = typeChecker.getSymbolAtLocation(name);
      if (!symbol || !symbolIsRuntimeValue(typeChecker, symbol) || !symbol.declarations || symbol.declarations.length === 0) {
        return void 0;
      }
      if (ts.isQualifiedName(name)) {
        const containerExpr = entityNameToExpression(name.left);
        if (containerExpr === void 0) {
          return void 0;
        }
        return ts.factory.createPropertyAccessExpression(containerExpr, name.right);
      }
      const decl = symbol.declarations[0];
      if (isAliasImportDeclaration(decl)) {
        referencedParameterTypes?.add(decl);
        if (decl.name !== void 0) {
          return ts.setOriginalNode(ts.factory.createIdentifier(decl.name.text), decl.name);
        }
      }
      return ts.setOriginalNode(ts.factory.createIdentifier(name.text), name);
    }
    function transformClassElement(element) {
      element = ts.visitEachChild(element, decoratorDownlevelVisitor, context);
      const decoratorsToKeep = [];
      const toLower = [];
      const decorators = host.getDecoratorsOfDeclaration(element) || [];
      for (const decorator of decorators) {
        const decoratorNode = decorator.node;
        if (!isAngularDecorator2(decorator, isCore)) {
          decoratorsToKeep.push(decoratorNode);
          continue;
        }
        toLower.push(decoratorNode);
      }
      if (!toLower.length)
        return [void 0, element, []];
      if (!element.name || !ts.isIdentifier(element.name)) {
        diagnostics.push({
          file: element.getSourceFile(),
          start: element.getStart(),
          length: element.getEnd() - element.getStart(),
          messageText: `Cannot process decorators for class element with non-analyzable name.`,
          category: ts.DiagnosticCategory.Error,
          code: 0
        });
        return [void 0, element, []];
      }
      const elementModifiers = ts.canHaveModifiers(element) ? ts.getModifiers(element) : void 0;
      let modifiers;
      if (decoratorsToKeep.length || elementModifiers?.length) {
        modifiers = ts.setTextRange(ts.factory.createNodeArray([...decoratorsToKeep, ...elementModifiers || []]), element.modifiers);
      }
      return [element.name.text, cloneClassElementWithModifiers(element, modifiers), toLower];
    }
    function transformConstructor(ctor) {
      ctor = ts.visitEachChild(ctor, decoratorDownlevelVisitor, context);
      const newParameters = [];
      const oldParameters = ctor.parameters;
      const parametersInfo = [];
      for (const param of oldParameters) {
        const decoratorsToKeep = [];
        const paramInfo = { decorators: [], type: null };
        const decorators = host.getDecoratorsOfDeclaration(param) || [];
        for (const decorator of decorators) {
          const decoratorNode = decorator.node;
          if (!isAngularDecorator2(decorator, isCore)) {
            decoratorsToKeep.push(decoratorNode);
            continue;
          }
          paramInfo.decorators.push(decoratorNode);
        }
        if (param.type) {
          paramInfo.type = param.type;
        }
        parametersInfo.push(paramInfo);
        let modifiers;
        const paramModifiers = ts.getModifiers(param);
        if (decoratorsToKeep.length || paramModifiers?.length) {
          modifiers = [...decoratorsToKeep, ...paramModifiers || []];
        }
        const newParam = ts.factory.updateParameterDeclaration(param, modifiers, param.dotDotDotToken, param.name, param.questionToken, param.type, param.initializer);
        newParameters.push(newParam);
      }
      const updated = ts.factory.updateConstructorDeclaration(ctor, ts.getModifiers(ctor), newParameters, ctor.body);
      return [updated, parametersInfo];
    }
    function transformClassDeclaration(classDecl) {
      const newMembers = [];
      const decoratedProperties = /* @__PURE__ */ new Map();
      let classParameters = null;
      for (const member of classDecl.members) {
        switch (member.kind) {
          case ts.SyntaxKind.PropertyDeclaration:
          case ts.SyntaxKind.GetAccessor:
          case ts.SyntaxKind.SetAccessor:
          case ts.SyntaxKind.MethodDeclaration: {
            const [name, newMember, decorators] = transformClassElement(member);
            newMembers.push(newMember);
            if (name)
              decoratedProperties.set(name, decorators);
            continue;
          }
          case ts.SyntaxKind.Constructor: {
            const ctor = member;
            if (!ctor.body)
              break;
            const [newMember, parametersInfo] = transformConstructor(member);
            classParameters = parametersInfo;
            newMembers.push(newMember);
            continue;
          }
          default:
            break;
        }
        newMembers.push(ts.visitEachChild(member, decoratorDownlevelVisitor, context));
      }
      const possibleAngularDecorators = host.getDecoratorsOfDeclaration(classDecl) || [];
      const hasAngularDecorator = possibleAngularDecorators.some((d) => isAngularDecorator2(d, isCore));
      if (classParameters) {
        if (hasAngularDecorator || classParameters.some((p) => !!p.decorators.length)) {
          newMembers.push(createCtorParametersClassProperty(diagnostics, entityNameToExpression, classParameters, isClosureCompilerEnabled));
        }
      }
      if (decoratedProperties.size) {
        newMembers.push(createPropDecoratorsClassProperty(diagnostics, decoratedProperties));
      }
      const members = ts.setTextRange(ts.factory.createNodeArray(newMembers, classDecl.members.hasTrailingComma), classDecl.members);
      return ts.factory.updateClassDeclaration(classDecl, classDecl.modifiers, classDecl.name, classDecl.typeParameters, classDecl.heritageClauses, members);
    }
    function decoratorDownlevelVisitor(node) {
      if (ts.isClassDeclaration(node) && (shouldTransformClass === void 0 || shouldTransformClass(node))) {
        return transformClassDeclaration(node);
      }
      return ts.visitEachChild(node, decoratorDownlevelVisitor, context);
    }
    return (sf) => {
      return ts.visitEachChild(sf, decoratorDownlevelVisitor, context);
    };
  };
}
function cloneClassElementWithModifiers(node, modifiers) {
  let clone;
  if (ts.isMethodDeclaration(node)) {
    clone = ts.factory.createMethodDeclaration(modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
  } else if (ts.isPropertyDeclaration(node)) {
    clone = ts.factory.createPropertyDeclaration(modifiers, node.name, node.questionToken, node.type, node.initializer);
  } else if (ts.isGetAccessor(node)) {
    clone = ts.factory.createGetAccessorDeclaration(modifiers, node.name, node.parameters, node.type, node.body);
  } else if (ts.isSetAccessor(node)) {
    clone = ts.factory.createSetAccessorDeclaration(modifiers, node.name, node.parameters, node.body);
  } else {
    throw new Error(`Unsupported decorated member with kind ${ts.SyntaxKind[node.kind]}`);
  }
  return ts.setOriginalNode(clone, node);
}

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/transform.js
import ts4 from "typescript";

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/transform_api.js
import ts2 from "typescript";
function createSyntheticAngularCoreDecoratorAccess(factory, importManager, ngClassDecorator, sourceFile, decoratorName) {
  const classDecoratorIdentifier = ts2.isIdentifier(ngClassDecorator.identifier) ? ngClassDecorator.identifier : ngClassDecorator.identifier.expression;
  return factory.createPropertyAccessExpression(
    importManager.addImport({
      exportModuleSpecifier: "@angular/core",
      exportSymbolName: null,
      requestedFile: sourceFile
    }),
    // The synthetic identifier may be checked later by the downlevel decorators
    // transform to resolve to an Angular import using `getSymbolAtLocation`. We trick
    // the transform to think it's not synthetic and comes from Angular core.
    ts2.setOriginalNode(factory.createIdentifier(decoratorName), classDecoratorIdentifier)
  );
}
function castAsAny(factory, expr) {
  return factory.createAsExpression(expr, factory.createKeywordTypeNode(ts2.SyntaxKind.AnyKeyword));
}

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/input_function.js
var signalInputsTransform = (member, sourceFile, host, factory, importTracker, importManager, classDecorator, isCore) => {
  if (host.getDecoratorsOfDeclaration(member.node)?.some((d) => isAngularDecorator(d, "Input", isCore))) {
    return member.node;
  }
  const inputMapping = tryParseSignalInputMapping(member, host, importTracker);
  if (inputMapping === null) {
    return member.node;
  }
  const fields = {
    "isSignal": factory.createTrue(),
    "alias": factory.createStringLiteral(inputMapping.bindingPropertyName),
    "required": inputMapping.required ? factory.createTrue() : factory.createFalse(),
    // For signal inputs, transforms are captured by the input signal. The runtime will
    // determine whether a transform needs to be run via the input signal, so the `transform`
    // option is always `undefined`.
    "transform": factory.createIdentifier("undefined")
  };
  const newDecorator = factory.createDecorator(factory.createCallExpression(createSyntheticAngularCoreDecoratorAccess(factory, importManager, classDecorator, sourceFile, "Input"), void 0, [
    // Cast to `any` because `isSignal` will be private, and in case this
    // transform is used directly as a pre-compilation step, the decorator should
    // not fail. It is already validated now due to us parsing the input metadata.
    castAsAny(factory, factory.createObjectLiteralExpression(Object.entries(fields).map(([name, value]) => factory.createPropertyAssignment(name, value))))
  ]));
  return factory.updatePropertyDeclaration(member.node, [newDecorator, ...member.node.modifiers ?? []], member.name, member.node.questionToken, member.node.type, member.node.initializer);
};

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/model_function.js
import ts3 from "typescript";
var signalModelTransform = (member, sourceFile, host, factory, importTracker, importManager, classDecorator, isCore) => {
  if (host.getDecoratorsOfDeclaration(member.node)?.some((d) => {
    return isAngularDecorator(d, "Input", isCore) || isAngularDecorator(d, "Output", isCore);
  })) {
    return member.node;
  }
  const modelMapping = tryParseSignalModelMapping(member, host, importTracker);
  if (modelMapping === null) {
    return member.node;
  }
  const inputConfig = factory.createObjectLiteralExpression([
    factory.createPropertyAssignment("isSignal", modelMapping.input.isSignal ? factory.createTrue() : factory.createFalse()),
    factory.createPropertyAssignment("alias", factory.createStringLiteral(modelMapping.input.bindingPropertyName)),
    factory.createPropertyAssignment("required", modelMapping.input.required ? factory.createTrue() : factory.createFalse())
  ]);
  const inputDecorator = createDecorator(
    "Input",
    // Config is cast to `any` because `isSignal` will be private, and in case this
    // transform is used directly as a pre-compilation step, the decorator should
    // not fail. It is already validated now due to us parsing the input metadata.
    factory.createAsExpression(inputConfig, factory.createKeywordTypeNode(ts3.SyntaxKind.AnyKeyword)),
    classDecorator,
    factory,
    sourceFile,
    importManager
  );
  const outputDecorator = createDecorator("Output", factory.createStringLiteral(modelMapping.output.bindingPropertyName), classDecorator, factory, sourceFile, importManager);
  return factory.updatePropertyDeclaration(member.node, [inputDecorator, outputDecorator, ...member.node.modifiers ?? []], member.node.name, member.node.questionToken, member.node.type, member.node.initializer);
};
function createDecorator(name, config, classDecorator, factory, sourceFile, importManager) {
  const callTarget = createSyntheticAngularCoreDecoratorAccess(factory, importManager, classDecorator, sourceFile, name);
  return factory.createDecorator(factory.createCallExpression(callTarget, void 0, [config]));
}

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/output_function.js
var initializerApiOutputTransform = (member, sourceFile, host, factory, importTracker, importManager, classDecorator, isCore) => {
  if (host.getDecoratorsOfDeclaration(member.node)?.some((d) => isAngularDecorator(d, "Output", isCore))) {
    return member.node;
  }
  const output = tryParseInitializerBasedOutput(member, host, importTracker);
  if (output === null) {
    return member.node;
  }
  const newDecorator = factory.createDecorator(factory.createCallExpression(createSyntheticAngularCoreDecoratorAccess(factory, importManager, classDecorator, sourceFile, "Output"), void 0, [factory.createStringLiteral(output.metadata.bindingPropertyName)]));
  return factory.updatePropertyDeclaration(member.node, [newDecorator, ...member.node.modifiers ?? []], member.node.name, member.node.questionToken, member.node.type, member.node.initializer);
};

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/query_functions.js
var queryFunctionToDecorator = {
  "viewChild": "ViewChild",
  "viewChildren": "ViewChildren",
  "contentChild": "ContentChild",
  "contentChildren": "ContentChildren"
};
var queryFunctionsTransforms = (member, sourceFile, host, factory, importTracker, importManager, classDecorator, isCore) => {
  const decorators = host.getDecoratorsOfDeclaration(member.node);
  const queryDecorators = decorators && getAngularDecorators(decorators, queryDecoratorNames, isCore);
  if (queryDecorators !== null && queryDecorators.length > 0) {
    return member.node;
  }
  const queryDefinition = tryParseSignalQueryFromInitializer(member, host, importTracker);
  if (queryDefinition === null) {
    return member.node;
  }
  const callArgs = queryDefinition.call.arguments;
  const newDecorator = factory.createDecorator(factory.createCallExpression(
    createSyntheticAngularCoreDecoratorAccess(factory, importManager, classDecorator, sourceFile, queryFunctionToDecorator[queryDefinition.name]),
    void 0,
    // All positional arguments of the query functions can be mostly re-used as is
    // for the decorator. i.e. predicate is always first argument. Options are second.
    [
      queryDefinition.call.arguments[0],
      // Note: Casting as `any` because `isSignal` is not publicly exposed and this
      // transform might pre-transform TS sources.
      castAsAny(factory, factory.createObjectLiteralExpression([
        ...callArgs.length > 1 ? [factory.createSpreadAssignment(callArgs[1])] : [],
        factory.createPropertyAssignment("isSignal", factory.createTrue())
      ]))
    ]
  ));
  return factory.updatePropertyDeclaration(member.node, [newDecorator, ...member.node.modifiers ?? []], member.node.name, member.node.questionToken, member.node.type, member.node.initializer);
};

// packages/compiler-cli/src/ngtsc/transform/jit/src/initializer_api_transforms/transform.js
var decoratorsWithInputs = ["Directive", "Component"];
var propertyTransforms = [
  signalInputsTransform,
  initializerApiOutputTransform,
  queryFunctionsTransforms,
  signalModelTransform
];
function getInitializerApiJitTransform(host, importTracker, isCore, shouldTransformClass) {
  return (ctx) => {
    return (sourceFile) => {
      const importManager = new ImportManager();
      sourceFile = ts4.visitNode(sourceFile, createTransformVisitor(ctx, host, importManager, importTracker, isCore, shouldTransformClass), ts4.isSourceFile);
      return importManager.transformTsFile(ctx, sourceFile);
    };
  };
}
function createTransformVisitor(ctx, host, importManager, importTracker, isCore, shouldTransformClass) {
  const visitor = (node) => {
    if (ts4.isClassDeclaration(node) && node.name !== void 0) {
      const originalNode = ts4.getOriginalNode(node, ts4.isClassDeclaration);
      const angularDecorator = host.getDecoratorsOfDeclaration(originalNode)?.find((d) => decoratorsWithInputs.some((name) => isAngularDecorator(d, name, isCore)));
      if (angularDecorator !== void 0 && (shouldTransformClass === void 0 || shouldTransformClass(node))) {
        let hasChanged = false;
        const sourceFile = originalNode.getSourceFile();
        const members = node.members.map((memberNode) => {
          if (!ts4.isPropertyDeclaration(memberNode)) {
            return memberNode;
          }
          const member = reflectClassMember(memberNode);
          if (member === null) {
            return memberNode;
          }
          for (const transform of propertyTransforms) {
            const newNode = transform({ ...member, node: memberNode }, sourceFile, host, ctx.factory, importTracker, importManager, angularDecorator, isCore);
            if (newNode !== member.node) {
              hasChanged = true;
              return newNode;
            }
          }
          return memberNode;
        });
        if (hasChanged) {
          return ctx.factory.updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, members);
        }
      }
    }
    return ts4.visitEachChild(node, visitor, ctx);
  };
  return visitor;
}

// packages/compiler-cli/src/ngtsc/transform/jit/src/index.js
function angularJitApplicationTransform(program, isCore = false, shouldTransformClass) {
  const typeChecker = program.getTypeChecker();
  const reflectionHost = new TypeScriptReflectionHost(typeChecker);
  const importTracker = new ImportedSymbolsTracker();
  const downlevelDecoratorTransform = getDownlevelDecoratorsTransform(
    typeChecker,
    reflectionHost,
    [],
    isCore,
    /* enableClosureCompiler */
    false,
    shouldTransformClass
  );
  const initializerApisJitTransform = getInitializerApiJitTransform(reflectionHost, importTracker, isCore, shouldTransformClass);
  return (ctx) => {
    return (sourceFile) => {
      sourceFile = initializerApisJitTransform(ctx)(sourceFile);
      sourceFile = downlevelDecoratorTransform(ctx)(sourceFile);
      return sourceFile;
    };
  };
}

export {
  getDownlevelDecoratorsTransform,
  getInitializerApiJitTransform,
  angularJitApplicationTransform
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
