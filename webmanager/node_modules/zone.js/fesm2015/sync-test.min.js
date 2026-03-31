"use strict";
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */function patchSyncTest(e){e.SyncTestZoneSpec=class{runZone=e.current;constructor(e){this.name="syncTestZone for "+e}name;onScheduleTask(e,s,c,n){switch(n.type){case"microTask":case"macroTask":throw new Error(`Cannot call ${n.source} from within a sync test (${this.name}).`);case"eventTask":n=e.scheduleTask(c,n)}return n}}}patchSyncTest(Zone);