
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  FatalLinkerError,
  FileLinker,
  LinkerEnvironment,
  assert,
  isFatalLinkerError
} from "../../chunk-BPDNYZBC.js";
import {
  ConsoleLogger,
  LogLevel
} from "../../chunk-6HOSNZU5.js";
import "../../chunk-HYJ2H3FU.js";
import "../../chunk-I2BHWRAU.js";
import {
  NodeJSFileSystem
} from "../../chunk-XYYEESKY.js";
import "../../chunk-G7GFT6BU.js";

// packages/compiler-cli/linker/babel/src/es2015_linker_plugin.js
import { types as t4 } from "@babel/core";

// packages/compiler-cli/linker/babel/src/ast/babel_ast_factory.js
import { types as t } from "@babel/core";
var BabelAstFactory = class {
  sourceUrl;
  constructor(sourceUrl) {
    this.sourceUrl = sourceUrl;
  }
  attachComments(statement, leadingComments) {
    for (let i = leadingComments.length - 1; i >= 0; i--) {
      const comment = leadingComments[i];
      t.addComment(statement, "leading", comment.toString(), !comment.multiline);
    }
  }
  createArrayLiteral = t.arrayExpression;
  createAssignment(target, operator, value) {
    assert(target, isLExpression, "must be a left hand side expression");
    return t.assignmentExpression(operator, target, value);
  }
  createBinaryExpression(leftOperand, operator, rightOperand) {
    switch (operator) {
      case "&&":
      case "||":
      case "??":
        return t.logicalExpression(operator, leftOperand, rightOperand);
      case "=":
      case "+=":
      case "-=":
      case "*=":
      case "/=":
      case "%=":
      case "**=":
      case "&&=":
      case "||=":
      case "??=":
        throw new Error(`Unexpected assignment operator ${operator}`);
      default:
        return t.binaryExpression(operator, leftOperand, rightOperand);
    }
  }
  createBlock = t.blockStatement;
  createCallExpression(callee, args, pure) {
    const call = t.callExpression(callee, args);
    if (pure) {
      t.addComment(
        call,
        "leading",
        " @__PURE__ ",
        /* line */
        false
      );
    }
    return call;
  }
  createConditional = t.conditionalExpression;
  createElementAccess(expression, element) {
    return t.memberExpression(
      expression,
      element,
      /* computed */
      true
    );
  }
  createExpressionStatement = t.expressionStatement;
  createFunctionDeclaration(functionName, parameters, body) {
    assert(body, t.isBlockStatement, "a block");
    return t.functionDeclaration(t.identifier(functionName), parameters.map((param) => t.identifier(param)), body);
  }
  createArrowFunctionExpression(parameters, body) {
    if (t.isStatement(body)) {
      assert(body, t.isBlockStatement, "a block");
    }
    return t.arrowFunctionExpression(parameters.map((param) => t.identifier(param)), body);
  }
  createFunctionExpression(functionName, parameters, body) {
    assert(body, t.isBlockStatement, "a block");
    const name = functionName !== null ? t.identifier(functionName) : null;
    return t.functionExpression(name, parameters.map((param) => t.identifier(param)), body);
  }
  createIdentifier = t.identifier;
  createIfStatement = t.ifStatement;
  createDynamicImport(url) {
    return this.createCallExpression(
      t.import(),
      [typeof url === "string" ? t.stringLiteral(url) : url],
      false
      /* pure */
    );
  }
  createLiteral(value) {
    if (typeof value === "string") {
      return t.stringLiteral(value);
    } else if (typeof value === "number") {
      return t.numericLiteral(value);
    } else if (typeof value === "boolean") {
      return t.booleanLiteral(value);
    } else if (value === void 0) {
      return t.identifier("undefined");
    } else if (value === null) {
      return t.nullLiteral();
    } else {
      throw new Error(`Invalid literal: ${value} (${typeof value})`);
    }
  }
  createNewExpression = t.newExpression;
  createObjectLiteral(properties) {
    return t.objectExpression(properties.map((prop) => {
      const key = prop.quoted ? t.stringLiteral(prop.propertyName) : t.identifier(prop.propertyName);
      return t.objectProperty(key, prop.value);
    }));
  }
  createParenthesizedExpression = t.parenthesizedExpression;
  createPropertyAccess(expression, propertyName) {
    return t.memberExpression(
      expression,
      t.identifier(propertyName),
      /* computed */
      false
    );
  }
  createReturnStatement = t.returnStatement;
  createTaggedTemplate(tag, template) {
    return t.taggedTemplateExpression(tag, this.createTemplateLiteral(template));
  }
  createTemplateLiteral(template) {
    const elements = template.elements.map((element, i) => this.setSourceMapRange(t.templateElement(element, i === template.elements.length - 1), element.range));
    return t.templateLiteral(elements, template.expressions);
  }
  createThrowStatement = t.throwStatement;
  createTypeOfExpression(expression) {
    return t.unaryExpression("typeof", expression);
  }
  createVoidExpression(expression) {
    return t.unaryExpression("void", expression);
  }
  createUnaryExpression = t.unaryExpression;
  createVariableDeclaration(variableName, initializer, type) {
    return t.variableDeclaration(type, [
      t.variableDeclarator(t.identifier(variableName), initializer)
    ]);
  }
  setSourceMapRange(node, sourceMapRange) {
    if (sourceMapRange === null) {
      return node;
    }
    node.loc = {
      // Add in the filename so that we can map to external template files.
      // Note that Babel gets confused if you specify a filename when it is the original source
      // file. This happens when the template is inline, in which case just use `undefined`.
      filename: sourceMapRange.url !== this.sourceUrl ? sourceMapRange.url : void 0,
      start: {
        line: sourceMapRange.start.line + 1,
        // lines are 1-based in Babel.
        column: sourceMapRange.start.column
      },
      end: {
        line: sourceMapRange.end.line + 1,
        // lines are 1-based in Babel.
        column: sourceMapRange.end.column
      }
    };
    node.start = sourceMapRange.start.offset;
    node.end = sourceMapRange.end.offset;
    return node;
  }
};
function isLExpression(expr) {
  return t.isLVal(expr);
}

// packages/compiler-cli/linker/babel/src/ast/babel_ast_host.js
import { types as t2 } from "@babel/core";
var BabelAstHost = class {
  getSymbolName(node) {
    if (t2.isIdentifier(node)) {
      return node.name;
    } else if (t2.isMemberExpression(node) && t2.isIdentifier(node.property)) {
      return node.property.name;
    } else {
      return null;
    }
  }
  isStringLiteral = t2.isStringLiteral;
  parseStringLiteral(str) {
    assert(str, t2.isStringLiteral, "a string literal");
    return str.value;
  }
  isNumericLiteral = t2.isNumericLiteral;
  parseNumericLiteral(num) {
    assert(num, t2.isNumericLiteral, "a numeric literal");
    return num.value;
  }
  isBooleanLiteral(bool) {
    return t2.isBooleanLiteral(bool) || isMinifiedBooleanLiteral(bool);
  }
  parseBooleanLiteral(bool) {
    if (t2.isBooleanLiteral(bool)) {
      return bool.value;
    } else if (isMinifiedBooleanLiteral(bool)) {
      return !bool.argument.value;
    } else {
      throw new FatalLinkerError(bool, "Unsupported syntax, expected a boolean literal.");
    }
  }
  isNull(node) {
    return t2.isNullLiteral(node);
  }
  isArrayLiteral = t2.isArrayExpression;
  parseArrayLiteral(array) {
    assert(array, t2.isArrayExpression, "an array literal");
    return array.elements.map((element) => {
      assert(element, isNotEmptyElement, "element in array not to be empty");
      assert(element, isNotSpreadElement, "element in array not to use spread syntax");
      return element;
    });
  }
  isObjectLiteral = t2.isObjectExpression;
  parseObjectLiteral(obj) {
    assert(obj, t2.isObjectExpression, "an object literal");
    const result = /* @__PURE__ */ new Map();
    for (const property of obj.properties) {
      assert(property, t2.isObjectProperty, "a property assignment");
      assert(property.value, t2.isExpression, "an expression");
      assert(property.key, isObjectExpressionPropertyName, "a property name");
      const key = t2.isIdentifier(property.key) ? property.key.name : property.key.value;
      result.set(`${key}`, property.value);
    }
    return result;
  }
  isFunctionExpression(node) {
    return t2.isFunction(node) || t2.isArrowFunctionExpression(node);
  }
  parseReturnValue(fn) {
    assert(fn, this.isFunctionExpression, "a function");
    if (!t2.isBlockStatement(fn.body)) {
      return fn.body;
    }
    if (fn.body.body.length !== 1) {
      throw new FatalLinkerError(fn.body, "Unsupported syntax, expected a function body with a single return statement.");
    }
    const stmt = fn.body.body[0];
    assert(stmt, t2.isReturnStatement, "a function body with a single return statement");
    if (stmt.argument === null || stmt.argument === void 0) {
      throw new FatalLinkerError(stmt, "Unsupported syntax, expected function to return a value.");
    }
    return stmt.argument;
  }
  parseParameters(fn) {
    assert(fn, this.isFunctionExpression, "a function");
    return fn.params.map((param) => {
      assert(param, t2.isIdentifier, "an identifier");
      return param;
    });
  }
  isCallExpression = t2.isCallExpression;
  parseCallee(call) {
    assert(call, t2.isCallExpression, "a call expression");
    assert(call.callee, t2.isExpression, "an expression");
    return call.callee;
  }
  parseArguments(call) {
    assert(call, t2.isCallExpression, "a call expression");
    return call.arguments.map((arg) => {
      assert(arg, isNotSpreadArgument, "argument not to use spread syntax");
      assert(arg, t2.isExpression, "argument to be an expression");
      return arg;
    });
  }
  getRange(node) {
    if (node.loc == null || node.start == null || node.end == null) {
      throw new FatalLinkerError(node, "Unable to read range for node - it is missing location information.");
    }
    return {
      startLine: node.loc.start.line - 1,
      // Babel lines are 1-based
      startCol: node.loc.start.column,
      startPos: node.start,
      endPos: node.end
    };
  }
};
function isNotEmptyElement(e) {
  return e !== null;
}
function isNotSpreadElement(e) {
  return !t2.isSpreadElement(e);
}
function isObjectExpressionPropertyName(n) {
  return t2.isIdentifier(n) || t2.isStringLiteral(n) || t2.isNumericLiteral(n);
}
function isNotSpreadArgument(arg) {
  return !t2.isSpreadElement(arg);
}
function isMinifiedBooleanLiteral(node) {
  return t2.isUnaryExpression(node) && node.prefix && node.operator === "!" && t2.isNumericLiteral(node.argument) && (node.argument.value === 0 || node.argument.value === 1);
}

// packages/compiler-cli/linker/babel/src/babel_declaration_scope.js
import { types as t3 } from "@babel/core";
var BabelDeclarationScope = class {
  declarationScope;
  /**
   * Construct a new `BabelDeclarationScope`.
   *
   * @param declarationScope the Babel scope containing the declaration call expression.
   */
  constructor(declarationScope) {
    this.declarationScope = declarationScope;
  }
  /**
   * Compute the Babel `NodePath` that can be used to reference the lexical scope where any
   * shared constant statements would be inserted.
   *
   * There will only be a shared constant scope if the expression is in an ECMAScript module, or a
   * UMD module. Otherwise `null` is returned to indicate that constant statements must be emitted
   * locally to the generated linked definition, to avoid polluting the global scope.
   *
   * @param expression the expression that points to the Angular core framework import.
   */
  getConstantScopeRef(expression) {
    let bindingExpression = expression;
    while (t3.isMemberExpression(bindingExpression)) {
      bindingExpression = bindingExpression.object;
    }
    if (!t3.isIdentifier(bindingExpression)) {
      return null;
    }
    const binding = this.declarationScope.getBinding(bindingExpression.name);
    if (binding === void 0) {
      return null;
    }
    const path = binding.scope.path;
    if (!path.isFunctionDeclaration() && !path.isFunctionExpression() && !(path.isProgram() && path.node.sourceType === "module")) {
      return null;
    }
    return path;
  }
};

// packages/compiler-cli/linker/babel/src/es2015_linker_plugin.js
function createEs2015LinkerPlugin({ fileSystem, logger, ...options }) {
  let fileLinker = null;
  return {
    visitor: {
      Program: {
        /**
         * Create a new `FileLinker` as we enter each file (`t.Program` in Babel).
         */
        enter(_, state) {
          assertNull(fileLinker);
          const file = state.file;
          const filename = file.opts.filename ?? file.opts.filenameRelative;
          if (!filename) {
            throw new Error("No filename (nor filenameRelative) provided by Babel. This is required for the linking of partially compiled directives and components.");
          }
          const sourceUrl = fileSystem.resolve(file.opts.cwd ?? ".", filename);
          const linkerEnvironment = LinkerEnvironment.create(fileSystem, logger, new BabelAstHost(), new BabelAstFactory(sourceUrl), options);
          fileLinker = new FileLinker(linkerEnvironment, sourceUrl, file.code);
        },
        /**
         * On exiting the file, insert any shared constant statements that were generated during
         * linking of the partial declarations.
         */
        exit() {
          assertNotNull(fileLinker);
          for (const { constantScope, statements } of fileLinker.getConstantStatements()) {
            insertStatements(constantScope, statements);
          }
          fileLinker = null;
        }
      },
      /**
       * Test each call expression to see if it is a partial declaration; it if is then replace it
       * with the results of linking the declaration.
       */
      CallExpression(call, state) {
        if (fileLinker === null) {
          return;
        }
        try {
          const calleeName = getCalleeName(call);
          if (calleeName === null) {
            return;
          }
          const args = call.node.arguments;
          if (!fileLinker.isPartialDeclaration(calleeName) || !isExpressionArray(args)) {
            return;
          }
          const declarationScope = new BabelDeclarationScope(call.scope);
          const replacement = fileLinker.linkPartialDeclaration(calleeName, args, declarationScope);
          call.replaceWith(replacement);
        } catch (e) {
          const node = isFatalLinkerError(e) ? e.node : call.node;
          throw buildCodeFrameError(state.file, e.message, node);
        }
      }
    }
  };
}
function insertStatements(path, statements) {
  if (path.isProgram()) {
    insertIntoProgram(path, statements);
  } else {
    insertIntoFunction(path, statements);
  }
}
function insertIntoFunction(fn, statements) {
  const body = fn.get("body");
  body.unshiftContainer("body", statements);
}
function insertIntoProgram(program, statements) {
  const body = program.get("body");
  const insertBeforeIndex = body.findIndex((statement) => !statement.isImportDeclaration());
  if (insertBeforeIndex === -1) {
    program.unshiftContainer("body", statements);
  } else {
    body[insertBeforeIndex].insertBefore(statements);
  }
}
function getCalleeName(call) {
  const callee = call.node.callee;
  if (t4.isIdentifier(callee)) {
    return callee.name;
  } else if (t4.isMemberExpression(callee) && t4.isIdentifier(callee.property)) {
    return callee.property.name;
  } else if (t4.isMemberExpression(callee) && t4.isStringLiteral(callee.property)) {
    return callee.property.value;
  } else {
    return null;
  }
}
function isExpressionArray(nodes) {
  return nodes.every((node) => t4.isExpression(node));
}
function assertNull(obj) {
  if (obj !== null) {
    throw new Error("BUG - expected `obj` to be null");
  }
}
function assertNotNull(obj) {
  if (obj === null) {
    throw new Error("BUG - expected `obj` not to be null");
  }
}
function buildCodeFrameError(file, message, node) {
  const filename = file.opts.filename || "(unknown file)";
  const error = file.hub.buildError(node, message);
  return `${filename}: ${error.message}`;
}

// packages/compiler-cli/linker/babel/src/babel_plugin.js
function defaultLinkerPlugin(api, options) {
  api.assertVersion(7);
  return createEs2015LinkerPlugin({
    ...options,
    fileSystem: new NodeJSFileSystem(),
    logger: new ConsoleLogger(LogLevel.info)
  });
}

// packages/compiler-cli/linker/babel/index.ts
var babel_default = defaultLinkerPlugin;
export {
  createEs2015LinkerPlugin,
  babel_default as default
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
