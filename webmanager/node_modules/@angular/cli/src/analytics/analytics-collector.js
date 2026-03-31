"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsCollector = void 0;
const node_crypto_1 = require("node:crypto");
const https = __importStar(require("node:https"));
const os = __importStar(require("node:os"));
const querystring = __importStar(require("node:querystring"));
const semver = __importStar(require("semver"));
const environment_options_1 = require("../utilities/environment-options");
const error_1 = require("../utilities/error");
const version_1 = require("../utilities/version");
const analytics_parameters_1 = require("./analytics-parameters");
const TRACKING_ID_PROD = 'G-VETNJBW8L4';
const TRACKING_ID_STAGING = 'G-TBMPRL1BTM';
class AnalyticsCollector {
    context;
    trackingEventsQueue;
    requestParameterStringified;
    userParameters;
    constructor(context, userId) {
        this.context = context;
        const requestParameters = {
            [analytics_parameters_1.RequestParameter.ProtocolVersion]: 2,
            [analytics_parameters_1.RequestParameter.ClientId]: userId,
            [analytics_parameters_1.RequestParameter.UserId]: userId,
            [analytics_parameters_1.RequestParameter.TrackingId]: /^\d+\.\d+\.\d+$/.test(version_1.VERSION.full) && version_1.VERSION.full !== '0.0.0'
                ? TRACKING_ID_PROD
                : TRACKING_ID_STAGING,
            // Built-in user properties
            [analytics_parameters_1.RequestParameter.SessionId]: (0, node_crypto_1.randomUUID)(),
            [analytics_parameters_1.RequestParameter.UserAgentArchitecture]: os.arch(),
            [analytics_parameters_1.RequestParameter.UserAgentPlatform]: os.platform(),
            [analytics_parameters_1.RequestParameter.UserAgentPlatformVersion]: os.release(),
            [analytics_parameters_1.RequestParameter.UserAgentMobile]: 0,
            [analytics_parameters_1.RequestParameter.SessionEngaged]: 1,
            // The below is needed for tech details to be collected.
            [analytics_parameters_1.RequestParameter.UserAgentFullVersionList]: 'Google%20Chrome;111.0.5563.64|Not(A%3ABrand;8.0.0.0|Chromium;111.0.5563.64',
        };
        if (environment_options_1.ngDebug) {
            requestParameters[analytics_parameters_1.RequestParameter.DebugView] = 1;
        }
        this.requestParameterStringified = querystring.stringify(requestParameters);
        const parsedVersion = semver.parse(process.version);
        const packageManagerVersion = context.packageManager.version;
        this.userParameters = {
            // While architecture is being collect by GA as UserAgentArchitecture.
            // It doesn't look like there is a way to query this. Therefore we collect this as a custom user dimension too.
            [analytics_parameters_1.UserCustomDimension.OsArchitecture]: os.arch(),
            // While User ID is being collected by GA, this is not visible in reports/for filtering.
            [analytics_parameters_1.UserCustomDimension.UserId]: userId,
            [analytics_parameters_1.UserCustomDimension.NodeVersion]: parsedVersion
                ? `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`
                : 'other',
            [analytics_parameters_1.UserCustomDimension.NodeMajorVersion]: parsedVersion?.major,
            [analytics_parameters_1.UserCustomDimension.PackageManager]: context.packageManager.name,
            [analytics_parameters_1.UserCustomDimension.PackageManagerVersion]: packageManagerVersion,
            [analytics_parameters_1.UserCustomDimension.PackageManagerMajorVersion]: packageManagerVersion
                ? +packageManagerVersion.split('.', 1)[0]
                : undefined,
            [analytics_parameters_1.UserCustomDimension.AngularCLIVersion]: version_1.VERSION.full,
            [analytics_parameters_1.UserCustomDimension.AngularCLIMajorVersion]: version_1.VERSION.major,
        };
    }
    reportWorkspaceInfoEvent(parameters) {
        this.event('workspace_info', parameters);
    }
    reportRebuildRunEvent(parameters) {
        this.event('run_rebuild', parameters);
    }
    reportBuildRunEvent(parameters) {
        this.event('run_build', parameters);
    }
    reportArchitectRunEvent(parameters) {
        this.event('run_architect', parameters);
    }
    reportSchematicRunEvent(parameters) {
        this.event('run_schematic', parameters);
    }
    reportCommandRunEvent(command) {
        this.event('run_command', { [analytics_parameters_1.EventCustomDimension.Command]: command });
    }
    event(eventName, parameters) {
        this.trackingEventsQueue ??= [];
        this.trackingEventsQueue.push({
            ...this.userParameters,
            ...parameters,
            'en': eventName,
        });
    }
    /**
     * Flush on an interval (if the event loop is waiting).
     *
     * @returns a method that when called will terminate the periodic
     * flush and call flush one last time.
     */
    periodFlush() {
        let analyticsFlushPromise = Promise.resolve();
        const analyticsFlushInterval = setInterval(() => {
            if (this.trackingEventsQueue?.length) {
                analyticsFlushPromise = analyticsFlushPromise.then(() => this.flush());
            }
        }, 4000);
        return () => {
            clearInterval(analyticsFlushInterval);
            // Flush one last time.
            return analyticsFlushPromise.then(() => this.flush());
        };
    }
    async flush() {
        const pendingTrackingEvents = this.trackingEventsQueue;
        this.context.logger.debug(`Analytics flush size. ${pendingTrackingEvents?.length}.`);
        if (!pendingTrackingEvents?.length) {
            return;
        }
        // The below is needed so that if flush is called multiple times,
        // we don't report the same event multiple times.
        this.trackingEventsQueue = undefined;
        try {
            await this.send(pendingTrackingEvents);
        }
        catch (error) {
            // Failure to report analytics shouldn't crash the CLI.
            (0, error_1.assertIsError)(error);
            this.context.logger.debug(`Send analytics error. ${error.message}.`);
        }
    }
    async send(data) {
        return new Promise((resolve, reject) => {
            const request = https.request({
                host: 'www.google-analytics.com',
                method: 'POST',
                path: '/g/collect?' + this.requestParameterStringified,
                headers: {
                    // The below is needed for tech details to be collected even though we provide our own information from the OS Node.js module
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                },
            }, (response) => {
                // The below is needed as otherwise the response will never close which will cause the CLI not to terminate.
                response.on('data', () => { });
                if (response.statusCode !== 200 && response.statusCode !== 204) {
                    reject(new Error(`Analytics reporting failed with status code: ${response.statusCode}.`));
                }
                else {
                    resolve();
                }
            });
            request.on('error', reject);
            const queryParameters = data.map((p) => querystring.stringify(p)).join('\n');
            request.write(queryParameters);
            request.end();
        });
    }
}
exports.AnalyticsCollector = AnalyticsCollector;
