'use strict';
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
        factory();
})((function () {
    'use strict';
    /**
     * @fileoverview
     * @suppress {missingRequire}
     */
    function patchFetch(Zone) {
        Zone.__load_patch('fetch', function (global, Zone, api) {
            var fetch = global['fetch'];
            if (typeof fetch !== 'function') {
                return;
            }
            var originalFetch = global[api.symbol('fetch')];
            if (originalFetch) {
                // restore unpatched fetch first
                fetch = originalFetch;
            }
            var ZoneAwarePromise = global.Promise;
            var symbolThenPatched = api.symbol('thenPatched');
            var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
            var OriginalResponse = global.Response;
            var placeholder = function () { };
            var createFetchTask = function (source, data, originalImpl, self, args, ac) { return new Promise(function (resolve, reject) {
                var task = Zone.current.scheduleMacroTask(source, placeholder, data, function () {
                    // The promise object returned by the original implementation passed into the
                    // function. This might be a `fetch` promise, `Response.prototype.json` promise,
                    // etc.
                    var implPromise;
                    var zone = Zone.current;
                    try {
                        zone[fetchTaskScheduling] = true;
                        implPromise = originalImpl.apply(self, args);
                    }
                    catch (error) {
                        reject(error);
                        return;
                    }
                    finally {
                        zone[fetchTaskScheduling] = false;
                    }
                    if (!(implPromise instanceof ZoneAwarePromise)) {
                        var ctor = implPromise.constructor;
                        if (!ctor[symbolThenPatched]) {
                            api.patchThen(ctor);
                        }
                    }
                    implPromise.then(function (resource) {
                        if (task.state !== 'notScheduled') {
                            task.invoke();
                        }
                        resolve(resource);
                    }, function (error) {
                        if (task.state !== 'notScheduled') {
                            task.invoke();
                        }
                        reject(error);
                    });
                }, function () {
                    ac === null || ac === void 0 ? void 0 : ac.abort();
                });
            }); };
            global['fetch'] = function () {
                var args = Array.prototype.slice.call(arguments);
                var options = args.length > 1 ? args[1] : {};
                var signal = options === null || options === void 0 ? void 0 : options.signal;
                var ac = new AbortController();
                var fetchSignal = ac.signal;
                options.signal = fetchSignal;
                args[1] = options;
                var onAbort;
                if (signal) {
                    var nativeAddEventListener = signal[Zone.__symbol__('addEventListener')] ||
                        signal.addEventListener;
                    onAbort = function () { return ac.abort(); };
                    nativeAddEventListener.call(signal, 'abort', onAbort, { once: true });
                }
                return createFetchTask('fetch', { fetchArgs: args }, fetch, this, args, ac).finally(function () {
                    // We need to be good citizens and remove the `abort` listener once
                    // the fetch is settled. The `abort` listener may not be called at all,
                    // which means the event listener closure would retain a reference to
                    // the `ac` object even if it goes out of scope. Since browser's garbage
                    // collectors work differently, some may not be smart enough to collect a signal.
                    signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', onAbort);
                });
            };
            if (OriginalResponse === null || OriginalResponse === void 0 ? void 0 : OriginalResponse.prototype) {
                // https://fetch.spec.whatwg.org/#body-mixin
                ['arrayBuffer', 'blob', 'formData', 'json', 'text']
                    // Safely check whether the method exists on the `Response` prototype before patching.
                    .filter(function (method) { return typeof OriginalResponse.prototype[method] === 'function'; })
                    .forEach(function (method) {
                    api.patchMethod(OriginalResponse.prototype, method, function (delegate) { return function (self, args) { return createFetchTask("Response.".concat(method), undefined, delegate, self, args, undefined); }; });
                });
            }
        });
    }
    patchFetch(Zone);
}));
