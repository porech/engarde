"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = empty;
exports.branch = branch;
exports.merge = merge;
exports.partition = partition;
const exception_1 = require("../exception/exception");
const host_tree_1 = require("./host-tree");
const interface_1 = require("./interface");
function empty() {
    return new host_tree_1.HostTree();
}
function branch(tree) {
    return tree.branch();
}
function merge(tree, other, strategy = interface_1.MergeStrategy.Default) {
    tree.merge(other, strategy);
    return tree;
}
function partition(tree, predicate) {
    if (tree instanceof host_tree_1.HostTree) {
        return [
            new host_tree_1.FilterHostTree(tree, predicate),
            new host_tree_1.FilterHostTree(tree, (path, entry) => !predicate(path, entry)),
        ];
    }
    else {
        throw new exception_1.SchematicsException('Tree type is not supported.');
    }
}
