"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCustomMetric = exports.EventCustomDimension = exports.UserCustomDimension = exports.RequestParameter = void 0;
/**
 * GA built-in request parameters
 * @see https://www.thyngster.com/ga4-measurement-protocol-cheatsheet
 * @see http://go/depot/google3/analytics/container_tag/templates/common/gold/mpv2_schema.js
 */
var RequestParameter;
(function (RequestParameter) {
    RequestParameter["ClientId"] = "cid";
    RequestParameter["DebugView"] = "_dbg";
    RequestParameter["GtmVersion"] = "gtm";
    RequestParameter["Language"] = "ul";
    RequestParameter["NewToSite"] = "_nsi";
    RequestParameter["NonInteraction"] = "ni";
    RequestParameter["PageLocation"] = "dl";
    RequestParameter["PageTitle"] = "dt";
    RequestParameter["ProtocolVersion"] = "v";
    RequestParameter["SessionEngaged"] = "seg";
    RequestParameter["SessionId"] = "sid";
    RequestParameter["SessionNumber"] = "sct";
    RequestParameter["SessionStart"] = "_ss";
    RequestParameter["TrackingId"] = "tid";
    RequestParameter["TrafficType"] = "tt";
    RequestParameter["UserAgentArchitecture"] = "uaa";
    RequestParameter["UserAgentBitness"] = "uab";
    RequestParameter["UserAgentFullVersionList"] = "uafvl";
    RequestParameter["UserAgentMobile"] = "uamb";
    RequestParameter["UserAgentModel"] = "uam";
    RequestParameter["UserAgentPlatform"] = "uap";
    RequestParameter["UserAgentPlatformVersion"] = "uapv";
    RequestParameter["UserId"] = "uid";
})(RequestParameter || (exports.RequestParameter = RequestParameter = {}));
/**
 * User scoped custom dimensions.
 * @remarks
 * - User custom dimensions limit is 25.
 * - `up.*` string type.
 * - `upn.*` number type.
 * @see https://support.google.com/analytics/answer/10075209?hl=en
 */
var UserCustomDimension;
(function (UserCustomDimension) {
    UserCustomDimension["UserId"] = "up.ng_user_id";
    UserCustomDimension["OsArchitecture"] = "up.ng_os_architecture";
    UserCustomDimension["NodeVersion"] = "up.ng_node_version";
    UserCustomDimension["NodeMajorVersion"] = "upn.ng_node_major_version";
    UserCustomDimension["AngularCLIVersion"] = "up.ng_cli_version";
    UserCustomDimension["AngularCLIMajorVersion"] = "upn.ng_cli_major_version";
    UserCustomDimension["PackageManager"] = "up.ng_package_manager";
    UserCustomDimension["PackageManagerVersion"] = "up.ng_pkg_manager_version";
    UserCustomDimension["PackageManagerMajorVersion"] = "upn.ng_pkg_manager_major_v";
})(UserCustomDimension || (exports.UserCustomDimension = UserCustomDimension = {}));
/**
 * Event scoped custom dimensions.
 * @remarks
 * - Event custom dimensions limit is 50.
 * - `ep.*` string type.
 * - `epn.*` number type.
 * @see https://support.google.com/analytics/answer/10075209?hl=en
 */
var EventCustomDimension;
(function (EventCustomDimension) {
    EventCustomDimension["Command"] = "ep.ng_command";
    EventCustomDimension["SchematicCollectionName"] = "ep.ng_schematic_collection_name";
    EventCustomDimension["SchematicName"] = "ep.ng_schematic_name";
    EventCustomDimension["Standalone"] = "ep.ng_standalone";
    EventCustomDimension["SSR"] = "ep.ng_ssr";
    EventCustomDimension["Style"] = "ep.ng_style";
    EventCustomDimension["Routing"] = "ep.ng_routing";
    EventCustomDimension["InlineTemplate"] = "ep.ng_inline_template";
    EventCustomDimension["InlineStyle"] = "ep.ng_inline_style";
    EventCustomDimension["BuilderTarget"] = "ep.ng_builder_target";
    EventCustomDimension["Aot"] = "ep.ng_aot";
    EventCustomDimension["Optimization"] = "ep.ng_optimization";
})(EventCustomDimension || (exports.EventCustomDimension = EventCustomDimension = {}));
/**
 * Event scoped custom mertics.
 * @remarks
 * - Event scoped custom mertics limit is 50.
 * - `ep.*` string type.
 * - `epn.*` number type.
 * @see https://support.google.com/analytics/answer/10075209?hl=en
 */
var EventCustomMetric;
(function (EventCustomMetric) {
    EventCustomMetric["AllChunksCount"] = "epn.ng_all_chunks_count";
    EventCustomMetric["LazyChunksCount"] = "epn.ng_lazy_chunks_count";
    EventCustomMetric["InitialChunksCount"] = "epn.ng_initial_chunks_count";
    EventCustomMetric["ChangedChunksCount"] = "epn.ng_changed_chunks_count";
    EventCustomMetric["DurationInMs"] = "epn.ng_duration_ms";
    EventCustomMetric["CssSizeInBytes"] = "epn.ng_css_size_bytes";
    EventCustomMetric["JsSizeInBytes"] = "epn.ng_js_size_bytes";
    EventCustomMetric["NgComponentCount"] = "epn.ng_component_count";
    EventCustomMetric["AllProjectsCount"] = "epn.all_projects_count";
    EventCustomMetric["LibraryProjectsCount"] = "epn.libs_projects_count";
    EventCustomMetric["ApplicationProjectsCount"] = "epn.apps_projects_count";
})(EventCustomMetric || (exports.EventCustomMetric = EventCustomMetric = {}));
