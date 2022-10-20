import{createRequire}from'module';const require=createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/firebase-functions/lib/common/encoding.js
var require_encoding = __commonJS({
  "node_modules/firebase-functions/lib/common/encoding.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertInvoker = exports.serviceAccountFromShorthand = exports.convertIfPresent = exports.copyIfPresent = exports.durationFromSeconds = void 0;
    function durationFromSeconds(s) {
      return `${s}s`;
    }
    exports.durationFromSeconds = durationFromSeconds;
    function copyIfPresent(dest, src, ...fields) {
      if (!src) {
        return;
      }
      for (const field of fields) {
        if (!Object.prototype.hasOwnProperty.call(src, field)) {
          continue;
        }
        dest[field] = src[field];
      }
    }
    exports.copyIfPresent = copyIfPresent;
    function convertIfPresent(dest, src, destField, srcField, converter = (from) => {
      return from;
    }) {
      if (!src) {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(src, srcField)) {
        return;
      }
      dest[destField] = converter(src[srcField]);
    }
    exports.convertIfPresent = convertIfPresent;
    function serviceAccountFromShorthand(serviceAccount) {
      if (serviceAccount === "default") {
        return null;
      } else if (serviceAccount.endsWith("@")) {
        if (!process.env.GCLOUD_PROJECT) {
          throw new Error(`Unable to determine email for service account '${serviceAccount}' because process.env.GCLOUD_PROJECT is not set.`);
        }
        return `${serviceAccount}${process.env.GCLOUD_PROJECT}.iam.gserviceaccount.com`;
      } else if (serviceAccount.includes("@")) {
        return serviceAccount;
      } else {
        throw new Error(`Invalid option for serviceAccount: '${serviceAccount}'. Valid options are 'default', a service account email, or '{serviceAccountName}@'`);
      }
    }
    exports.serviceAccountFromShorthand = serviceAccountFromShorthand;
    function convertInvoker(invoker) {
      if (typeof invoker === "string") {
        invoker = [invoker];
      }
      if (invoker.length === 0) {
        throw new Error("Invalid option for invoker: Must be a non-empty array.");
      }
      if (invoker.find((inv) => inv.length === 0)) {
        throw new Error("Invalid option for invoker: Must be a non-empty string.");
      }
      if (invoker.length > 1 && invoker.find((inv) => inv === "public" || inv === "private")) {
        throw new Error("Invalid option for invoker: Cannot have 'public' or 'private' in an array of service accounts.");
      }
      return invoker;
    }
    exports.convertInvoker = convertInvoker;
  }
});

// node_modules/firebase-functions/lib/config.js
var require_config = __commonJS({
  "node_modules/firebase-functions/lib/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.firebaseConfig = exports.firebaseConfigCache = exports.config = void 0;
    var fs = __require("fs");
    var path = __require("path");
    function config() {
      if (process.env.K_CONFIGURATION) {
        throw new Error("functions.config() is no longer available in Cloud Functions for Firebase v2. Please see the latest documentation for information on how to transition to using environment variables");
      }
      if (typeof config.singleton === "undefined") {
        init();
      }
      return config.singleton;
    }
    exports.config = config;
    (function(config2) {
    })(config = exports.config || (exports.config = {}));
    exports.firebaseConfigCache = null;
    function firebaseConfig() {
      if (exports.firebaseConfigCache) {
        return exports.firebaseConfigCache;
      }
      let env = process.env.FIREBASE_CONFIG;
      if (env) {
        if (!env.startsWith("{")) {
          env = fs.readFileSync(path.join(process.env.PWD, env)).toString("utf8");
        }
        exports.firebaseConfigCache = JSON.parse(env);
        return exports.firebaseConfigCache;
      }
      try {
        const config2 = JSON.parse(process.env.CLOUD_RUNTIME_CONFIG);
        if (config2.firebase) {
          exports.firebaseConfigCache = config2.firebase;
          return exports.firebaseConfigCache;
        }
      } catch (e) {
      }
      try {
        const configPath = process.env.CLOUD_RUNTIME_CONFIG || path.join(process.cwd(), ".runtimeconfig.json");
        const contents = fs.readFileSync(configPath);
        const config2 = JSON.parse(contents.toString("utf8"));
        if (config2.firebase) {
          exports.firebaseConfigCache = config2.firebase;
          return exports.firebaseConfigCache;
        }
      } catch (e) {
      }
      return null;
    }
    exports.firebaseConfig = firebaseConfig;
    function init() {
      try {
        const parsed = JSON.parse(process.env.CLOUD_RUNTIME_CONFIG);
        delete parsed.firebase;
        config.singleton = parsed;
        return;
      } catch (e) {
      }
      try {
        const configPath = process.env.CLOUD_RUNTIME_CONFIG || path.join(process.cwd(), ".runtimeconfig.json");
        const contents = fs.readFileSync(configPath);
        const parsed = JSON.parse(contents.toString("utf8"));
        delete parsed.firebase;
        config.singleton = parsed;
        return;
      } catch (e) {
      }
      config.singleton = {};
    }
  }
});

// node_modules/firebase-functions/lib/logger/common.js
var require_common = __commonJS({
  "node_modules/firebase-functions/lib/logger/common.js"(exports) {
    "use strict";
    var _a;
    var _b;
    var _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UNPATCHED_CONSOLE = exports.CONSOLE_SEVERITY = exports.SUPPORTS_STRUCTURED_LOGS = void 0;
    exports.SUPPORTS_STRUCTURED_LOGS = parseInt(((_c = (_b = (_a = process.versions) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.split(".")) === null || _c === void 0 ? void 0 : _c[0]) || "8", 10) >= 10;
    exports.CONSOLE_SEVERITY = {
      DEBUG: "debug",
      INFO: "info",
      NOTICE: "info",
      WARNING: "warn",
      ERROR: "error",
      CRITICAL: "error",
      ALERT: "error",
      EMERGENCY: "error"
    };
    exports.UNPATCHED_CONSOLE = {
      debug: console.debug,
      info: console.info,
      log: console.log,
      warn: console.warn,
      error: console.error
    };
  }
});

// node_modules/firebase-functions/lib/logger/index.js
var require_logger = __commonJS({
  "node_modules/firebase-functions/lib/logger/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.error = exports.warn = exports.info = exports.log = exports.debug = exports.write = void 0;
    var util_1 = __require("util");
    var common_1 = require_common();
    function removeCircular(obj, refs = []) {
      if (typeof obj !== "object" || !obj) {
        return obj;
      }
      if (obj.toJSON) {
        return obj.toJSON();
      }
      if (refs.includes(obj)) {
        return "[Circular]";
      } else {
        refs.push(obj);
      }
      let returnObj;
      if (Array.isArray(obj)) {
        returnObj = new Array(obj.length);
      } else {
        returnObj = {};
      }
      for (const k in obj) {
        if (refs.includes(obj[k])) {
          returnObj[k] = "[Circular]";
        } else {
          returnObj[k] = removeCircular(obj[k], refs);
        }
      }
      return returnObj;
    }
    function write(entry) {
      if (common_1.SUPPORTS_STRUCTURED_LOGS) {
        common_1.UNPATCHED_CONSOLE[common_1.CONSOLE_SEVERITY[entry.severity]](JSON.stringify(removeCircular(entry)));
        return;
      }
      let message = entry.message || "";
      const jsonPayload = {};
      let jsonKeyCount = 0;
      for (const k in entry) {
        if (!["severity", "message"].includes(k)) {
          jsonKeyCount++;
          jsonPayload[k] = entry[k];
        }
      }
      if (jsonKeyCount > 0) {
        message = `${message} ${JSON.stringify(removeCircular(jsonPayload), null, 2)}`;
      }
      common_1.UNPATCHED_CONSOLE[common_1.CONSOLE_SEVERITY[entry.severity]](message);
    }
    exports.write = write;
    function debug(...args) {
      write(entryFromArgs("DEBUG", args));
    }
    exports.debug = debug;
    function log(...args) {
      write(entryFromArgs("INFO", args));
    }
    exports.log = log;
    function info(...args) {
      write(entryFromArgs("INFO", args));
    }
    exports.info = info;
    function warn(...args) {
      write(entryFromArgs("WARNING", args));
    }
    exports.warn = warn;
    function error(...args) {
      write(entryFromArgs("ERROR", args));
    }
    exports.error = error;
    function entryFromArgs(severity, args) {
      let entry = {};
      const lastArg = args[args.length - 1];
      if (lastArg && typeof lastArg == "object" && lastArg.constructor == Object) {
        entry = args.pop();
      }
      return Object.assign({}, entry, {
        severity,
        message: util_1.format.apply(null, args)
      });
    }
  }
});

// node_modules/firebase-functions/lib/v2/params/types.js
var require_types = __commonJS({
  "node_modules/firebase-functions/lib/v2/params/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListParam = exports.BooleanParam = exports.FloatParam = exports.IntParam = exports.StringParam = exports.SecretParam = exports.Param = exports.CompareExpression = exports.TernaryExpression = exports.Expression = void 0;
    var Expression = class {
      value() {
        throw new Error("Not implemented");
      }
      toCEL() {
        return `{{ ${this.toString()} }}`;
      }
      toJSON() {
        return this.toString();
      }
    };
    exports.Expression = Expression;
    function quoteIfString(literal) {
      return typeof literal === "string" ? `"${literal}"` : literal;
    }
    var TernaryExpression = class extends Expression {
      constructor(test2, ifTrue, ifFalse) {
        super();
        this.test = test2;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
      }
      value() {
        return !!this.test.value ? this.ifTrue : this.ifFalse;
      }
      toString() {
        return `${this.test} ? ${quoteIfString(this.ifTrue)} : ${quoteIfString(this.ifFalse)}`;
      }
    };
    exports.TernaryExpression = TernaryExpression;
    var CompareExpression = class extends Expression {
      constructor(cmp, lhs, rhs) {
        super();
        this.cmp = cmp;
        this.lhs = lhs;
        this.rhs = rhs;
      }
      value() {
        const left = this.lhs.value();
        switch (this.cmp) {
          case "==":
            return left === this.rhs;
          case ">":
            return left > this.rhs;
          case ">=":
            return left >= this.rhs;
          case "<":
            return left < this.rhs;
          case "<=":
            return left <= this.rhs;
          default:
            throw new Error("Unknown comparator " + this.cmp);
        }
      }
      toString() {
        return `${this.lhs} ${this.cmp} ${quoteIfString(this.rhs)}`;
      }
      then(ifTrue, ifFalse) {
        return new TernaryExpression(this, ifTrue, ifFalse);
      }
    };
    exports.CompareExpression = CompareExpression;
    var Param = class extends Expression {
      constructor(name, options = {}) {
        super();
        this.name = name;
        this.options = options;
      }
      value() {
        throw new Error("Not implemented");
      }
      cmp(cmp, rhs) {
        return new CompareExpression(cmp, this, rhs);
      }
      equals(rhs) {
        return this.cmp("==", rhs);
      }
      toString() {
        return `params.${this.name}`;
      }
      toSpec() {
        const out = {
          name: this.name,
          ...this.options,
          type: this.constructor.type
        };
        return out;
      }
    };
    exports.Param = Param;
    Param.type = "string";
    var SecretParam = class {
      constructor(name) {
        this.name = name;
      }
      value() {
        return process.env[this.name] || "";
      }
      toSpec() {
        return {
          type: "secret",
          name: this.name
        };
      }
    };
    exports.SecretParam = SecretParam;
    SecretParam.type = "secret";
    var StringParam = class extends Param {
      value() {
        return process.env[this.name] || "";
      }
    };
    exports.StringParam = StringParam;
    var IntParam = class extends Param {
      value() {
        return parseInt(process.env[this.name] || "0", 10) || 0;
      }
    };
    exports.IntParam = IntParam;
    IntParam.type = "int";
    var FloatParam = class extends Param {
      value() {
        return parseFloat(process.env[this.name] || "0") || 0;
      }
    };
    exports.FloatParam = FloatParam;
    FloatParam.type = "float";
    var BooleanParam = class extends Param {
      value() {
        return !!process.env[this.name];
      }
      then(ifTrue, ifFalse) {
        return new TernaryExpression(this, ifTrue, ifFalse);
      }
    };
    exports.BooleanParam = BooleanParam;
    BooleanParam.type = "boolean";
    var ListParam = class extends Param {
      value() {
        throw new Error("Not implemented");
      }
      toSpec() {
        const out = {
          name: this.name,
          type: "list",
          ...this.options
        };
        if (this.options.default && this.options.default.length > 0) {
          out.default = this.options.default.join(",");
        }
        return out;
      }
    };
    exports.ListParam = ListParam;
    ListParam.type = "list";
  }
});

// node_modules/firebase-functions/lib/v2/params/index.js
var require_params = __commonJS({
  "node_modules/firebase-functions/lib/v2/params/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defineList = exports.defineFloat = exports.defineInt = exports.defineBoolean = exports.defineString = exports.defineSecret = exports.clearParams = exports.declaredParams = exports.Expression = void 0;
    var types_1 = require_types();
    Object.defineProperty(exports, "Expression", { enumerable: true, get: function() {
      return types_1.Expression;
    } });
    exports.declaredParams = [];
    function registerParam(param) {
      for (let i = 0; i < exports.declaredParams.length; i++) {
        if (exports.declaredParams[i].name === param.name) {
          exports.declaredParams.splice(i, 1);
        }
      }
      exports.declaredParams.push(param);
    }
    function clearParams() {
      exports.declaredParams.splice(0, exports.declaredParams.length);
    }
    exports.clearParams = clearParams;
    function defineSecret(name) {
      const param = new types_1.SecretParam(name);
      registerParam(param);
      return param;
    }
    exports.defineSecret = defineSecret;
    function defineString(name, options = {}) {
      const param = new types_1.StringParam(name, options);
      registerParam(param);
      return param;
    }
    exports.defineString = defineString;
    function defineBoolean(name, options = {}) {
      const param = new types_1.BooleanParam(name, options);
      registerParam(param);
      return param;
    }
    exports.defineBoolean = defineBoolean;
    function defineInt(name, options = {}) {
      const param = new types_1.IntParam(name, options);
      registerParam(param);
      return param;
    }
    exports.defineInt = defineInt;
    function defineFloat(name, options = {}) {
      const param = new types_1.FloatParam(name, options);
      registerParam(param);
      return param;
    }
    exports.defineFloat = defineFloat;
    function defineList(name, options = {}) {
      const param = new types_1.ListParam(name, options);
      registerParam(param);
      return param;
    }
    exports.defineList = defineList;
  }
});

// node_modules/firebase-functions/lib/v2/options.js
var require_options = __commonJS({
  "node_modules/firebase-functions/lib/v2/options.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.__getSpec = exports.optionsToEndpoint = exports.optionsToTriggerAnnotations = exports.getGlobalOptions = exports.setGlobalOptions = void 0;
    var encoding_1 = require_encoding();
    var logger = require_logger();
    var params_1 = require_params();
    var MemoryOptionToMB = {
      "128MiB": 128,
      "256MiB": 256,
      "512MiB": 512,
      "1GiB": 1024,
      "2GiB": 2048,
      "4GiB": 4096,
      "8GiB": 8192,
      "16GiB": 16384,
      "32GiB": 32768
    };
    var globalOptions;
    function setGlobalOptions(options) {
      if (globalOptions) {
        logger.warn("Calling setGlobalOptions twice leads to undefined behavior");
      }
      globalOptions = options;
    }
    exports.setGlobalOptions = setGlobalOptions;
    function getGlobalOptions() {
      return globalOptions || {};
    }
    exports.getGlobalOptions = getGlobalOptions;
    function optionsToTriggerAnnotations(opts) {
      const annotation = {};
      (0, encoding_1.copyIfPresent)(annotation, opts, "concurrency", "minInstances", "maxInstances", "ingressSettings", "labels", "vpcConnector", "vpcConnectorEgressSettings", "secrets");
      (0, encoding_1.convertIfPresent)(annotation, opts, "availableMemoryMb", "memory", (mem) => {
        return typeof mem === "object" ? mem : MemoryOptionToMB[mem];
      });
      (0, encoding_1.convertIfPresent)(annotation, opts, "regions", "region", (region) => {
        if (typeof region === "string") {
          return [region];
        }
        return region;
      });
      (0, encoding_1.convertIfPresent)(annotation, opts, "serviceAccountEmail", "serviceAccount", encoding_1.serviceAccountFromShorthand);
      (0, encoding_1.convertIfPresent)(annotation, opts, "timeout", "timeoutSeconds", encoding_1.durationFromSeconds);
      (0, encoding_1.convertIfPresent)(annotation, opts, "failurePolicy", "retry", (retry) => {
        return retry ? { retry: true } : null;
      });
      return annotation;
    }
    exports.optionsToTriggerAnnotations = optionsToTriggerAnnotations;
    function optionsToEndpoint(opts) {
      const endpoint = {};
      (0, encoding_1.copyIfPresent)(endpoint, opts, "concurrency", "minInstances", "maxInstances", "ingressSettings", "labels", "timeoutSeconds", "cpu");
      (0, encoding_1.convertIfPresent)(endpoint, opts, "serviceAccountEmail", "serviceAccount");
      if (opts.vpcConnector) {
        const vpc = { connector: opts.vpcConnector };
        (0, encoding_1.convertIfPresent)(vpc, opts, "egressSettings", "vpcConnectorEgressSettings");
        endpoint.vpc = vpc;
      }
      (0, encoding_1.convertIfPresent)(endpoint, opts, "availableMemoryMb", "memory", (mem) => {
        return typeof mem === "object" ? mem : MemoryOptionToMB[mem];
      });
      (0, encoding_1.convertIfPresent)(endpoint, opts, "region", "region", (region) => {
        if (typeof region === "string") {
          return [region];
        }
        return region;
      });
      (0, encoding_1.convertIfPresent)(endpoint, opts, "secretEnvironmentVariables", "secrets", (secrets) => secrets.map((secret) => ({ key: secret })));
      return endpoint;
    }
    exports.optionsToEndpoint = optionsToEndpoint;
    function __getSpec() {
      return {
        globalOptions: getGlobalOptions(),
        params: params_1.declaredParams.map((p) => p.toSpec())
      };
    }
    exports.__getSpec = __getSpec;
  }
});

// node_modules/firebase-functions/lib/v2/providers/storage.js
var require_storage = __commonJS({
  "node_modules/firebase-functions/lib/v2/providers/storage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOptsAndBucket = exports.onOperation = exports.onObjectMetadataUpdated = exports.onObjectDeleted = exports.onObjectFinalized = exports.onObjectArchived = exports.metadataUpdatedEvent = exports.deletedEvent = exports.finalizedEvent = exports.archivedEvent = void 0;
    var encoding_1 = require_encoding();
    var config_1 = require_config();
    var options = require_options();
    exports.archivedEvent = "google.cloud.storage.object.v1.archived";
    exports.finalizedEvent = "google.cloud.storage.object.v1.finalized";
    exports.deletedEvent = "google.cloud.storage.object.v1.deleted";
    exports.metadataUpdatedEvent = "google.cloud.storage.object.v1.metadataUpdated";
    function onObjectArchived(bucketOrOptsOrHandler, handler) {
      return onOperation(exports.archivedEvent, bucketOrOptsOrHandler, handler);
    }
    exports.onObjectArchived = onObjectArchived;
    function onObjectFinalized2(bucketOrOptsOrHandler, handler) {
      return onOperation(exports.finalizedEvent, bucketOrOptsOrHandler, handler);
    }
    exports.onObjectFinalized = onObjectFinalized2;
    function onObjectDeleted(bucketOrOptsOrHandler, handler) {
      return onOperation(exports.deletedEvent, bucketOrOptsOrHandler, handler);
    }
    exports.onObjectDeleted = onObjectDeleted;
    function onObjectMetadataUpdated(bucketOrOptsOrHandler, handler) {
      return onOperation(exports.metadataUpdatedEvent, bucketOrOptsOrHandler, handler);
    }
    exports.onObjectMetadataUpdated = onObjectMetadataUpdated;
    function onOperation(eventType, bucketOrOptsOrHandler, handler) {
      if (typeof bucketOrOptsOrHandler === "function") {
        handler = bucketOrOptsOrHandler;
        bucketOrOptsOrHandler = {};
      }
      const [opts, bucket] = getOptsAndBucket(bucketOrOptsOrHandler);
      const func = (raw) => {
        return handler(raw);
      };
      func.run = handler;
      Object.defineProperty(func, "__trigger", {
        get: () => {
          const baseOpts = options.optionsToTriggerAnnotations(options.getGlobalOptions());
          const specificOpts = options.optionsToTriggerAnnotations(opts);
          return {
            platform: "gcfv2",
            ...baseOpts,
            ...specificOpts,
            labels: {
              ...baseOpts === null || baseOpts === void 0 ? void 0 : baseOpts.labels,
              ...specificOpts === null || specificOpts === void 0 ? void 0 : specificOpts.labels
            },
            eventTrigger: {
              eventType,
              resource: bucket
            }
          };
        }
      });
      func.__endpoint = {};
      Object.defineProperty(func, "__endpoint", {
        get: () => {
          const baseOpts = options.optionsToEndpoint(options.getGlobalOptions());
          const specificOpts = options.optionsToEndpoint(opts);
          const endpoint = {
            platform: "gcfv2",
            ...baseOpts,
            ...specificOpts,
            labels: {
              ...baseOpts === null || baseOpts === void 0 ? void 0 : baseOpts.labels,
              ...specificOpts === null || specificOpts === void 0 ? void 0 : specificOpts.labels
            },
            eventTrigger: {
              eventType,
              eventFilters: { bucket },
              retry: false
            }
          };
          (0, encoding_1.copyIfPresent)(endpoint.eventTrigger, opts, "retry", "retry");
          return endpoint;
        }
      });
      return func;
    }
    exports.onOperation = onOperation;
    function getOptsAndBucket(bucketOrOpts) {
      var _a;
      let bucket;
      let opts;
      if (typeof bucketOrOpts === "string") {
        bucket = bucketOrOpts;
        opts = {};
      } else {
        bucket = bucketOrOpts.bucket || ((_a = (0, config_1.firebaseConfig)()) === null || _a === void 0 ? void 0 : _a.storageBucket);
        opts = { ...bucketOrOpts };
        delete opts.bucket;
      }
      if (!bucket) {
        throw new Error("Missing bucket name. If you are unit testing, please provide a bucket name by providing bucket name directly in the event handler or by setting process.env.FIREBASE_CONFIG.");
      }
      if (!/^[a-z\d][a-z\d\\._-]{1,230}[a-z\d]$/.test(bucket)) {
        throw new Error(`Invalid bucket name ${bucket}`);
      }
      return [opts, bucket];
    }
    exports.getOptsAndBucket = getOptsAndBucket;
  }
});

// src/index.ts
var import_storage = __toESM(require_storage(), 1);
var test = (0, import_storage.onObjectFinalized)({ region: "europe-west1" }, (event) => {
  console.log(event);
});
export {
  test
};
//# sourceMappingURL=index.js.map
