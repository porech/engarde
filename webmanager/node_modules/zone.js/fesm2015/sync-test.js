'use strict';
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */
function patchSyncTest(Zone) {
    class SyncTestZoneSpec {
        runZone = Zone.current;
        constructor(namePrefix) {
            this.name = 'syncTestZone for ' + namePrefix;
        }
        // ZoneSpec implementation below.
        name;
        onScheduleTask(delegate, current, target, task) {
            switch (task.type) {
                case 'microTask':
                case 'macroTask':
                    throw new Error(`Cannot call ${task.source} from within a sync test (${this.name}).`);
                case 'eventTask':
                    task = delegate.scheduleTask(target, task);
                    break;
            }
            return task;
        }
    }
    // Export the class so that new instances can be created with proper
    // constructor params.
    Zone['SyncTestZoneSpec'] = SyncTestZoneSpec;
}

patchSyncTest(Zone);
