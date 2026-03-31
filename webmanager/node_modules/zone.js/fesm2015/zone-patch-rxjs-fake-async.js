'use strict';
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */
class ProxyZoneSpec {
    defaultSpecDelegate;
    name = 'ProxyZone';
    _delegateSpec = null;
    properties = { 'ProxyZoneSpec': this };
    propertyKeys = null;
    lastTaskState = null;
    isNeedToTriggerHasTask = false;
    tasks = [];
    static get() {
        return Zone.current.get('ProxyZoneSpec');
    }
    static isLoaded() {
        return ProxyZoneSpec.get() instanceof ProxyZoneSpec;
    }
    static assertPresent() {
        const spec = ProxyZoneSpec.get();
        if (spec === undefined) {
            throw new Error(`Expected to be running in 'ProxyZone', but it was not found.`);
        }
        return spec;
    }
    constructor(defaultSpecDelegate = null) {
        this.defaultSpecDelegate = defaultSpecDelegate;
        this.setDelegate(defaultSpecDelegate);
    }
    setDelegate(delegateSpec) {
        const isNewDelegate = this._delegateSpec !== delegateSpec;
        this._delegateSpec = delegateSpec;
        this.propertyKeys && this.propertyKeys.forEach((key) => delete this.properties[key]);
        this.propertyKeys = null;
        if (delegateSpec && delegateSpec.properties) {
            this.propertyKeys = Object.keys(delegateSpec.properties);
            this.propertyKeys.forEach((k) => (this.properties[k] = delegateSpec.properties[k]));
        }
        // if a new delegateSpec was set, check if we need to trigger hasTask
        if (isNewDelegate &&
            this.lastTaskState &&
            (this.lastTaskState.macroTask || this.lastTaskState.microTask)) {
            this.isNeedToTriggerHasTask = true;
        }
    }
    getDelegate() {
        return this._delegateSpec;
    }
    resetDelegate() {
        this.getDelegate();
        this.setDelegate(this.defaultSpecDelegate);
    }
    tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone) {
        if (this.isNeedToTriggerHasTask && this.lastTaskState) {
            // last delegateSpec has microTask or macroTask
            // should call onHasTask in current delegateSpec
            this.isNeedToTriggerHasTask = false;
            this.onHasTask(parentZoneDelegate, currentZone, targetZone, this.lastTaskState);
        }
    }
    removeFromTasks(task) {
        if (!this.tasks) {
            return;
        }
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i] === task) {
                this.tasks.splice(i, 1);
                return;
            }
        }
    }
    getAndClearPendingTasksInfo() {
        if (this.tasks.length === 0) {
            return '';
        }
        const taskInfo = this.tasks.map((task) => {
            const dataInfo = task.data &&
                Object.keys(task.data)
                    .map((key) => {
                    return key + ':' + task.data[key];
                })
                    .join(',');
            return `type: ${task.type}, source: ${task.source}, args: {${dataInfo}}`;
        });
        const pendingTasksInfo = '--Pending async tasks are: [' + taskInfo + ']';
        // clear tasks
        this.tasks = [];
        return pendingTasksInfo;
    }
    onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec) {
        if (this._delegateSpec && this._delegateSpec.onFork) {
            return this._delegateSpec.onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec);
        }
        else {
            return parentZoneDelegate.fork(targetZone, zoneSpec);
        }
    }
    onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source) {
        if (this._delegateSpec && this._delegateSpec.onIntercept) {
            return this._delegateSpec.onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source);
        }
        else {
            return parentZoneDelegate.intercept(targetZone, delegate, source);
        }
    }
    onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onInvoke) {
            return this._delegateSpec.onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source);
        }
        else {
            return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        }
    }
    onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
        if (this._delegateSpec && this._delegateSpec.onHandleError) {
            return this._delegateSpec.onHandleError(parentZoneDelegate, currentZone, targetZone, error);
        }
        else {
            return parentZoneDelegate.handleError(targetZone, error);
        }
    }
    onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
        if (task.type !== 'eventTask') {
            this.tasks.push(task);
        }
        if (this._delegateSpec && this._delegateSpec.onScheduleTask) {
            return this._delegateSpec.onScheduleTask(parentZoneDelegate, currentZone, targetZone, task);
        }
        else {
            return parentZoneDelegate.scheduleTask(targetZone, task);
        }
    }
    onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (task.type !== 'eventTask') {
            this.removeFromTasks(task);
        }
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onInvokeTask) {
            return this._delegateSpec.onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs);
        }
        else {
            return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        }
    }
    onCancelTask(parentZoneDelegate, currentZone, targetZone, task) {
        if (task.type !== 'eventTask') {
            this.removeFromTasks(task);
        }
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onCancelTask) {
            return this._delegateSpec.onCancelTask(parentZoneDelegate, currentZone, targetZone, task);
        }
        else {
            return parentZoneDelegate.cancelTask(targetZone, task);
        }
    }
    onHasTask(delegate, current, target, hasTaskState) {
        this.lastTaskState = hasTaskState;
        if (this._delegateSpec && this._delegateSpec.onHasTask) {
            this._delegateSpec.onHasTask(delegate, current, target, hasTaskState);
        }
        else {
            delegate.hasTask(target, hasTaskState);
        }
    }
}
function patchProxyZoneSpec(Zone) {
    // Export the class so that new instances can be created with proper
    // constructor params.
    Zone['ProxyZoneSpec'] = ProxyZoneSpec;
}

patchProxyZoneSpec(Zone);
