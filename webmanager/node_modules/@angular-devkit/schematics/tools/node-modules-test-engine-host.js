"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModulesTestEngineHost = void 0;
const node_module_engine_host_1 = require("./node-module-engine-host");
/**
 * An EngineHost that uses a registry to super seed locations of collection.json files, but
 * revert back to using node modules resolution. This is done for testing.
 */
class NodeModulesTestEngineHost extends node_module_engine_host_1.NodeModulesEngineHost {
    #collections = new Map();
    #tasks = [];
    get tasks() {
        return this.#tasks;
    }
    clearTasks() {
        this.#tasks = [];
    }
    registerCollection(name, path) {
        this.#collections.set(name, path);
    }
    transformContext(context) {
        const oldAddTask = context.addTask.bind(context);
        context.addTask = (task, dependencies) => {
            this.#tasks.push(task.toConfiguration());
            return oldAddTask(task, dependencies);
        };
        return context;
    }
    _resolveCollectionPath(name, requester) {
        return this.#collections.get(name) ?? super._resolveCollectionPath(name, requester);
    }
}
exports.NodeModulesTestEngineHost = NodeModulesTestEngineHost;
