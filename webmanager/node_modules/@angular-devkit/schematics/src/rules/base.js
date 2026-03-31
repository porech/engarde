"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.source = source;
exports.empty = empty;
exports.chain = chain;
exports.apply = apply;
exports.mergeWith = mergeWith;
exports.noop = noop;
exports.filter = filter;
exports.asSource = asSource;
exports.branchAndMerge = branchAndMerge;
exports.when = when;
exports.partitionApplyMerge = partitionApplyMerge;
exports.forEach = forEach;
exports.composeFileOperators = composeFileOperators;
exports.applyToSubtree = applyToSubtree;
const rxjs_1 = require("rxjs");
const exception_1 = require("../exception/exception");
const host_tree_1 = require("../tree/host-tree");
const interface_1 = require("../tree/interface");
const scoped_1 = require("../tree/scoped");
const static_1 = require("../tree/static");
const call_1 = require("./call");
/**
 * A Source that returns an tree as its single value.
 */
function source(tree) {
    return () => tree;
}
/**
 * A source that returns an empty tree.
 */
function empty() {
    return () => (0, static_1.empty)();
}
/**
 * Chain multiple rules into a single rule.
 */
function chain(rules) {
    return async (initialTree, context) => {
        let intermediateTree;
        if (Symbol.asyncIterator in rules) {
            for await (const rule of rules) {
                intermediateTree = (0, call_1.callRule)(rule, intermediateTree ?? initialTree, context);
            }
        }
        else {
            for (const rule of rules) {
                intermediateTree = (0, call_1.callRule)(rule, intermediateTree ?? initialTree, context);
            }
        }
        return () => intermediateTree;
    };
}
/**
 * Apply multiple rules to a source, and returns the source transformed.
 */
function apply(source, rules) {
    return (context) => (0, call_1.callRule)(chain(rules), (0, call_1.callSource)(source, context), context);
}
/**
 * Merge an input tree with the source passed in.
 */
function mergeWith(source, strategy = interface_1.MergeStrategy.Default) {
    return (tree, context) => {
        return (0, call_1.callSource)(source, context).pipe((0, rxjs_1.map)((sourceTree) => tree.merge(sourceTree, strategy || context.strategy)), (0, rxjs_1.mapTo)(tree));
    };
}
function noop() {
    return () => { };
}
function filter(predicate) {
    return (tree) => {
        if (host_tree_1.HostTree.isHostTree(tree)) {
            return new host_tree_1.FilterHostTree(tree, predicate);
        }
        else {
            throw new exception_1.SchematicsException('Tree type is not supported.');
        }
    };
}
function asSource(rule) {
    return (context) => (0, call_1.callRule)(rule, (0, static_1.empty)(), context);
}
function branchAndMerge(rule, strategy = interface_1.MergeStrategy.Default) {
    return (tree, context) => {
        return (0, call_1.callRule)(rule, tree.branch(), context).pipe((0, rxjs_1.map)((branch) => tree.merge(branch, strategy || context.strategy)), (0, rxjs_1.mapTo)(tree));
    };
}
function when(predicate, operator) {
    return (entry) => {
        if (predicate(entry.path, entry)) {
            return operator(entry);
        }
        else {
            return entry;
        }
    };
}
function partitionApplyMerge(predicate, ruleYes, ruleNo) {
    return (tree, context) => {
        const [yes, no] = (0, static_1.partition)(tree, predicate);
        return (0, rxjs_1.concat)((0, call_1.callRule)(ruleYes, yes, context), (0, call_1.callRule)(ruleNo || noop(), no, context)).pipe((0, rxjs_1.toArray)(), (0, rxjs_1.map)(([yesTree, noTree]) => {
            yesTree.merge(noTree, context.strategy);
            return yesTree;
        }));
    };
}
function forEach(operator) {
    return (tree) => {
        tree.visit((path, entry) => {
            if (!entry) {
                return;
            }
            const newEntry = operator(entry);
            if (newEntry === entry) {
                return;
            }
            if (newEntry === null) {
                tree.delete(path);
                return;
            }
            if (newEntry.path != path) {
                tree.rename(path, newEntry.path);
            }
            if (!newEntry.content.equals(entry.content)) {
                tree.overwrite(newEntry.path, newEntry.content);
            }
        });
    };
}
function composeFileOperators(operators) {
    return (entry) => {
        let current = entry;
        for (const op of operators) {
            current = op(current);
            if (current === null) {
                // Deleted, just return.
                return null;
            }
        }
        return current;
    };
}
function applyToSubtree(path, rules) {
    return (tree, context) => {
        const scoped = new scoped_1.ScopedTree(tree, path);
        return (0, call_1.callRule)(chain(rules), scoped, context).pipe((0, rxjs_1.map)((result) => {
            if (result === scoped) {
                return tree;
            }
            else {
                throw new exception_1.SchematicsException('Original tree must be returned from all rules when using "applyToSubtree".');
            }
        }));
    };
}
