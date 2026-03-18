var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedAsync(name) {
  const fn = /* @__PURE__ */ notImplemented(name);
  fn.__promisify__ = () => /* @__PURE__ */ notImplemented(name + ".__promisify__");
  fn.native = fn;
  return fn;
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(rawHeaders, "rawHeaders");
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedAsync, "notImplementedAsync");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type2) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type2) {
        return this._entries.filter((e) => e.name === name && (!type2 || e.entryType === type2));
      }
      getEntriesByType(type2) {
        return this._entries.filter((e) => e.entryType === type2);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type2, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type2, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type2, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type2 ? `${type2}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// api/admin/change-password.ts
async function onRequestPost(context2) {
  try {
    const authHeader = context2.request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token || !token.startsWith("demo-token-")) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { currentPassword, newPassword } = await context2.request.json();
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const adminPassword = context2.env.ADMIN_PASSWORD || "admin123";
    if (currentPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Password change requested");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Password changed successfully"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    console.error("Change password error:", error3);
    return new Response(
      JSON.stringify({ error: error3.message || "Failed to change password" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var init_change_password = __esm({
  "api/admin/change-password.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestPost, "onRequestPost");
  }
});

// api/admin/login.ts
async function onRequestPost2(context2) {
  try {
    const { email, password } = await context2.request.json();
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (email && password) {
      const accessToken = "demo-token-" + Date.now();
      const refreshToken = "refresh-token-" + Date.now();
      return new Response(
        JSON.stringify({
          success: true,
          accessToken,
          refreshToken,
          user: { email, name: "Admin" }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    console.error("Login error:", error3);
    return new Response(
      JSON.stringify({ error: error3.message || "Login failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var init_login = __esm({
  "api/admin/login.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestPost2, "onRequestPost");
  }
});

// api/newsletters/send.ts
async function onRequestPost3(context2) {
  try {
    const url = new URL(context2.request.url);
    const pathParts = url.pathname.split("/");
    const newsletterId = pathParts[pathParts.length - 2];
    const { recipients } = await context2.request.json();
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Recipients required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(`[NEWSLETTER] Sending newsletter ${newsletterId} to ${recipients.length} recipients`);
    return new Response(
      JSON.stringify({
        success: true,
        sent: recipients.length,
        message: `Newsletter sent to ${recipients.length} recipients`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    console.error("Send newsletter error:", error3);
    return new Response(
      JSON.stringify({ error: error3.message || "Failed to send newsletter" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var init_send = __esm({
  "api/newsletters/send.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestPost3, "onRequestPost");
  }
});

// api/admin/forgot-password.ts
var onRequest;
var init_forgot_password = __esm({
  "api/admin/forgot-password.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequest = /* @__PURE__ */ __name(async (context2) => {
      if (context2.request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const { email } = await context2.request.json();
        if (!email) {
          return new Response(JSON.stringify({ error: "Email required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.log("Forgot password request for:", email);
        return new Response(JSON.stringify({
          success: true,
          message: "If an account exists, a reset link has been sent"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("Forgot password error:", err);
        return new Response(JSON.stringify({ error: "Request failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequest");
  }
});

// api/admin/profile.ts
var onRequest2;
var init_profile = __esm({
  "api/admin/profile.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequest2 = /* @__PURE__ */ __name(async (context2) => {
      if (context2.request.method === "GET") {
        try {
          const authHeader = context2.request.headers.get("Authorization");
          if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" }
            });
          }
          const adminEmail = context2.env.ADMIN_EMAIL || "admin@authorfatima.com";
          const adminName = context2.env.ADMIN_NAME || "Admin";
          return new Response(JSON.stringify({
            success: true,
            admin: {
              id: "1",
              email: adminEmail,
              name: adminName,
              username: adminEmail.split("@")[0],
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            }
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      } else if (context2.request.method === "PUT") {
        try {
          const { email, username, name } = await context2.request.json();
          console.log("Update profile:", { email, username, name });
          return new Response(JSON.stringify({
            success: true,
            message: "Profile updated successfully",
            admin: {
              id: "1",
              email: email || context2.env.ADMIN_EMAIL || "admin@authorfatima.com",
              name: name || context2.env.ADMIN_NAME || "Admin",
              username: username || (email || context2.env.ADMIN_EMAIL || "admin@authorfatima.com").split("@")[0]
            }
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ error: "Update failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }, "onRequest");
  }
});

// api/admin/reset-password.ts
var onRequest3;
var init_reset_password = __esm({
  "api/admin/reset-password.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequest3 = /* @__PURE__ */ __name(async (context2) => {
      if (context2.request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" }
        });
      }
      try {
        const { token, newPassword } = await context2.request.json();
        if (!token || !newPassword) {
          return new Response(JSON.stringify({ error: "Token and new password required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.log("Reset password request with token:", token);
        return new Response(JSON.stringify({
          success: true,
          message: "Password reset successfully"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("Reset password error:", err);
        return new Response(JSON.stringify({ error: "Reset failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequest");
  }
});

// node-built-in-modules:events
import libDefault from "events";
var require_events = __commonJS({
  "node-built-in-modules:events"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault;
  }
});

// node-built-in-modules:url
import libDefault2 from "url";
var require_url = __commonJS({
  "node-built-in-modules:url"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault2;
  }
});

// node-built-in-modules:util
import libDefault3 from "util";
var require_util = __commonJS({
  "node-built-in-modules:util"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault3;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs
var access, copyFile, cp, open, opendir, rename, truncate, rm, rmdir, mkdir, readdir, readlink, symlink, lstat, stat, link, unlink, chmod, lchmod, lchown, chown, utimes, lutimes, realpath, mkdtemp, writeFile, appendFile, readFile, watch, statfs, glob;
var init_promises = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    access = /* @__PURE__ */ notImplemented("fs.access");
    copyFile = /* @__PURE__ */ notImplemented("fs.copyFile");
    cp = /* @__PURE__ */ notImplemented("fs.cp");
    open = /* @__PURE__ */ notImplemented("fs.open");
    opendir = /* @__PURE__ */ notImplemented("fs.opendir");
    rename = /* @__PURE__ */ notImplemented("fs.rename");
    truncate = /* @__PURE__ */ notImplemented("fs.truncate");
    rm = /* @__PURE__ */ notImplemented("fs.rm");
    rmdir = /* @__PURE__ */ notImplemented("fs.rmdir");
    mkdir = /* @__PURE__ */ notImplemented("fs.mkdir");
    readdir = /* @__PURE__ */ notImplemented("fs.readdir");
    readlink = /* @__PURE__ */ notImplemented("fs.readlink");
    symlink = /* @__PURE__ */ notImplemented("fs.symlink");
    lstat = /* @__PURE__ */ notImplemented("fs.lstat");
    stat = /* @__PURE__ */ notImplemented("fs.stat");
    link = /* @__PURE__ */ notImplemented("fs.link");
    unlink = /* @__PURE__ */ notImplemented("fs.unlink");
    chmod = /* @__PURE__ */ notImplemented("fs.chmod");
    lchmod = /* @__PURE__ */ notImplemented("fs.lchmod");
    lchown = /* @__PURE__ */ notImplemented("fs.lchown");
    chown = /* @__PURE__ */ notImplemented("fs.chown");
    utimes = /* @__PURE__ */ notImplemented("fs.utimes");
    lutimes = /* @__PURE__ */ notImplemented("fs.lutimes");
    realpath = /* @__PURE__ */ notImplemented("fs.realpath");
    mkdtemp = /* @__PURE__ */ notImplemented("fs.mkdtemp");
    writeFile = /* @__PURE__ */ notImplemented("fs.writeFile");
    appendFile = /* @__PURE__ */ notImplemented("fs.appendFile");
    readFile = /* @__PURE__ */ notImplemented("fs.readFile");
    watch = /* @__PURE__ */ notImplemented("fs.watch");
    statfs = /* @__PURE__ */ notImplemented("fs.statfs");
    glob = /* @__PURE__ */ notImplemented("fs.glob");
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs
var constants_exports = {};
__export(constants_exports, {
  COPYFILE_EXCL: () => COPYFILE_EXCL,
  COPYFILE_FICLONE: () => COPYFILE_FICLONE,
  COPYFILE_FICLONE_FORCE: () => COPYFILE_FICLONE_FORCE,
  EXTENSIONLESS_FORMAT_JAVASCRIPT: () => EXTENSIONLESS_FORMAT_JAVASCRIPT,
  EXTENSIONLESS_FORMAT_WASM: () => EXTENSIONLESS_FORMAT_WASM,
  F_OK: () => F_OK,
  O_APPEND: () => O_APPEND,
  O_CREAT: () => O_CREAT,
  O_DIRECT: () => O_DIRECT,
  O_DIRECTORY: () => O_DIRECTORY,
  O_DSYNC: () => O_DSYNC,
  O_EXCL: () => O_EXCL,
  O_NOATIME: () => O_NOATIME,
  O_NOCTTY: () => O_NOCTTY,
  O_NOFOLLOW: () => O_NOFOLLOW,
  O_NONBLOCK: () => O_NONBLOCK,
  O_RDONLY: () => O_RDONLY,
  O_RDWR: () => O_RDWR,
  O_SYNC: () => O_SYNC,
  O_TRUNC: () => O_TRUNC,
  O_WRONLY: () => O_WRONLY,
  R_OK: () => R_OK,
  S_IFBLK: () => S_IFBLK,
  S_IFCHR: () => S_IFCHR,
  S_IFDIR: () => S_IFDIR,
  S_IFIFO: () => S_IFIFO,
  S_IFLNK: () => S_IFLNK,
  S_IFMT: () => S_IFMT,
  S_IFREG: () => S_IFREG,
  S_IFSOCK: () => S_IFSOCK,
  S_IRGRP: () => S_IRGRP,
  S_IROTH: () => S_IROTH,
  S_IRUSR: () => S_IRUSR,
  S_IRWXG: () => S_IRWXG,
  S_IRWXO: () => S_IRWXO,
  S_IRWXU: () => S_IRWXU,
  S_IWGRP: () => S_IWGRP,
  S_IWOTH: () => S_IWOTH,
  S_IWUSR: () => S_IWUSR,
  S_IXGRP: () => S_IXGRP,
  S_IXOTH: () => S_IXOTH,
  S_IXUSR: () => S_IXUSR,
  UV_DIRENT_BLOCK: () => UV_DIRENT_BLOCK,
  UV_DIRENT_CHAR: () => UV_DIRENT_CHAR,
  UV_DIRENT_DIR: () => UV_DIRENT_DIR,
  UV_DIRENT_FIFO: () => UV_DIRENT_FIFO,
  UV_DIRENT_FILE: () => UV_DIRENT_FILE,
  UV_DIRENT_LINK: () => UV_DIRENT_LINK,
  UV_DIRENT_SOCKET: () => UV_DIRENT_SOCKET,
  UV_DIRENT_UNKNOWN: () => UV_DIRENT_UNKNOWN,
  UV_FS_COPYFILE_EXCL: () => UV_FS_COPYFILE_EXCL,
  UV_FS_COPYFILE_FICLONE: () => UV_FS_COPYFILE_FICLONE,
  UV_FS_COPYFILE_FICLONE_FORCE: () => UV_FS_COPYFILE_FICLONE_FORCE,
  UV_FS_O_FILEMAP: () => UV_FS_O_FILEMAP,
  UV_FS_SYMLINK_DIR: () => UV_FS_SYMLINK_DIR,
  UV_FS_SYMLINK_JUNCTION: () => UV_FS_SYMLINK_JUNCTION,
  W_OK: () => W_OK,
  X_OK: () => X_OK
});
var UV_FS_SYMLINK_DIR, UV_FS_SYMLINK_JUNCTION, O_RDONLY, O_WRONLY, O_RDWR, UV_DIRENT_UNKNOWN, UV_DIRENT_FILE, UV_DIRENT_DIR, UV_DIRENT_LINK, UV_DIRENT_FIFO, UV_DIRENT_SOCKET, UV_DIRENT_CHAR, UV_DIRENT_BLOCK, EXTENSIONLESS_FORMAT_JAVASCRIPT, EXTENSIONLESS_FORMAT_WASM, S_IFMT, S_IFREG, S_IFDIR, S_IFCHR, S_IFBLK, S_IFIFO, S_IFLNK, S_IFSOCK, O_CREAT, O_EXCL, UV_FS_O_FILEMAP, O_NOCTTY, O_TRUNC, O_APPEND, O_DIRECTORY, O_NOATIME, O_NOFOLLOW, O_SYNC, O_DSYNC, O_DIRECT, O_NONBLOCK, S_IRWXU, S_IRUSR, S_IWUSR, S_IXUSR, S_IRWXG, S_IRGRP, S_IWGRP, S_IXGRP, S_IRWXO, S_IROTH, S_IWOTH, S_IXOTH, F_OK, R_OK, W_OK, X_OK, UV_FS_COPYFILE_EXCL, COPYFILE_EXCL, UV_FS_COPYFILE_FICLONE, COPYFILE_FICLONE, UV_FS_COPYFILE_FICLONE_FORCE, COPYFILE_FICLONE_FORCE;
var init_constants = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    UV_FS_SYMLINK_DIR = 1;
    UV_FS_SYMLINK_JUNCTION = 2;
    O_RDONLY = 0;
    O_WRONLY = 1;
    O_RDWR = 2;
    UV_DIRENT_UNKNOWN = 0;
    UV_DIRENT_FILE = 1;
    UV_DIRENT_DIR = 2;
    UV_DIRENT_LINK = 3;
    UV_DIRENT_FIFO = 4;
    UV_DIRENT_SOCKET = 5;
    UV_DIRENT_CHAR = 6;
    UV_DIRENT_BLOCK = 7;
    EXTENSIONLESS_FORMAT_JAVASCRIPT = 0;
    EXTENSIONLESS_FORMAT_WASM = 1;
    S_IFMT = 61440;
    S_IFREG = 32768;
    S_IFDIR = 16384;
    S_IFCHR = 8192;
    S_IFBLK = 24576;
    S_IFIFO = 4096;
    S_IFLNK = 40960;
    S_IFSOCK = 49152;
    O_CREAT = 64;
    O_EXCL = 128;
    UV_FS_O_FILEMAP = 0;
    O_NOCTTY = 256;
    O_TRUNC = 512;
    O_APPEND = 1024;
    O_DIRECTORY = 65536;
    O_NOATIME = 262144;
    O_NOFOLLOW = 131072;
    O_SYNC = 1052672;
    O_DSYNC = 4096;
    O_DIRECT = 16384;
    O_NONBLOCK = 2048;
    S_IRWXU = 448;
    S_IRUSR = 256;
    S_IWUSR = 128;
    S_IXUSR = 64;
    S_IRWXG = 56;
    S_IRGRP = 32;
    S_IWGRP = 16;
    S_IXGRP = 8;
    S_IRWXO = 7;
    S_IROTH = 4;
    S_IWOTH = 2;
    S_IXOTH = 1;
    F_OK = 0;
    R_OK = 4;
    W_OK = 2;
    X_OK = 1;
    UV_FS_COPYFILE_EXCL = 1;
    COPYFILE_EXCL = 1;
    UV_FS_COPYFILE_FICLONE = 2;
    COPYFILE_FICLONE = 2;
    UV_FS_COPYFILE_FICLONE_FORCE = 4;
    COPYFILE_FICLONE_FORCE = 4;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/fs/promises.mjs
var promises_default;
var init_promises2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/fs/promises.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises();
    init_constants();
    init_promises();
    promises_default = {
      constants: constants_exports,
      access,
      appendFile,
      chmod,
      chown,
      copyFile,
      cp,
      glob,
      lchmod,
      lchown,
      link,
      lstat,
      lutimes,
      mkdir,
      mkdtemp,
      open,
      opendir,
      readFile,
      readdir,
      readlink,
      realpath,
      rename,
      rm,
      rmdir,
      stat,
      statfs,
      symlink,
      truncate,
      unlink,
      utimes,
      watch,
      writeFile
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs
var Dir, Dirent, Stats, ReadStream2, WriteStream2, FileReadStream, FileWriteStream;
var init_classes = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    Dir = /* @__PURE__ */ notImplementedClass("fs.Dir");
    Dirent = /* @__PURE__ */ notImplementedClass("fs.Dirent");
    Stats = /* @__PURE__ */ notImplementedClass("fs.Stats");
    ReadStream2 = /* @__PURE__ */ notImplementedClass("fs.ReadStream");
    WriteStream2 = /* @__PURE__ */ notImplementedClass("fs.WriteStream");
    FileReadStream = ReadStream2;
    FileWriteStream = WriteStream2;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs
function callbackify(fn) {
  const fnc = /* @__PURE__ */ __name(function(...args) {
    const cb = args.pop();
    fn().catch((error3) => cb(error3)).then((val) => cb(void 0, val));
  }, "fnc");
  fnc.__promisify__ = fn;
  fnc.native = fnc;
  return fnc;
}
var access2, appendFile2, chown2, chmod2, copyFile2, cp2, lchown2, lchmod2, link2, lstat2, lutimes2, mkdir2, mkdtemp2, realpath2, open2, opendir2, readdir2, readFile2, readlink2, rename2, rm2, rmdir2, stat2, symlink2, truncate2, unlink2, utimes2, writeFile2, statfs2, close, createReadStream, createWriteStream, exists, fchown, fchmod, fdatasync, fstat, fsync, ftruncate, futimes, lstatSync, read, readv, realpathSync, statSync, unwatchFile, watch2, watchFile, write, writev, _toUnixTimestamp, openAsBlob, glob2, appendFileSync, accessSync, chownSync, chmodSync, closeSync, copyFileSync, cpSync, existsSync, fchownSync, fchmodSync, fdatasyncSync, fstatSync, fsyncSync, ftruncateSync, futimesSync, lchownSync, lchmodSync, linkSync, lutimesSync, mkdirSync, mkdtempSync, openSync, opendirSync, readdirSync, readSync, readvSync, readFileSync, readlinkSync, renameSync, rmSync, rmdirSync, symlinkSync, truncateSync, unlinkSync, utimesSync, writeFileSync, writeSync, writevSync, statfsSync, globSync;
var init_fs = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_promises();
    __name(callbackify, "callbackify");
    access2 = callbackify(access);
    appendFile2 = callbackify(appendFile);
    chown2 = callbackify(chown);
    chmod2 = callbackify(chmod);
    copyFile2 = callbackify(copyFile);
    cp2 = callbackify(cp);
    lchown2 = callbackify(lchown);
    lchmod2 = callbackify(lchmod);
    link2 = callbackify(link);
    lstat2 = callbackify(lstat);
    lutimes2 = callbackify(lutimes);
    mkdir2 = callbackify(mkdir);
    mkdtemp2 = callbackify(mkdtemp);
    realpath2 = callbackify(realpath);
    open2 = callbackify(open);
    opendir2 = callbackify(opendir);
    readdir2 = callbackify(readdir);
    readFile2 = callbackify(readFile);
    readlink2 = callbackify(readlink);
    rename2 = callbackify(rename);
    rm2 = callbackify(rm);
    rmdir2 = callbackify(rmdir);
    stat2 = callbackify(stat);
    symlink2 = callbackify(symlink);
    truncate2 = callbackify(truncate);
    unlink2 = callbackify(unlink);
    utimes2 = callbackify(utimes);
    writeFile2 = callbackify(writeFile);
    statfs2 = callbackify(statfs);
    close = /* @__PURE__ */ notImplementedAsync("fs.close");
    createReadStream = /* @__PURE__ */ notImplementedAsync("fs.createReadStream");
    createWriteStream = /* @__PURE__ */ notImplementedAsync("fs.createWriteStream");
    exists = /* @__PURE__ */ notImplementedAsync("fs.exists");
    fchown = /* @__PURE__ */ notImplementedAsync("fs.fchown");
    fchmod = /* @__PURE__ */ notImplementedAsync("fs.fchmod");
    fdatasync = /* @__PURE__ */ notImplementedAsync("fs.fdatasync");
    fstat = /* @__PURE__ */ notImplementedAsync("fs.fstat");
    fsync = /* @__PURE__ */ notImplementedAsync("fs.fsync");
    ftruncate = /* @__PURE__ */ notImplementedAsync("fs.ftruncate");
    futimes = /* @__PURE__ */ notImplementedAsync("fs.futimes");
    lstatSync = /* @__PURE__ */ notImplementedAsync("fs.lstatSync");
    read = /* @__PURE__ */ notImplementedAsync("fs.read");
    readv = /* @__PURE__ */ notImplementedAsync("fs.readv");
    realpathSync = /* @__PURE__ */ notImplementedAsync("fs.realpathSync");
    statSync = /* @__PURE__ */ notImplementedAsync("fs.statSync");
    unwatchFile = /* @__PURE__ */ notImplementedAsync("fs.unwatchFile");
    watch2 = /* @__PURE__ */ notImplementedAsync("fs.watch");
    watchFile = /* @__PURE__ */ notImplementedAsync("fs.watchFile");
    write = /* @__PURE__ */ notImplementedAsync("fs.write");
    writev = /* @__PURE__ */ notImplementedAsync("fs.writev");
    _toUnixTimestamp = /* @__PURE__ */ notImplementedAsync("fs._toUnixTimestamp");
    openAsBlob = /* @__PURE__ */ notImplementedAsync("fs.openAsBlob");
    glob2 = /* @__PURE__ */ notImplementedAsync("fs.glob");
    appendFileSync = /* @__PURE__ */ notImplemented("fs.appendFileSync");
    accessSync = /* @__PURE__ */ notImplemented("fs.accessSync");
    chownSync = /* @__PURE__ */ notImplemented("fs.chownSync");
    chmodSync = /* @__PURE__ */ notImplemented("fs.chmodSync");
    closeSync = /* @__PURE__ */ notImplemented("fs.closeSync");
    copyFileSync = /* @__PURE__ */ notImplemented("fs.copyFileSync");
    cpSync = /* @__PURE__ */ notImplemented("fs.cpSync");
    existsSync = /* @__PURE__ */ __name(() => false, "existsSync");
    fchownSync = /* @__PURE__ */ notImplemented("fs.fchownSync");
    fchmodSync = /* @__PURE__ */ notImplemented("fs.fchmodSync");
    fdatasyncSync = /* @__PURE__ */ notImplemented("fs.fdatasyncSync");
    fstatSync = /* @__PURE__ */ notImplemented("fs.fstatSync");
    fsyncSync = /* @__PURE__ */ notImplemented("fs.fsyncSync");
    ftruncateSync = /* @__PURE__ */ notImplemented("fs.ftruncateSync");
    futimesSync = /* @__PURE__ */ notImplemented("fs.futimesSync");
    lchownSync = /* @__PURE__ */ notImplemented("fs.lchownSync");
    lchmodSync = /* @__PURE__ */ notImplemented("fs.lchmodSync");
    linkSync = /* @__PURE__ */ notImplemented("fs.linkSync");
    lutimesSync = /* @__PURE__ */ notImplemented("fs.lutimesSync");
    mkdirSync = /* @__PURE__ */ notImplemented("fs.mkdirSync");
    mkdtempSync = /* @__PURE__ */ notImplemented("fs.mkdtempSync");
    openSync = /* @__PURE__ */ notImplemented("fs.openSync");
    opendirSync = /* @__PURE__ */ notImplemented("fs.opendirSync");
    readdirSync = /* @__PURE__ */ notImplemented("fs.readdirSync");
    readSync = /* @__PURE__ */ notImplemented("fs.readSync");
    readvSync = /* @__PURE__ */ notImplemented("fs.readvSync");
    readFileSync = /* @__PURE__ */ notImplemented("fs.readFileSync");
    readlinkSync = /* @__PURE__ */ notImplemented("fs.readlinkSync");
    renameSync = /* @__PURE__ */ notImplemented("fs.renameSync");
    rmSync = /* @__PURE__ */ notImplemented("fs.rmSync");
    rmdirSync = /* @__PURE__ */ notImplemented("fs.rmdirSync");
    symlinkSync = /* @__PURE__ */ notImplemented("fs.symlinkSync");
    truncateSync = /* @__PURE__ */ notImplemented("fs.truncateSync");
    unlinkSync = /* @__PURE__ */ notImplemented("fs.unlinkSync");
    utimesSync = /* @__PURE__ */ notImplemented("fs.utimesSync");
    writeFileSync = /* @__PURE__ */ notImplemented("fs.writeFileSync");
    writeSync = /* @__PURE__ */ notImplemented("fs.writeSync");
    writevSync = /* @__PURE__ */ notImplemented("fs.writevSync");
    statfsSync = /* @__PURE__ */ notImplemented("fs.statfsSync");
    globSync = /* @__PURE__ */ notImplemented("fs.globSync");
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/fs.mjs
var fs_default;
var init_fs2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/fs.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises2();
    init_classes();
    init_fs();
    init_constants();
    init_constants();
    init_fs();
    init_classes();
    fs_default = {
      F_OK,
      R_OK,
      W_OK,
      X_OK,
      constants: constants_exports,
      promises: promises_default,
      Dir,
      Dirent,
      FileReadStream,
      FileWriteStream,
      ReadStream: ReadStream2,
      Stats,
      WriteStream: WriteStream2,
      _toUnixTimestamp,
      access: access2,
      accessSync,
      appendFile: appendFile2,
      appendFileSync,
      chmod: chmod2,
      chmodSync,
      chown: chown2,
      chownSync,
      close,
      closeSync,
      copyFile: copyFile2,
      copyFileSync,
      cp: cp2,
      cpSync,
      createReadStream,
      createWriteStream,
      exists,
      existsSync,
      fchmod,
      fchmodSync,
      fchown,
      fchownSync,
      fdatasync,
      fdatasyncSync,
      fstat,
      fstatSync,
      fsync,
      fsyncSync,
      ftruncate,
      ftruncateSync,
      futimes,
      futimesSync,
      glob: glob2,
      lchmod: lchmod2,
      globSync,
      lchmodSync,
      lchown: lchown2,
      lchownSync,
      link: link2,
      linkSync,
      lstat: lstat2,
      lstatSync,
      lutimes: lutimes2,
      lutimesSync,
      mkdir: mkdir2,
      mkdirSync,
      mkdtemp: mkdtemp2,
      mkdtempSync,
      open: open2,
      openAsBlob,
      openSync,
      opendir: opendir2,
      opendirSync,
      read,
      readFile: readFile2,
      readFileSync,
      readSync,
      readdir: readdir2,
      readdirSync,
      readlink: readlink2,
      readlinkSync,
      readv,
      readvSync,
      realpath: realpath2,
      realpathSync,
      rename: rename2,
      renameSync,
      rm: rm2,
      rmSync,
      rmdir: rmdir2,
      rmdirSync,
      stat: stat2,
      statSync,
      statfs: statfs2,
      statfsSync,
      symlink: symlink2,
      symlinkSync,
      truncate: truncate2,
      truncateSync,
      unlink: unlink2,
      unlinkSync,
      unwatchFile,
      utimes: utimes2,
      utimesSync,
      watch: watch2,
      watchFile,
      write,
      writeFile: writeFile2,
      writeFileSync,
      writeSync,
      writev,
      writevSync
    };
  }
});

// node-built-in-modules:fs
var require_fs = __commonJS({
  "node-built-in-modules:fs"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_fs2();
    module.exports = fs_default;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/request.mjs
import { Socket } from "node:net";
import { Readable } from "node:stream";
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(Boolean);
    }
  }
  return d;
}
var IncomingMessage;
var init_request = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/request.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    IncomingMessage = class extends Readable {
      static {
        __name(this, "IncomingMessage");
      }
      __unenv__ = {};
      aborted = false;
      httpVersion = "1.1";
      httpVersionMajor = 1;
      httpVersionMinor = 1;
      complete = true;
      connection;
      socket;
      headers = {};
      trailers = {};
      method = "GET";
      url = "/";
      statusCode = 200;
      statusMessage = "";
      closed = false;
      errored = null;
      readable = false;
      constructor(socket) {
        super();
        this.socket = this.connection = socket || new Socket();
      }
      get rawHeaders() {
        return rawHeaders(this.headers);
      }
      get rawTrailers() {
        return [];
      }
      setTimeout(_msecs, _callback) {
        return this;
      }
      get headersDistinct() {
        return _distinct(this.headers);
      }
      get trailersDistinct() {
        return _distinct(this.trailers);
      }
      _read() {
      }
    };
    __name(_distinct, "_distinct");
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/response.mjs
import { Writable as Writable2 } from "node:stream";
var ServerResponse;
var init_response = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/response.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ServerResponse = class extends Writable2 {
      static {
        __name(this, "ServerResponse");
      }
      __unenv__ = true;
      statusCode = 200;
      statusMessage = "";
      upgrading = false;
      chunkedEncoding = false;
      shouldKeepAlive = false;
      useChunkedEncodingByDefault = false;
      sendDate = false;
      finished = false;
      headersSent = false;
      strictContentLength = false;
      connection = null;
      socket = null;
      req;
      _headers = {};
      constructor(req) {
        super();
        this.req = req;
      }
      assignSocket(socket) {
        socket._httpMessage = this;
        this.socket = socket;
        this.connection = socket;
        this.emit("socket", socket);
        this._flush();
      }
      _flush() {
        this.flushHeaders();
      }
      detachSocket(_socket) {
      }
      writeContinue(_callback) {
      }
      writeHead(statusCode, arg1, arg2) {
        if (statusCode) {
          this.statusCode = statusCode;
        }
        if (typeof arg1 === "string") {
          this.statusMessage = arg1;
          arg1 = void 0;
        }
        const headers = arg2 || arg1;
        if (headers) {
          if (Array.isArray(headers)) {
          } else {
            for (const key in headers) {
              this.setHeader(key, headers[key]);
            }
          }
        }
        this.headersSent = true;
        return this;
      }
      writeProcessing() {
      }
      setTimeout(_msecs, _callback) {
        return this;
      }
      appendHeader(name, value) {
        name = name.toLowerCase();
        const current = this._headers[name];
        const all = [...Array.isArray(current) ? current : [current], ...Array.isArray(value) ? value : [value]].filter(Boolean);
        this._headers[name] = all.length > 1 ? all : all[0];
        return this;
      }
      setHeader(name, value) {
        this._headers[name.toLowerCase()] = Array.isArray(value) ? [...value] : value;
        return this;
      }
      setHeaders(headers) {
        for (const [key, value] of headers.entries()) {
          this.setHeader(key, value);
        }
        return this;
      }
      getHeader(name) {
        return this._headers[name.toLowerCase()];
      }
      getHeaders() {
        return this._headers;
      }
      getHeaderNames() {
        return Object.keys(this._headers);
      }
      hasHeader(name) {
        return name.toLowerCase() in this._headers;
      }
      removeHeader(name) {
        delete this._headers[name.toLowerCase()];
      }
      addTrailers(_headers) {
      }
      flushHeaders() {
      }
      writeEarlyHints(_headers, cb) {
        if (typeof cb === "function") {
          cb();
        }
      }
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/agent.mjs
import { EventEmitter as EventEmitter2 } from "node:events";
var Agent;
var init_agent = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/agent.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Agent = class extends EventEmitter2 {
      static {
        __name(this, "Agent");
      }
      __unenv__ = {};
      maxFreeSockets = 256;
      maxSockets = Infinity;
      maxTotalSockets = Infinity;
      freeSockets = {};
      sockets = {};
      requests = {};
      options;
      constructor(opts = {}) {
        super();
        this.options = opts;
      }
      destroy() {
      }
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/constants.mjs
var METHODS, STATUS_CODES, maxHeaderSize;
var init_constants2 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/http/constants.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    METHODS = [
      "ACL",
      "BIND",
      "CHECKOUT",
      "CONNECT",
      "COPY",
      "DELETE",
      "GET",
      "HEAD",
      "LINK",
      "LOCK",
      "M-SEARCH",
      "MERGE",
      "MKACTIVITY",
      "MKCALENDAR",
      "MKCOL",
      "MOVE",
      "NOTIFY",
      "OPTIONS",
      "PATCH",
      "POST",
      "PRI",
      "PROPFIND",
      "PROPPATCH",
      "PURGE",
      "PUT",
      "REBIND",
      "REPORT",
      "SEARCH",
      "SOURCE",
      "SUBSCRIBE",
      "TRACE",
      "UNBIND",
      "UNLINK",
      "UNLOCK",
      "UNSUBSCRIBE"
    ];
    STATUS_CODES = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      103: "Early Hints",
      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "URI Too Long",
      415: "Unsupported Media Type",
      416: "Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a Teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      425: "Too Early",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      451: "Unavailable For Legal Reasons",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      509: "Bandwidth Limit Exceeded",
      510: "Not Extended",
      511: "Network Authentication Required"
    };
    maxHeaderSize = 16384;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/http.mjs
var createServer, request, get, Server, OutgoingMessage, ClientRequest, globalAgent, validateHeaderName, validateHeaderValue, setMaxIdleHTTPParsers, _connectionListener, WebSocket2, CloseEvent, MessageEvent, http_default;
var init_http = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/http.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_request();
    init_response();
    init_agent();
    init_constants2();
    init_request();
    init_response();
    createServer = /* @__PURE__ */ notImplemented("http.createServer");
    request = /* @__PURE__ */ notImplemented("http.request");
    get = /* @__PURE__ */ notImplemented("http.get");
    Server = /* @__PURE__ */ notImplementedClass("http.Server");
    OutgoingMessage = /* @__PURE__ */ notImplementedClass("http.OutgoingMessage");
    ClientRequest = /* @__PURE__ */ notImplementedClass("http.ClientRequest");
    globalAgent = new Agent();
    validateHeaderName = /* @__PURE__ */ notImplemented("http.validateHeaderName");
    validateHeaderValue = /* @__PURE__ */ notImplemented("http.validateHeaderValue");
    setMaxIdleHTTPParsers = /* @__PURE__ */ notImplemented("http.setMaxIdleHTTPParsers");
    _connectionListener = /* @__PURE__ */ notImplemented("http._connectionListener");
    WebSocket2 = globalThis.WebSocket || /* @__PURE__ */ notImplementedClass("WebSocket");
    CloseEvent = globalThis.CloseEvent || /* @__PURE__ */ notImplementedClass("CloseEvent");
    MessageEvent = globalThis.MessageEvent || /* @__PURE__ */ notImplementedClass("MessageEvent");
    http_default = {
      METHODS,
      STATUS_CODES,
      maxHeaderSize,
      IncomingMessage,
      ServerResponse,
      WebSocket: WebSocket2,
      CloseEvent,
      MessageEvent,
      createServer,
      request,
      get,
      Server,
      OutgoingMessage,
      ClientRequest,
      Agent,
      globalAgent,
      validateHeaderName,
      validateHeaderValue,
      setMaxIdleHTTPParsers,
      _connectionListener
    };
  }
});

// node-built-in-modules:http
var require_http = __commonJS({
  "node-built-in-modules:http"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_http();
    module.exports = http_default;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/https.mjs
var Server2, Agent2, globalAgent2, get2, createServer2, request2, https_default;
var init_https = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/https.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_agent();
    Server2 = /* @__PURE__ */ notImplementedClass("https.Server");
    Agent2 = Agent;
    globalAgent2 = /* @__PURE__ */ new Agent2();
    get2 = /* @__PURE__ */ notImplemented("https.get");
    createServer2 = /* @__PURE__ */ notImplemented("https.createServer");
    request2 = /* @__PURE__ */ notImplemented("https.request");
    https_default = {
      Server: Server2,
      Agent: Agent2,
      globalAgent: globalAgent2,
      get: get2,
      createServer: createServer2,
      request: request2
    };
  }
});

// node-built-in-modules:https
var require_https = __commonJS({
  "node-built-in-modules:https"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_https();
    module.exports = https_default;
  }
});

// node-built-in-modules:zlib
import libDefault4 from "zlib";
var require_zlib = __commonJS({
  "node-built-in-modules:zlib"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault4;
  }
});

// node-built-in-modules:stream
import libDefault5 from "stream";
var require_stream = __commonJS({
  "node-built-in-modules:stream"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault5;
  }
});

// ../node_modules/nodemailer/lib/fetch/cookies.js
var require_cookies = __commonJS({
  "../node_modules/nodemailer/lib/fetch/cookies.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var urllib = require_url();
    var SESSION_TIMEOUT = 1800;
    var Cookies = class {
      static {
        __name(this, "Cookies");
      }
      constructor(options) {
        this.options = options || {};
        this.cookies = [];
      }
      /**
       * Stores a cookie string to the cookie storage
       *
       * @param {String} cookieStr Value from the 'Set-Cookie:' header
       * @param {String} url Current URL
       */
      set(cookieStr, url) {
        let urlparts = urllib.parse(url || "");
        let cookie = this.parse(cookieStr);
        let domain2;
        if (cookie.domain) {
          domain2 = cookie.domain.replace(/^\./, "");
          if (
            // can't be valid if the requested domain is shorter than current hostname
            urlparts.hostname.length < domain2.length || // prefix domains with dot to be sure that partial matches are not used
            ("." + urlparts.hostname).substr(-domain2.length + 1) !== "." + domain2
          ) {
            cookie.domain = urlparts.hostname;
          }
        } else {
          cookie.domain = urlparts.hostname;
        }
        if (!cookie.path) {
          cookie.path = this.getPath(urlparts.pathname);
        }
        if (!cookie.expires) {
          cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1e3);
        }
        return this.add(cookie);
      }
      /**
       * Returns cookie string for the 'Cookie:' header.
       *
       * @param {String} url URL to check for
       * @returns {String} Cookie header or empty string if no matches were found
       */
      get(url) {
        return this.list(url).map((cookie) => cookie.name + "=" + cookie.value).join("; ");
      }
      /**
       * Lists all valied cookie objects for the specified URL
       *
       * @param {String} url URL to check for
       * @returns {Array} An array of cookie objects
       */
      list(url) {
        let result = [];
        let i;
        let cookie;
        for (i = this.cookies.length - 1; i >= 0; i--) {
          cookie = this.cookies[i];
          if (this.isExpired(cookie)) {
            this.cookies.splice(i, i);
            continue;
          }
          if (this.match(cookie, url)) {
            result.unshift(cookie);
          }
        }
        return result;
      }
      /**
       * Parses cookie string from the 'Set-Cookie:' header
       *
       * @param {String} cookieStr String from the 'Set-Cookie:' header
       * @returns {Object} Cookie object
       */
      parse(cookieStr) {
        let cookie = {};
        (cookieStr || "").toString().split(";").forEach((cookiePart) => {
          let valueParts = cookiePart.split("=");
          let key = valueParts.shift().trim().toLowerCase();
          let value = valueParts.join("=").trim();
          let domain2;
          if (!key) {
            return;
          }
          switch (key) {
            case "expires":
              value = new Date(value);
              if (value.toString() !== "Invalid Date") {
                cookie.expires = value;
              }
              break;
            case "path":
              cookie.path = value;
              break;
            case "domain":
              domain2 = value.toLowerCase();
              if (domain2.length && domain2.charAt(0) !== ".") {
                domain2 = "." + domain2;
              }
              cookie.domain = domain2;
              break;
            case "max-age":
              cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1e3);
              break;
            case "secure":
              cookie.secure = true;
              break;
            case "httponly":
              cookie.httponly = true;
              break;
            default:
              if (!cookie.name) {
                cookie.name = key;
                cookie.value = value;
              }
          }
        });
        return cookie;
      }
      /**
       * Checks if a cookie object is valid for a specified URL
       *
       * @param {Object} cookie Cookie object
       * @param {String} url URL to check for
       * @returns {Boolean} true if cookie is valid for specifiec URL
       */
      match(cookie, url) {
        let urlparts = urllib.parse(url || "");
        if (urlparts.hostname !== cookie.domain && (cookie.domain.charAt(0) !== "." || ("." + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)) {
          return false;
        }
        let path = this.getPath(urlparts.pathname);
        if (path.substr(0, cookie.path.length) !== cookie.path) {
          return false;
        }
        if (cookie.secure && urlparts.protocol !== "https:") {
          return false;
        }
        return true;
      }
      /**
       * Adds (or updates/removes if needed) a cookie object to the cookie storage
       *
       * @param {Object} cookie Cookie value to be stored
       */
      add(cookie) {
        let i;
        let len;
        if (!cookie || !cookie.name) {
          return false;
        }
        for (i = 0, len = this.cookies.length; i < len; i++) {
          if (this.compare(this.cookies[i], cookie)) {
            if (this.isExpired(cookie)) {
              this.cookies.splice(i, 1);
              return false;
            }
            this.cookies[i] = cookie;
            return true;
          }
        }
        if (!this.isExpired(cookie)) {
          this.cookies.push(cookie);
        }
        return true;
      }
      /**
       * Checks if two cookie objects are the same
       *
       * @param {Object} a Cookie to check against
       * @param {Object} b Cookie to check against
       * @returns {Boolean} True, if the cookies are the same
       */
      compare(a, b) {
        return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === a.httponly;
      }
      /**
       * Checks if a cookie is expired
       *
       * @param {Object} cookie Cookie object to check against
       * @returns {Boolean} True, if the cookie is expired
       */
      isExpired(cookie) {
        return cookie.expires && cookie.expires < /* @__PURE__ */ new Date() || !cookie.value;
      }
      /**
       * Returns normalized cookie path for an URL path argument
       *
       * @param {String} pathname
       * @returns {String} Normalized path
       */
      getPath(pathname) {
        let path = (pathname || "/").split("/");
        path.pop();
        path = path.join("/").trim();
        if (path.charAt(0) !== "/") {
          path = "/" + path;
        }
        if (path.substr(-1) !== "/") {
          path += "/";
        }
        return path;
      }
    };
    module.exports = Cookies;
  }
});

// ../node_modules/nodemailer/package.json
var require_package = __commonJS({
  "../node_modules/nodemailer/package.json"(exports, module) {
    module.exports = {
      name: "nodemailer",
      version: "7.0.12",
      description: "Easy as cake e-mail sending from your Node.js applications",
      main: "lib/nodemailer.js",
      scripts: {
        test: "node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js",
        "test:coverage": "c8 node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js",
        format: 'prettier --write "**/*.{js,json,md}"',
        "format:check": 'prettier --check "**/*.{js,json,md}"',
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
        update: "rm -rf node_modules/ package-lock.json && ncu -u && npm install"
      },
      repository: {
        type: "git",
        url: "https://github.com/nodemailer/nodemailer.git"
      },
      keywords: [
        "Nodemailer"
      ],
      author: "Andris Reinman",
      license: "MIT-0",
      bugs: {
        url: "https://github.com/nodemailer/nodemailer/issues"
      },
      homepage: "https://nodemailer.com/",
      devDependencies: {
        "@aws-sdk/client-sesv2": "3.940.0",
        bunyan: "1.8.15",
        c8: "10.1.3",
        eslint: "9.39.1",
        "eslint-config-prettier": "10.1.8",
        globals: "16.5.0",
        libbase64: "1.3.0",
        libmime: "5.3.7",
        libqp: "2.1.1",
        "nodemailer-ntlm-auth": "1.0.4",
        prettier: "3.6.2",
        proxy: "1.0.2",
        "proxy-test-server": "1.0.0",
        "smtp-server": "3.16.1"
      },
      engines: {
        node: ">=6.0.0"
      }
    };
  }
});

// node-built-in-modules:net
import libDefault6 from "net";
var require_net = __commonJS({
  "node-built-in-modules:net"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault6;
  }
});

// ../node_modules/nodemailer/lib/fetch/index.js
var require_fetch = __commonJS({
  "../node_modules/nodemailer/lib/fetch/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var http = require_http();
    var https = require_https();
    var urllib = require_url();
    var zlib = require_zlib();
    var PassThrough = require_stream().PassThrough;
    var Cookies = require_cookies();
    var packageData = require_package();
    var net = require_net();
    var MAX_REDIRECTS = 5;
    module.exports = function(url, options) {
      return nmfetch(url, options);
    };
    module.exports.Cookies = Cookies;
    function nmfetch(url, options) {
      options = options || {};
      options.fetchRes = options.fetchRes || new PassThrough();
      options.cookies = options.cookies || new Cookies();
      options.redirects = options.redirects || 0;
      options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;
      if (options.cookie) {
        [].concat(options.cookie || []).forEach((cookie) => {
          options.cookies.set(cookie, url);
        });
        options.cookie = false;
      }
      let fetchRes = options.fetchRes;
      let parsed = urllib.parse(url);
      let method = (options.method || "").toString().trim().toUpperCase() || "GET";
      let finished = false;
      let cookies;
      let body;
      let handler = parsed.protocol === "https:" ? https : http;
      let headers = {
        "accept-encoding": "gzip,deflate",
        "user-agent": "nodemailer/" + packageData.version
      };
      Object.keys(options.headers || {}).forEach((key) => {
        headers[key.toLowerCase().trim()] = options.headers[key];
      });
      if (options.userAgent) {
        headers["user-agent"] = options.userAgent;
      }
      if (parsed.auth) {
        headers.Authorization = "Basic " + Buffer.from(parsed.auth).toString("base64");
      }
      if (cookies = options.cookies.get(url)) {
        headers.cookie = cookies;
      }
      if (options.body) {
        if (options.contentType !== false) {
          headers["Content-Type"] = options.contentType || "application/x-www-form-urlencoded";
        }
        if (typeof options.body.pipe === "function") {
          headers["Transfer-Encoding"] = "chunked";
          body = options.body;
          body.on("error", (err) => {
            if (finished) {
              return;
            }
            finished = true;
            err.type = "FETCH";
            err.sourceUrl = url;
            fetchRes.emit("error", err);
          });
        } else {
          if (options.body instanceof Buffer) {
            body = options.body;
          } else if (typeof options.body === "object") {
            try {
              body = Buffer.from(
                Object.keys(options.body).map((key) => {
                  let value = options.body[key].toString().trim();
                  return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }).join("&")
              );
            } catch (E) {
              if (finished) {
                return;
              }
              finished = true;
              E.type = "FETCH";
              E.sourceUrl = url;
              fetchRes.emit("error", E);
              return;
            }
          } else {
            body = Buffer.from(options.body.toString().trim());
          }
          headers["Content-Type"] = options.contentType || "application/x-www-form-urlencoded";
          headers["Content-Length"] = body.length;
        }
        method = (options.method || "").toString().trim().toUpperCase() || "POST";
      }
      let req;
      let reqOptions = {
        method,
        host: parsed.hostname,
        path: parsed.path,
        port: parsed.port ? parsed.port : parsed.protocol === "https:" ? 443 : 80,
        headers,
        rejectUnauthorized: false,
        agent: false
      };
      if (options.tls) {
        Object.keys(options.tls).forEach((key) => {
          reqOptions[key] = options.tls[key];
        });
      }
      if (parsed.protocol === "https:" && parsed.hostname && parsed.hostname !== reqOptions.host && !net.isIP(parsed.hostname) && !reqOptions.servername) {
        reqOptions.servername = parsed.hostname;
      }
      try {
        req = handler.request(reqOptions);
      } catch (E) {
        finished = true;
        setImmediate(() => {
          E.type = "FETCH";
          E.sourceUrl = url;
          fetchRes.emit("error", E);
        });
        return fetchRes;
      }
      if (options.timeout) {
        req.setTimeout(options.timeout, () => {
          if (finished) {
            return;
          }
          finished = true;
          req.abort();
          let err = new Error("Request Timeout");
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
        });
      }
      req.on("error", (err) => {
        if (finished) {
          return;
        }
        finished = true;
        err.type = "FETCH";
        err.sourceUrl = url;
        fetchRes.emit("error", err);
      });
      req.on("response", (res) => {
        let inflate;
        if (finished) {
          return;
        }
        switch (res.headers["content-encoding"]) {
          case "gzip":
          case "deflate":
            inflate = zlib.createUnzip();
            break;
        }
        if (res.headers["set-cookie"]) {
          [].concat(res.headers["set-cookie"] || []).forEach((cookie) => {
            options.cookies.set(cookie, url);
          });
        }
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          options.redirects++;
          if (options.redirects > options.maxRedirects) {
            finished = true;
            let err = new Error("Maximum redirect count exceeded");
            err.type = "FETCH";
            err.sourceUrl = url;
            fetchRes.emit("error", err);
            req.abort();
            return;
          }
          options.method = "GET";
          options.body = false;
          return nmfetch(urllib.resolve(url, res.headers.location), options);
        }
        fetchRes.statusCode = res.statusCode;
        fetchRes.headers = res.headers;
        if (res.statusCode >= 300 && !options.allowErrorResponse) {
          finished = true;
          let err = new Error("Invalid status code " + res.statusCode);
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
          req.abort();
          return;
        }
        res.on("error", (err) => {
          if (finished) {
            return;
          }
          finished = true;
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
          req.abort();
        });
        if (inflate) {
          res.pipe(inflate).pipe(fetchRes);
          inflate.on("error", (err) => {
            if (finished) {
              return;
            }
            finished = true;
            err.type = "FETCH";
            err.sourceUrl = url;
            fetchRes.emit("error", err);
            req.abort();
          });
        } else {
          res.pipe(fetchRes);
        }
      });
      setImmediate(() => {
        if (body) {
          try {
            if (typeof body.pipe === "function") {
              return body.pipe(req);
            } else {
              req.write(body);
            }
          } catch (err) {
            finished = true;
            err.type = "FETCH";
            err.sourceUrl = url;
            fetchRes.emit("error", err);
            return;
          }
        }
        req.end();
      });
      return fetchRes;
    }
    __name(nmfetch, "nmfetch");
  }
});

// node-built-in-modules:dns
import libDefault7 from "dns";
var require_dns = __commonJS({
  "node-built-in-modules:dns"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault7;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/os/constants.mjs
var UV_UDP_REUSEADDR, dlopen2, errno, signals, priority;
var init_constants3 = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/os/constants.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    UV_UDP_REUSEADDR = 4;
    dlopen2 = {
      RTLD_LAZY: 1,
      RTLD_NOW: 2,
      RTLD_GLOBAL: 256,
      RTLD_LOCAL: 0,
      RTLD_DEEPBIND: 8
    };
    errno = {
      E2BIG: 7,
      EACCES: 13,
      EADDRINUSE: 98,
      EADDRNOTAVAIL: 99,
      EAFNOSUPPORT: 97,
      EAGAIN: 11,
      EALREADY: 114,
      EBADF: 9,
      EBADMSG: 74,
      EBUSY: 16,
      ECANCELED: 125,
      ECHILD: 10,
      ECONNABORTED: 103,
      ECONNREFUSED: 111,
      ECONNRESET: 104,
      EDEADLK: 35,
      EDESTADDRREQ: 89,
      EDOM: 33,
      EDQUOT: 122,
      EEXIST: 17,
      EFAULT: 14,
      EFBIG: 27,
      EHOSTUNREACH: 113,
      EIDRM: 43,
      EILSEQ: 84,
      EINPROGRESS: 115,
      EINTR: 4,
      EINVAL: 22,
      EIO: 5,
      EISCONN: 106,
      EISDIR: 21,
      ELOOP: 40,
      EMFILE: 24,
      EMLINK: 31,
      EMSGSIZE: 90,
      EMULTIHOP: 72,
      ENAMETOOLONG: 36,
      ENETDOWN: 100,
      ENETRESET: 102,
      ENETUNREACH: 101,
      ENFILE: 23,
      ENOBUFS: 105,
      ENODATA: 61,
      ENODEV: 19,
      ENOENT: 2,
      ENOEXEC: 8,
      ENOLCK: 37,
      ENOLINK: 67,
      ENOMEM: 12,
      ENOMSG: 42,
      ENOPROTOOPT: 92,
      ENOSPC: 28,
      ENOSR: 63,
      ENOSTR: 60,
      ENOSYS: 38,
      ENOTCONN: 107,
      ENOTDIR: 20,
      ENOTEMPTY: 39,
      ENOTSOCK: 88,
      ENOTSUP: 95,
      ENOTTY: 25,
      ENXIO: 6,
      EOPNOTSUPP: 95,
      EOVERFLOW: 75,
      EPERM: 1,
      EPIPE: 32,
      EPROTO: 71,
      EPROTONOSUPPORT: 93,
      EPROTOTYPE: 91,
      ERANGE: 34,
      EROFS: 30,
      ESPIPE: 29,
      ESRCH: 3,
      ESTALE: 116,
      ETIME: 62,
      ETIMEDOUT: 110,
      ETXTBSY: 26,
      EWOULDBLOCK: 11,
      EXDEV: 18
    };
    signals = {
      SIGHUP: 1,
      SIGINT: 2,
      SIGQUIT: 3,
      SIGILL: 4,
      SIGTRAP: 5,
      SIGABRT: 6,
      SIGIOT: 6,
      SIGBUS: 7,
      SIGFPE: 8,
      SIGKILL: 9,
      SIGUSR1: 10,
      SIGSEGV: 11,
      SIGUSR2: 12,
      SIGPIPE: 13,
      SIGALRM: 14,
      SIGTERM: 15,
      SIGCHLD: 17,
      SIGSTKFLT: 16,
      SIGCONT: 18,
      SIGSTOP: 19,
      SIGTSTP: 20,
      SIGTTIN: 21,
      SIGTTOU: 22,
      SIGURG: 23,
      SIGXCPU: 24,
      SIGXFSZ: 25,
      SIGVTALRM: 26,
      SIGPROF: 27,
      SIGWINCH: 28,
      SIGIO: 29,
      SIGPOLL: 29,
      SIGPWR: 30,
      SIGSYS: 31
    };
    priority = {
      PRIORITY_LOW: 19,
      PRIORITY_BELOW_NORMAL: 10,
      PRIORITY_NORMAL: 0,
      PRIORITY_ABOVE_NORMAL: -7,
      PRIORITY_HIGH: -14,
      PRIORITY_HIGHEST: -20
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/os.mjs
var constants, NUM_CPUS, availableParallelism, arch2, machine, endianness, cpus, getPriority, setPriority, homedir, tmpdir, devNull, freemem, totalmem, loadavg, uptime2, hostname, networkInterfaces, platform2, type, release2, version2, userInfo, EOL, os_default;
var init_os = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/os.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_constants3();
    constants = {
      UV_UDP_REUSEADDR,
      dlopen: dlopen2,
      errno,
      signals,
      priority
    };
    NUM_CPUS = 8;
    availableParallelism = /* @__PURE__ */ __name(() => NUM_CPUS, "availableParallelism");
    arch2 = /* @__PURE__ */ __name(() => "", "arch");
    machine = /* @__PURE__ */ __name(() => "", "machine");
    endianness = /* @__PURE__ */ __name(() => "LE", "endianness");
    cpus = /* @__PURE__ */ __name(() => {
      const info3 = {
        model: "",
        speed: 0,
        times: {
          user: 0,
          nice: 0,
          sys: 0,
          idle: 0,
          irq: 0
        }
      };
      return Array.from({ length: NUM_CPUS }, () => info3);
    }, "cpus");
    getPriority = /* @__PURE__ */ __name(() => 0, "getPriority");
    setPriority = /* @__PURE__ */ notImplemented("os.setPriority");
    homedir = /* @__PURE__ */ __name(() => "/", "homedir");
    tmpdir = /* @__PURE__ */ __name(() => "/tmp", "tmpdir");
    devNull = "/dev/null";
    freemem = /* @__PURE__ */ __name(() => 0, "freemem");
    totalmem = /* @__PURE__ */ __name(() => 0, "totalmem");
    loadavg = /* @__PURE__ */ __name(() => [
      0,
      0,
      0
    ], "loadavg");
    uptime2 = /* @__PURE__ */ __name(() => 0, "uptime");
    hostname = /* @__PURE__ */ __name(() => "", "hostname");
    networkInterfaces = /* @__PURE__ */ __name(() => {
      return { lo0: [
        {
          address: "127.0.0.1",
          netmask: "255.0.0.0",
          family: "IPv4",
          mac: "00:00:00:00:00:00",
          internal: true,
          cidr: "127.0.0.1/8"
        },
        {
          address: "::1",
          netmask: "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
          family: "IPv6",
          mac: "00:00:00:00:00:00",
          internal: true,
          cidr: "::1/128",
          scopeid: 0
        },
        {
          address: "fe80::1",
          netmask: "ffff:ffff:ffff:ffff::",
          family: "IPv6",
          mac: "00:00:00:00:00:00",
          internal: true,
          cidr: "fe80::1/64",
          scopeid: 1
        }
      ] };
    }, "networkInterfaces");
    platform2 = /* @__PURE__ */ __name(() => "linux", "platform");
    type = /* @__PURE__ */ __name(() => "Linux", "type");
    release2 = /* @__PURE__ */ __name(() => "", "release");
    version2 = /* @__PURE__ */ __name(() => "", "version");
    userInfo = /* @__PURE__ */ __name((opts) => {
      const encode2 = /* @__PURE__ */ __name((str) => {
        if (opts?.encoding) {
          const buff = Buffer.from(str);
          return opts.encoding === "buffer" ? buff : buff.toString(opts.encoding);
        }
        return str;
      }, "encode");
      return {
        gid: 1e3,
        uid: 1e3,
        homedir: encode2("/"),
        shell: encode2("/bin/sh"),
        username: encode2("root")
      };
    }, "userInfo");
    EOL = "\n";
    os_default = {
      arch: arch2,
      availableParallelism,
      constants,
      cpus,
      EOL,
      endianness,
      devNull,
      freemem,
      getPriority,
      homedir,
      hostname,
      loadavg,
      machine,
      networkInterfaces,
      platform: platform2,
      release: release2,
      setPriority,
      tmpdir,
      totalmem,
      type,
      uptime: uptime2,
      userInfo,
      version: version2
    };
  }
});

// node-built-in-modules:os
var require_os = __commonJS({
  "node-built-in-modules:os"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_os();
    module.exports = os_default;
  }
});

// ../node_modules/nodemailer/lib/shared/index.js
var require_shared = __commonJS({
  "../node_modules/nodemailer/lib/shared/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var urllib = require_url();
    var util = require_util();
    var fs = require_fs();
    var nmfetch = require_fetch();
    var dns = require_dns();
    var net = require_net();
    var os = require_os();
    var DNS_TTL = 5 * 60 * 1e3;
    var CACHE_CLEANUP_INTERVAL = 30 * 1e3;
    var MAX_CACHE_SIZE = 1e3;
    var lastCacheCleanup = 0;
    module.exports._lastCacheCleanup = () => lastCacheCleanup;
    module.exports._resetCacheCleanup = () => {
      lastCacheCleanup = 0;
    };
    var networkInterfaces2;
    try {
      networkInterfaces2 = os.networkInterfaces();
    } catch (_err) {
    }
    module.exports.networkInterfaces = networkInterfaces2;
    var isFamilySupported = /* @__PURE__ */ __name((family, allowInternal) => {
      let networkInterfaces3 = module.exports.networkInterfaces;
      if (!networkInterfaces3) {
        return true;
      }
      const familySupported = (
        // crux that replaces Object.values(networkInterfaces) as Object.values is not supported in nodejs v6
        Object.keys(networkInterfaces3).map((key) => networkInterfaces3[key]).reduce((acc, val) => acc.concat(val), []).filter((i) => !i.internal || allowInternal).filter((i) => i.family === "IPv" + family || i.family === family).length > 0
      );
      return familySupported;
    }, "isFamilySupported");
    var resolver = /* @__PURE__ */ __name((family, hostname2, options, callback) => {
      options = options || {};
      const familySupported = isFamilySupported(family, options.allowInternalNetworkInterfaces);
      if (!familySupported) {
        return callback(null, []);
      }
      const resolver2 = dns.Resolver ? new dns.Resolver(options) : dns;
      resolver2["resolve" + family](hostname2, (err, addresses) => {
        if (err) {
          switch (err.code) {
            case dns.NODATA:
            case dns.NOTFOUND:
            case dns.NOTIMP:
            case dns.SERVFAIL:
            case dns.CONNREFUSED:
            case dns.REFUSED:
            case "EAI_AGAIN":
              return callback(null, []);
          }
          return callback(err);
        }
        return callback(null, Array.isArray(addresses) ? addresses : [].concat(addresses || []));
      });
    }, "resolver");
    var dnsCache = module.exports.dnsCache = /* @__PURE__ */ new Map();
    var formatDNSValue = /* @__PURE__ */ __name((value, extra) => {
      if (!value) {
        return Object.assign({}, extra || {});
      }
      return Object.assign(
        {
          servername: value.servername,
          host: !value.addresses || !value.addresses.length ? null : value.addresses.length === 1 ? value.addresses[0] : value.addresses[Math.floor(Math.random() * value.addresses.length)]
        },
        extra || {}
      );
    }, "formatDNSValue");
    module.exports.resolveHostname = (options, callback) => {
      options = options || {};
      if (!options.host && options.servername) {
        options.host = options.servername;
      }
      if (!options.host || net.isIP(options.host)) {
        let value = {
          addresses: [options.host],
          servername: options.servername || false
        };
        return callback(
          null,
          formatDNSValue(value, {
            cached: false
          })
        );
      }
      let cached;
      if (dnsCache.has(options.host)) {
        cached = dnsCache.get(options.host);
        const now = Date.now();
        if (now - lastCacheCleanup > CACHE_CLEANUP_INTERVAL) {
          lastCacheCleanup = now;
          for (const [host, entry] of dnsCache.entries()) {
            if (entry.expires && entry.expires < now) {
              dnsCache.delete(host);
            }
          }
          if (dnsCache.size > MAX_CACHE_SIZE) {
            const toDelete = Math.floor(MAX_CACHE_SIZE * 0.1);
            const keys = Array.from(dnsCache.keys()).slice(0, toDelete);
            keys.forEach((key) => dnsCache.delete(key));
          }
        }
        if (!cached.expires || cached.expires >= now) {
          return callback(
            null,
            formatDNSValue(cached.value, {
              cached: true
            })
          );
        }
      }
      resolver(4, options.host, options, (err, addresses) => {
        if (err) {
          if (cached) {
            dnsCache.set(options.host, {
              value: cached.value,
              expires: Date.now() + (options.dnsTtl || DNS_TTL)
            });
            return callback(
              null,
              formatDNSValue(cached.value, {
                cached: true,
                error: err
              })
            );
          }
          return callback(err);
        }
        if (addresses && addresses.length) {
          let value = {
            addresses,
            servername: options.servername || options.host
          };
          dnsCache.set(options.host, {
            value,
            expires: Date.now() + (options.dnsTtl || DNS_TTL)
          });
          return callback(
            null,
            formatDNSValue(value, {
              cached: false
            })
          );
        }
        resolver(6, options.host, options, (err2, addresses2) => {
          if (err2) {
            if (cached) {
              dnsCache.set(options.host, {
                value: cached.value,
                expires: Date.now() + (options.dnsTtl || DNS_TTL)
              });
              return callback(
                null,
                formatDNSValue(cached.value, {
                  cached: true,
                  error: err2
                })
              );
            }
            return callback(err2);
          }
          if (addresses2 && addresses2.length) {
            let value = {
              addresses: addresses2,
              servername: options.servername || options.host
            };
            dnsCache.set(options.host, {
              value,
              expires: Date.now() + (options.dnsTtl || DNS_TTL)
            });
            return callback(
              null,
              formatDNSValue(value, {
                cached: false
              })
            );
          }
          try {
            dns.lookup(options.host, { all: true }, (err3, addresses3) => {
              if (err3) {
                if (cached) {
                  dnsCache.set(options.host, {
                    value: cached.value,
                    expires: Date.now() + (options.dnsTtl || DNS_TTL)
                  });
                  return callback(
                    null,
                    formatDNSValue(cached.value, {
                      cached: true,
                      error: err3
                    })
                  );
                }
                return callback(err3);
              }
              let address = addresses3 ? addresses3.filter((addr) => isFamilySupported(addr.family)).map((addr) => addr.address).shift() : false;
              if (addresses3 && addresses3.length && !address) {
                console.warn(`Failed to resolve IPv${addresses3[0].family} addresses with current network`);
              }
              if (!address && cached) {
                return callback(
                  null,
                  formatDNSValue(cached.value, {
                    cached: true
                  })
                );
              }
              let value = {
                addresses: address ? [address] : [options.host],
                servername: options.servername || options.host
              };
              dnsCache.set(options.host, {
                value,
                expires: Date.now() + (options.dnsTtl || DNS_TTL)
              });
              return callback(
                null,
                formatDNSValue(value, {
                  cached: false
                })
              );
            });
          } catch (_err) {
            if (cached) {
              dnsCache.set(options.host, {
                value: cached.value,
                expires: Date.now() + (options.dnsTtl || DNS_TTL)
              });
              return callback(
                null,
                formatDNSValue(cached.value, {
                  cached: true,
                  error: err2
                })
              );
            }
            return callback(err2);
          }
        });
      });
    };
    module.exports.parseConnectionUrl = (str) => {
      str = str || "";
      let options = {};
      [urllib.parse(str, true)].forEach((url) => {
        let auth;
        switch (url.protocol) {
          case "smtp:":
            options.secure = false;
            break;
          case "smtps:":
            options.secure = true;
            break;
          case "direct:":
            options.direct = true;
            break;
        }
        if (!isNaN(url.port) && Number(url.port)) {
          options.port = Number(url.port);
        }
        if (url.hostname) {
          options.host = url.hostname;
        }
        if (url.auth) {
          auth = url.auth.split(":");
          if (!options.auth) {
            options.auth = {};
          }
          options.auth.user = auth.shift();
          options.auth.pass = auth.join(":");
        }
        Object.keys(url.query || {}).forEach((key) => {
          let obj = options;
          let lKey = key;
          let value = url.query[key];
          if (!isNaN(value)) {
            value = Number(value);
          }
          switch (value) {
            case "true":
              value = true;
              break;
            case "false":
              value = false;
              break;
          }
          if (key.indexOf("tls.") === 0) {
            lKey = key.substr(4);
            if (!options.tls) {
              options.tls = {};
            }
            obj = options.tls;
          } else if (key.indexOf(".") >= 0) {
            return;
          }
          if (!(lKey in obj)) {
            obj[lKey] = value;
          }
        });
      });
      return options;
    };
    module.exports._logFunc = (logger, level, defaults, data, message, ...args) => {
      let entry = {};
      Object.keys(defaults || {}).forEach((key) => {
        if (key !== "level") {
          entry[key] = defaults[key];
        }
      });
      Object.keys(data || {}).forEach((key) => {
        if (key !== "level") {
          entry[key] = data[key];
        }
      });
      logger[level](entry, message, ...args);
    };
    module.exports.getLogger = (options, defaults) => {
      options = options || {};
      let response = {};
      let levels = ["trace", "debug", "info", "warn", "error", "fatal"];
      if (!options.logger) {
        levels.forEach((level) => {
          response[level] = () => false;
        });
        return response;
      }
      let logger = options.logger;
      if (options.logger === true) {
        logger = createDefaultLogger(levels);
      }
      levels.forEach((level) => {
        response[level] = (data, message, ...args) => {
          module.exports._logFunc(logger, level, defaults, data, message, ...args);
        };
      });
      return response;
    };
    module.exports.callbackPromise = (resolve, reject) => function() {
      let args = Array.from(arguments);
      let err = args.shift();
      if (err) {
        reject(err);
      } else {
        resolve(...args);
      }
    };
    module.exports.parseDataURI = (uri) => {
      if (typeof uri !== "string") {
        return null;
      }
      if (!uri.startsWith("data:")) {
        return null;
      }
      const commaPos = uri.indexOf(",");
      if (commaPos === -1) {
        return null;
      }
      const data = uri.substring(commaPos + 1);
      const metaStr = uri.substring("data:".length, commaPos);
      let encoding;
      const metaEntries = metaStr.split(";");
      if (metaEntries.length > 0) {
        const lastEntry = metaEntries[metaEntries.length - 1].toLowerCase().trim();
        if (["base64", "utf8", "utf-8"].includes(lastEntry) && lastEntry.indexOf("=") === -1) {
          encoding = lastEntry;
          metaEntries.pop();
        }
      }
      const contentType = metaEntries.length > 0 ? metaEntries.shift() : "application/octet-stream";
      const params = {};
      for (let i = 0; i < metaEntries.length; i++) {
        const entry = metaEntries[i];
        const sepPos = entry.indexOf("=");
        if (sepPos > 0) {
          const key = entry.substring(0, sepPos).trim();
          const value = entry.substring(sepPos + 1).trim();
          if (key) {
            params[key] = value;
          }
        }
      }
      let bufferData;
      try {
        if (encoding === "base64") {
          bufferData = Buffer.from(data, "base64");
        } else {
          try {
            bufferData = Buffer.from(decodeURIComponent(data));
          } catch (_decodeError) {
            bufferData = Buffer.from(data);
          }
        }
      } catch (_bufferError) {
        bufferData = Buffer.alloc(0);
      }
      return {
        data: bufferData,
        encoding: encoding || null,
        contentType: contentType || "application/octet-stream",
        params
      };
    };
    module.exports.resolveContent = (data, key, callback) => {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = module.exports.callbackPromise(resolve, reject);
        });
      }
      let content = data && data[key] && data[key].content || data[key];
      let contentStream;
      let encoding = (typeof data[key] === "object" && data[key].encoding || "utf8").toString().toLowerCase().replace(/[-_\s]/g, "");
      if (!content) {
        return callback(null, content);
      }
      if (typeof content === "object") {
        if (typeof content.pipe === "function") {
          return resolveStream(content, (err, value) => {
            if (err) {
              return callback(err);
            }
            if (data[key].content) {
              data[key].content = value;
            } else {
              data[key] = value;
            }
            callback(null, value);
          });
        } else if (/^https?:\/\//i.test(content.path || content.href)) {
          contentStream = nmfetch(content.path || content.href);
          return resolveStream(contentStream, callback);
        } else if (/^data:/i.test(content.path || content.href)) {
          let parsedDataUri = module.exports.parseDataURI(content.path || content.href);
          if (!parsedDataUri || !parsedDataUri.data) {
            return callback(null, Buffer.from(0));
          }
          return callback(null, parsedDataUri.data);
        } else if (content.path) {
          return resolveStream(fs.createReadStream(content.path), callback);
        }
      }
      if (typeof data[key].content === "string" && !["utf8", "usascii", "ascii"].includes(encoding)) {
        content = Buffer.from(data[key].content, encoding);
      }
      setImmediate(() => callback(null, content));
      return promise;
    };
    module.exports.assign = function() {
      let args = Array.from(arguments);
      let target = args.shift() || {};
      args.forEach((source) => {
        Object.keys(source || {}).forEach((key) => {
          if (["tls", "auth"].includes(key) && source[key] && typeof source[key] === "object") {
            if (!target[key]) {
              target[key] = {};
            }
            Object.keys(source[key]).forEach((subKey) => {
              target[key][subKey] = source[key][subKey];
            });
          } else {
            target[key] = source[key];
          }
        });
      });
      return target;
    };
    module.exports.encodeXText = (str) => {
      if (!/[^\x21-\x2A\x2C-\x3C\x3E-\x7E]/.test(str)) {
        return str;
      }
      let buf = Buffer.from(str);
      let result = "";
      for (let i = 0, len = buf.length; i < len; i++) {
        let c = buf[i];
        if (c < 33 || c > 126 || c === 43 || c === 61) {
          result += "+" + (c < 16 ? "0" : "") + c.toString(16).toUpperCase();
        } else {
          result += String.fromCharCode(c);
        }
      }
      return result;
    };
    function resolveStream(stream, callback) {
      let responded = false;
      let chunks = [];
      let chunklen = 0;
      stream.on("error", (err) => {
        if (responded) {
          return;
        }
        responded = true;
        callback(err);
      });
      stream.on("readable", () => {
        let chunk;
        while ((chunk = stream.read()) !== null) {
          chunks.push(chunk);
          chunklen += chunk.length;
        }
      });
      stream.on("end", () => {
        if (responded) {
          return;
        }
        responded = true;
        let value;
        try {
          value = Buffer.concat(chunks, chunklen);
        } catch (E) {
          return callback(E);
        }
        callback(null, value);
      });
    }
    __name(resolveStream, "resolveStream");
    function createDefaultLogger(levels) {
      let levelMaxLen = 0;
      let levelNames = /* @__PURE__ */ new Map();
      levels.forEach((level) => {
        if (level.length > levelMaxLen) {
          levelMaxLen = level.length;
        }
      });
      levels.forEach((level) => {
        let levelName = level.toUpperCase();
        if (levelName.length < levelMaxLen) {
          levelName += " ".repeat(levelMaxLen - levelName.length);
        }
        levelNames.set(level, levelName);
      });
      let print = /* @__PURE__ */ __name((level, entry, message, ...args) => {
        let prefix = "";
        if (entry) {
          if (entry.tnx === "server") {
            prefix = "S: ";
          } else if (entry.tnx === "client") {
            prefix = "C: ";
          }
          if (entry.sid) {
            prefix = "[" + entry.sid + "] " + prefix;
          }
          if (entry.cid) {
            prefix = "[#" + entry.cid + "] " + prefix;
          }
        }
        message = util.format(message, ...args);
        message.split(/\r?\n/).forEach((line) => {
          console.log("[%s] %s %s", (/* @__PURE__ */ new Date()).toISOString().substr(0, 19).replace(/T/, " "), levelNames.get(level), prefix + line);
        });
      }, "print");
      let logger = {};
      levels.forEach((level) => {
        logger[level] = print.bind(null, level);
      });
      return logger;
    }
    __name(createDefaultLogger, "createDefaultLogger");
  }
});

// node-built-in-modules:path
import libDefault8 from "path";
var require_path = __commonJS({
  "node-built-in-modules:path"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault8;
  }
});

// ../node_modules/nodemailer/lib/mime-funcs/mime-types.js
var require_mime_types = __commonJS({
  "../node_modules/nodemailer/lib/mime-funcs/mime-types.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var path = require_path();
    var defaultMimeType = "application/octet-stream";
    var defaultExtension = "bin";
    var mimeTypes = /* @__PURE__ */ new Map([
      ["application/acad", "dwg"],
      ["application/applixware", "aw"],
      ["application/arj", "arj"],
      ["application/atom+xml", "xml"],
      ["application/atomcat+xml", "atomcat"],
      ["application/atomsvc+xml", "atomsvc"],
      ["application/base64", ["mm", "mme"]],
      ["application/binhex", "hqx"],
      ["application/binhex4", "hqx"],
      ["application/book", ["book", "boo"]],
      ["application/ccxml+xml,", "ccxml"],
      ["application/cdf", "cdf"],
      ["application/cdmi-capability", "cdmia"],
      ["application/cdmi-container", "cdmic"],
      ["application/cdmi-domain", "cdmid"],
      ["application/cdmi-object", "cdmio"],
      ["application/cdmi-queue", "cdmiq"],
      ["application/clariscad", "ccad"],
      ["application/commonground", "dp"],
      ["application/cu-seeme", "cu"],
      ["application/davmount+xml", "davmount"],
      ["application/drafting", "drw"],
      ["application/dsptype", "tsp"],
      ["application/dssc+der", "dssc"],
      ["application/dssc+xml", "xdssc"],
      ["application/dxf", "dxf"],
      ["application/ecmascript", ["js", "es"]],
      ["application/emma+xml", "emma"],
      ["application/envoy", "evy"],
      ["application/epub+zip", "epub"],
      ["application/excel", ["xls", "xl", "xla", "xlb", "xlc", "xld", "xlk", "xll", "xlm", "xlt", "xlv", "xlw"]],
      ["application/exi", "exi"],
      ["application/font-tdpfr", "pfr"],
      ["application/fractals", "fif"],
      ["application/freeloader", "frl"],
      ["application/futuresplash", "spl"],
      ["application/geo+json", "geojson"],
      ["application/gnutar", "tgz"],
      ["application/groupwise", "vew"],
      ["application/hlp", "hlp"],
      ["application/hta", "hta"],
      ["application/hyperstudio", "stk"],
      ["application/i-deas", "unv"],
      ["application/iges", ["iges", "igs"]],
      ["application/inf", "inf"],
      ["application/internet-property-stream", "acx"],
      ["application/ipfix", "ipfix"],
      ["application/java", "class"],
      ["application/java-archive", "jar"],
      ["application/java-byte-code", "class"],
      ["application/java-serialized-object", "ser"],
      ["application/java-vm", "class"],
      ["application/javascript", "js"],
      ["application/json", "json"],
      ["application/lha", "lha"],
      ["application/lzx", "lzx"],
      ["application/mac-binary", "bin"],
      ["application/mac-binhex", "hqx"],
      ["application/mac-binhex40", "hqx"],
      ["application/mac-compactpro", "cpt"],
      ["application/macbinary", "bin"],
      ["application/mads+xml", "mads"],
      ["application/marc", "mrc"],
      ["application/marcxml+xml", "mrcx"],
      ["application/mathematica", "ma"],
      ["application/mathml+xml", "mathml"],
      ["application/mbedlet", "mbd"],
      ["application/mbox", "mbox"],
      ["application/mcad", "mcd"],
      ["application/mediaservercontrol+xml", "mscml"],
      ["application/metalink4+xml", "meta4"],
      ["application/mets+xml", "mets"],
      ["application/mime", "aps"],
      ["application/mods+xml", "mods"],
      ["application/mp21", "m21"],
      ["application/mp4", "mp4"],
      ["application/mspowerpoint", ["ppt", "pot", "pps", "ppz"]],
      ["application/msword", ["doc", "dot", "w6w", "wiz", "word"]],
      ["application/mswrite", "wri"],
      ["application/mxf", "mxf"],
      ["application/netmc", "mcp"],
      ["application/octet-stream", ["*"]],
      ["application/oda", "oda"],
      ["application/oebps-package+xml", "opf"],
      ["application/ogg", "ogx"],
      ["application/olescript", "axs"],
      ["application/onenote", "onetoc"],
      ["application/patch-ops-error+xml", "xer"],
      ["application/pdf", "pdf"],
      ["application/pgp-encrypted", "asc"],
      ["application/pgp-signature", "pgp"],
      ["application/pics-rules", "prf"],
      ["application/pkcs-12", "p12"],
      ["application/pkcs-crl", "crl"],
      ["application/pkcs10", "p10"],
      ["application/pkcs7-mime", ["p7c", "p7m"]],
      ["application/pkcs7-signature", "p7s"],
      ["application/pkcs8", "p8"],
      ["application/pkix-attr-cert", "ac"],
      ["application/pkix-cert", ["cer", "crt"]],
      ["application/pkix-crl", "crl"],
      ["application/pkix-pkipath", "pkipath"],
      ["application/pkixcmp", "pki"],
      ["application/plain", "text"],
      ["application/pls+xml", "pls"],
      ["application/postscript", ["ps", "ai", "eps"]],
      ["application/powerpoint", "ppt"],
      ["application/pro_eng", ["part", "prt"]],
      ["application/prs.cww", "cww"],
      ["application/pskc+xml", "pskcxml"],
      ["application/rdf+xml", "rdf"],
      ["application/reginfo+xml", "rif"],
      ["application/relax-ng-compact-syntax", "rnc"],
      ["application/resource-lists+xml", "rl"],
      ["application/resource-lists-diff+xml", "rld"],
      ["application/ringing-tones", "rng"],
      ["application/rls-services+xml", "rs"],
      ["application/rsd+xml", "rsd"],
      ["application/rss+xml", "xml"],
      ["application/rtf", ["rtf", "rtx"]],
      ["application/sbml+xml", "sbml"],
      ["application/scvp-cv-request", "scq"],
      ["application/scvp-cv-response", "scs"],
      ["application/scvp-vp-request", "spq"],
      ["application/scvp-vp-response", "spp"],
      ["application/sdp", "sdp"],
      ["application/sea", "sea"],
      ["application/set", "set"],
      ["application/set-payment-initiation", "setpay"],
      ["application/set-registration-initiation", "setreg"],
      ["application/shf+xml", "shf"],
      ["application/sla", "stl"],
      ["application/smil", ["smi", "smil"]],
      ["application/smil+xml", "smi"],
      ["application/solids", "sol"],
      ["application/sounder", "sdr"],
      ["application/sparql-query", "rq"],
      ["application/sparql-results+xml", "srx"],
      ["application/srgs", "gram"],
      ["application/srgs+xml", "grxml"],
      ["application/sru+xml", "sru"],
      ["application/ssml+xml", "ssml"],
      ["application/step", ["step", "stp"]],
      ["application/streamingmedia", "ssm"],
      ["application/tei+xml", "tei"],
      ["application/thraud+xml", "tfi"],
      ["application/timestamped-data", "tsd"],
      ["application/toolbook", "tbk"],
      ["application/vda", "vda"],
      ["application/vnd.3gpp.pic-bw-large", "plb"],
      ["application/vnd.3gpp.pic-bw-small", "psb"],
      ["application/vnd.3gpp.pic-bw-var", "pvb"],
      ["application/vnd.3gpp2.tcap", "tcap"],
      ["application/vnd.3m.post-it-notes", "pwn"],
      ["application/vnd.accpac.simply.aso", "aso"],
      ["application/vnd.accpac.simply.imp", "imp"],
      ["application/vnd.acucobol", "acu"],
      ["application/vnd.acucorp", "atc"],
      ["application/vnd.adobe.air-application-installer-package+zip", "air"],
      ["application/vnd.adobe.fxp", "fxp"],
      ["application/vnd.adobe.xdp+xml", "xdp"],
      ["application/vnd.adobe.xfdf", "xfdf"],
      ["application/vnd.ahead.space", "ahead"],
      ["application/vnd.airzip.filesecure.azf", "azf"],
      ["application/vnd.airzip.filesecure.azs", "azs"],
      ["application/vnd.amazon.ebook", "azw"],
      ["application/vnd.americandynamics.acc", "acc"],
      ["application/vnd.amiga.ami", "ami"],
      ["application/vnd.android.package-archive", "apk"],
      ["application/vnd.anser-web-certificate-issue-initiation", "cii"],
      ["application/vnd.anser-web-funds-transfer-initiation", "fti"],
      ["application/vnd.antix.game-component", "atx"],
      ["application/vnd.apple.installer+xml", "mpkg"],
      ["application/vnd.apple.mpegurl", "m3u8"],
      ["application/vnd.aristanetworks.swi", "swi"],
      ["application/vnd.audiograph", "aep"],
      ["application/vnd.blueice.multipass", "mpm"],
      ["application/vnd.bmi", "bmi"],
      ["application/vnd.businessobjects", "rep"],
      ["application/vnd.chemdraw+xml", "cdxml"],
      ["application/vnd.chipnuts.karaoke-mmd", "mmd"],
      ["application/vnd.cinderella", "cdy"],
      ["application/vnd.claymore", "cla"],
      ["application/vnd.cloanto.rp9", "rp9"],
      ["application/vnd.clonk.c4group", "c4g"],
      ["application/vnd.cluetrust.cartomobile-config", "c11amc"],
      ["application/vnd.cluetrust.cartomobile-config-pkg", "c11amz"],
      ["application/vnd.commonspace", "csp"],
      ["application/vnd.contact.cmsg", "cdbcmsg"],
      ["application/vnd.cosmocaller", "cmc"],
      ["application/vnd.crick.clicker", "clkx"],
      ["application/vnd.crick.clicker.keyboard", "clkk"],
      ["application/vnd.crick.clicker.palette", "clkp"],
      ["application/vnd.crick.clicker.template", "clkt"],
      ["application/vnd.crick.clicker.wordbank", "clkw"],
      ["application/vnd.criticaltools.wbs+xml", "wbs"],
      ["application/vnd.ctc-posml", "pml"],
      ["application/vnd.cups-ppd", "ppd"],
      ["application/vnd.curl.car", "car"],
      ["application/vnd.curl.pcurl", "pcurl"],
      ["application/vnd.data-vision.rdz", "rdz"],
      ["application/vnd.denovo.fcselayout-link", "fe_launch"],
      ["application/vnd.dna", "dna"],
      ["application/vnd.dolby.mlp", "mlp"],
      ["application/vnd.dpgraph", "dpg"],
      ["application/vnd.dreamfactory", "dfac"],
      ["application/vnd.dvb.ait", "ait"],
      ["application/vnd.dvb.service", "svc"],
      ["application/vnd.dynageo", "geo"],
      ["application/vnd.ecowin.chart", "mag"],
      ["application/vnd.enliven", "nml"],
      ["application/vnd.epson.esf", "esf"],
      ["application/vnd.epson.msf", "msf"],
      ["application/vnd.epson.quickanime", "qam"],
      ["application/vnd.epson.salt", "slt"],
      ["application/vnd.epson.ssf", "ssf"],
      ["application/vnd.eszigno3+xml", "es3"],
      ["application/vnd.ezpix-album", "ez2"],
      ["application/vnd.ezpix-package", "ez3"],
      ["application/vnd.fdf", "fdf"],
      ["application/vnd.fdsn.seed", "seed"],
      ["application/vnd.flographit", "gph"],
      ["application/vnd.fluxtime.clip", "ftc"],
      ["application/vnd.framemaker", "fm"],
      ["application/vnd.frogans.fnc", "fnc"],
      ["application/vnd.frogans.ltf", "ltf"],
      ["application/vnd.fsc.weblaunch", "fsc"],
      ["application/vnd.fujitsu.oasys", "oas"],
      ["application/vnd.fujitsu.oasys2", "oa2"],
      ["application/vnd.fujitsu.oasys3", "oa3"],
      ["application/vnd.fujitsu.oasysgp", "fg5"],
      ["application/vnd.fujitsu.oasysprs", "bh2"],
      ["application/vnd.fujixerox.ddd", "ddd"],
      ["application/vnd.fujixerox.docuworks", "xdw"],
      ["application/vnd.fujixerox.docuworks.binder", "xbd"],
      ["application/vnd.fuzzysheet", "fzs"],
      ["application/vnd.genomatix.tuxedo", "txd"],
      ["application/vnd.geogebra.file", "ggb"],
      ["application/vnd.geogebra.tool", "ggt"],
      ["application/vnd.geometry-explorer", "gex"],
      ["application/vnd.geonext", "gxt"],
      ["application/vnd.geoplan", "g2w"],
      ["application/vnd.geospace", "g3w"],
      ["application/vnd.gmx", "gmx"],
      ["application/vnd.google-earth.kml+xml", "kml"],
      ["application/vnd.google-earth.kmz", "kmz"],
      ["application/vnd.grafeq", "gqf"],
      ["application/vnd.groove-account", "gac"],
      ["application/vnd.groove-help", "ghf"],
      ["application/vnd.groove-identity-message", "gim"],
      ["application/vnd.groove-injector", "grv"],
      ["application/vnd.groove-tool-message", "gtm"],
      ["application/vnd.groove-tool-template", "tpl"],
      ["application/vnd.groove-vcard", "vcg"],
      ["application/vnd.hal+xml", "hal"],
      ["application/vnd.handheld-entertainment+xml", "zmm"],
      ["application/vnd.hbci", "hbci"],
      ["application/vnd.hhe.lesson-player", "les"],
      ["application/vnd.hp-hpgl", ["hgl", "hpg", "hpgl"]],
      ["application/vnd.hp-hpid", "hpid"],
      ["application/vnd.hp-hps", "hps"],
      ["application/vnd.hp-jlyt", "jlt"],
      ["application/vnd.hp-pcl", "pcl"],
      ["application/vnd.hp-pclxl", "pclxl"],
      ["application/vnd.hydrostatix.sof-data", "sfd-hdstx"],
      ["application/vnd.hzn-3d-crossword", "x3d"],
      ["application/vnd.ibm.minipay", "mpy"],
      ["application/vnd.ibm.modcap", "afp"],
      ["application/vnd.ibm.rights-management", "irm"],
      ["application/vnd.ibm.secure-container", "sc"],
      ["application/vnd.iccprofile", "icc"],
      ["application/vnd.igloader", "igl"],
      ["application/vnd.immervision-ivp", "ivp"],
      ["application/vnd.immervision-ivu", "ivu"],
      ["application/vnd.insors.igm", "igm"],
      ["application/vnd.intercon.formnet", "xpw"],
      ["application/vnd.intergeo", "i2g"],
      ["application/vnd.intu.qbo", "qbo"],
      ["application/vnd.intu.qfx", "qfx"],
      ["application/vnd.ipunplugged.rcprofile", "rcprofile"],
      ["application/vnd.irepository.package+xml", "irp"],
      ["application/vnd.is-xpr", "xpr"],
      ["application/vnd.isac.fcs", "fcs"],
      ["application/vnd.jam", "jam"],
      ["application/vnd.jcp.javame.midlet-rms", "rms"],
      ["application/vnd.jisp", "jisp"],
      ["application/vnd.joost.joda-archive", "joda"],
      ["application/vnd.kahootz", "ktz"],
      ["application/vnd.kde.karbon", "karbon"],
      ["application/vnd.kde.kchart", "chrt"],
      ["application/vnd.kde.kformula", "kfo"],
      ["application/vnd.kde.kivio", "flw"],
      ["application/vnd.kde.kontour", "kon"],
      ["application/vnd.kde.kpresenter", "kpr"],
      ["application/vnd.kde.kspread", "ksp"],
      ["application/vnd.kde.kword", "kwd"],
      ["application/vnd.kenameaapp", "htke"],
      ["application/vnd.kidspiration", "kia"],
      ["application/vnd.kinar", "kne"],
      ["application/vnd.koan", "skp"],
      ["application/vnd.kodak-descriptor", "sse"],
      ["application/vnd.las.las+xml", "lasxml"],
      ["application/vnd.llamagraphics.life-balance.desktop", "lbd"],
      ["application/vnd.llamagraphics.life-balance.exchange+xml", "lbe"],
      ["application/vnd.lotus-1-2-3", "123"],
      ["application/vnd.lotus-approach", "apr"],
      ["application/vnd.lotus-freelance", "pre"],
      ["application/vnd.lotus-notes", "nsf"],
      ["application/vnd.lotus-organizer", "org"],
      ["application/vnd.lotus-screencam", "scm"],
      ["application/vnd.lotus-wordpro", "lwp"],
      ["application/vnd.macports.portpkg", "portpkg"],
      ["application/vnd.mcd", "mcd"],
      ["application/vnd.medcalcdata", "mc1"],
      ["application/vnd.mediastation.cdkey", "cdkey"],
      ["application/vnd.mfer", "mwf"],
      ["application/vnd.mfmp", "mfm"],
      ["application/vnd.micrografx.flo", "flo"],
      ["application/vnd.micrografx.igx", "igx"],
      ["application/vnd.mif", "mif"],
      ["application/vnd.mobius.daf", "daf"],
      ["application/vnd.mobius.dis", "dis"],
      ["application/vnd.mobius.mbk", "mbk"],
      ["application/vnd.mobius.mqy", "mqy"],
      ["application/vnd.mobius.msl", "msl"],
      ["application/vnd.mobius.plc", "plc"],
      ["application/vnd.mobius.txf", "txf"],
      ["application/vnd.mophun.application", "mpn"],
      ["application/vnd.mophun.certificate", "mpc"],
      ["application/vnd.mozilla.xul+xml", "xul"],
      ["application/vnd.ms-artgalry", "cil"],
      ["application/vnd.ms-cab-compressed", "cab"],
      ["application/vnd.ms-excel", ["xls", "xla", "xlc", "xlm", "xlt", "xlw", "xlb", "xll"]],
      ["application/vnd.ms-excel.addin.macroenabled.12", "xlam"],
      ["application/vnd.ms-excel.sheet.binary.macroenabled.12", "xlsb"],
      ["application/vnd.ms-excel.sheet.macroenabled.12", "xlsm"],
      ["application/vnd.ms-excel.template.macroenabled.12", "xltm"],
      ["application/vnd.ms-fontobject", "eot"],
      ["application/vnd.ms-htmlhelp", "chm"],
      ["application/vnd.ms-ims", "ims"],
      ["application/vnd.ms-lrm", "lrm"],
      ["application/vnd.ms-officetheme", "thmx"],
      ["application/vnd.ms-outlook", "msg"],
      ["application/vnd.ms-pki.certstore", "sst"],
      ["application/vnd.ms-pki.pko", "pko"],
      ["application/vnd.ms-pki.seccat", "cat"],
      ["application/vnd.ms-pki.stl", "stl"],
      ["application/vnd.ms-pkicertstore", "sst"],
      ["application/vnd.ms-pkiseccat", "cat"],
      ["application/vnd.ms-pkistl", "stl"],
      ["application/vnd.ms-powerpoint", ["ppt", "pot", "pps", "ppa", "pwz"]],
      ["application/vnd.ms-powerpoint.addin.macroenabled.12", "ppam"],
      ["application/vnd.ms-powerpoint.presentation.macroenabled.12", "pptm"],
      ["application/vnd.ms-powerpoint.slide.macroenabled.12", "sldm"],
      ["application/vnd.ms-powerpoint.slideshow.macroenabled.12", "ppsm"],
      ["application/vnd.ms-powerpoint.template.macroenabled.12", "potm"],
      ["application/vnd.ms-project", "mpp"],
      ["application/vnd.ms-word.document.macroenabled.12", "docm"],
      ["application/vnd.ms-word.template.macroenabled.12", "dotm"],
      ["application/vnd.ms-works", ["wks", "wcm", "wdb", "wps"]],
      ["application/vnd.ms-wpl", "wpl"],
      ["application/vnd.ms-xpsdocument", "xps"],
      ["application/vnd.mseq", "mseq"],
      ["application/vnd.musician", "mus"],
      ["application/vnd.muvee.style", "msty"],
      ["application/vnd.neurolanguage.nlu", "nlu"],
      ["application/vnd.noblenet-directory", "nnd"],
      ["application/vnd.noblenet-sealer", "nns"],
      ["application/vnd.noblenet-web", "nnw"],
      ["application/vnd.nokia.configuration-message", "ncm"],
      ["application/vnd.nokia.n-gage.data", "ngdat"],
      ["application/vnd.nokia.n-gage.symbian.install", "n-gage"],
      ["application/vnd.nokia.radio-preset", "rpst"],
      ["application/vnd.nokia.radio-presets", "rpss"],
      ["application/vnd.nokia.ringing-tone", "rng"],
      ["application/vnd.novadigm.edm", "edm"],
      ["application/vnd.novadigm.edx", "edx"],
      ["application/vnd.novadigm.ext", "ext"],
      ["application/vnd.oasis.opendocument.chart", "odc"],
      ["application/vnd.oasis.opendocument.chart-template", "otc"],
      ["application/vnd.oasis.opendocument.database", "odb"],
      ["application/vnd.oasis.opendocument.formula", "odf"],
      ["application/vnd.oasis.opendocument.formula-template", "odft"],
      ["application/vnd.oasis.opendocument.graphics", "odg"],
      ["application/vnd.oasis.opendocument.graphics-template", "otg"],
      ["application/vnd.oasis.opendocument.image", "odi"],
      ["application/vnd.oasis.opendocument.image-template", "oti"],
      ["application/vnd.oasis.opendocument.presentation", "odp"],
      ["application/vnd.oasis.opendocument.presentation-template", "otp"],
      ["application/vnd.oasis.opendocument.spreadsheet", "ods"],
      ["application/vnd.oasis.opendocument.spreadsheet-template", "ots"],
      ["application/vnd.oasis.opendocument.text", "odt"],
      ["application/vnd.oasis.opendocument.text-master", "odm"],
      ["application/vnd.oasis.opendocument.text-template", "ott"],
      ["application/vnd.oasis.opendocument.text-web", "oth"],
      ["application/vnd.olpc-sugar", "xo"],
      ["application/vnd.oma.dd2+xml", "dd2"],
      ["application/vnd.openofficeorg.extension", "oxt"],
      ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
      ["application/vnd.openxmlformats-officedocument.presentationml.slide", "sldx"],
      ["application/vnd.openxmlformats-officedocument.presentationml.slideshow", "ppsx"],
      ["application/vnd.openxmlformats-officedocument.presentationml.template", "potx"],
      ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
      ["application/vnd.openxmlformats-officedocument.spreadsheetml.template", "xltx"],
      ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
      ["application/vnd.openxmlformats-officedocument.wordprocessingml.template", "dotx"],
      ["application/vnd.osgeo.mapguide.package", "mgp"],
      ["application/vnd.osgi.dp", "dp"],
      ["application/vnd.palm", "pdb"],
      ["application/vnd.pawaafile", "paw"],
      ["application/vnd.pg.format", "str"],
      ["application/vnd.pg.osasli", "ei6"],
      ["application/vnd.picsel", "efif"],
      ["application/vnd.pmi.widget", "wg"],
      ["application/vnd.pocketlearn", "plf"],
      ["application/vnd.powerbuilder6", "pbd"],
      ["application/vnd.previewsystems.box", "box"],
      ["application/vnd.proteus.magazine", "mgz"],
      ["application/vnd.publishare-delta-tree", "qps"],
      ["application/vnd.pvi.ptid1", "ptid"],
      ["application/vnd.quark.quarkxpress", "qxd"],
      ["application/vnd.realvnc.bed", "bed"],
      ["application/vnd.recordare.musicxml", "mxl"],
      ["application/vnd.recordare.musicxml+xml", "musicxml"],
      ["application/vnd.rig.cryptonote", "cryptonote"],
      ["application/vnd.rim.cod", "cod"],
      ["application/vnd.rn-realmedia", "rm"],
      ["application/vnd.rn-realplayer", "rnx"],
      ["application/vnd.route66.link66+xml", "link66"],
      ["application/vnd.sailingtracker.track", "st"],
      ["application/vnd.seemail", "see"],
      ["application/vnd.sema", "sema"],
      ["application/vnd.semd", "semd"],
      ["application/vnd.semf", "semf"],
      ["application/vnd.shana.informed.formdata", "ifm"],
      ["application/vnd.shana.informed.formtemplate", "itp"],
      ["application/vnd.shana.informed.interchange", "iif"],
      ["application/vnd.shana.informed.package", "ipk"],
      ["application/vnd.simtech-mindmapper", "twd"],
      ["application/vnd.smaf", "mmf"],
      ["application/vnd.smart.teacher", "teacher"],
      ["application/vnd.solent.sdkm+xml", "sdkm"],
      ["application/vnd.spotfire.dxp", "dxp"],
      ["application/vnd.spotfire.sfs", "sfs"],
      ["application/vnd.stardivision.calc", "sdc"],
      ["application/vnd.stardivision.draw", "sda"],
      ["application/vnd.stardivision.impress", "sdd"],
      ["application/vnd.stardivision.math", "smf"],
      ["application/vnd.stardivision.writer", "sdw"],
      ["application/vnd.stardivision.writer-global", "sgl"],
      ["application/vnd.stepmania.stepchart", "sm"],
      ["application/vnd.sun.xml.calc", "sxc"],
      ["application/vnd.sun.xml.calc.template", "stc"],
      ["application/vnd.sun.xml.draw", "sxd"],
      ["application/vnd.sun.xml.draw.template", "std"],
      ["application/vnd.sun.xml.impress", "sxi"],
      ["application/vnd.sun.xml.impress.template", "sti"],
      ["application/vnd.sun.xml.math", "sxm"],
      ["application/vnd.sun.xml.writer", "sxw"],
      ["application/vnd.sun.xml.writer.global", "sxg"],
      ["application/vnd.sun.xml.writer.template", "stw"],
      ["application/vnd.sus-calendar", "sus"],
      ["application/vnd.svd", "svd"],
      ["application/vnd.symbian.install", "sis"],
      ["application/vnd.syncml+xml", "xsm"],
      ["application/vnd.syncml.dm+wbxml", "bdm"],
      ["application/vnd.syncml.dm+xml", "xdm"],
      ["application/vnd.tao.intent-module-archive", "tao"],
      ["application/vnd.tmobile-livetv", "tmo"],
      ["application/vnd.trid.tpt", "tpt"],
      ["application/vnd.triscape.mxs", "mxs"],
      ["application/vnd.trueapp", "tra"],
      ["application/vnd.ufdl", "ufd"],
      ["application/vnd.uiq.theme", "utz"],
      ["application/vnd.umajin", "umj"],
      ["application/vnd.unity", "unityweb"],
      ["application/vnd.uoml+xml", "uoml"],
      ["application/vnd.vcx", "vcx"],
      ["application/vnd.visio", "vsd"],
      ["application/vnd.visionary", "vis"],
      ["application/vnd.vsf", "vsf"],
      ["application/vnd.wap.wbxml", "wbxml"],
      ["application/vnd.wap.wmlc", "wmlc"],
      ["application/vnd.wap.wmlscriptc", "wmlsc"],
      ["application/vnd.webturbo", "wtb"],
      ["application/vnd.wolfram.player", "nbp"],
      ["application/vnd.wordperfect", "wpd"],
      ["application/vnd.wqd", "wqd"],
      ["application/vnd.wt.stf", "stf"],
      ["application/vnd.xara", ["web", "xar"]],
      ["application/vnd.xfdl", "xfdl"],
      ["application/vnd.yamaha.hv-dic", "hvd"],
      ["application/vnd.yamaha.hv-script", "hvs"],
      ["application/vnd.yamaha.hv-voice", "hvp"],
      ["application/vnd.yamaha.openscoreformat", "osf"],
      ["application/vnd.yamaha.openscoreformat.osfpvg+xml", "osfpvg"],
      ["application/vnd.yamaha.smaf-audio", "saf"],
      ["application/vnd.yamaha.smaf-phrase", "spf"],
      ["application/vnd.yellowriver-custom-menu", "cmp"],
      ["application/vnd.zul", "zir"],
      ["application/vnd.zzazz.deck+xml", "zaz"],
      ["application/vocaltec-media-desc", "vmd"],
      ["application/vocaltec-media-file", "vmf"],
      ["application/voicexml+xml", "vxml"],
      ["application/widget", "wgt"],
      ["application/winhlp", "hlp"],
      ["application/wordperfect", ["wp", "wp5", "wp6", "wpd"]],
      ["application/wordperfect6.0", ["w60", "wp5"]],
      ["application/wordperfect6.1", "w61"],
      ["application/wsdl+xml", "wsdl"],
      ["application/wspolicy+xml", "wspolicy"],
      ["application/x-123", "wk1"],
      ["application/x-7z-compressed", "7z"],
      ["application/x-abiword", "abw"],
      ["application/x-ace-compressed", "ace"],
      ["application/x-aim", "aim"],
      ["application/x-authorware-bin", "aab"],
      ["application/x-authorware-map", "aam"],
      ["application/x-authorware-seg", "aas"],
      ["application/x-bcpio", "bcpio"],
      ["application/x-binary", "bin"],
      ["application/x-binhex40", "hqx"],
      ["application/x-bittorrent", "torrent"],
      ["application/x-bsh", ["bsh", "sh", "shar"]],
      ["application/x-bytecode.elisp", "elc"],
      ["application/x-bytecode.python", "pyc"],
      ["application/x-bzip", "bz"],
      ["application/x-bzip2", ["boz", "bz2"]],
      ["application/x-cdf", "cdf"],
      ["application/x-cdlink", "vcd"],
      ["application/x-chat", ["cha", "chat"]],
      ["application/x-chess-pgn", "pgn"],
      ["application/x-cmu-raster", "ras"],
      ["application/x-cocoa", "cco"],
      ["application/x-compactpro", "cpt"],
      ["application/x-compress", "z"],
      ["application/x-compressed", ["tgz", "gz", "z", "zip"]],
      ["application/x-conference", "nsc"],
      ["application/x-cpio", "cpio"],
      ["application/x-cpt", "cpt"],
      ["application/x-csh", "csh"],
      ["application/x-debian-package", "deb"],
      ["application/x-deepv", "deepv"],
      ["application/x-director", ["dir", "dcr", "dxr"]],
      ["application/x-doom", "wad"],
      ["application/x-dtbncx+xml", "ncx"],
      ["application/x-dtbook+xml", "dtb"],
      ["application/x-dtbresource+xml", "res"],
      ["application/x-dvi", "dvi"],
      ["application/x-elc", "elc"],
      ["application/x-envoy", ["env", "evy"]],
      ["application/x-esrehber", "es"],
      ["application/x-excel", ["xls", "xla", "xlb", "xlc", "xld", "xlk", "xll", "xlm", "xlt", "xlv", "xlw"]],
      ["application/x-font-bdf", "bdf"],
      ["application/x-font-ghostscript", "gsf"],
      ["application/x-font-linux-psf", "psf"],
      ["application/x-font-otf", "otf"],
      ["application/x-font-pcf", "pcf"],
      ["application/x-font-snf", "snf"],
      ["application/x-font-ttf", "ttf"],
      ["application/x-font-type1", "pfa"],
      ["application/x-font-woff", "woff"],
      ["application/x-frame", "mif"],
      ["application/x-freelance", "pre"],
      ["application/x-futuresplash", "spl"],
      ["application/x-gnumeric", "gnumeric"],
      ["application/x-gsp", "gsp"],
      ["application/x-gss", "gss"],
      ["application/x-gtar", "gtar"],
      ["application/x-gzip", ["gz", "gzip"]],
      ["application/x-hdf", "hdf"],
      ["application/x-helpfile", ["help", "hlp"]],
      ["application/x-httpd-imap", "imap"],
      ["application/x-ima", "ima"],
      ["application/x-internet-signup", ["ins", "isp"]],
      ["application/x-internett-signup", "ins"],
      ["application/x-inventor", "iv"],
      ["application/x-ip2", "ip"],
      ["application/x-iphone", "iii"],
      ["application/x-java-class", "class"],
      ["application/x-java-commerce", "jcm"],
      ["application/x-java-jnlp-file", "jnlp"],
      ["application/x-javascript", "js"],
      ["application/x-koan", ["skd", "skm", "skp", "skt"]],
      ["application/x-ksh", "ksh"],
      ["application/x-latex", ["latex", "ltx"]],
      ["application/x-lha", "lha"],
      ["application/x-lisp", "lsp"],
      ["application/x-livescreen", "ivy"],
      ["application/x-lotus", "wq1"],
      ["application/x-lotusscreencam", "scm"],
      ["application/x-lzh", "lzh"],
      ["application/x-lzx", "lzx"],
      ["application/x-mac-binhex40", "hqx"],
      ["application/x-macbinary", "bin"],
      ["application/x-magic-cap-package-1.0", "mc$"],
      ["application/x-mathcad", "mcd"],
      ["application/x-meme", "mm"],
      ["application/x-midi", ["mid", "midi"]],
      ["application/x-mif", "mif"],
      ["application/x-mix-transfer", "nix"],
      ["application/x-mobipocket-ebook", "prc"],
      ["application/x-mplayer2", "asx"],
      ["application/x-ms-application", "application"],
      ["application/x-ms-wmd", "wmd"],
      ["application/x-ms-wmz", "wmz"],
      ["application/x-ms-xbap", "xbap"],
      ["application/x-msaccess", "mdb"],
      ["application/x-msbinder", "obd"],
      ["application/x-mscardfile", "crd"],
      ["application/x-msclip", "clp"],
      ["application/x-msdownload", ["exe", "dll"]],
      ["application/x-msexcel", ["xls", "xla", "xlw"]],
      ["application/x-msmediaview", ["mvb", "m13", "m14"]],
      ["application/x-msmetafile", "wmf"],
      ["application/x-msmoney", "mny"],
      ["application/x-mspowerpoint", "ppt"],
      ["application/x-mspublisher", "pub"],
      ["application/x-msschedule", "scd"],
      ["application/x-msterminal", "trm"],
      ["application/x-mswrite", "wri"],
      ["application/x-navi-animation", "ani"],
      ["application/x-navidoc", "nvd"],
      ["application/x-navimap", "map"],
      ["application/x-navistyle", "stl"],
      ["application/x-netcdf", ["cdf", "nc"]],
      ["application/x-newton-compatible-pkg", "pkg"],
      ["application/x-nokia-9000-communicator-add-on-software", "aos"],
      ["application/x-omc", "omc"],
      ["application/x-omcdatamaker", "omcd"],
      ["application/x-omcregerator", "omcr"],
      ["application/x-pagemaker", ["pm4", "pm5"]],
      ["application/x-pcl", "pcl"],
      ["application/x-perfmon", ["pma", "pmc", "pml", "pmr", "pmw"]],
      ["application/x-pixclscript", "plx"],
      ["application/x-pkcs10", "p10"],
      ["application/x-pkcs12", ["p12", "pfx"]],
      ["application/x-pkcs7-certificates", ["p7b", "spc"]],
      ["application/x-pkcs7-certreqresp", "p7r"],
      ["application/x-pkcs7-mime", ["p7m", "p7c"]],
      ["application/x-pkcs7-signature", ["p7s", "p7a"]],
      ["application/x-pointplus", "css"],
      ["application/x-portable-anymap", "pnm"],
      ["application/x-project", ["mpc", "mpt", "mpv", "mpx"]],
      ["application/x-qpro", "wb1"],
      ["application/x-rar-compressed", "rar"],
      ["application/x-rtf", "rtf"],
      ["application/x-sdp", "sdp"],
      ["application/x-sea", "sea"],
      ["application/x-seelogo", "sl"],
      ["application/x-sh", "sh"],
      ["application/x-shar", ["shar", "sh"]],
      ["application/x-shockwave-flash", "swf"],
      ["application/x-silverlight-app", "xap"],
      ["application/x-sit", "sit"],
      ["application/x-sprite", ["spr", "sprite"]],
      ["application/x-stuffit", "sit"],
      ["application/x-stuffitx", "sitx"],
      ["application/x-sv4cpio", "sv4cpio"],
      ["application/x-sv4crc", "sv4crc"],
      ["application/x-tar", "tar"],
      ["application/x-tbook", ["sbk", "tbk"]],
      ["application/x-tcl", "tcl"],
      ["application/x-tex", "tex"],
      ["application/x-tex-tfm", "tfm"],
      ["application/x-texinfo", ["texi", "texinfo"]],
      ["application/x-troff", ["roff", "t", "tr"]],
      ["application/x-troff-man", "man"],
      ["application/x-troff-me", "me"],
      ["application/x-troff-ms", "ms"],
      ["application/x-troff-msvideo", "avi"],
      ["application/x-ustar", "ustar"],
      ["application/x-visio", ["vsd", "vst", "vsw"]],
      ["application/x-vnd.audioexplosion.mzz", "mzz"],
      ["application/x-vnd.ls-xpix", "xpix"],
      ["application/x-vrml", "vrml"],
      ["application/x-wais-source", ["src", "wsrc"]],
      ["application/x-winhelp", "hlp"],
      ["application/x-wintalk", "wtk"],
      ["application/x-world", ["wrl", "svr"]],
      ["application/x-wpwin", "wpd"],
      ["application/x-wri", "wri"],
      ["application/x-x509-ca-cert", ["cer", "crt", "der"]],
      ["application/x-x509-user-cert", "crt"],
      ["application/x-xfig", "fig"],
      ["application/x-xpinstall", "xpi"],
      ["application/x-zip-compressed", "zip"],
      ["application/xcap-diff+xml", "xdf"],
      ["application/xenc+xml", "xenc"],
      ["application/xhtml+xml", "xhtml"],
      ["application/xml", "xml"],
      ["application/xml-dtd", "dtd"],
      ["application/xop+xml", "xop"],
      ["application/xslt+xml", "xslt"],
      ["application/xspf+xml", "xspf"],
      ["application/xv+xml", "mxml"],
      ["application/yang", "yang"],
      ["application/yin+xml", "yin"],
      ["application/ynd.ms-pkipko", "pko"],
      ["application/zip", "zip"],
      ["audio/adpcm", "adp"],
      ["audio/aiff", ["aiff", "aif", "aifc"]],
      ["audio/basic", ["snd", "au"]],
      ["audio/it", "it"],
      ["audio/make", ["funk", "my", "pfunk"]],
      ["audio/make.my.funk", "pfunk"],
      ["audio/mid", ["mid", "rmi"]],
      ["audio/midi", ["midi", "kar", "mid"]],
      ["audio/mod", "mod"],
      ["audio/mp4", "mp4a"],
      ["audio/mpeg", ["mpga", "mp3", "m2a", "mp2", "mpa", "mpg"]],
      ["audio/mpeg3", "mp3"],
      ["audio/nspaudio", ["la", "lma"]],
      ["audio/ogg", "oga"],
      ["audio/s3m", "s3m"],
      ["audio/tsp-audio", "tsi"],
      ["audio/tsplayer", "tsp"],
      ["audio/vnd.dece.audio", "uva"],
      ["audio/vnd.digital-winds", "eol"],
      ["audio/vnd.dra", "dra"],
      ["audio/vnd.dts", "dts"],
      ["audio/vnd.dts.hd", "dtshd"],
      ["audio/vnd.lucent.voice", "lvp"],
      ["audio/vnd.ms-playready.media.pya", "pya"],
      ["audio/vnd.nuera.ecelp4800", "ecelp4800"],
      ["audio/vnd.nuera.ecelp7470", "ecelp7470"],
      ["audio/vnd.nuera.ecelp9600", "ecelp9600"],
      ["audio/vnd.qcelp", "qcp"],
      ["audio/vnd.rip", "rip"],
      ["audio/voc", "voc"],
      ["audio/voxware", "vox"],
      ["audio/wav", "wav"],
      ["audio/webm", "weba"],
      ["audio/x-aac", "aac"],
      ["audio/x-adpcm", "snd"],
      ["audio/x-aiff", ["aiff", "aif", "aifc"]],
      ["audio/x-au", "au"],
      ["audio/x-gsm", ["gsd", "gsm"]],
      ["audio/x-jam", "jam"],
      ["audio/x-liveaudio", "lam"],
      ["audio/x-mid", ["mid", "midi"]],
      ["audio/x-midi", ["midi", "mid"]],
      ["audio/x-mod", "mod"],
      ["audio/x-mpeg", "mp2"],
      ["audio/x-mpeg-3", "mp3"],
      ["audio/x-mpegurl", "m3u"],
      ["audio/x-mpequrl", "m3u"],
      ["audio/x-ms-wax", "wax"],
      ["audio/x-ms-wma", "wma"],
      ["audio/x-nspaudio", ["la", "lma"]],
      ["audio/x-pn-realaudio", ["ra", "ram", "rm", "rmm", "rmp"]],
      ["audio/x-pn-realaudio-plugin", ["ra", "rmp", "rpm"]],
      ["audio/x-psid", "sid"],
      ["audio/x-realaudio", "ra"],
      ["audio/x-twinvq", "vqf"],
      ["audio/x-twinvq-plugin", ["vqe", "vql"]],
      ["audio/x-vnd.audioexplosion.mjuicemediafile", "mjf"],
      ["audio/x-voc", "voc"],
      ["audio/x-wav", "wav"],
      ["audio/xm", "xm"],
      ["chemical/x-cdx", "cdx"],
      ["chemical/x-cif", "cif"],
      ["chemical/x-cmdf", "cmdf"],
      ["chemical/x-cml", "cml"],
      ["chemical/x-csml", "csml"],
      ["chemical/x-pdb", ["pdb", "xyz"]],
      ["chemical/x-xyz", "xyz"],
      ["drawing/x-dwf", "dwf"],
      ["i-world/i-vrml", "ivr"],
      ["image/bmp", ["bmp", "bm"]],
      ["image/cgm", "cgm"],
      ["image/cis-cod", "cod"],
      ["image/cmu-raster", ["ras", "rast"]],
      ["image/fif", "fif"],
      ["image/florian", ["flo", "turbot"]],
      ["image/g3fax", "g3"],
      ["image/gif", "gif"],
      ["image/ief", ["ief", "iefs"]],
      ["image/jpeg", ["jpeg", "jpe", "jpg", "jfif", "jfif-tbnl"]],
      ["image/jutvision", "jut"],
      ["image/ktx", "ktx"],
      ["image/naplps", ["nap", "naplps"]],
      ["image/pict", ["pic", "pict"]],
      ["image/pipeg", "jfif"],
      ["image/pjpeg", ["jfif", "jpe", "jpeg", "jpg"]],
      ["image/png", ["png", "x-png"]],
      ["image/prs.btif", "btif"],
      ["image/svg+xml", "svg"],
      ["image/tiff", ["tif", "tiff"]],
      ["image/vasa", "mcf"],
      ["image/vnd.adobe.photoshop", "psd"],
      ["image/vnd.dece.graphic", "uvi"],
      ["image/vnd.djvu", "djvu"],
      ["image/vnd.dvb.subtitle", "sub"],
      ["image/vnd.dwg", ["dwg", "dxf", "svf"]],
      ["image/vnd.dxf", "dxf"],
      ["image/vnd.fastbidsheet", "fbs"],
      ["image/vnd.fpx", "fpx"],
      ["image/vnd.fst", "fst"],
      ["image/vnd.fujixerox.edmics-mmr", "mmr"],
      ["image/vnd.fujixerox.edmics-rlc", "rlc"],
      ["image/vnd.ms-modi", "mdi"],
      ["image/vnd.net-fpx", ["fpx", "npx"]],
      ["image/vnd.rn-realflash", "rf"],
      ["image/vnd.rn-realpix", "rp"],
      ["image/vnd.wap.wbmp", "wbmp"],
      ["image/vnd.xiff", "xif"],
      ["image/webp", "webp"],
      ["image/x-cmu-raster", "ras"],
      ["image/x-cmx", "cmx"],
      ["image/x-dwg", ["dwg", "dxf", "svf"]],
      ["image/x-freehand", "fh"],
      ["image/x-icon", "ico"],
      ["image/x-jg", "art"],
      ["image/x-jps", "jps"],
      ["image/x-niff", ["niff", "nif"]],
      ["image/x-pcx", "pcx"],
      ["image/x-pict", ["pct", "pic"]],
      ["image/x-portable-anymap", "pnm"],
      ["image/x-portable-bitmap", "pbm"],
      ["image/x-portable-graymap", "pgm"],
      ["image/x-portable-greymap", "pgm"],
      ["image/x-portable-pixmap", "ppm"],
      ["image/x-quicktime", ["qif", "qti", "qtif"]],
      ["image/x-rgb", "rgb"],
      ["image/x-tiff", ["tif", "tiff"]],
      ["image/x-windows-bmp", "bmp"],
      ["image/x-xbitmap", "xbm"],
      ["image/x-xbm", "xbm"],
      ["image/x-xpixmap", ["xpm", "pm"]],
      ["image/x-xwd", "xwd"],
      ["image/x-xwindowdump", "xwd"],
      ["image/xbm", "xbm"],
      ["image/xpm", "xpm"],
      ["message/rfc822", ["eml", "mht", "mhtml", "nws", "mime"]],
      ["model/iges", ["iges", "igs"]],
      ["model/mesh", "msh"],
      ["model/vnd.collada+xml", "dae"],
      ["model/vnd.dwf", "dwf"],
      ["model/vnd.gdl", "gdl"],
      ["model/vnd.gtw", "gtw"],
      ["model/vnd.mts", "mts"],
      ["model/vnd.vtu", "vtu"],
      ["model/vrml", ["vrml", "wrl", "wrz"]],
      ["model/x-pov", "pov"],
      ["multipart/x-gzip", "gzip"],
      ["multipart/x-ustar", "ustar"],
      ["multipart/x-zip", "zip"],
      ["music/crescendo", ["mid", "midi"]],
      ["music/x-karaoke", "kar"],
      ["paleovu/x-pv", "pvu"],
      ["text/asp", "asp"],
      ["text/calendar", "ics"],
      ["text/css", "css"],
      ["text/csv", "csv"],
      ["text/ecmascript", "js"],
      ["text/h323", "323"],
      ["text/html", ["html", "htm", "stm", "acgi", "htmls", "htx", "shtml"]],
      ["text/iuls", "uls"],
      ["text/javascript", "js"],
      ["text/mcf", "mcf"],
      ["text/n3", "n3"],
      ["text/pascal", "pas"],
      [
        "text/plain",
        [
          "txt",
          "bas",
          "c",
          "h",
          "c++",
          "cc",
          "com",
          "conf",
          "cxx",
          "def",
          "f",
          "f90",
          "for",
          "g",
          "hh",
          "idc",
          "jav",
          "java",
          "list",
          "log",
          "lst",
          "m",
          "mar",
          "pl",
          "sdml",
          "text"
        ]
      ],
      ["text/plain-bas", "par"],
      ["text/prs.lines.tag", "dsc"],
      ["text/richtext", ["rtx", "rt", "rtf"]],
      ["text/scriplet", "wsc"],
      ["text/scriptlet", "sct"],
      ["text/sgml", ["sgm", "sgml"]],
      ["text/tab-separated-values", "tsv"],
      ["text/troff", "t"],
      ["text/turtle", "ttl"],
      ["text/uri-list", ["uni", "unis", "uri", "uris"]],
      ["text/vnd.abc", "abc"],
      ["text/vnd.curl", "curl"],
      ["text/vnd.curl.dcurl", "dcurl"],
      ["text/vnd.curl.mcurl", "mcurl"],
      ["text/vnd.curl.scurl", "scurl"],
      ["text/vnd.fly", "fly"],
      ["text/vnd.fmi.flexstor", "flx"],
      ["text/vnd.graphviz", "gv"],
      ["text/vnd.in3d.3dml", "3dml"],
      ["text/vnd.in3d.spot", "spot"],
      ["text/vnd.rn-realtext", "rt"],
      ["text/vnd.sun.j2me.app-descriptor", "jad"],
      ["text/vnd.wap.wml", "wml"],
      ["text/vnd.wap.wmlscript", "wmls"],
      ["text/webviewhtml", "htt"],
      ["text/x-asm", ["asm", "s"]],
      ["text/x-audiosoft-intra", "aip"],
      ["text/x-c", ["c", "cc", "cpp"]],
      ["text/x-component", "htc"],
      ["text/x-fortran", ["for", "f", "f77", "f90"]],
      ["text/x-h", ["h", "hh"]],
      ["text/x-java-source", ["java", "jav"]],
      ["text/x-java-source,java", "java"],
      ["text/x-la-asf", "lsx"],
      ["text/x-m", "m"],
      ["text/x-pascal", "p"],
      ["text/x-script", "hlb"],
      ["text/x-script.csh", "csh"],
      ["text/x-script.elisp", "el"],
      ["text/x-script.guile", "scm"],
      ["text/x-script.ksh", "ksh"],
      ["text/x-script.lisp", "lsp"],
      ["text/x-script.perl", "pl"],
      ["text/x-script.perl-module", "pm"],
      ["text/x-script.phyton", "py"],
      ["text/x-script.rexx", "rexx"],
      ["text/x-script.scheme", "scm"],
      ["text/x-script.sh", "sh"],
      ["text/x-script.tcl", "tcl"],
      ["text/x-script.tcsh", "tcsh"],
      ["text/x-script.zsh", "zsh"],
      ["text/x-server-parsed-html", ["shtml", "ssi"]],
      ["text/x-setext", "etx"],
      ["text/x-sgml", ["sgm", "sgml"]],
      ["text/x-speech", ["spc", "talk"]],
      ["text/x-uil", "uil"],
      ["text/x-uuencode", ["uu", "uue"]],
      ["text/x-vcalendar", "vcs"],
      ["text/x-vcard", "vcf"],
      ["text/xml", "xml"],
      ["video/3gpp", "3gp"],
      ["video/3gpp2", "3g2"],
      ["video/animaflex", "afl"],
      ["video/avi", "avi"],
      ["video/avs-video", "avs"],
      ["video/dl", "dl"],
      ["video/fli", "fli"],
      ["video/gl", "gl"],
      ["video/h261", "h261"],
      ["video/h263", "h263"],
      ["video/h264", "h264"],
      ["video/jpeg", "jpgv"],
      ["video/jpm", "jpm"],
      ["video/mj2", "mj2"],
      ["video/mp4", "mp4"],
      ["video/mpeg", ["mpeg", "mp2", "mpa", "mpe", "mpg", "mpv2", "m1v", "m2v", "mp3"]],
      ["video/msvideo", "avi"],
      ["video/ogg", "ogv"],
      ["video/quicktime", ["mov", "qt", "moov"]],
      ["video/vdo", "vdo"],
      ["video/vivo", ["viv", "vivo"]],
      ["video/vnd.dece.hd", "uvh"],
      ["video/vnd.dece.mobile", "uvm"],
      ["video/vnd.dece.pd", "uvp"],
      ["video/vnd.dece.sd", "uvs"],
      ["video/vnd.dece.video", "uvv"],
      ["video/vnd.fvt", "fvt"],
      ["video/vnd.mpegurl", "mxu"],
      ["video/vnd.ms-playready.media.pyv", "pyv"],
      ["video/vnd.rn-realvideo", "rv"],
      ["video/vnd.uvvu.mp4", "uvu"],
      ["video/vnd.vivo", ["viv", "vivo"]],
      ["video/vosaic", "vos"],
      ["video/webm", "webm"],
      ["video/x-amt-demorun", "xdr"],
      ["video/x-amt-showrun", "xsr"],
      ["video/x-atomic3d-feature", "fmf"],
      ["video/x-dl", "dl"],
      ["video/x-dv", ["dif", "dv"]],
      ["video/x-f4v", "f4v"],
      ["video/x-fli", "fli"],
      ["video/x-flv", "flv"],
      ["video/x-gl", "gl"],
      ["video/x-isvideo", "isu"],
      ["video/x-la-asf", ["lsf", "lsx"]],
      ["video/x-m4v", "m4v"],
      ["video/x-motion-jpeg", "mjpg"],
      ["video/x-mpeg", ["mp3", "mp2"]],
      ["video/x-mpeq2a", "mp2"],
      ["video/x-ms-asf", ["asf", "asr", "asx"]],
      ["video/x-ms-asf-plugin", "asx"],
      ["video/x-ms-wm", "wm"],
      ["video/x-ms-wmv", "wmv"],
      ["video/x-ms-wmx", "wmx"],
      ["video/x-ms-wvx", "wvx"],
      ["video/x-msvideo", "avi"],
      ["video/x-qtc", "qtc"],
      ["video/x-scm", "scm"],
      ["video/x-sgi-movie", ["movie", "mv"]],
      ["windows/metafile", "wmf"],
      ["www/mime", "mime"],
      ["x-conference/x-cooltalk", "ice"],
      ["x-music/x-midi", ["mid", "midi"]],
      ["x-world/x-3dmf", ["3dm", "3dmf", "qd3", "qd3d"]],
      ["x-world/x-svr", "svr"],
      ["x-world/x-vrml", ["flr", "vrml", "wrl", "wrz", "xaf", "xof"]],
      ["x-world/x-vrt", "vrt"],
      ["xgl/drawing", "xgz"],
      ["xgl/movie", "xmz"]
    ]);
    var extensions = /* @__PURE__ */ new Map([
      ["123", "application/vnd.lotus-1-2-3"],
      ["323", "text/h323"],
      ["*", "application/octet-stream"],
      ["3dm", "x-world/x-3dmf"],
      ["3dmf", "x-world/x-3dmf"],
      ["3dml", "text/vnd.in3d.3dml"],
      ["3g2", "video/3gpp2"],
      ["3gp", "video/3gpp"],
      ["7z", "application/x-7z-compressed"],
      ["a", "application/octet-stream"],
      ["aab", "application/x-authorware-bin"],
      ["aac", "audio/x-aac"],
      ["aam", "application/x-authorware-map"],
      ["aas", "application/x-authorware-seg"],
      ["abc", "text/vnd.abc"],
      ["abw", "application/x-abiword"],
      ["ac", "application/pkix-attr-cert"],
      ["acc", "application/vnd.americandynamics.acc"],
      ["ace", "application/x-ace-compressed"],
      ["acgi", "text/html"],
      ["acu", "application/vnd.acucobol"],
      ["acx", "application/internet-property-stream"],
      ["adp", "audio/adpcm"],
      ["aep", "application/vnd.audiograph"],
      ["afl", "video/animaflex"],
      ["afp", "application/vnd.ibm.modcap"],
      ["ahead", "application/vnd.ahead.space"],
      ["ai", "application/postscript"],
      ["aif", ["audio/aiff", "audio/x-aiff"]],
      ["aifc", ["audio/aiff", "audio/x-aiff"]],
      ["aiff", ["audio/aiff", "audio/x-aiff"]],
      ["aim", "application/x-aim"],
      ["aip", "text/x-audiosoft-intra"],
      ["air", "application/vnd.adobe.air-application-installer-package+zip"],
      ["ait", "application/vnd.dvb.ait"],
      ["ami", "application/vnd.amiga.ami"],
      ["ani", "application/x-navi-animation"],
      ["aos", "application/x-nokia-9000-communicator-add-on-software"],
      ["apk", "application/vnd.android.package-archive"],
      ["application", "application/x-ms-application"],
      ["apr", "application/vnd.lotus-approach"],
      ["aps", "application/mime"],
      ["arc", "application/octet-stream"],
      ["arj", ["application/arj", "application/octet-stream"]],
      ["art", "image/x-jg"],
      ["asf", "video/x-ms-asf"],
      ["asm", "text/x-asm"],
      ["aso", "application/vnd.accpac.simply.aso"],
      ["asp", "text/asp"],
      ["asr", "video/x-ms-asf"],
      ["asx", ["video/x-ms-asf", "application/x-mplayer2", "video/x-ms-asf-plugin"]],
      ["atc", "application/vnd.acucorp"],
      ["atomcat", "application/atomcat+xml"],
      ["atomsvc", "application/atomsvc+xml"],
      ["atx", "application/vnd.antix.game-component"],
      ["au", ["audio/basic", "audio/x-au"]],
      ["avi", ["video/avi", "video/msvideo", "application/x-troff-msvideo", "video/x-msvideo"]],
      ["avs", "video/avs-video"],
      ["aw", "application/applixware"],
      ["axs", "application/olescript"],
      ["azf", "application/vnd.airzip.filesecure.azf"],
      ["azs", "application/vnd.airzip.filesecure.azs"],
      ["azw", "application/vnd.amazon.ebook"],
      ["bas", "text/plain"],
      ["bcpio", "application/x-bcpio"],
      ["bdf", "application/x-font-bdf"],
      ["bdm", "application/vnd.syncml.dm+wbxml"],
      ["bed", "application/vnd.realvnc.bed"],
      ["bh2", "application/vnd.fujitsu.oasysprs"],
      [
        "bin",
        ["application/octet-stream", "application/mac-binary", "application/macbinary", "application/x-macbinary", "application/x-binary"]
      ],
      ["bm", "image/bmp"],
      ["bmi", "application/vnd.bmi"],
      ["bmp", ["image/bmp", "image/x-windows-bmp"]],
      ["boo", "application/book"],
      ["book", "application/book"],
      ["box", "application/vnd.previewsystems.box"],
      ["boz", "application/x-bzip2"],
      ["bsh", "application/x-bsh"],
      ["btif", "image/prs.btif"],
      ["bz", "application/x-bzip"],
      ["bz2", "application/x-bzip2"],
      ["c", ["text/plain", "text/x-c"]],
      ["c++", "text/plain"],
      ["c11amc", "application/vnd.cluetrust.cartomobile-config"],
      ["c11amz", "application/vnd.cluetrust.cartomobile-config-pkg"],
      ["c4g", "application/vnd.clonk.c4group"],
      ["cab", "application/vnd.ms-cab-compressed"],
      ["car", "application/vnd.curl.car"],
      ["cat", ["application/vnd.ms-pkiseccat", "application/vnd.ms-pki.seccat"]],
      ["cc", ["text/plain", "text/x-c"]],
      ["ccad", "application/clariscad"],
      ["cco", "application/x-cocoa"],
      ["ccxml", "application/ccxml+xml,"],
      ["cdbcmsg", "application/vnd.contact.cmsg"],
      ["cdf", ["application/cdf", "application/x-cdf", "application/x-netcdf"]],
      ["cdkey", "application/vnd.mediastation.cdkey"],
      ["cdmia", "application/cdmi-capability"],
      ["cdmic", "application/cdmi-container"],
      ["cdmid", "application/cdmi-domain"],
      ["cdmio", "application/cdmi-object"],
      ["cdmiq", "application/cdmi-queue"],
      ["cdx", "chemical/x-cdx"],
      ["cdxml", "application/vnd.chemdraw+xml"],
      ["cdy", "application/vnd.cinderella"],
      ["cer", ["application/pkix-cert", "application/x-x509-ca-cert"]],
      ["cgm", "image/cgm"],
      ["cha", "application/x-chat"],
      ["chat", "application/x-chat"],
      ["chm", "application/vnd.ms-htmlhelp"],
      ["chrt", "application/vnd.kde.kchart"],
      ["cif", "chemical/x-cif"],
      ["cii", "application/vnd.anser-web-certificate-issue-initiation"],
      ["cil", "application/vnd.ms-artgalry"],
      ["cla", "application/vnd.claymore"],
      [
        "class",
        ["application/octet-stream", "application/java", "application/java-byte-code", "application/java-vm", "application/x-java-class"]
      ],
      ["clkk", "application/vnd.crick.clicker.keyboard"],
      ["clkp", "application/vnd.crick.clicker.palette"],
      ["clkt", "application/vnd.crick.clicker.template"],
      ["clkw", "application/vnd.crick.clicker.wordbank"],
      ["clkx", "application/vnd.crick.clicker"],
      ["clp", "application/x-msclip"],
      ["cmc", "application/vnd.cosmocaller"],
      ["cmdf", "chemical/x-cmdf"],
      ["cml", "chemical/x-cml"],
      ["cmp", "application/vnd.yellowriver-custom-menu"],
      ["cmx", "image/x-cmx"],
      ["cod", ["image/cis-cod", "application/vnd.rim.cod"]],
      ["com", ["application/octet-stream", "text/plain"]],
      ["conf", "text/plain"],
      ["cpio", "application/x-cpio"],
      ["cpp", "text/x-c"],
      ["cpt", ["application/mac-compactpro", "application/x-compactpro", "application/x-cpt"]],
      ["crd", "application/x-mscardfile"],
      ["crl", ["application/pkix-crl", "application/pkcs-crl"]],
      ["crt", ["application/pkix-cert", "application/x-x509-user-cert", "application/x-x509-ca-cert"]],
      ["cryptonote", "application/vnd.rig.cryptonote"],
      ["csh", ["text/x-script.csh", "application/x-csh"]],
      ["csml", "chemical/x-csml"],
      ["csp", "application/vnd.commonspace"],
      ["css", ["text/css", "application/x-pointplus"]],
      ["csv", "text/csv"],
      ["cu", "application/cu-seeme"],
      ["curl", "text/vnd.curl"],
      ["cww", "application/prs.cww"],
      ["cxx", "text/plain"],
      ["dae", "model/vnd.collada+xml"],
      ["daf", "application/vnd.mobius.daf"],
      ["davmount", "application/davmount+xml"],
      ["dcr", "application/x-director"],
      ["dcurl", "text/vnd.curl.dcurl"],
      ["dd2", "application/vnd.oma.dd2+xml"],
      ["ddd", "application/vnd.fujixerox.ddd"],
      ["deb", "application/x-debian-package"],
      ["deepv", "application/x-deepv"],
      ["def", "text/plain"],
      ["der", "application/x-x509-ca-cert"],
      ["dfac", "application/vnd.dreamfactory"],
      ["dif", "video/x-dv"],
      ["dir", "application/x-director"],
      ["dis", "application/vnd.mobius.dis"],
      ["djvu", "image/vnd.djvu"],
      ["dl", ["video/dl", "video/x-dl"]],
      ["dll", "application/x-msdownload"],
      ["dms", "application/octet-stream"],
      ["dna", "application/vnd.dna"],
      ["doc", "application/msword"],
      ["docm", "application/vnd.ms-word.document.macroenabled.12"],
      ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      ["dot", "application/msword"],
      ["dotm", "application/vnd.ms-word.template.macroenabled.12"],
      ["dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
      ["dp", ["application/commonground", "application/vnd.osgi.dp"]],
      ["dpg", "application/vnd.dpgraph"],
      ["dra", "audio/vnd.dra"],
      ["drw", "application/drafting"],
      ["dsc", "text/prs.lines.tag"],
      ["dssc", "application/dssc+der"],
      ["dtb", "application/x-dtbook+xml"],
      ["dtd", "application/xml-dtd"],
      ["dts", "audio/vnd.dts"],
      ["dtshd", "audio/vnd.dts.hd"],
      ["dump", "application/octet-stream"],
      ["dv", "video/x-dv"],
      ["dvi", "application/x-dvi"],
      ["dwf", ["model/vnd.dwf", "drawing/x-dwf"]],
      ["dwg", ["application/acad", "image/vnd.dwg", "image/x-dwg"]],
      ["dxf", ["application/dxf", "image/vnd.dwg", "image/vnd.dxf", "image/x-dwg"]],
      ["dxp", "application/vnd.spotfire.dxp"],
      ["dxr", "application/x-director"],
      ["ecelp4800", "audio/vnd.nuera.ecelp4800"],
      ["ecelp7470", "audio/vnd.nuera.ecelp7470"],
      ["ecelp9600", "audio/vnd.nuera.ecelp9600"],
      ["edm", "application/vnd.novadigm.edm"],
      ["edx", "application/vnd.novadigm.edx"],
      ["efif", "application/vnd.picsel"],
      ["ei6", "application/vnd.pg.osasli"],
      ["el", "text/x-script.elisp"],
      ["elc", ["application/x-elc", "application/x-bytecode.elisp"]],
      ["eml", "message/rfc822"],
      ["emma", "application/emma+xml"],
      ["env", "application/x-envoy"],
      ["eol", "audio/vnd.digital-winds"],
      ["eot", "application/vnd.ms-fontobject"],
      ["eps", "application/postscript"],
      ["epub", "application/epub+zip"],
      ["es", ["application/ecmascript", "application/x-esrehber"]],
      ["es3", "application/vnd.eszigno3+xml"],
      ["esf", "application/vnd.epson.esf"],
      ["etx", "text/x-setext"],
      ["evy", ["application/envoy", "application/x-envoy"]],
      ["exe", ["application/octet-stream", "application/x-msdownload"]],
      ["exi", "application/exi"],
      ["ext", "application/vnd.novadigm.ext"],
      ["ez2", "application/vnd.ezpix-album"],
      ["ez3", "application/vnd.ezpix-package"],
      ["f", ["text/plain", "text/x-fortran"]],
      ["f4v", "video/x-f4v"],
      ["f77", "text/x-fortran"],
      ["f90", ["text/plain", "text/x-fortran"]],
      ["fbs", "image/vnd.fastbidsheet"],
      ["fcs", "application/vnd.isac.fcs"],
      ["fdf", "application/vnd.fdf"],
      ["fe_launch", "application/vnd.denovo.fcselayout-link"],
      ["fg5", "application/vnd.fujitsu.oasysgp"],
      ["fh", "image/x-freehand"],
      ["fif", ["application/fractals", "image/fif"]],
      ["fig", "application/x-xfig"],
      ["fli", ["video/fli", "video/x-fli"]],
      ["flo", ["image/florian", "application/vnd.micrografx.flo"]],
      ["flr", "x-world/x-vrml"],
      ["flv", "video/x-flv"],
      ["flw", "application/vnd.kde.kivio"],
      ["flx", "text/vnd.fmi.flexstor"],
      ["fly", "text/vnd.fly"],
      ["fm", "application/vnd.framemaker"],
      ["fmf", "video/x-atomic3d-feature"],
      ["fnc", "application/vnd.frogans.fnc"],
      ["for", ["text/plain", "text/x-fortran"]],
      ["fpx", ["image/vnd.fpx", "image/vnd.net-fpx"]],
      ["frl", "application/freeloader"],
      ["fsc", "application/vnd.fsc.weblaunch"],
      ["fst", "image/vnd.fst"],
      ["ftc", "application/vnd.fluxtime.clip"],
      ["fti", "application/vnd.anser-web-funds-transfer-initiation"],
      ["funk", "audio/make"],
      ["fvt", "video/vnd.fvt"],
      ["fxp", "application/vnd.adobe.fxp"],
      ["fzs", "application/vnd.fuzzysheet"],
      ["g", "text/plain"],
      ["g2w", "application/vnd.geoplan"],
      ["g3", "image/g3fax"],
      ["g3w", "application/vnd.geospace"],
      ["gac", "application/vnd.groove-account"],
      ["gdl", "model/vnd.gdl"],
      ["geo", "application/vnd.dynageo"],
      ["geojson", "application/geo+json"],
      ["gex", "application/vnd.geometry-explorer"],
      ["ggb", "application/vnd.geogebra.file"],
      ["ggt", "application/vnd.geogebra.tool"],
      ["ghf", "application/vnd.groove-help"],
      ["gif", "image/gif"],
      ["gim", "application/vnd.groove-identity-message"],
      ["gl", ["video/gl", "video/x-gl"]],
      ["gmx", "application/vnd.gmx"],
      ["gnumeric", "application/x-gnumeric"],
      ["gph", "application/vnd.flographit"],
      ["gqf", "application/vnd.grafeq"],
      ["gram", "application/srgs"],
      ["grv", "application/vnd.groove-injector"],
      ["grxml", "application/srgs+xml"],
      ["gsd", "audio/x-gsm"],
      ["gsf", "application/x-font-ghostscript"],
      ["gsm", "audio/x-gsm"],
      ["gsp", "application/x-gsp"],
      ["gss", "application/x-gss"],
      ["gtar", "application/x-gtar"],
      ["gtm", "application/vnd.groove-tool-message"],
      ["gtw", "model/vnd.gtw"],
      ["gv", "text/vnd.graphviz"],
      ["gxt", "application/vnd.geonext"],
      ["gz", ["application/x-gzip", "application/x-compressed"]],
      ["gzip", ["multipart/x-gzip", "application/x-gzip"]],
      ["h", ["text/plain", "text/x-h"]],
      ["h261", "video/h261"],
      ["h263", "video/h263"],
      ["h264", "video/h264"],
      ["hal", "application/vnd.hal+xml"],
      ["hbci", "application/vnd.hbci"],
      ["hdf", "application/x-hdf"],
      ["help", "application/x-helpfile"],
      ["hgl", "application/vnd.hp-hpgl"],
      ["hh", ["text/plain", "text/x-h"]],
      ["hlb", "text/x-script"],
      ["hlp", ["application/winhlp", "application/hlp", "application/x-helpfile", "application/x-winhelp"]],
      ["hpg", "application/vnd.hp-hpgl"],
      ["hpgl", "application/vnd.hp-hpgl"],
      ["hpid", "application/vnd.hp-hpid"],
      ["hps", "application/vnd.hp-hps"],
      [
        "hqx",
        [
          "application/mac-binhex40",
          "application/binhex",
          "application/binhex4",
          "application/mac-binhex",
          "application/x-binhex40",
          "application/x-mac-binhex40"
        ]
      ],
      ["hta", "application/hta"],
      ["htc", "text/x-component"],
      ["htke", "application/vnd.kenameaapp"],
      ["htm", "text/html"],
      ["html", "text/html"],
      ["htmls", "text/html"],
      ["htt", "text/webviewhtml"],
      ["htx", "text/html"],
      ["hvd", "application/vnd.yamaha.hv-dic"],
      ["hvp", "application/vnd.yamaha.hv-voice"],
      ["hvs", "application/vnd.yamaha.hv-script"],
      ["i2g", "application/vnd.intergeo"],
      ["icc", "application/vnd.iccprofile"],
      ["ice", "x-conference/x-cooltalk"],
      ["ico", "image/x-icon"],
      ["ics", "text/calendar"],
      ["idc", "text/plain"],
      ["ief", "image/ief"],
      ["iefs", "image/ief"],
      ["ifm", "application/vnd.shana.informed.formdata"],
      ["iges", ["application/iges", "model/iges"]],
      ["igl", "application/vnd.igloader"],
      ["igm", "application/vnd.insors.igm"],
      ["igs", ["application/iges", "model/iges"]],
      ["igx", "application/vnd.micrografx.igx"],
      ["iif", "application/vnd.shana.informed.interchange"],
      ["iii", "application/x-iphone"],
      ["ima", "application/x-ima"],
      ["imap", "application/x-httpd-imap"],
      ["imp", "application/vnd.accpac.simply.imp"],
      ["ims", "application/vnd.ms-ims"],
      ["inf", "application/inf"],
      ["ins", ["application/x-internet-signup", "application/x-internett-signup"]],
      ["ip", "application/x-ip2"],
      ["ipfix", "application/ipfix"],
      ["ipk", "application/vnd.shana.informed.package"],
      ["irm", "application/vnd.ibm.rights-management"],
      ["irp", "application/vnd.irepository.package+xml"],
      ["isp", "application/x-internet-signup"],
      ["isu", "video/x-isvideo"],
      ["it", "audio/it"],
      ["itp", "application/vnd.shana.informed.formtemplate"],
      ["iv", "application/x-inventor"],
      ["ivp", "application/vnd.immervision-ivp"],
      ["ivr", "i-world/i-vrml"],
      ["ivu", "application/vnd.immervision-ivu"],
      ["ivy", "application/x-livescreen"],
      ["jad", "text/vnd.sun.j2me.app-descriptor"],
      ["jam", ["application/vnd.jam", "audio/x-jam"]],
      ["jar", "application/java-archive"],
      ["jav", ["text/plain", "text/x-java-source"]],
      ["java", ["text/plain", "text/x-java-source,java", "text/x-java-source"]],
      ["jcm", "application/x-java-commerce"],
      ["jfif", ["image/pipeg", "image/jpeg", "image/pjpeg"]],
      ["jfif-tbnl", "image/jpeg"],
      ["jisp", "application/vnd.jisp"],
      ["jlt", "application/vnd.hp-jlyt"],
      ["jnlp", "application/x-java-jnlp-file"],
      ["joda", "application/vnd.joost.joda-archive"],
      ["jpe", ["image/jpeg", "image/pjpeg"]],
      ["jpeg", ["image/jpeg", "image/pjpeg"]],
      ["jpg", ["image/jpeg", "image/pjpeg"]],
      ["jpgv", "video/jpeg"],
      ["jpm", "video/jpm"],
      ["jps", "image/x-jps"],
      ["js", ["application/javascript", "application/ecmascript", "text/javascript", "text/ecmascript", "application/x-javascript"]],
      ["json", "application/json"],
      ["jut", "image/jutvision"],
      ["kar", ["audio/midi", "music/x-karaoke"]],
      ["karbon", "application/vnd.kde.karbon"],
      ["kfo", "application/vnd.kde.kformula"],
      ["kia", "application/vnd.kidspiration"],
      ["kml", "application/vnd.google-earth.kml+xml"],
      ["kmz", "application/vnd.google-earth.kmz"],
      ["kne", "application/vnd.kinar"],
      ["kon", "application/vnd.kde.kontour"],
      ["kpr", "application/vnd.kde.kpresenter"],
      ["ksh", ["application/x-ksh", "text/x-script.ksh"]],
      ["ksp", "application/vnd.kde.kspread"],
      ["ktx", "image/ktx"],
      ["ktz", "application/vnd.kahootz"],
      ["kwd", "application/vnd.kde.kword"],
      ["la", ["audio/nspaudio", "audio/x-nspaudio"]],
      ["lam", "audio/x-liveaudio"],
      ["lasxml", "application/vnd.las.las+xml"],
      ["latex", "application/x-latex"],
      ["lbd", "application/vnd.llamagraphics.life-balance.desktop"],
      ["lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"],
      ["les", "application/vnd.hhe.lesson-player"],
      ["lha", ["application/octet-stream", "application/lha", "application/x-lha"]],
      ["lhx", "application/octet-stream"],
      ["link66", "application/vnd.route66.link66+xml"],
      ["list", "text/plain"],
      ["lma", ["audio/nspaudio", "audio/x-nspaudio"]],
      ["log", "text/plain"],
      ["lrm", "application/vnd.ms-lrm"],
      ["lsf", "video/x-la-asf"],
      ["lsp", ["application/x-lisp", "text/x-script.lisp"]],
      ["lst", "text/plain"],
      ["lsx", ["video/x-la-asf", "text/x-la-asf"]],
      ["ltf", "application/vnd.frogans.ltf"],
      ["ltx", "application/x-latex"],
      ["lvp", "audio/vnd.lucent.voice"],
      ["lwp", "application/vnd.lotus-wordpro"],
      ["lzh", ["application/octet-stream", "application/x-lzh"]],
      ["lzx", ["application/lzx", "application/octet-stream", "application/x-lzx"]],
      ["m", ["text/plain", "text/x-m"]],
      ["m13", "application/x-msmediaview"],
      ["m14", "application/x-msmediaview"],
      ["m1v", "video/mpeg"],
      ["m21", "application/mp21"],
      ["m2a", "audio/mpeg"],
      ["m2v", "video/mpeg"],
      ["m3u", ["audio/x-mpegurl", "audio/x-mpequrl"]],
      ["m3u8", "application/vnd.apple.mpegurl"],
      ["m4v", "video/x-m4v"],
      ["ma", "application/mathematica"],
      ["mads", "application/mads+xml"],
      ["mag", "application/vnd.ecowin.chart"],
      ["man", "application/x-troff-man"],
      ["map", "application/x-navimap"],
      ["mar", "text/plain"],
      ["mathml", "application/mathml+xml"],
      ["mbd", "application/mbedlet"],
      ["mbk", "application/vnd.mobius.mbk"],
      ["mbox", "application/mbox"],
      ["mc$", "application/x-magic-cap-package-1.0"],
      ["mc1", "application/vnd.medcalcdata"],
      ["mcd", ["application/mcad", "application/vnd.mcd", "application/x-mathcad"]],
      ["mcf", ["image/vasa", "text/mcf"]],
      ["mcp", "application/netmc"],
      ["mcurl", "text/vnd.curl.mcurl"],
      ["mdb", "application/x-msaccess"],
      ["mdi", "image/vnd.ms-modi"],
      ["me", "application/x-troff-me"],
      ["meta4", "application/metalink4+xml"],
      ["mets", "application/mets+xml"],
      ["mfm", "application/vnd.mfmp"],
      ["mgp", "application/vnd.osgeo.mapguide.package"],
      ["mgz", "application/vnd.proteus.magazine"],
      ["mht", "message/rfc822"],
      ["mhtml", "message/rfc822"],
      ["mid", ["audio/mid", "audio/midi", "music/crescendo", "x-music/x-midi", "audio/x-midi", "application/x-midi", "audio/x-mid"]],
      ["midi", ["audio/midi", "music/crescendo", "x-music/x-midi", "audio/x-midi", "application/x-midi", "audio/x-mid"]],
      ["mif", ["application/vnd.mif", "application/x-mif", "application/x-frame"]],
      ["mime", ["message/rfc822", "www/mime"]],
      ["mj2", "video/mj2"],
      ["mjf", "audio/x-vnd.audioexplosion.mjuicemediafile"],
      ["mjpg", "video/x-motion-jpeg"],
      ["mlp", "application/vnd.dolby.mlp"],
      ["mm", ["application/base64", "application/x-meme"]],
      ["mmd", "application/vnd.chipnuts.karaoke-mmd"],
      ["mme", "application/base64"],
      ["mmf", "application/vnd.smaf"],
      ["mmr", "image/vnd.fujixerox.edmics-mmr"],
      ["mny", "application/x-msmoney"],
      ["mod", ["audio/mod", "audio/x-mod"]],
      ["mods", "application/mods+xml"],
      ["moov", "video/quicktime"],
      ["mov", "video/quicktime"],
      ["movie", "video/x-sgi-movie"],
      ["mp2", ["video/mpeg", "audio/mpeg", "video/x-mpeg", "audio/x-mpeg", "video/x-mpeq2a"]],
      ["mp3", ["audio/mpeg", "audio/mpeg3", "video/mpeg", "audio/x-mpeg-3", "video/x-mpeg"]],
      ["mp4", ["video/mp4", "application/mp4"]],
      ["mp4a", "audio/mp4"],
      ["mpa", ["video/mpeg", "audio/mpeg"]],
      ["mpc", ["application/vnd.mophun.certificate", "application/x-project"]],
      ["mpe", "video/mpeg"],
      ["mpeg", "video/mpeg"],
      ["mpg", ["video/mpeg", "audio/mpeg"]],
      ["mpga", "audio/mpeg"],
      ["mpkg", "application/vnd.apple.installer+xml"],
      ["mpm", "application/vnd.blueice.multipass"],
      ["mpn", "application/vnd.mophun.application"],
      ["mpp", "application/vnd.ms-project"],
      ["mpt", "application/x-project"],
      ["mpv", "application/x-project"],
      ["mpv2", "video/mpeg"],
      ["mpx", "application/x-project"],
      ["mpy", "application/vnd.ibm.minipay"],
      ["mqy", "application/vnd.mobius.mqy"],
      ["mrc", "application/marc"],
      ["mrcx", "application/marcxml+xml"],
      ["ms", "application/x-troff-ms"],
      ["mscml", "application/mediaservercontrol+xml"],
      ["mseq", "application/vnd.mseq"],
      ["msf", "application/vnd.epson.msf"],
      ["msg", "application/vnd.ms-outlook"],
      ["msh", "model/mesh"],
      ["msl", "application/vnd.mobius.msl"],
      ["msty", "application/vnd.muvee.style"],
      ["mts", "model/vnd.mts"],
      ["mus", "application/vnd.musician"],
      ["musicxml", "application/vnd.recordare.musicxml+xml"],
      ["mv", "video/x-sgi-movie"],
      ["mvb", "application/x-msmediaview"],
      ["mwf", "application/vnd.mfer"],
      ["mxf", "application/mxf"],
      ["mxl", "application/vnd.recordare.musicxml"],
      ["mxml", "application/xv+xml"],
      ["mxs", "application/vnd.triscape.mxs"],
      ["mxu", "video/vnd.mpegurl"],
      ["my", "audio/make"],
      ["mzz", "application/x-vnd.audioexplosion.mzz"],
      ["n-gage", "application/vnd.nokia.n-gage.symbian.install"],
      ["n3", "text/n3"],
      ["nap", "image/naplps"],
      ["naplps", "image/naplps"],
      ["nbp", "application/vnd.wolfram.player"],
      ["nc", "application/x-netcdf"],
      ["ncm", "application/vnd.nokia.configuration-message"],
      ["ncx", "application/x-dtbncx+xml"],
      ["ngdat", "application/vnd.nokia.n-gage.data"],
      ["nif", "image/x-niff"],
      ["niff", "image/x-niff"],
      ["nix", "application/x-mix-transfer"],
      ["nlu", "application/vnd.neurolanguage.nlu"],
      ["nml", "application/vnd.enliven"],
      ["nnd", "application/vnd.noblenet-directory"],
      ["nns", "application/vnd.noblenet-sealer"],
      ["nnw", "application/vnd.noblenet-web"],
      ["npx", "image/vnd.net-fpx"],
      ["nsc", "application/x-conference"],
      ["nsf", "application/vnd.lotus-notes"],
      ["nvd", "application/x-navidoc"],
      ["nws", "message/rfc822"],
      ["o", "application/octet-stream"],
      ["oa2", "application/vnd.fujitsu.oasys2"],
      ["oa3", "application/vnd.fujitsu.oasys3"],
      ["oas", "application/vnd.fujitsu.oasys"],
      ["obd", "application/x-msbinder"],
      ["oda", "application/oda"],
      ["odb", "application/vnd.oasis.opendocument.database"],
      ["odc", "application/vnd.oasis.opendocument.chart"],
      ["odf", "application/vnd.oasis.opendocument.formula"],
      ["odft", "application/vnd.oasis.opendocument.formula-template"],
      ["odg", "application/vnd.oasis.opendocument.graphics"],
      ["odi", "application/vnd.oasis.opendocument.image"],
      ["odm", "application/vnd.oasis.opendocument.text-master"],
      ["odp", "application/vnd.oasis.opendocument.presentation"],
      ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
      ["odt", "application/vnd.oasis.opendocument.text"],
      ["oga", "audio/ogg"],
      ["ogv", "video/ogg"],
      ["ogx", "application/ogg"],
      ["omc", "application/x-omc"],
      ["omcd", "application/x-omcdatamaker"],
      ["omcr", "application/x-omcregerator"],
      ["onetoc", "application/onenote"],
      ["opf", "application/oebps-package+xml"],
      ["org", "application/vnd.lotus-organizer"],
      ["osf", "application/vnd.yamaha.openscoreformat"],
      ["osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"],
      ["otc", "application/vnd.oasis.opendocument.chart-template"],
      ["otf", "application/x-font-otf"],
      ["otg", "application/vnd.oasis.opendocument.graphics-template"],
      ["oth", "application/vnd.oasis.opendocument.text-web"],
      ["oti", "application/vnd.oasis.opendocument.image-template"],
      ["otp", "application/vnd.oasis.opendocument.presentation-template"],
      ["ots", "application/vnd.oasis.opendocument.spreadsheet-template"],
      ["ott", "application/vnd.oasis.opendocument.text-template"],
      ["oxt", "application/vnd.openofficeorg.extension"],
      ["p", "text/x-pascal"],
      ["p10", ["application/pkcs10", "application/x-pkcs10"]],
      ["p12", ["application/pkcs-12", "application/x-pkcs12"]],
      ["p7a", "application/x-pkcs7-signature"],
      ["p7b", "application/x-pkcs7-certificates"],
      ["p7c", ["application/pkcs7-mime", "application/x-pkcs7-mime"]],
      ["p7m", ["application/pkcs7-mime", "application/x-pkcs7-mime"]],
      ["p7r", "application/x-pkcs7-certreqresp"],
      ["p7s", ["application/pkcs7-signature", "application/x-pkcs7-signature"]],
      ["p8", "application/pkcs8"],
      ["par", "text/plain-bas"],
      ["part", "application/pro_eng"],
      ["pas", "text/pascal"],
      ["paw", "application/vnd.pawaafile"],
      ["pbd", "application/vnd.powerbuilder6"],
      ["pbm", "image/x-portable-bitmap"],
      ["pcf", "application/x-font-pcf"],
      ["pcl", ["application/vnd.hp-pcl", "application/x-pcl"]],
      ["pclxl", "application/vnd.hp-pclxl"],
      ["pct", "image/x-pict"],
      ["pcurl", "application/vnd.curl.pcurl"],
      ["pcx", "image/x-pcx"],
      ["pdb", ["application/vnd.palm", "chemical/x-pdb"]],
      ["pdf", "application/pdf"],
      ["pfa", "application/x-font-type1"],
      ["pfr", "application/font-tdpfr"],
      ["pfunk", ["audio/make", "audio/make.my.funk"]],
      ["pfx", "application/x-pkcs12"],
      ["pgm", ["image/x-portable-graymap", "image/x-portable-greymap"]],
      ["pgn", "application/x-chess-pgn"],
      ["pgp", "application/pgp-signature"],
      ["pic", ["image/pict", "image/x-pict"]],
      ["pict", "image/pict"],
      ["pkg", "application/x-newton-compatible-pkg"],
      ["pki", "application/pkixcmp"],
      ["pkipath", "application/pkix-pkipath"],
      ["pko", ["application/ynd.ms-pkipko", "application/vnd.ms-pki.pko"]],
      ["pl", ["text/plain", "text/x-script.perl"]],
      ["plb", "application/vnd.3gpp.pic-bw-large"],
      ["plc", "application/vnd.mobius.plc"],
      ["plf", "application/vnd.pocketlearn"],
      ["pls", "application/pls+xml"],
      ["plx", "application/x-pixclscript"],
      ["pm", ["text/x-script.perl-module", "image/x-xpixmap"]],
      ["pm4", "application/x-pagemaker"],
      ["pm5", "application/x-pagemaker"],
      ["pma", "application/x-perfmon"],
      ["pmc", "application/x-perfmon"],
      ["pml", ["application/vnd.ctc-posml", "application/x-perfmon"]],
      ["pmr", "application/x-perfmon"],
      ["pmw", "application/x-perfmon"],
      ["png", "image/png"],
      ["pnm", ["application/x-portable-anymap", "image/x-portable-anymap"]],
      ["portpkg", "application/vnd.macports.portpkg"],
      ["pot", ["application/vnd.ms-powerpoint", "application/mspowerpoint"]],
      ["potm", "application/vnd.ms-powerpoint.template.macroenabled.12"],
      ["potx", "application/vnd.openxmlformats-officedocument.presentationml.template"],
      ["pov", "model/x-pov"],
      ["ppa", "application/vnd.ms-powerpoint"],
      ["ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12"],
      ["ppd", "application/vnd.cups-ppd"],
      ["ppm", "image/x-portable-pixmap"],
      ["pps", ["application/vnd.ms-powerpoint", "application/mspowerpoint"]],
      ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12"],
      ["ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
      ["ppt", ["application/vnd.ms-powerpoint", "application/mspowerpoint", "application/powerpoint", "application/x-mspowerpoint"]],
      ["pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12"],
      ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      ["ppz", "application/mspowerpoint"],
      ["prc", "application/x-mobipocket-ebook"],
      ["pre", ["application/vnd.lotus-freelance", "application/x-freelance"]],
      ["prf", "application/pics-rules"],
      ["prt", "application/pro_eng"],
      ["ps", "application/postscript"],
      ["psb", "application/vnd.3gpp.pic-bw-small"],
      ["psd", ["application/octet-stream", "image/vnd.adobe.photoshop"]],
      ["psf", "application/x-font-linux-psf"],
      ["pskcxml", "application/pskc+xml"],
      ["ptid", "application/vnd.pvi.ptid1"],
      ["pub", "application/x-mspublisher"],
      ["pvb", "application/vnd.3gpp.pic-bw-var"],
      ["pvu", "paleovu/x-pv"],
      ["pwn", "application/vnd.3m.post-it-notes"],
      ["pwz", "application/vnd.ms-powerpoint"],
      ["py", "text/x-script.phyton"],
      ["pya", "audio/vnd.ms-playready.media.pya"],
      ["pyc", "application/x-bytecode.python"],
      ["pyv", "video/vnd.ms-playready.media.pyv"],
      ["qam", "application/vnd.epson.quickanime"],
      ["qbo", "application/vnd.intu.qbo"],
      ["qcp", "audio/vnd.qcelp"],
      ["qd3", "x-world/x-3dmf"],
      ["qd3d", "x-world/x-3dmf"],
      ["qfx", "application/vnd.intu.qfx"],
      ["qif", "image/x-quicktime"],
      ["qps", "application/vnd.publishare-delta-tree"],
      ["qt", "video/quicktime"],
      ["qtc", "video/x-qtc"],
      ["qti", "image/x-quicktime"],
      ["qtif", "image/x-quicktime"],
      ["qxd", "application/vnd.quark.quarkxpress"],
      ["ra", ["audio/x-realaudio", "audio/x-pn-realaudio", "audio/x-pn-realaudio-plugin"]],
      ["ram", "audio/x-pn-realaudio"],
      ["rar", "application/x-rar-compressed"],
      ["ras", ["image/cmu-raster", "application/x-cmu-raster", "image/x-cmu-raster"]],
      ["rast", "image/cmu-raster"],
      ["rcprofile", "application/vnd.ipunplugged.rcprofile"],
      ["rdf", "application/rdf+xml"],
      ["rdz", "application/vnd.data-vision.rdz"],
      ["rep", "application/vnd.businessobjects"],
      ["res", "application/x-dtbresource+xml"],
      ["rexx", "text/x-script.rexx"],
      ["rf", "image/vnd.rn-realflash"],
      ["rgb", "image/x-rgb"],
      ["rif", "application/reginfo+xml"],
      ["rip", "audio/vnd.rip"],
      ["rl", "application/resource-lists+xml"],
      ["rlc", "image/vnd.fujixerox.edmics-rlc"],
      ["rld", "application/resource-lists-diff+xml"],
      ["rm", ["application/vnd.rn-realmedia", "audio/x-pn-realaudio"]],
      ["rmi", "audio/mid"],
      ["rmm", "audio/x-pn-realaudio"],
      ["rmp", ["audio/x-pn-realaudio-plugin", "audio/x-pn-realaudio"]],
      ["rms", "application/vnd.jcp.javame.midlet-rms"],
      ["rnc", "application/relax-ng-compact-syntax"],
      ["rng", ["application/ringing-tones", "application/vnd.nokia.ringing-tone"]],
      ["rnx", "application/vnd.rn-realplayer"],
      ["roff", "application/x-troff"],
      ["rp", "image/vnd.rn-realpix"],
      ["rp9", "application/vnd.cloanto.rp9"],
      ["rpm", "audio/x-pn-realaudio-plugin"],
      ["rpss", "application/vnd.nokia.radio-presets"],
      ["rpst", "application/vnd.nokia.radio-preset"],
      ["rq", "application/sparql-query"],
      ["rs", "application/rls-services+xml"],
      ["rsd", "application/rsd+xml"],
      ["rt", ["text/richtext", "text/vnd.rn-realtext"]],
      ["rtf", ["application/rtf", "text/richtext", "application/x-rtf"]],
      ["rtx", ["text/richtext", "application/rtf"]],
      ["rv", "video/vnd.rn-realvideo"],
      ["s", "text/x-asm"],
      ["s3m", "audio/s3m"],
      ["saf", "application/vnd.yamaha.smaf-audio"],
      ["saveme", "application/octet-stream"],
      ["sbk", "application/x-tbook"],
      ["sbml", "application/sbml+xml"],
      ["sc", "application/vnd.ibm.secure-container"],
      ["scd", "application/x-msschedule"],
      [
        "scm",
        ["application/vnd.lotus-screencam", "video/x-scm", "text/x-script.guile", "application/x-lotusscreencam", "text/x-script.scheme"]
      ],
      ["scq", "application/scvp-cv-request"],
      ["scs", "application/scvp-cv-response"],
      ["sct", "text/scriptlet"],
      ["scurl", "text/vnd.curl.scurl"],
      ["sda", "application/vnd.stardivision.draw"],
      ["sdc", "application/vnd.stardivision.calc"],
      ["sdd", "application/vnd.stardivision.impress"],
      ["sdkm", "application/vnd.solent.sdkm+xml"],
      ["sdml", "text/plain"],
      ["sdp", ["application/sdp", "application/x-sdp"]],
      ["sdr", "application/sounder"],
      ["sdw", "application/vnd.stardivision.writer"],
      ["sea", ["application/sea", "application/x-sea"]],
      ["see", "application/vnd.seemail"],
      ["seed", "application/vnd.fdsn.seed"],
      ["sema", "application/vnd.sema"],
      ["semd", "application/vnd.semd"],
      ["semf", "application/vnd.semf"],
      ["ser", "application/java-serialized-object"],
      ["set", "application/set"],
      ["setpay", "application/set-payment-initiation"],
      ["setreg", "application/set-registration-initiation"],
      ["sfd-hdstx", "application/vnd.hydrostatix.sof-data"],
      ["sfs", "application/vnd.spotfire.sfs"],
      ["sgl", "application/vnd.stardivision.writer-global"],
      ["sgm", ["text/sgml", "text/x-sgml"]],
      ["sgml", ["text/sgml", "text/x-sgml"]],
      ["sh", ["application/x-shar", "application/x-bsh", "application/x-sh", "text/x-script.sh"]],
      ["shar", ["application/x-bsh", "application/x-shar"]],
      ["shf", "application/shf+xml"],
      ["shtml", ["text/html", "text/x-server-parsed-html"]],
      ["sid", "audio/x-psid"],
      ["sis", "application/vnd.symbian.install"],
      ["sit", ["application/x-stuffit", "application/x-sit"]],
      ["sitx", "application/x-stuffitx"],
      ["skd", "application/x-koan"],
      ["skm", "application/x-koan"],
      ["skp", ["application/vnd.koan", "application/x-koan"]],
      ["skt", "application/x-koan"],
      ["sl", "application/x-seelogo"],
      ["sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"],
      ["sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide"],
      ["slt", "application/vnd.epson.salt"],
      ["sm", "application/vnd.stepmania.stepchart"],
      ["smf", "application/vnd.stardivision.math"],
      ["smi", ["application/smil", "application/smil+xml"]],
      ["smil", "application/smil"],
      ["snd", ["audio/basic", "audio/x-adpcm"]],
      ["snf", "application/x-font-snf"],
      ["sol", "application/solids"],
      ["spc", ["text/x-speech", "application/x-pkcs7-certificates"]],
      ["spf", "application/vnd.yamaha.smaf-phrase"],
      ["spl", ["application/futuresplash", "application/x-futuresplash"]],
      ["spot", "text/vnd.in3d.spot"],
      ["spp", "application/scvp-vp-response"],
      ["spq", "application/scvp-vp-request"],
      ["spr", "application/x-sprite"],
      ["sprite", "application/x-sprite"],
      ["src", "application/x-wais-source"],
      ["sru", "application/sru+xml"],
      ["srx", "application/sparql-results+xml"],
      ["sse", "application/vnd.kodak-descriptor"],
      ["ssf", "application/vnd.epson.ssf"],
      ["ssi", "text/x-server-parsed-html"],
      ["ssm", "application/streamingmedia"],
      ["ssml", "application/ssml+xml"],
      ["sst", ["application/vnd.ms-pkicertstore", "application/vnd.ms-pki.certstore"]],
      ["st", "application/vnd.sailingtracker.track"],
      ["stc", "application/vnd.sun.xml.calc.template"],
      ["std", "application/vnd.sun.xml.draw.template"],
      ["step", "application/step"],
      ["stf", "application/vnd.wt.stf"],
      ["sti", "application/vnd.sun.xml.impress.template"],
      ["stk", "application/hyperstudio"],
      ["stl", ["application/vnd.ms-pkistl", "application/sla", "application/vnd.ms-pki.stl", "application/x-navistyle"]],
      ["stm", "text/html"],
      ["stp", "application/step"],
      ["str", "application/vnd.pg.format"],
      ["stw", "application/vnd.sun.xml.writer.template"],
      ["sub", "image/vnd.dvb.subtitle"],
      ["sus", "application/vnd.sus-calendar"],
      ["sv4cpio", "application/x-sv4cpio"],
      ["sv4crc", "application/x-sv4crc"],
      ["svc", "application/vnd.dvb.service"],
      ["svd", "application/vnd.svd"],
      ["svf", ["image/vnd.dwg", "image/x-dwg"]],
      ["svg", "image/svg+xml"],
      ["svr", ["x-world/x-svr", "application/x-world"]],
      ["swf", "application/x-shockwave-flash"],
      ["swi", "application/vnd.aristanetworks.swi"],
      ["sxc", "application/vnd.sun.xml.calc"],
      ["sxd", "application/vnd.sun.xml.draw"],
      ["sxg", "application/vnd.sun.xml.writer.global"],
      ["sxi", "application/vnd.sun.xml.impress"],
      ["sxm", "application/vnd.sun.xml.math"],
      ["sxw", "application/vnd.sun.xml.writer"],
      ["t", ["text/troff", "application/x-troff"]],
      ["talk", "text/x-speech"],
      ["tao", "application/vnd.tao.intent-module-archive"],
      ["tar", "application/x-tar"],
      ["tbk", ["application/toolbook", "application/x-tbook"]],
      ["tcap", "application/vnd.3gpp2.tcap"],
      ["tcl", ["text/x-script.tcl", "application/x-tcl"]],
      ["tcsh", "text/x-script.tcsh"],
      ["teacher", "application/vnd.smart.teacher"],
      ["tei", "application/tei+xml"],
      ["tex", "application/x-tex"],
      ["texi", "application/x-texinfo"],
      ["texinfo", "application/x-texinfo"],
      ["text", ["application/plain", "text/plain"]],
      ["tfi", "application/thraud+xml"],
      ["tfm", "application/x-tex-tfm"],
      ["tgz", ["application/gnutar", "application/x-compressed"]],
      ["thmx", "application/vnd.ms-officetheme"],
      ["tif", ["image/tiff", "image/x-tiff"]],
      ["tiff", ["image/tiff", "image/x-tiff"]],
      ["tmo", "application/vnd.tmobile-livetv"],
      ["torrent", "application/x-bittorrent"],
      ["tpl", "application/vnd.groove-tool-template"],
      ["tpt", "application/vnd.trid.tpt"],
      ["tr", "application/x-troff"],
      ["tra", "application/vnd.trueapp"],
      ["trm", "application/x-msterminal"],
      ["tsd", "application/timestamped-data"],
      ["tsi", "audio/tsp-audio"],
      ["tsp", ["application/dsptype", "audio/tsplayer"]],
      ["tsv", "text/tab-separated-values"],
      ["ttf", "application/x-font-ttf"],
      ["ttl", "text/turtle"],
      ["turbot", "image/florian"],
      ["twd", "application/vnd.simtech-mindmapper"],
      ["txd", "application/vnd.genomatix.tuxedo"],
      ["txf", "application/vnd.mobius.txf"],
      ["txt", "text/plain"],
      ["ufd", "application/vnd.ufdl"],
      ["uil", "text/x-uil"],
      ["uls", "text/iuls"],
      ["umj", "application/vnd.umajin"],
      ["uni", "text/uri-list"],
      ["unis", "text/uri-list"],
      ["unityweb", "application/vnd.unity"],
      ["unv", "application/i-deas"],
      ["uoml", "application/vnd.uoml+xml"],
      ["uri", "text/uri-list"],
      ["uris", "text/uri-list"],
      ["ustar", ["application/x-ustar", "multipart/x-ustar"]],
      ["utz", "application/vnd.uiq.theme"],
      ["uu", ["application/octet-stream", "text/x-uuencode"]],
      ["uue", "text/x-uuencode"],
      ["uva", "audio/vnd.dece.audio"],
      ["uvh", "video/vnd.dece.hd"],
      ["uvi", "image/vnd.dece.graphic"],
      ["uvm", "video/vnd.dece.mobile"],
      ["uvp", "video/vnd.dece.pd"],
      ["uvs", "video/vnd.dece.sd"],
      ["uvu", "video/vnd.uvvu.mp4"],
      ["uvv", "video/vnd.dece.video"],
      ["vcd", "application/x-cdlink"],
      ["vcf", "text/x-vcard"],
      ["vcg", "application/vnd.groove-vcard"],
      ["vcs", "text/x-vcalendar"],
      ["vcx", "application/vnd.vcx"],
      ["vda", "application/vda"],
      ["vdo", "video/vdo"],
      ["vew", "application/groupwise"],
      ["vis", "application/vnd.visionary"],
      ["viv", ["video/vivo", "video/vnd.vivo"]],
      ["vivo", ["video/vivo", "video/vnd.vivo"]],
      ["vmd", "application/vocaltec-media-desc"],
      ["vmf", "application/vocaltec-media-file"],
      ["voc", ["audio/voc", "audio/x-voc"]],
      ["vos", "video/vosaic"],
      ["vox", "audio/voxware"],
      ["vqe", "audio/x-twinvq-plugin"],
      ["vqf", "audio/x-twinvq"],
      ["vql", "audio/x-twinvq-plugin"],
      ["vrml", ["model/vrml", "x-world/x-vrml", "application/x-vrml"]],
      ["vrt", "x-world/x-vrt"],
      ["vsd", ["application/vnd.visio", "application/x-visio"]],
      ["vsf", "application/vnd.vsf"],
      ["vst", "application/x-visio"],
      ["vsw", "application/x-visio"],
      ["vtu", "model/vnd.vtu"],
      ["vxml", "application/voicexml+xml"],
      ["w60", "application/wordperfect6.0"],
      ["w61", "application/wordperfect6.1"],
      ["w6w", "application/msword"],
      ["wad", "application/x-doom"],
      ["wav", ["audio/wav", "audio/x-wav"]],
      ["wax", "audio/x-ms-wax"],
      ["wb1", "application/x-qpro"],
      ["wbmp", "image/vnd.wap.wbmp"],
      ["wbs", "application/vnd.criticaltools.wbs+xml"],
      ["wbxml", "application/vnd.wap.wbxml"],
      ["wcm", "application/vnd.ms-works"],
      ["wdb", "application/vnd.ms-works"],
      ["web", "application/vnd.xara"],
      ["weba", "audio/webm"],
      ["webm", "video/webm"],
      ["webp", "image/webp"],
      ["wg", "application/vnd.pmi.widget"],
      ["wgt", "application/widget"],
      ["wiz", "application/msword"],
      ["wk1", "application/x-123"],
      ["wks", "application/vnd.ms-works"],
      ["wm", "video/x-ms-wm"],
      ["wma", "audio/x-ms-wma"],
      ["wmd", "application/x-ms-wmd"],
      ["wmf", ["windows/metafile", "application/x-msmetafile"]],
      ["wml", "text/vnd.wap.wml"],
      ["wmlc", "application/vnd.wap.wmlc"],
      ["wmls", "text/vnd.wap.wmlscript"],
      ["wmlsc", "application/vnd.wap.wmlscriptc"],
      ["wmv", "video/x-ms-wmv"],
      ["wmx", "video/x-ms-wmx"],
      ["wmz", "application/x-ms-wmz"],
      ["woff", "application/x-font-woff"],
      ["word", "application/msword"],
      ["wp", "application/wordperfect"],
      ["wp5", ["application/wordperfect", "application/wordperfect6.0"]],
      ["wp6", "application/wordperfect"],
      ["wpd", ["application/wordperfect", "application/vnd.wordperfect", "application/x-wpwin"]],
      ["wpl", "application/vnd.ms-wpl"],
      ["wps", "application/vnd.ms-works"],
      ["wq1", "application/x-lotus"],
      ["wqd", "application/vnd.wqd"],
      ["wri", ["application/mswrite", "application/x-wri", "application/x-mswrite"]],
      ["wrl", ["model/vrml", "x-world/x-vrml", "application/x-world"]],
      ["wrz", ["model/vrml", "x-world/x-vrml"]],
      ["wsc", "text/scriplet"],
      ["wsdl", "application/wsdl+xml"],
      ["wspolicy", "application/wspolicy+xml"],
      ["wsrc", "application/x-wais-source"],
      ["wtb", "application/vnd.webturbo"],
      ["wtk", "application/x-wintalk"],
      ["wvx", "video/x-ms-wvx"],
      ["x-png", "image/png"],
      ["x3d", "application/vnd.hzn-3d-crossword"],
      ["xaf", "x-world/x-vrml"],
      ["xap", "application/x-silverlight-app"],
      ["xar", "application/vnd.xara"],
      ["xbap", "application/x-ms-xbap"],
      ["xbd", "application/vnd.fujixerox.docuworks.binder"],
      ["xbm", ["image/xbm", "image/x-xbm", "image/x-xbitmap"]],
      ["xdf", "application/xcap-diff+xml"],
      ["xdm", "application/vnd.syncml.dm+xml"],
      ["xdp", "application/vnd.adobe.xdp+xml"],
      ["xdr", "video/x-amt-demorun"],
      ["xdssc", "application/dssc+xml"],
      ["xdw", "application/vnd.fujixerox.docuworks"],
      ["xenc", "application/xenc+xml"],
      ["xer", "application/patch-ops-error+xml"],
      ["xfdf", "application/vnd.adobe.xfdf"],
      ["xfdl", "application/vnd.xfdl"],
      ["xgz", "xgl/drawing"],
      ["xhtml", "application/xhtml+xml"],
      ["xif", "image/vnd.xiff"],
      ["xl", "application/excel"],
      ["xla", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
      ["xlam", "application/vnd.ms-excel.addin.macroenabled.12"],
      ["xlb", ["application/excel", "application/vnd.ms-excel", "application/x-excel"]],
      ["xlc", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
      ["xld", ["application/excel", "application/x-excel"]],
      ["xlk", ["application/excel", "application/x-excel"]],
      ["xll", ["application/excel", "application/vnd.ms-excel", "application/x-excel"]],
      ["xlm", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
      ["xls", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
      ["xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12"],
      ["xlsm", "application/vnd.ms-excel.sheet.macroenabled.12"],
      ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      ["xlt", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
      ["xltm", "application/vnd.ms-excel.template.macroenabled.12"],
      ["xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
      ["xlv", ["application/excel", "application/x-excel"]],
      ["xlw", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
      ["xm", "audio/xm"],
      ["xml", ["application/xml", "text/xml", "application/atom+xml", "application/rss+xml"]],
      ["xmz", "xgl/movie"],
      ["xo", "application/vnd.olpc-sugar"],
      ["xof", "x-world/x-vrml"],
      ["xop", "application/xop+xml"],
      ["xpi", "application/x-xpinstall"],
      ["xpix", "application/x-vnd.ls-xpix"],
      ["xpm", ["image/xpm", "image/x-xpixmap"]],
      ["xpr", "application/vnd.is-xpr"],
      ["xps", "application/vnd.ms-xpsdocument"],
      ["xpw", "application/vnd.intercon.formnet"],
      ["xslt", "application/xslt+xml"],
      ["xsm", "application/vnd.syncml+xml"],
      ["xspf", "application/xspf+xml"],
      ["xsr", "video/x-amt-showrun"],
      ["xul", "application/vnd.mozilla.xul+xml"],
      ["xwd", ["image/x-xwd", "image/x-xwindowdump"]],
      ["xyz", ["chemical/x-xyz", "chemical/x-pdb"]],
      ["yang", "application/yang"],
      ["yin", "application/yin+xml"],
      ["z", ["application/x-compressed", "application/x-compress"]],
      ["zaz", "application/vnd.zzazz.deck+xml"],
      ["zip", ["application/zip", "multipart/x-zip", "application/x-zip-compressed", "application/x-compressed"]],
      ["zir", "application/vnd.zul"],
      ["zmm", "application/vnd.handheld-entertainment+xml"],
      ["zoo", "application/octet-stream"],
      ["zsh", "text/x-script.zsh"]
    ]);
    module.exports = {
      detectMimeType(filename) {
        if (!filename) {
          return defaultMimeType;
        }
        let parsed = path.parse(filename);
        let extension = (parsed.ext.substr(1) || parsed.name || "").split("?").shift().trim().toLowerCase();
        let value = defaultMimeType;
        if (extensions.has(extension)) {
          value = extensions.get(extension);
        }
        if (Array.isArray(value)) {
          return value[0];
        }
        return value;
      },
      detectExtension(mimeType) {
        if (!mimeType) {
          return defaultExtension;
        }
        let parts = (mimeType || "").toLowerCase().trim().split("/");
        let rootType = parts.shift().trim();
        let subType = parts.join("/").trim();
        if (mimeTypes.has(rootType + "/" + subType)) {
          let value = mimeTypes.get(rootType + "/" + subType);
          if (Array.isArray(value)) {
            return value[0];
          }
          return value;
        }
        switch (rootType) {
          case "text":
            return "txt";
          default:
            return "bin";
        }
      }
    };
  }
});

// node-built-in-modules:crypto
import libDefault9 from "crypto";
var require_crypto = __commonJS({
  "node-built-in-modules:crypto"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault9;
  }
});

// ../node_modules/nodemailer/lib/punycode/index.js
var require_punycode = __commonJS({
  "../node_modules/nodemailer/lib/punycode/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var maxInt = 2147483647;
    var base = 36;
    var tMin = 1;
    var tMax = 26;
    var skew = 38;
    var damp = 700;
    var initialBias = 72;
    var initialN = 128;
    var delimiter = "-";
    var regexPunycode = /^xn--/;
    var regexNonASCII = /[^\0-\x7F]/;
    var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
    var errors = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    };
    var baseMinusTMin = base - tMin;
    var floor = Math.floor;
    var stringFromCharCode = String.fromCharCode;
    function error3(type2) {
      throw new RangeError(errors[type2]);
    }
    __name(error3, "error");
    function map(array2, callback) {
      const result = [];
      let length = array2.length;
      while (length--) {
        result[length] = callback(array2[length]);
      }
      return result;
    }
    __name(map, "map");
    function mapDomain(domain2, callback) {
      const parts = domain2.split("@");
      let result = "";
      if (parts.length > 1) {
        result = parts[0] + "@";
        domain2 = parts[1];
      }
      domain2 = domain2.replace(regexSeparators, ".");
      const labels = domain2.split(".");
      const encoded = map(labels, callback).join(".");
      return result + encoded;
    }
    __name(mapDomain, "mapDomain");
    function ucs2decode(string2) {
      const output = [];
      let counter = 0;
      const length = string2.length;
      while (counter < length) {
        const value = string2.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
          const extra = string2.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
    __name(ucs2decode, "ucs2decode");
    var ucs2encode = /* @__PURE__ */ __name((codePoints) => String.fromCodePoint(...codePoints), "ucs2encode");
    var basicToDigit = /* @__PURE__ */ __name(function(codePoint) {
      if (codePoint >= 48 && codePoint < 58) {
        return 26 + (codePoint - 48);
      }
      if (codePoint >= 65 && codePoint < 91) {
        return codePoint - 65;
      }
      if (codePoint >= 97 && codePoint < 123) {
        return codePoint - 97;
      }
      return base;
    }, "basicToDigit");
    var digitToBasic = /* @__PURE__ */ __name(function(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }, "digitToBasic");
    var adapt = /* @__PURE__ */ __name(function(delta, numPoints, firstTime) {
      let k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (
        ;
        /* no initialization */
        delta > baseMinusTMin * tMax >> 1;
        k += base
      ) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }, "adapt");
    var decode2 = /* @__PURE__ */ __name(function(input) {
      const output = [];
      const inputLength = input.length;
      let i = 0;
      let n = initialN;
      let bias = initialBias;
      let basic = input.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (let j = 0; j < basic; ++j) {
        if (input.charCodeAt(j) >= 128) {
          error3("not-basic");
        }
        output.push(input.charCodeAt(j));
      }
      for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
        const oldi = i;
        for (let w = 1, k = base; ; k += base) {
          if (index >= inputLength) {
            error3("invalid-input");
          }
          const digit = basicToDigit(input.charCodeAt(index++));
          if (digit >= base) {
            error3("invalid-input");
          }
          if (digit > floor((maxInt - i) / w)) {
            error3("overflow");
          }
          i += digit * w;
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (digit < t) {
            break;
          }
          const baseMinusT = base - t;
          if (w > floor(maxInt / baseMinusT)) {
            error3("overflow");
          }
          w *= baseMinusT;
        }
        const out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        if (floor(i / out) > maxInt - n) {
          error3("overflow");
        }
        n += floor(i / out);
        i %= out;
        output.splice(i++, 0, n);
      }
      return String.fromCodePoint(...output);
    }, "decode");
    var encode2 = /* @__PURE__ */ __name(function(input) {
      const output = [];
      input = ucs2decode(input);
      const inputLength = input.length;
      let n = initialN;
      let delta = 0;
      let bias = initialBias;
      for (const currentValue of input) {
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      const basicLength = output.length;
      let handledCPCount = basicLength;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        let m = maxInt;
        for (const currentValue of input) {
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error3("overflow");
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (const currentValue of input) {
          if (currentValue < n && ++delta > maxInt) {
            error3("overflow");
          }
          if (currentValue === n) {
            let q = delta;
            for (let k = base; ; k += base) {
              const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (q < t) {
                break;
              }
              const qMinusT = q - t;
              const baseMinusT = base - t;
              output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
              q = floor(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
        ++delta;
        ++n;
      }
      return output.join("");
    }, "encode");
    var toUnicode = /* @__PURE__ */ __name(function(input) {
      return mapDomain(input, function(string2) {
        return regexPunycode.test(string2) ? decode2(string2.slice(4).toLowerCase()) : string2;
      });
    }, "toUnicode");
    var toASCII = /* @__PURE__ */ __name(function(input) {
      return mapDomain(input, function(string2) {
        return regexNonASCII.test(string2) ? "xn--" + encode2(string2) : string2;
      });
    }, "toASCII");
    var punycode = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "2.3.1",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: ucs2decode,
        encode: ucs2encode
      },
      decode: decode2,
      encode: encode2,
      toASCII,
      toUnicode
    };
    module.exports = punycode;
  }
});

// ../node_modules/nodemailer/lib/base64/index.js
var require_base64 = __commonJS({
  "../node_modules/nodemailer/lib/base64/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Transform = require_stream().Transform;
    function encode2(buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer, "utf-8");
      }
      return buffer.toString("base64");
    }
    __name(encode2, "encode");
    function wrap(str, lineLength) {
      str = (str || "").toString();
      lineLength = lineLength || 76;
      if (str.length <= lineLength) {
        return str;
      }
      let result = [];
      let pos = 0;
      let chunkLength = lineLength * 1024;
      while (pos < str.length) {
        let wrappedLines = str.substr(pos, chunkLength).replace(new RegExp(".{" + lineLength + "}", "g"), "$&\r\n");
        result.push(wrappedLines);
        pos += chunkLength;
      }
      return result.join("");
    }
    __name(wrap, "wrap");
    var Encoder = class extends Transform {
      static {
        __name(this, "Encoder");
      }
      constructor(options) {
        super();
        this.options = options || {};
        if (this.options.lineLength !== false) {
          this.options.lineLength = this.options.lineLength || 76;
        }
        this._curLine = "";
        this._remainingBytes = false;
        this.inputBytes = 0;
        this.outputBytes = 0;
      }
      _transform(chunk, encoding, done) {
        if (encoding !== "buffer") {
          chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
          return setImmediate(done);
        }
        this.inputBytes += chunk.length;
        if (this._remainingBytes && this._remainingBytes.length) {
          chunk = Buffer.concat([this._remainingBytes, chunk], this._remainingBytes.length + chunk.length);
          this._remainingBytes = false;
        }
        if (chunk.length % 3) {
          this._remainingBytes = chunk.slice(chunk.length - chunk.length % 3);
          chunk = chunk.slice(0, chunk.length - chunk.length % 3);
        } else {
          this._remainingBytes = false;
        }
        let b64 = this._curLine + encode2(chunk);
        if (this.options.lineLength) {
          b64 = wrap(b64, this.options.lineLength);
          let lastLF = b64.lastIndexOf("\n");
          if (lastLF < 0) {
            this._curLine = b64;
            b64 = "";
          } else {
            this._curLine = b64.substring(lastLF + 1);
            b64 = b64.substring(0, lastLF + 1);
            if (b64 && !b64.endsWith("\r\n")) {
              b64 += "\r\n";
            }
          }
        } else {
          this._curLine = "";
        }
        if (b64) {
          this.outputBytes += b64.length;
          this.push(Buffer.from(b64, "ascii"));
        }
        setImmediate(done);
      }
      _flush(done) {
        if (this._remainingBytes && this._remainingBytes.length) {
          this._curLine += encode2(this._remainingBytes);
        }
        if (this._curLine) {
          this.outputBytes += this._curLine.length;
          this.push(Buffer.from(this._curLine, "ascii"));
          this._curLine = "";
        }
        done();
      }
    };
    module.exports = {
      encode: encode2,
      wrap,
      Encoder
    };
  }
});

// ../node_modules/nodemailer/lib/qp/index.js
var require_qp = __commonJS({
  "../node_modules/nodemailer/lib/qp/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Transform = require_stream().Transform;
    function encode2(buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer, "utf-8");
      }
      let ranges = [
        // https://tools.ietf.org/html/rfc2045#section-6.7
        [9],
        // <TAB>
        [10],
        // <LF>
        [13],
        // <CR>
        [32, 60],
        // <SP>!"#$%&'()*+,-./0123456789:;
        [62, 126]
        // >?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
      ];
      let result = "";
      let ord;
      for (let i = 0, len = buffer.length; i < len; i++) {
        ord = buffer[i];
        if (checkRanges(ord, ranges) && !((ord === 32 || ord === 9) && (i === len - 1 || buffer[i + 1] === 10 || buffer[i + 1] === 13))) {
          result += String.fromCharCode(ord);
          continue;
        }
        result += "=" + (ord < 16 ? "0" : "") + ord.toString(16).toUpperCase();
      }
      return result;
    }
    __name(encode2, "encode");
    function wrap(str, lineLength) {
      str = (str || "").toString();
      lineLength = lineLength || 76;
      if (str.length <= lineLength) {
        return str;
      }
      let pos = 0;
      let len = str.length;
      let match2, code, line;
      let lineMargin = Math.floor(lineLength / 3);
      let result = "";
      while (pos < len) {
        line = str.substr(pos, lineLength);
        if (match2 = line.match(/\r\n/)) {
          line = line.substr(0, match2.index + match2[0].length);
          result += line;
          pos += line.length;
          continue;
        }
        if (line.substr(-1) === "\n") {
          result += line;
          pos += line.length;
          continue;
        } else if (match2 = line.substr(-lineMargin).match(/\n.*?$/)) {
          line = line.substr(0, line.length - (match2[0].length - 1));
          result += line;
          pos += line.length;
          continue;
        } else if (line.length > lineLength - lineMargin && (match2 = line.substr(-lineMargin).match(/[ \t.,!?][^ \t.,!?]*$/))) {
          line = line.substr(0, line.length - (match2[0].length - 1));
        } else if (line.match(/[=][\da-f]{0,2}$/i)) {
          if (match2 = line.match(/[=][\da-f]{0,1}$/i)) {
            line = line.substr(0, line.length - match2[0].length);
          }
          while (line.length > 3 && line.length < len - pos && !line.match(/^(?:=[\da-f]{2}){1,4}$/i) && (match2 = line.match(/[=][\da-f]{2}$/gi))) {
            code = parseInt(match2[0].substr(1, 2), 16);
            if (code < 128) {
              break;
            }
            line = line.substr(0, line.length - 3);
            if (code >= 192) {
              break;
            }
          }
        }
        if (pos + line.length < len && line.substr(-1) !== "\n") {
          if (line.length === lineLength && line.match(/[=][\da-f]{2}$/i)) {
            line = line.substr(0, line.length - 3);
          } else if (line.length === lineLength) {
            line = line.substr(0, line.length - 1);
          }
          pos += line.length;
          line += "=\r\n";
        } else {
          pos += line.length;
        }
        result += line;
      }
      return result;
    }
    __name(wrap, "wrap");
    function checkRanges(nr, ranges) {
      for (let i = ranges.length - 1; i >= 0; i--) {
        if (!ranges[i].length) {
          continue;
        }
        if (ranges[i].length === 1 && nr === ranges[i][0]) {
          return true;
        }
        if (ranges[i].length === 2 && nr >= ranges[i][0] && nr <= ranges[i][1]) {
          return true;
        }
      }
      return false;
    }
    __name(checkRanges, "checkRanges");
    var Encoder = class extends Transform {
      static {
        __name(this, "Encoder");
      }
      constructor(options) {
        super();
        this.options = options || {};
        if (this.options.lineLength !== false) {
          this.options.lineLength = this.options.lineLength || 76;
        }
        this._curLine = "";
        this.inputBytes = 0;
        this.outputBytes = 0;
      }
      _transform(chunk, encoding, done) {
        let qp;
        if (encoding !== "buffer") {
          chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
          return done();
        }
        this.inputBytes += chunk.length;
        if (this.options.lineLength) {
          qp = this._curLine + encode2(chunk);
          qp = wrap(qp, this.options.lineLength);
          qp = qp.replace(/(^|\n)([^\n]*)$/, (match2, lineBreak, lastLine) => {
            this._curLine = lastLine;
            return lineBreak;
          });
          if (qp) {
            this.outputBytes += qp.length;
            this.push(qp);
          }
        } else {
          qp = encode2(chunk);
          this.outputBytes += qp.length;
          this.push(qp, "ascii");
        }
        done();
      }
      _flush(done) {
        if (this._curLine) {
          this.outputBytes += this._curLine.length;
          this.push(this._curLine, "ascii");
        }
        done();
      }
    };
    module.exports = {
      encode: encode2,
      wrap,
      Encoder
    };
  }
});

// ../node_modules/nodemailer/lib/mime-funcs/index.js
var require_mime_funcs = __commonJS({
  "../node_modules/nodemailer/lib/mime-funcs/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var base64 = require_base64();
    var qp = require_qp();
    var mimeTypes = require_mime_types();
    module.exports = {
      /**
       * Checks if a value is plaintext string (uses only printable 7bit chars)
       *
       * @param {String} value String to be tested
       * @returns {Boolean} true if it is a plaintext string
       */
      isPlainText(value, isParam) {
        const re = isParam ? /[\x00-\x08\x0b\x0c\x0e-\x1f"\u0080-\uFFFF]/ : /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/;
        if (typeof value !== "string" || re.test(value)) {
          return false;
        } else {
          return true;
        }
      },
      /**
       * Checks if a multi line string containes lines longer than the selected value.
       *
       * Useful when detecting if a mail message needs any processing at all –
       * if only plaintext characters are used and lines are short, then there is
       * no need to encode the values in any way. If the value is plaintext but has
       * longer lines then allowed, then use format=flowed
       *
       * @param {Number} lineLength Max line length to check for
       * @returns {Boolean} Returns true if there is at least one line longer than lineLength chars
       */
      hasLongerLines(str, lineLength) {
        if (str.length > 128 * 1024) {
          return true;
        }
        return new RegExp("^.{" + (lineLength + 1) + ",}", "m").test(str);
      },
      /**
       * Encodes a string or an Buffer to an UTF-8 MIME Word (rfc2047)
       *
       * @param {String|Buffer} data String to be encoded
       * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
       * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
       * @return {String} Single or several mime words joined together
       */
      encodeWord(data, mimeWordEncoding, maxLength) {
        mimeWordEncoding = (mimeWordEncoding || "Q").toString().toUpperCase().trim().charAt(0);
        maxLength = maxLength || 0;
        let encodedStr;
        let toCharset = "UTF-8";
        if (maxLength && maxLength > 7 + toCharset.length) {
          maxLength -= 7 + toCharset.length;
        }
        if (mimeWordEncoding === "Q") {
          encodedStr = qp.encode(data).replace(/[^a-z0-9!*+\-/=]/gi, (chr) => {
            let ord = chr.charCodeAt(0).toString(16).toUpperCase();
            if (chr === " ") {
              return "_";
            } else {
              return "=" + (ord.length === 1 ? "0" + ord : ord);
            }
          });
        } else if (mimeWordEncoding === "B") {
          encodedStr = typeof data === "string" ? data : base64.encode(data);
          maxLength = maxLength ? Math.max(3, (maxLength - maxLength % 4) / 4 * 3) : 0;
        }
        if (maxLength && (mimeWordEncoding !== "B" ? encodedStr : base64.encode(data)).length > maxLength) {
          if (mimeWordEncoding === "Q") {
            encodedStr = this.splitMimeEncodedString(encodedStr, maxLength).join("?= =?" + toCharset + "?" + mimeWordEncoding + "?");
          } else {
            let parts = [];
            let lpart = "";
            for (let i = 0, len = encodedStr.length; i < len; i++) {
              let chr = encodedStr.charAt(i);
              if (/[\ud83c\ud83d\ud83e]/.test(chr) && i < len - 1) {
                chr += encodedStr.charAt(++i);
              }
              if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
                lpart += chr;
              } else {
                parts.push(base64.encode(lpart));
                lpart = chr;
              }
            }
            if (lpart) {
              parts.push(base64.encode(lpart));
            }
            if (parts.length > 1) {
              encodedStr = parts.join("?= =?" + toCharset + "?" + mimeWordEncoding + "?");
            } else {
              encodedStr = parts.join("");
            }
          }
        } else if (mimeWordEncoding === "B") {
          encodedStr = base64.encode(data);
        }
        return "=?" + toCharset + "?" + mimeWordEncoding + "?" + encodedStr + (encodedStr.substr(-2) === "?=" ? "" : "?=");
      },
      /**
       * Finds word sequences with non ascii text and converts these to mime words
       *
       * @param {String} value String to be encoded
       * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
       * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
       * @param {Boolean} [encodeAll=false] If true and the value needs encoding then encodes entire string, not just the smallest match
       * @return {String} String with possible mime words
       */
      encodeWords(value, mimeWordEncoding, maxLength, encodeAll) {
        maxLength = maxLength || 0;
        let encodedValue;
        let firstMatch = value.match(/(?:^|\s)([^\s]*["\u0080-\uFFFF])/);
        if (!firstMatch) {
          return value;
        }
        if (encodeAll) {
          return this.encodeWord(value, mimeWordEncoding, maxLength);
        }
        let lastMatch = value.match(/(["\u0080-\uFFFF][^\s]*)[^"\u0080-\uFFFF]*$/);
        if (!lastMatch) {
          return value;
        }
        let startIndex = firstMatch.index + (firstMatch[0].match(/[^\s]/) || {
          index: 0
        }).index;
        let endIndex = lastMatch.index + (lastMatch[1] || "").length;
        encodedValue = (startIndex ? value.substr(0, startIndex) : "") + this.encodeWord(value.substring(startIndex, endIndex), mimeWordEncoding || "Q", maxLength) + (endIndex < value.length ? value.substr(endIndex) : "");
        return encodedValue;
      },
      /**
       * Joins parsed header value together as 'value; param1=value1; param2=value2'
       * PS: We are following RFC 822 for the list of special characters that we need to keep in quotes.
       *      Refer: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
       * @param {Object} structured Parsed header value
       * @return {String} joined header value
       */
      buildHeaderValue(structured) {
        let paramsArray = [];
        Object.keys(structured.params || {}).forEach((param) => {
          let value = structured.params[param];
          if (!this.isPlainText(value, true) || value.length >= 75) {
            this.buildHeaderParam(param, value, 50).forEach((encodedParam) => {
              if (!/[\s"\\;:/=(),<>@[\]?]|^[-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === "*") {
                paramsArray.push(encodedParam.key + "=" + encodedParam.value);
              } else {
                paramsArray.push(encodedParam.key + "=" + JSON.stringify(encodedParam.value));
              }
            });
          } else if (/[\s'"\\;:/=(),<>@[\]?]|^-/.test(value)) {
            paramsArray.push(param + "=" + JSON.stringify(value));
          } else {
            paramsArray.push(param + "=" + value);
          }
        });
        return structured.value + (paramsArray.length ? "; " + paramsArray.join("; ") : "");
      },
      /**
       * Encodes a string or an Buffer to an UTF-8 Parameter Value Continuation encoding (rfc2231)
       * Useful for splitting long parameter values.
       *
       * For example
       *      title="unicode string"
       * becomes
       *     title*0*=utf-8''unicode
       *     title*1*=%20string
       *
       * @param {String|Buffer} data String to be encoded
       * @param {Number} [maxLength=50] Max length for generated chunks
       * @param {String} [fromCharset='UTF-8'] Source sharacter set
       * @return {Array} A list of encoded keys and headers
       */
      buildHeaderParam(key, data, maxLength) {
        let list = [];
        let encodedStr = typeof data === "string" ? data : (data || "").toString();
        let encodedStrArr;
        let chr, ord;
        let line;
        let startPos = 0;
        let i, len;
        maxLength = maxLength || 50;
        if (this.isPlainText(data, true)) {
          if (encodedStr.length <= maxLength) {
            return [
              {
                key,
                value: encodedStr
              }
            ];
          }
          encodedStr = encodedStr.replace(new RegExp(".{" + maxLength + "}", "g"), (str) => {
            list.push({
              line: str
            });
            return "";
          });
          if (encodedStr) {
            list.push({
              line: encodedStr
            });
          }
        } else {
          if (/[\uD800-\uDBFF]/.test(encodedStr)) {
            encodedStrArr = [];
            for (i = 0, len = encodedStr.length; i < len; i++) {
              chr = encodedStr.charAt(i);
              ord = chr.charCodeAt(0);
              if (ord >= 55296 && ord <= 56319 && i < len - 1) {
                chr += encodedStr.charAt(i + 1);
                encodedStrArr.push(chr);
                i++;
              } else {
                encodedStrArr.push(chr);
              }
            }
            encodedStr = encodedStrArr;
          }
          line = "utf-8''";
          let encoded = true;
          startPos = 0;
          for (i = 0, len = encodedStr.length; i < len; i++) {
            chr = encodedStr[i];
            if (encoded) {
              chr = this.safeEncodeURIComponent(chr);
            } else {
              chr = chr === " " ? chr : this.safeEncodeURIComponent(chr);
              if (chr !== encodedStr[i]) {
                if ((this.safeEncodeURIComponent(line) + chr).length >= maxLength) {
                  list.push({
                    line,
                    encoded
                  });
                  line = "";
                  startPos = i - 1;
                } else {
                  encoded = true;
                  i = startPos;
                  line = "";
                  continue;
                }
              }
            }
            if ((line + chr).length >= maxLength) {
              list.push({
                line,
                encoded
              });
              line = chr = encodedStr[i] === " " ? " " : this.safeEncodeURIComponent(encodedStr[i]);
              if (chr === encodedStr[i]) {
                encoded = false;
                startPos = i - 1;
              } else {
                encoded = true;
              }
            } else {
              line += chr;
            }
          }
          if (line) {
            list.push({
              line,
              encoded
            });
          }
        }
        return list.map((item, i2) => ({
          // encoded lines: {name}*{part}*
          // unencoded lines: {name}*{part}
          // if any line needs to be encoded then the first line (part==0) is always encoded
          key: key + "*" + i2 + (item.encoded ? "*" : ""),
          value: item.line
        }));
      },
      /**
       * Parses a header value with key=value arguments into a structured
       * object.
       *
       *   parseHeaderValue('content-type: text/plain; CHARSET='UTF-8'') ->
       *   {
       *     'value': 'text/plain',
       *     'params': {
       *       'charset': 'UTF-8'
       *     }
       *   }
       *
       * @param {String} str Header value
       * @return {Object} Header value as a parsed structure
       */
      parseHeaderValue(str) {
        let response = {
          value: false,
          params: {}
        };
        let key = false;
        let value = "";
        let type2 = "value";
        let quote = false;
        let escaped = false;
        let chr;
        for (let i = 0, len = str.length; i < len; i++) {
          chr = str.charAt(i);
          if (type2 === "key") {
            if (chr === "=") {
              key = value.trim().toLowerCase();
              type2 = "value";
              value = "";
              continue;
            }
            value += chr;
          } else {
            if (escaped) {
              value += chr;
            } else if (chr === "\\") {
              escaped = true;
              continue;
            } else if (quote && chr === quote) {
              quote = false;
            } else if (!quote && chr === '"') {
              quote = chr;
            } else if (!quote && chr === ";") {
              if (key === false) {
                response.value = value.trim();
              } else {
                response.params[key] = value.trim();
              }
              type2 = "key";
              value = "";
            } else {
              value += chr;
            }
            escaped = false;
          }
        }
        if (type2 === "value") {
          if (key === false) {
            response.value = value.trim();
          } else {
            response.params[key] = value.trim();
          }
        } else if (value.trim()) {
          response.params[value.trim().toLowerCase()] = "";
        }
        Object.keys(response.params).forEach((key2) => {
          let actualKey, nr, match2, value2;
          if (match2 = key2.match(/(\*(\d+)|\*(\d+)\*|\*)$/)) {
            actualKey = key2.substr(0, match2.index);
            nr = Number(match2[2] || match2[3]) || 0;
            if (!response.params[actualKey] || typeof response.params[actualKey] !== "object") {
              response.params[actualKey] = {
                charset: false,
                values: []
              };
            }
            value2 = response.params[key2];
            if (nr === 0 && match2[0].substr(-1) === "*" && (match2 = value2.match(/^([^']*)'[^']*'(.*)$/))) {
              response.params[actualKey].charset = match2[1] || "iso-8859-1";
              value2 = match2[2];
            }
            response.params[actualKey].values[nr] = value2;
            delete response.params[key2];
          }
        });
        Object.keys(response.params).forEach((key2) => {
          let value2;
          if (response.params[key2] && Array.isArray(response.params[key2].values)) {
            value2 = response.params[key2].values.map((val) => val || "").join("");
            if (response.params[key2].charset) {
              response.params[key2] = "=?" + response.params[key2].charset + "?Q?" + value2.replace(/[=?_\s]/g, (s) => {
                let c = s.charCodeAt(0).toString(16);
                if (s === " ") {
                  return "_";
                } else {
                  return "%" + (c.length < 2 ? "0" : "") + c;
                }
              }).replace(/%/g, "=") + "?=";
            } else {
              response.params[key2] = value2;
            }
          }
        });
        return response;
      },
      /**
       * Returns file extension for a content type string. If no suitable extensions
       * are found, 'bin' is used as the default extension
       *
       * @param {String} mimeType Content type to be checked for
       * @return {String} File extension
       */
      detectExtension: /* @__PURE__ */ __name((mimeType) => mimeTypes.detectExtension(mimeType), "detectExtension"),
      /**
       * Returns content type for a file extension. If no suitable content types
       * are found, 'application/octet-stream' is used as the default content type
       *
       * @param {String} extension Extension to be checked for
       * @return {String} File extension
       */
      detectMimeType: /* @__PURE__ */ __name((extension) => mimeTypes.detectMimeType(extension), "detectMimeType"),
      /**
       * Folds long lines, useful for folding header lines (afterSpace=false) and
       * flowed text (afterSpace=true)
       *
       * @param {String} str String to be folded
       * @param {Number} [lineLength=76] Maximum length of a line
       * @param {Boolean} afterSpace If true, leave a space in th end of a line
       * @return {String} String with folded lines
       */
      foldLines(str, lineLength, afterSpace) {
        str = (str || "").toString();
        lineLength = lineLength || 76;
        let pos = 0, len = str.length, result = "", line, match2;
        while (pos < len) {
          line = str.substr(pos, lineLength);
          if (line.length < lineLength) {
            result += line;
            break;
          }
          if (match2 = line.match(/^[^\n\r]*(\r?\n|\r)/)) {
            line = match2[0];
            result += line;
            pos += line.length;
            continue;
          } else if ((match2 = line.match(/(\s+)[^\s]*$/)) && match2[0].length - (afterSpace ? (match2[1] || "").length : 0) < line.length) {
            line = line.substr(0, line.length - (match2[0].length - (afterSpace ? (match2[1] || "").length : 0)));
          } else if (match2 = str.substr(pos + line.length).match(/^[^\s]+(\s*)/)) {
            line = line + match2[0].substr(0, match2[0].length - (!afterSpace ? (match2[1] || "").length : 0));
          }
          result += line;
          pos += line.length;
          if (pos < len) {
            result += "\r\n";
          }
        }
        return result;
      },
      /**
       * Splits a mime encoded string. Needed for dividing mime words into smaller chunks
       *
       * @param {String} str Mime encoded string to be split up
       * @param {Number} maxlen Maximum length of characters for one part (minimum 12)
       * @return {Array} Split string
       */
      splitMimeEncodedString: /* @__PURE__ */ __name((str, maxlen) => {
        let curLine, match2, chr, done, lines = [];
        maxlen = Math.max(maxlen || 0, 12);
        while (str.length) {
          curLine = str.substr(0, maxlen);
          if (match2 = curLine.match(/[=][0-9A-F]?$/i)) {
            curLine = curLine.substr(0, match2.index);
          }
          done = false;
          while (!done) {
            done = true;
            if (match2 = str.substr(curLine.length).match(/^[=]([0-9A-F]{2})/i)) {
              chr = parseInt(match2[1], 16);
              if (chr < 194 && chr > 127) {
                curLine = curLine.substr(0, curLine.length - 3);
                done = false;
              }
            }
          }
          if (curLine.length) {
            lines.push(curLine);
          }
          str = str.substr(curLine.length);
        }
        return lines;
      }, "splitMimeEncodedString"),
      encodeURICharComponent: /* @__PURE__ */ __name((chr) => {
        let res = "";
        let ord = chr.charCodeAt(0).toString(16).toUpperCase();
        if (ord.length % 2) {
          ord = "0" + ord;
        }
        if (ord.length > 2) {
          for (let i = 0, len = ord.length / 2; i < len; i++) {
            res += "%" + ord.substr(i, 2);
          }
        } else {
          res += "%" + ord;
        }
        return res;
      }, "encodeURICharComponent"),
      safeEncodeURIComponent(str) {
        str = (str || "").toString();
        try {
          str = encodeURIComponent(str);
        } catch (_E) {
          return str.replace(/[^\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]+/g, "");
        }
        return str.replace(/[\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]/g, (chr) => this.encodeURICharComponent(chr));
      }
    };
  }
});

// ../node_modules/nodemailer/lib/addressparser/index.js
var require_addressparser = __commonJS({
  "../node_modules/nodemailer/lib/addressparser/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function _handleAddress(tokens, depth) {
      let isGroup = false;
      let state = "text";
      let address;
      let addresses = [];
      let data = {
        address: [],
        comment: [],
        group: [],
        text: [],
        textWasQuoted: []
        // Track which text tokens came from inside quotes
      };
      let i;
      let len;
      let insideQuotes = false;
      for (i = 0, len = tokens.length; i < len; i++) {
        let token = tokens[i];
        let prevToken = i ? tokens[i - 1] : null;
        if (token.type === "operator") {
          switch (token.value) {
            case "<":
              state = "address";
              insideQuotes = false;
              break;
            case "(":
              state = "comment";
              insideQuotes = false;
              break;
            case ":":
              state = "group";
              isGroup = true;
              insideQuotes = false;
              break;
            case '"':
              insideQuotes = !insideQuotes;
              state = "text";
              break;
            default:
              state = "text";
              insideQuotes = false;
              break;
          }
        } else if (token.value) {
          if (state === "address") {
            token.value = token.value.replace(/^[^<]*<\s*/, "");
          }
          if (prevToken && prevToken.noBreak && data[state].length) {
            data[state][data[state].length - 1] += token.value;
            if (state === "text" && insideQuotes) {
              data.textWasQuoted[data.textWasQuoted.length - 1] = true;
            }
          } else {
            data[state].push(token.value);
            if (state === "text") {
              data.textWasQuoted.push(insideQuotes);
            }
          }
        }
      }
      if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
      }
      if (isGroup) {
        data.text = data.text.join(" ");
        let groupMembers = [];
        if (data.group.length) {
          let parsedGroup = addressparser(data.group.join(","), { _depth: depth + 1 });
          parsedGroup.forEach((member) => {
            if (member.group) {
              groupMembers = groupMembers.concat(member.group);
            } else {
              groupMembers.push(member);
            }
          });
        }
        addresses.push({
          name: data.text || address && address.name,
          group: groupMembers
        });
      } else {
        if (!data.address.length && data.text.length) {
          for (i = data.text.length - 1; i >= 0; i--) {
            if (!data.textWasQuoted[i] && data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
              data.address = data.text.splice(i, 1);
              data.textWasQuoted.splice(i, 1);
              break;
            }
          }
          let _regexHandler = /* @__PURE__ */ __name(function(address2) {
            if (!data.address.length) {
              data.address = [address2.trim()];
              return " ";
            } else {
              return address2;
            }
          }, "_regexHandler");
          if (!data.address.length) {
            for (i = data.text.length - 1; i >= 0; i--) {
              if (!data.textWasQuoted[i]) {
                data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
                if (data.address.length) {
                  break;
                }
              }
            }
          }
        }
        if (!data.text.length && data.comment.length) {
          data.text = data.comment;
          data.comment = [];
        }
        if (data.address.length > 1) {
          data.text = data.text.concat(data.address.splice(1));
        }
        data.text = data.text.join(" ");
        data.address = data.address.join(" ");
        if (!data.address && isGroup) {
          return [];
        } else {
          address = {
            address: data.address || data.text || "",
            name: data.text || data.address || ""
          };
          if (address.address === address.name) {
            if ((address.address || "").match(/@/)) {
              address.name = "";
            } else {
              address.address = "";
            }
          }
          addresses.push(address);
        }
      }
      return addresses;
    }
    __name(_handleAddress, "_handleAddress");
    var Tokenizer = class {
      static {
        __name(this, "Tokenizer");
      }
      constructor(str) {
        this.str = (str || "").toString();
        this.operatorCurrent = "";
        this.operatorExpecting = "";
        this.node = null;
        this.escaped = false;
        this.list = [];
        this.operators = {
          '"': '"',
          "(": ")",
          "<": ">",
          ",": "",
          ":": ";",
          // Semicolons are not a legal delimiter per the RFC2822 grammar other
          // than for terminating a group, but they are also not valid for any
          // other use in this context.  Given that some mail clients have
          // historically allowed the semicolon as a delimiter equivalent to the
          // comma in their UI, it makes sense to treat them the same as a comma
          // when used outside of a group.
          ";": ""
        };
      }
      /**
       * Tokenizes the original input string
       *
       * @return {Array} An array of operator|text tokens
       */
      tokenize() {
        let list = [];
        for (let i = 0, len = this.str.length; i < len; i++) {
          let chr = this.str.charAt(i);
          let nextChr = i < len - 1 ? this.str.charAt(i + 1) : null;
          this.checkChar(chr, nextChr);
        }
        this.list.forEach((node) => {
          node.value = (node.value || "").toString().trim();
          if (node.value) {
            list.push(node);
          }
        });
        return list;
      }
      /**
       * Checks if a character is an operator or text and acts accordingly
       *
       * @param {String} chr Character from the address field
       */
      checkChar(chr, nextChr) {
        if (this.escaped) {
        } else if (chr === this.operatorExpecting) {
          this.node = {
            type: "operator",
            value: chr
          };
          if (nextChr && ![" ", "	", "\r", "\n", ",", ";"].includes(nextChr)) {
            this.node.noBreak = true;
          }
          this.list.push(this.node);
          this.node = null;
          this.operatorExpecting = "";
          this.escaped = false;
          return;
        } else if (!this.operatorExpecting && chr in this.operators) {
          this.node = {
            type: "operator",
            value: chr
          };
          this.list.push(this.node);
          this.node = null;
          this.operatorExpecting = this.operators[chr];
          this.escaped = false;
          return;
        } else if (['"', "'"].includes(this.operatorExpecting) && chr === "\\") {
          this.escaped = true;
          return;
        }
        if (!this.node) {
          this.node = {
            type: "text",
            value: ""
          };
          this.list.push(this.node);
        }
        if (chr === "\n") {
          chr = " ";
        }
        if (chr.charCodeAt(0) >= 33 || [" ", "	"].includes(chr)) {
          this.node.value += chr;
        }
        this.escaped = false;
      }
    };
    var MAX_NESTED_GROUP_DEPTH = 50;
    function addressparser(str, options) {
      options = options || {};
      let depth = options._depth || 0;
      if (depth > MAX_NESTED_GROUP_DEPTH) {
        return [];
      }
      let tokenizer = new Tokenizer(str);
      let tokens = tokenizer.tokenize();
      let addresses = [];
      let address = [];
      let parsedAddresses = [];
      tokens.forEach((token) => {
        if (token.type === "operator" && (token.value === "," || token.value === ";")) {
          if (address.length) {
            addresses.push(address);
          }
          address = [];
        } else {
          address.push(token);
        }
      });
      if (address.length) {
        addresses.push(address);
      }
      addresses.forEach((address2) => {
        address2 = _handleAddress(address2, depth);
        if (address2.length) {
          parsedAddresses = parsedAddresses.concat(address2);
        }
      });
      if (options.flatten) {
        let addresses2 = [];
        let walkAddressList = /* @__PURE__ */ __name((list) => {
          list.forEach((address2) => {
            if (address2.group) {
              return walkAddressList(address2.group);
            } else {
              addresses2.push(address2);
            }
          });
        }, "walkAddressList");
        walkAddressList(parsedAddresses);
        return addresses2;
      }
      return parsedAddresses;
    }
    __name(addressparser, "addressparser");
    module.exports = addressparser;
  }
});

// ../node_modules/nodemailer/lib/mime-node/last-newline.js
var require_last_newline = __commonJS({
  "../node_modules/nodemailer/lib/mime-node/last-newline.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Transform = require_stream().Transform;
    var LastNewline = class extends Transform {
      static {
        __name(this, "LastNewline");
      }
      constructor() {
        super();
        this.lastByte = false;
      }
      _transform(chunk, encoding, done) {
        if (chunk.length) {
          this.lastByte = chunk[chunk.length - 1];
        }
        this.push(chunk);
        done();
      }
      _flush(done) {
        if (this.lastByte === 10) {
          return done();
        }
        if (this.lastByte === 13) {
          this.push(Buffer.from("\n"));
          return done();
        }
        this.push(Buffer.from("\r\n"));
        return done();
      }
    };
    module.exports = LastNewline;
  }
});

// ../node_modules/nodemailer/lib/mime-node/le-windows.js
var require_le_windows = __commonJS({
  "../node_modules/nodemailer/lib/mime-node/le-windows.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var stream = require_stream();
    var Transform = stream.Transform;
    var LeWindows = class extends Transform {
      static {
        __name(this, "LeWindows");
      }
      constructor(options) {
        super(options);
        this.options = options || {};
        this.lastByte = false;
      }
      /**
       * Escapes dots
       */
      _transform(chunk, encoding, done) {
        let buf;
        let lastPos = 0;
        for (let i = 0, len = chunk.length; i < len; i++) {
          if (chunk[i] === 10) {
            if (i && chunk[i - 1] !== 13 || !i && this.lastByte !== 13) {
              if (i > lastPos) {
                buf = chunk.slice(lastPos, i);
                this.push(buf);
              }
              this.push(Buffer.from("\r\n"));
              lastPos = i + 1;
            }
          }
        }
        if (lastPos && lastPos < chunk.length) {
          buf = chunk.slice(lastPos);
          this.push(buf);
        } else if (!lastPos) {
          this.push(chunk);
        }
        this.lastByte = chunk[chunk.length - 1];
        done();
      }
    };
    module.exports = LeWindows;
  }
});

// ../node_modules/nodemailer/lib/mime-node/le-unix.js
var require_le_unix = __commonJS({
  "../node_modules/nodemailer/lib/mime-node/le-unix.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var stream = require_stream();
    var Transform = stream.Transform;
    var LeWindows = class extends Transform {
      static {
        __name(this, "LeWindows");
      }
      constructor(options) {
        super(options);
        this.options = options || {};
      }
      /**
       * Escapes dots
       */
      _transform(chunk, encoding, done) {
        let buf;
        let lastPos = 0;
        for (let i = 0, len = chunk.length; i < len; i++) {
          if (chunk[i] === 13) {
            buf = chunk.slice(lastPos, i);
            lastPos = i + 1;
            this.push(buf);
          }
        }
        if (lastPos && lastPos < chunk.length) {
          buf = chunk.slice(lastPos);
          this.push(buf);
        } else if (!lastPos) {
          this.push(chunk);
        }
        done();
      }
    };
    module.exports = LeWindows;
  }
});

// ../node_modules/nodemailer/lib/mime-node/index.js
var require_mime_node = __commonJS({
  "../node_modules/nodemailer/lib/mime-node/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var crypto = require_crypto();
    var fs = require_fs();
    var punycode = require_punycode();
    var PassThrough = require_stream().PassThrough;
    var shared = require_shared();
    var mimeFuncs = require_mime_funcs();
    var qp = require_qp();
    var base64 = require_base64();
    var addressparser = require_addressparser();
    var nmfetch = require_fetch();
    var LastNewline = require_last_newline();
    var LeWindows = require_le_windows();
    var LeUnix = require_le_unix();
    var MimeNode = class _MimeNode {
      static {
        __name(this, "MimeNode");
      }
      constructor(contentType, options) {
        this.nodeCounter = 0;
        options = options || {};
        this.baseBoundary = options.baseBoundary || crypto.randomBytes(8).toString("hex");
        this.boundaryPrefix = options.boundaryPrefix || "--_NmP";
        this.disableFileAccess = !!options.disableFileAccess;
        this.disableUrlAccess = !!options.disableUrlAccess;
        this.normalizeHeaderKey = options.normalizeHeaderKey;
        this.date = /* @__PURE__ */ new Date();
        this.rootNode = options.rootNode || this;
        this.keepBcc = !!options.keepBcc;
        if (options.filename) {
          this.filename = options.filename;
          if (!contentType) {
            contentType = mimeFuncs.detectMimeType(this.filename.split(".").pop());
          }
        }
        this.textEncoding = (options.textEncoding || "").toString().trim().charAt(0).toUpperCase();
        this.parentNode = options.parentNode;
        this.hostname = options.hostname;
        this.newline = options.newline;
        this.childNodes = [];
        this._nodeId = ++this.rootNode.nodeCounter;
        this._headers = [];
        this._isPlainText = false;
        this._hasLongLines = false;
        this._envelope = false;
        this._raw = false;
        this._transforms = [];
        this._processFuncs = [];
        if (contentType) {
          this.setHeader("Content-Type", contentType);
        }
      }
      /////// PUBLIC METHODS
      /**
       * Creates and appends a child node.Arguments provided are passed to MimeNode constructor
       *
       * @param {String} [contentType] Optional content type
       * @param {Object} [options] Optional options object
       * @return {Object} Created node object
       */
      createChild(contentType, options) {
        if (!options && typeof contentType === "object") {
          options = contentType;
          contentType = void 0;
        }
        let node = new _MimeNode(contentType, options);
        this.appendChild(node);
        return node;
      }
      /**
       * Appends an existing node to the mime tree. Removes the node from an existing
       * tree if needed
       *
       * @param {Object} childNode node to be appended
       * @return {Object} Appended node object
       */
      appendChild(childNode) {
        if (childNode.rootNode !== this.rootNode) {
          childNode.rootNode = this.rootNode;
          childNode._nodeId = ++this.rootNode.nodeCounter;
        }
        childNode.parentNode = this;
        this.childNodes.push(childNode);
        return childNode;
      }
      /**
       * Replaces current node with another node
       *
       * @param {Object} node Replacement node
       * @return {Object} Replacement node
       */
      replace(node) {
        if (node === this) {
          return this;
        }
        this.parentNode.childNodes.forEach((childNode, i) => {
          if (childNode === this) {
            node.rootNode = this.rootNode;
            node.parentNode = this.parentNode;
            node._nodeId = this._nodeId;
            this.rootNode = this;
            this.parentNode = void 0;
            node.parentNode.childNodes[i] = node;
          }
        });
        return node;
      }
      /**
       * Removes current node from the mime tree
       *
       * @return {Object} removed node
       */
      remove() {
        if (!this.parentNode) {
          return this;
        }
        for (let i = this.parentNode.childNodes.length - 1; i >= 0; i--) {
          if (this.parentNode.childNodes[i] === this) {
            this.parentNode.childNodes.splice(i, 1);
            this.parentNode = void 0;
            this.rootNode = this;
            return this;
          }
        }
      }
      /**
       * Sets a header value. If the value for selected key exists, it is overwritten.
       * You can set multiple values as well by using [{key:'', value:''}] or
       * {key: 'value'} as the first argument.
       *
       * @param {String|Array|Object} key Header key or a list of key value pairs
       * @param {String} value Header value
       * @return {Object} current node
       */
      setHeader(key, value) {
        let added = false, headerValue;
        if (!value && key && typeof key === "object") {
          if (key.key && "value" in key) {
            this.setHeader(key.key, key.value);
          } else if (Array.isArray(key)) {
            key.forEach((i) => {
              this.setHeader(i.key, i.value);
            });
          } else {
            Object.keys(key).forEach((i) => {
              this.setHeader(i, key[i]);
            });
          }
          return this;
        }
        key = this._normalizeHeaderKey(key);
        headerValue = {
          key,
          value
        };
        for (let i = 0, len = this._headers.length; i < len; i++) {
          if (this._headers[i].key === key) {
            if (!added) {
              this._headers[i] = headerValue;
              added = true;
            } else {
              this._headers.splice(i, 1);
              i--;
              len--;
            }
          }
        }
        if (!added) {
          this._headers.push(headerValue);
        }
        return this;
      }
      /**
       * Adds a header value. If the value for selected key exists, the value is appended
       * as a new field and old one is not touched.
       * You can set multiple values as well by using [{key:'', value:''}] or
       * {key: 'value'} as the first argument.
       *
       * @param {String|Array|Object} key Header key or a list of key value pairs
       * @param {String} value Header value
       * @return {Object} current node
       */
      addHeader(key, value) {
        if (!value && key && typeof key === "object") {
          if (key.key && key.value) {
            this.addHeader(key.key, key.value);
          } else if (Array.isArray(key)) {
            key.forEach((i) => {
              this.addHeader(i.key, i.value);
            });
          } else {
            Object.keys(key).forEach((i) => {
              this.addHeader(i, key[i]);
            });
          }
          return this;
        } else if (Array.isArray(value)) {
          value.forEach((val) => {
            this.addHeader(key, val);
          });
          return this;
        }
        this._headers.push({
          key: this._normalizeHeaderKey(key),
          value
        });
        return this;
      }
      /**
       * Retrieves the first mathcing value of a selected key
       *
       * @param {String} key Key to search for
       * @retun {String} Value for the key
       */
      getHeader(key) {
        key = this._normalizeHeaderKey(key);
        for (let i = 0, len = this._headers.length; i < len; i++) {
          if (this._headers[i].key === key) {
            return this._headers[i].value;
          }
        }
      }
      /**
       * Sets body content for current node. If the value is a string, charset is added automatically
       * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
       * the charset yourself
       *
       * @param (String|Buffer) content Body content
       * @return {Object} current node
       */
      setContent(content) {
        this.content = content;
        if (typeof this.content.pipe === "function") {
          this._contentErrorHandler = (err) => {
            this.content.removeListener("error", this._contentErrorHandler);
            this.content = err;
          };
          this.content.once("error", this._contentErrorHandler);
        } else if (typeof this.content === "string") {
          this._isPlainText = mimeFuncs.isPlainText(this.content);
          if (this._isPlainText && mimeFuncs.hasLongerLines(this.content, 76)) {
            this._hasLongLines = true;
          }
        }
        return this;
      }
      build(callback) {
        let promise;
        if (!callback) {
          promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
          });
        }
        let stream = this.createReadStream();
        let buf = [];
        let buflen = 0;
        let returned = false;
        stream.on("readable", () => {
          let chunk;
          while ((chunk = stream.read()) !== null) {
            buf.push(chunk);
            buflen += chunk.length;
          }
        });
        stream.once("error", (err) => {
          if (returned) {
            return;
          }
          returned = true;
          return callback(err);
        });
        stream.once("end", (chunk) => {
          if (returned) {
            return;
          }
          returned = true;
          if (chunk && chunk.length) {
            buf.push(chunk);
            buflen += chunk.length;
          }
          return callback(null, Buffer.concat(buf, buflen));
        });
        return promise;
      }
      getTransferEncoding() {
        let transferEncoding = false;
        let contentType = (this.getHeader("Content-Type") || "").toString().toLowerCase().trim();
        if (this.content) {
          transferEncoding = (this.getHeader("Content-Transfer-Encoding") || "").toString().toLowerCase().trim();
          if (!transferEncoding || !["base64", "quoted-printable"].includes(transferEncoding)) {
            if (/^text\//i.test(contentType)) {
              if (this._isPlainText && !this._hasLongLines) {
                transferEncoding = "7bit";
              } else if (typeof this.content === "string" || this.content instanceof Buffer) {
                transferEncoding = this._getTextEncoding(this.content) === "Q" ? "quoted-printable" : "base64";
              } else {
                transferEncoding = this.textEncoding === "B" ? "base64" : "quoted-printable";
              }
            } else if (!/^(multipart|message)\//i.test(contentType)) {
              transferEncoding = transferEncoding || "base64";
            }
          }
        }
        return transferEncoding;
      }
      /**
       * Builds the header block for the mime node. Append \r\n\r\n before writing the content
       *
       * @returns {String} Headers
       */
      buildHeaders() {
        let transferEncoding = this.getTransferEncoding();
        let headers = [];
        if (transferEncoding) {
          this.setHeader("Content-Transfer-Encoding", transferEncoding);
        }
        if (this.filename && !this.getHeader("Content-Disposition")) {
          this.setHeader("Content-Disposition", "attachment");
        }
        if (this.rootNode === this) {
          if (!this.getHeader("Date")) {
            this.setHeader("Date", this.date.toUTCString().replace(/GMT/, "+0000"));
          }
          this.messageId();
          if (!this.getHeader("MIME-Version")) {
            this.setHeader("MIME-Version", "1.0");
          }
          for (let i = this._headers.length - 2; i >= 0; i--) {
            let header = this._headers[i];
            if (header.key === "Content-Type") {
              this._headers.splice(i, 1);
              this._headers.push(header);
            }
          }
        }
        this._headers.forEach((header) => {
          let key = header.key;
          let value = header.value;
          let structured;
          let param;
          let options = {};
          let formattedHeaders = ["From", "Sender", "To", "Cc", "Bcc", "Reply-To", "Date", "References"];
          if (value && typeof value === "object" && !formattedHeaders.includes(key)) {
            Object.keys(value).forEach((key2) => {
              if (key2 !== "value") {
                options[key2] = value[key2];
              }
            });
            value = (value.value || "").toString();
            if (!value.trim()) {
              return;
            }
          }
          if (options.prepared) {
            if (options.foldLines) {
              headers.push(mimeFuncs.foldLines(key + ": " + value));
            } else {
              headers.push(key + ": " + value);
            }
            return;
          }
          switch (header.key) {
            case "Content-Disposition":
              structured = mimeFuncs.parseHeaderValue(value);
              if (this.filename) {
                structured.params.filename = this.filename;
              }
              value = mimeFuncs.buildHeaderValue(structured);
              break;
            case "Content-Type":
              structured = mimeFuncs.parseHeaderValue(value);
              this._handleContentType(structured);
              if (structured.value.match(/^text\/plain\b/) && typeof this.content === "string" && /[\u0080-\uFFFF]/.test(this.content)) {
                structured.params.charset = "utf-8";
              }
              value = mimeFuncs.buildHeaderValue(structured);
              if (this.filename) {
                param = this._encodeWords(this.filename);
                if (param !== this.filename || /[\s'"\\;:/=(),<>@[\]?]|^-/.test(param)) {
                  param = '"' + param + '"';
                }
                value += "; name=" + param;
              }
              break;
            case "Bcc":
              if (!this.keepBcc) {
                return;
              }
              break;
          }
          value = this._encodeHeaderValue(key, value);
          if (!(value || "").toString().trim()) {
            return;
          }
          if (typeof this.normalizeHeaderKey === "function") {
            let normalized = this.normalizeHeaderKey(key, value);
            if (normalized && typeof normalized === "string" && normalized.length) {
              key = normalized;
            }
          }
          headers.push(mimeFuncs.foldLines(key + ": " + value, 76));
        });
        return headers.join("\r\n");
      }
      /**
       * Streams the rfc2822 message from the current node. If this is a root node,
       * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
       *
       * @return {String} Compiled message
       */
      createReadStream(options) {
        options = options || {};
        let stream = new PassThrough(options);
        let outputStream = stream;
        let transform;
        this.stream(stream, options, (err) => {
          if (err) {
            outputStream.emit("error", err);
            return;
          }
          stream.end();
        });
        for (let i = 0, len = this._transforms.length; i < len; i++) {
          transform = typeof this._transforms[i] === "function" ? this._transforms[i]() : this._transforms[i];
          outputStream.once("error", (err) => {
            transform.emit("error", err);
          });
          outputStream = outputStream.pipe(transform);
        }
        transform = new LastNewline();
        outputStream.once("error", (err) => {
          transform.emit("error", err);
        });
        outputStream = outputStream.pipe(transform);
        for (let i = 0, len = this._processFuncs.length; i < len; i++) {
          transform = this._processFuncs[i];
          outputStream = transform(outputStream);
        }
        if (this.newline) {
          const winbreak = ["win", "windows", "dos", "\r\n"].includes(this.newline.toString().toLowerCase());
          const newlineTransform = winbreak ? new LeWindows() : new LeUnix();
          const stream2 = outputStream.pipe(newlineTransform);
          outputStream.on("error", (err) => stream2.emit("error", err));
          return stream2;
        }
        return outputStream;
      }
      /**
       * Appends a transform stream object to the transforms list. Final output
       * is passed through this stream before exposing
       *
       * @param {Object} transform Read-Write stream
       */
      transform(transform) {
        this._transforms.push(transform);
      }
      /**
       * Appends a post process function. The functon is run after transforms and
       * uses the following syntax
       *
       *   processFunc(input) -> outputStream
       *
       * @param {Object} processFunc Read-Write stream
       */
      processFunc(processFunc) {
        this._processFuncs.push(processFunc);
      }
      stream(outputStream, options, done) {
        let transferEncoding = this.getTransferEncoding();
        let contentStream;
        let localStream;
        let returned = false;
        let callback = /* @__PURE__ */ __name((err) => {
          if (returned) {
            return;
          }
          returned = true;
          done(err);
        }, "callback");
        let finalize = /* @__PURE__ */ __name(() => {
          let childId = 0;
          let processChildNode = /* @__PURE__ */ __name(() => {
            if (childId >= this.childNodes.length) {
              outputStream.write("\r\n--" + this.boundary + "--\r\n");
              return callback();
            }
            let child = this.childNodes[childId++];
            outputStream.write((childId > 1 ? "\r\n" : "") + "--" + this.boundary + "\r\n");
            child.stream(outputStream, options, (err) => {
              if (err) {
                return callback(err);
              }
              setImmediate(processChildNode);
            });
          }, "processChildNode");
          if (this.multipart) {
            setImmediate(processChildNode);
          } else {
            return callback();
          }
        }, "finalize");
        let sendContent = /* @__PURE__ */ __name(() => {
          if (this.content) {
            if (Object.prototype.toString.call(this.content) === "[object Error]") {
              return callback(this.content);
            }
            if (typeof this.content.pipe === "function") {
              this.content.removeListener("error", this._contentErrorHandler);
              this._contentErrorHandler = (err) => callback(err);
              this.content.once("error", this._contentErrorHandler);
            }
            let createStream = /* @__PURE__ */ __name(() => {
              if (["quoted-printable", "base64"].includes(transferEncoding)) {
                contentStream = new (transferEncoding === "base64" ? base64 : qp).Encoder(options);
                contentStream.pipe(outputStream, {
                  end: false
                });
                contentStream.once("end", finalize);
                contentStream.once("error", (err) => callback(err));
                localStream = this._getStream(this.content);
                localStream.pipe(contentStream);
              } else {
                localStream = this._getStream(this.content);
                localStream.pipe(outputStream, {
                  end: false
                });
                localStream.once("end", finalize);
              }
              localStream.once("error", (err) => callback(err));
            }, "createStream");
            if (this.content._resolve) {
              let chunks = [];
              let chunklen = 0;
              let returned2 = false;
              let sourceStream = this._getStream(this.content);
              sourceStream.on("error", (err) => {
                if (returned2) {
                  return;
                }
                returned2 = true;
                callback(err);
              });
              sourceStream.on("readable", () => {
                let chunk;
                while ((chunk = sourceStream.read()) !== null) {
                  chunks.push(chunk);
                  chunklen += chunk.length;
                }
              });
              sourceStream.on("end", () => {
                if (returned2) {
                  return;
                }
                returned2 = true;
                this.content._resolve = false;
                this.content._resolvedValue = Buffer.concat(chunks, chunklen);
                setImmediate(createStream);
              });
            } else {
              setImmediate(createStream);
            }
            return;
          } else {
            return setImmediate(finalize);
          }
        }, "sendContent");
        if (this._raw) {
          setImmediate(() => {
            if (Object.prototype.toString.call(this._raw) === "[object Error]") {
              return callback(this._raw);
            }
            if (typeof this._raw.pipe === "function") {
              this._raw.removeListener("error", this._contentErrorHandler);
            }
            let raw = this._getStream(this._raw);
            raw.pipe(outputStream, {
              end: false
            });
            raw.on("error", (err) => outputStream.emit("error", err));
            raw.on("end", finalize);
          });
        } else {
          outputStream.write(this.buildHeaders() + "\r\n\r\n");
          setImmediate(sendContent);
        }
      }
      /**
       * Sets envelope to be used instead of the generated one
       *
       * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
       */
      setEnvelope(envelope) {
        let list;
        this._envelope = {
          from: false,
          to: []
        };
        if (envelope.from) {
          list = [];
          this._convertAddresses(this._parseAddresses(envelope.from), list);
          list = list.filter((address) => address && address.address);
          if (list.length && list[0]) {
            this._envelope.from = list[0].address;
          }
        }
        ["to", "cc", "bcc"].forEach((key) => {
          if (envelope[key]) {
            this._convertAddresses(this._parseAddresses(envelope[key]), this._envelope.to);
          }
        });
        this._envelope.to = this._envelope.to.map((to) => to.address).filter((address) => address);
        let standardFields = ["to", "cc", "bcc", "from"];
        Object.keys(envelope).forEach((key) => {
          if (!standardFields.includes(key)) {
            this._envelope[key] = envelope[key];
          }
        });
        return this;
      }
      /**
       * Generates and returns an object with parsed address fields
       *
       * @return {Object} Address object
       */
      getAddresses() {
        let addresses = {};
        this._headers.forEach((header) => {
          let key = header.key.toLowerCase();
          if (["from", "sender", "reply-to", "to", "cc", "bcc"].includes(key)) {
            if (!Array.isArray(addresses[key])) {
              addresses[key] = [];
            }
            this._convertAddresses(this._parseAddresses(header.value), addresses[key]);
          }
        });
        return addresses;
      }
      /**
       * Generates and returns SMTP envelope with the sender address and a list of recipients addresses
       *
       * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
       */
      getEnvelope() {
        if (this._envelope) {
          return this._envelope;
        }
        let envelope = {
          from: false,
          to: []
        };
        this._headers.forEach((header) => {
          let list = [];
          if (header.key === "From" || !envelope.from && ["Reply-To", "Sender"].includes(header.key)) {
            this._convertAddresses(this._parseAddresses(header.value), list);
            if (list.length && list[0]) {
              envelope.from = list[0].address;
            }
          } else if (["To", "Cc", "Bcc"].includes(header.key)) {
            this._convertAddresses(this._parseAddresses(header.value), envelope.to);
          }
        });
        envelope.to = envelope.to.map((to) => to.address);
        return envelope;
      }
      /**
       * Returns Message-Id value. If it does not exist, then creates one
       *
       * @return {String} Message-Id value
       */
      messageId() {
        let messageId = this.getHeader("Message-ID");
        if (!messageId) {
          messageId = this._generateMessageId();
          this.setHeader("Message-ID", messageId);
        }
        return messageId;
      }
      /**
       * Sets pregenerated content that will be used as the output of this node
       *
       * @param {String|Buffer|Stream} Raw MIME contents
       */
      setRaw(raw) {
        this._raw = raw;
        if (this._raw && typeof this._raw.pipe === "function") {
          this._contentErrorHandler = (err) => {
            this._raw.removeListener("error", this._contentErrorHandler);
            this._raw = err;
          };
          this._raw.once("error", this._contentErrorHandler);
        }
        return this;
      }
      /////// PRIVATE METHODS
      /**
       * Detects and returns handle to a stream related with the content.
       *
       * @param {Mixed} content Node content
       * @returns {Object} Stream object
       */
      _getStream(content) {
        let contentStream;
        if (content._resolvedValue) {
          contentStream = new PassThrough();
          setImmediate(() => {
            try {
              contentStream.end(content._resolvedValue);
            } catch (_err) {
              contentStream.emit("error", _err);
            }
          });
          return contentStream;
        } else if (typeof content.pipe === "function") {
          return content;
        } else if (content && typeof content.path === "string" && !content.href) {
          if (this.disableFileAccess) {
            contentStream = new PassThrough();
            setImmediate(() => contentStream.emit("error", new Error("File access rejected for " + content.path)));
            return contentStream;
          }
          return fs.createReadStream(content.path);
        } else if (content && typeof content.href === "string") {
          if (this.disableUrlAccess) {
            contentStream = new PassThrough();
            setImmediate(() => contentStream.emit("error", new Error("Url access rejected for " + content.href)));
            return contentStream;
          }
          return nmfetch(content.href, { headers: content.httpHeaders });
        } else {
          contentStream = new PassThrough();
          setImmediate(() => {
            try {
              contentStream.end(content || "");
            } catch (_err) {
              contentStream.emit("error", _err);
            }
          });
          return contentStream;
        }
      }
      /**
       * Parses addresses. Takes in a single address or an array or an
       * array of address arrays (eg. To: [[first group], [second group],...])
       *
       * @param {Mixed} addresses Addresses to be parsed
       * @return {Array} An array of address objects
       */
      _parseAddresses(addresses) {
        return [].concat.apply(
          [],
          [].concat(addresses).map((address) => {
            if (address && address.address) {
              address.address = this._normalizeAddress(address.address);
              address.name = address.name || "";
              return [address];
            }
            return addressparser(address);
          })
        );
      }
      /**
       * Normalizes a header key, uses Camel-Case form, except for uppercase MIME-
       *
       * @param {String} key Key to be normalized
       * @return {String} key in Camel-Case form
       */
      _normalizeHeaderKey(key) {
        key = (key || "").toString().replace(/\r?\n|\r/g, " ").trim().toLowerCase().replace(/^X-SMTPAPI$|^(MIME|DKIM|ARC|BIMI)\b|^[a-z]|-(SPF|FBL|ID|MD5)$|-[a-z]/gi, (c) => c.toUpperCase()).replace(/^Content-Features$/i, "Content-features");
        return key;
      }
      /**
       * Checks if the content type is multipart and defines boundary if needed.
       * Doesn't return anything, modifies object argument instead.
       *
       * @param {Object} structured Parsed header value for 'Content-Type' key
       */
      _handleContentType(structured) {
        this.contentType = structured.value.trim().toLowerCase();
        this.multipart = /^multipart\//i.test(this.contentType) ? this.contentType.substr(this.contentType.indexOf("/") + 1) : false;
        if (this.multipart) {
          this.boundary = structured.params.boundary = structured.params.boundary || this.boundary || this._generateBoundary();
        } else {
          this.boundary = false;
        }
      }
      /**
       * Generates a multipart boundary value
       *
       * @return {String} boundary value
       */
      _generateBoundary() {
        return this.rootNode.boundaryPrefix + "-" + this.rootNode.baseBoundary + "-Part_" + this._nodeId;
      }
      /**
       * Encodes a header value for use in the generated rfc2822 email.
       *
       * @param {String} key Header key
       * @param {String} value Header value
       */
      _encodeHeaderValue(key, value) {
        key = this._normalizeHeaderKey(key);
        switch (key) {
          // Structured headers
          case "From":
          case "Sender":
          case "To":
          case "Cc":
          case "Bcc":
          case "Reply-To":
            return this._convertAddresses(this._parseAddresses(value));
          // values enclosed in <>
          case "Message-ID":
          case "In-Reply-To":
          case "Content-Id":
            value = (value || "").toString().replace(/\r?\n|\r/g, " ");
            if (value.charAt(0) !== "<") {
              value = "<" + value;
            }
            if (value.charAt(value.length - 1) !== ">") {
              value = value + ">";
            }
            return value;
          // space separated list of values enclosed in <>
          case "References":
            value = [].concat.apply(
              [],
              [].concat(value || "").map((elm) => {
                elm = (elm || "").toString().replace(/\r?\n|\r/g, " ").trim();
                return elm.replace(/<[^>]*>/g, (str) => str.replace(/\s/g, "")).split(/\s+/);
              })
            ).map((elm) => {
              if (elm.charAt(0) !== "<") {
                elm = "<" + elm;
              }
              if (elm.charAt(elm.length - 1) !== ">") {
                elm = elm + ">";
              }
              return elm;
            });
            return value.join(" ").trim();
          case "Date":
            if (Object.prototype.toString.call(value) === "[object Date]") {
              return value.toUTCString().replace(/GMT/, "+0000");
            }
            value = (value || "").toString().replace(/\r?\n|\r/g, " ");
            return this._encodeWords(value);
          case "Content-Type":
          case "Content-Disposition":
            return (value || "").toString().replace(/\r?\n|\r/g, " ");
          default:
            value = (value || "").toString().replace(/\r?\n|\r/g, " ");
            return this._encodeWords(value);
        }
      }
      /**
       * Rebuilds address object using punycode and other adjustments
       *
       * @param {Array} addresses An array of address objects
       * @param {Array} [uniqueList] An array to be populated with addresses
       * @return {String} address string
       */
      _convertAddresses(addresses, uniqueList) {
        let values = [];
        uniqueList = uniqueList || [];
        [].concat(addresses || []).forEach((address) => {
          if (address.address) {
            address.address = this._normalizeAddress(address.address);
            if (!address.name) {
              values.push(address.address.indexOf(" ") >= 0 ? `<${address.address}>` : `${address.address}`);
            } else if (address.name) {
              values.push(`${this._encodeAddressName(address.name)} <${address.address}>`);
            }
            if (address.address) {
              if (!uniqueList.filter((a) => a.address === address.address).length) {
                uniqueList.push(address);
              }
            }
          } else if (address.group) {
            let groupListAddresses = (address.group.length ? this._convertAddresses(address.group, uniqueList) : "").trim();
            values.push(`${this._encodeAddressName(address.name)}:${groupListAddresses};`);
          }
        });
        return values.join(", ");
      }
      /**
       * Normalizes an email address
       *
       * @param {Array} address An array of address objects
       * @return {String} address string
       */
      _normalizeAddress(address) {
        address = (address || "").toString().replace(/[\x00-\x1F<>]+/g, " ").trim();
        let lastAt = address.lastIndexOf("@");
        if (lastAt < 0) {
          return address;
        }
        let user = address.substr(0, lastAt);
        let domain2 = address.substr(lastAt + 1);
        let encodedDomain;
        try {
          encodedDomain = punycode.toASCII(domain2.toLowerCase());
        } catch (_err) {
        }
        if (user.indexOf(" ") >= 0) {
          if (user.charAt(0) !== '"') {
            user = '"' + user;
          }
          if (user.substr(-1) !== '"') {
            user = user + '"';
          }
        }
        return `${user}@${encodedDomain}`;
      }
      /**
       * If needed, mime encodes the name part
       *
       * @param {String} name Name part of an address
       * @returns {String} Mime word encoded string if needed
       */
      _encodeAddressName(name) {
        if (!/^[\w ]*$/.test(name)) {
          if (/^[\x20-\x7e]*$/.test(name)) {
            return '"' + name.replace(/([\\"])/g, "\\$1") + '"';
          } else {
            return mimeFuncs.encodeWord(name, this._getTextEncoding(name), 52);
          }
        }
        return name;
      }
      /**
       * If needed, mime encodes the name part
       *
       * @param {String} name Name part of an address
       * @returns {String} Mime word encoded string if needed
       */
      _encodeWords(value) {
        return mimeFuncs.encodeWords(value, this._getTextEncoding(value), 52, true);
      }
      /**
       * Detects best mime encoding for a text value
       *
       * @param {String} value Value to check for
       * @return {String} either 'Q' or 'B'
       */
      _getTextEncoding(value) {
        value = (value || "").toString();
        let encoding = this.textEncoding;
        let latinLen;
        let nonLatinLen;
        if (!encoding) {
          nonLatinLen = (value.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\u0080-\uFFFF]/g) || []).length;
          latinLen = (value.match(/[a-z]/gi) || []).length;
          encoding = nonLatinLen < latinLen ? "Q" : "B";
        }
        return encoding;
      }
      /**
       * Generates a message id
       *
       * @return {String} Random Message-ID value
       */
      _generateMessageId() {
        return "<" + [2, 2, 2, 6].reduce(
          // crux to generate UUID-like random strings
          (prev, len) => prev + "-" + crypto.randomBytes(len).toString("hex"),
          crypto.randomBytes(4).toString("hex")
        ) + "@" + // try to use the domain of the FROM address or fallback to server hostname
        (this.getEnvelope().from || this.hostname || "localhost").split("@").pop() + ">";
      }
    };
    module.exports = MimeNode;
  }
});

// ../node_modules/nodemailer/lib/mail-composer/index.js
var require_mail_composer = __commonJS({
  "../node_modules/nodemailer/lib/mail-composer/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var MimeNode = require_mime_node();
    var mimeFuncs = require_mime_funcs();
    var parseDataURI = require_shared().parseDataURI;
    var MailComposer = class {
      static {
        __name(this, "MailComposer");
      }
      constructor(mail) {
        this.mail = mail || {};
        this.message = false;
      }
      /**
       * Builds MimeNode instance
       */
      compile() {
        this._alternatives = this.getAlternatives();
        this._htmlNode = this._alternatives.filter((alternative) => /^text\/html\b/i.test(alternative.contentType)).pop();
        this._attachments = this.getAttachments(!!this._htmlNode);
        this._useRelated = !!(this._htmlNode && this._attachments.related.length);
        this._useAlternative = this._alternatives.length > 1;
        this._useMixed = this._attachments.attached.length > 1 || this._alternatives.length && this._attachments.attached.length === 1;
        if (this.mail.raw) {
          this.message = new MimeNode("message/rfc822", { newline: this.mail.newline }).setRaw(this.mail.raw);
        } else if (this._useMixed) {
          this.message = this._createMixed();
        } else if (this._useAlternative) {
          this.message = this._createAlternative();
        } else if (this._useRelated) {
          this.message = this._createRelated();
        } else {
          this.message = this._createContentNode(
            false,
            [].concat(this._alternatives || []).concat(this._attachments.attached || []).shift() || {
              contentType: "text/plain",
              content: ""
            }
          );
        }
        if (this.mail.headers) {
          this.message.addHeader(this.mail.headers);
        }
        ["from", "sender", "to", "cc", "bcc", "reply-to", "in-reply-to", "references", "subject", "message-id", "date"].forEach((header) => {
          let key = header.replace(/-(\w)/g, (o, c) => c.toUpperCase());
          if (this.mail[key]) {
            this.message.setHeader(header, this.mail[key]);
          }
        });
        if (this.mail.envelope) {
          this.message.setEnvelope(this.mail.envelope);
        }
        this.message.messageId();
        return this.message;
      }
      /**
       * List all attachments. Resulting attachment objects can be used as input for MimeNode nodes
       *
       * @param {Boolean} findRelated If true separate related attachments from attached ones
       * @returns {Object} An object of arrays (`related` and `attached`)
       */
      getAttachments(findRelated) {
        let icalEvent, eventObject;
        let attachments = [].concat(this.mail.attachments || []).map((attachment, i) => {
          let data;
          if (/^data:/i.test(attachment.path || attachment.href)) {
            attachment = this._processDataUrl(attachment);
          }
          let contentType = attachment.contentType || mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || "bin");
          let isImage = /^image\//i.test(contentType);
          let isMessageNode = /^message\//i.test(contentType);
          let contentDisposition = attachment.contentDisposition || (isMessageNode || isImage && attachment.cid ? "inline" : "attachment");
          let contentTransferEncoding;
          if ("contentTransferEncoding" in attachment) {
            contentTransferEncoding = attachment.contentTransferEncoding;
          } else if (isMessageNode) {
            contentTransferEncoding = "8bit";
          } else {
            contentTransferEncoding = "base64";
          }
          data = {
            contentType,
            contentDisposition,
            contentTransferEncoding
          };
          if (attachment.filename) {
            data.filename = attachment.filename;
          } else if (!isMessageNode && attachment.filename !== false) {
            data.filename = (attachment.path || attachment.href || "").split("/").pop().split("?").shift() || "attachment-" + (i + 1);
            if (data.filename.indexOf(".") < 0) {
              data.filename += "." + mimeFuncs.detectExtension(data.contentType);
            }
          }
          if (/^https?:\/\//i.test(attachment.path)) {
            attachment.href = attachment.path;
            attachment.path = void 0;
          }
          if (attachment.cid) {
            data.cid = attachment.cid;
          }
          if (attachment.raw) {
            data.raw = attachment.raw;
          } else if (attachment.path) {
            data.content = {
              path: attachment.path
            };
          } else if (attachment.href) {
            data.content = {
              href: attachment.href,
              httpHeaders: attachment.httpHeaders
            };
          } else {
            data.content = attachment.content || "";
          }
          if (attachment.encoding) {
            data.encoding = attachment.encoding;
          }
          if (attachment.headers) {
            data.headers = attachment.headers;
          }
          return data;
        });
        if (this.mail.icalEvent) {
          if (typeof this.mail.icalEvent === "object" && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
            icalEvent = this.mail.icalEvent;
          } else {
            icalEvent = {
              content: this.mail.icalEvent
            };
          }
          eventObject = {};
          Object.keys(icalEvent).forEach((key) => {
            eventObject[key] = icalEvent[key];
          });
          eventObject.contentType = "application/ics";
          if (!eventObject.headers) {
            eventObject.headers = {};
          }
          eventObject.filename = eventObject.filename || "invite.ics";
          eventObject.headers["Content-Disposition"] = "attachment";
          eventObject.headers["Content-Transfer-Encoding"] = "base64";
        }
        if (!findRelated) {
          return {
            attached: attachments.concat(eventObject || []),
            related: []
          };
        } else {
          return {
            attached: attachments.filter((attachment) => !attachment.cid).concat(eventObject || []),
            related: attachments.filter((attachment) => !!attachment.cid)
          };
        }
      }
      /**
       * List alternatives. Resulting objects can be used as input for MimeNode nodes
       *
       * @returns {Array} An array of alternative elements. Includes the `text` and `html` values as well
       */
      getAlternatives() {
        let alternatives = [], text, html, watchHtml, amp, icalEvent, eventObject;
        if (this.mail.text) {
          if (typeof this.mail.text === "object" && (this.mail.text.content || this.mail.text.path || this.mail.text.href || this.mail.text.raw)) {
            text = this.mail.text;
          } else {
            text = {
              content: this.mail.text
            };
          }
          text.contentType = "text/plain; charset=utf-8";
        }
        if (this.mail.watchHtml) {
          if (typeof this.mail.watchHtml === "object" && (this.mail.watchHtml.content || this.mail.watchHtml.path || this.mail.watchHtml.href || this.mail.watchHtml.raw)) {
            watchHtml = this.mail.watchHtml;
          } else {
            watchHtml = {
              content: this.mail.watchHtml
            };
          }
          watchHtml.contentType = "text/watch-html; charset=utf-8";
        }
        if (this.mail.amp) {
          if (typeof this.mail.amp === "object" && (this.mail.amp.content || this.mail.amp.path || this.mail.amp.href || this.mail.amp.raw)) {
            amp = this.mail.amp;
          } else {
            amp = {
              content: this.mail.amp
            };
          }
          amp.contentType = "text/x-amp-html; charset=utf-8";
        }
        if (this.mail.icalEvent) {
          if (typeof this.mail.icalEvent === "object" && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
            icalEvent = this.mail.icalEvent;
          } else {
            icalEvent = {
              content: this.mail.icalEvent
            };
          }
          eventObject = {};
          Object.keys(icalEvent).forEach((key) => {
            eventObject[key] = icalEvent[key];
          });
          if (eventObject.content && typeof eventObject.content === "object") {
            eventObject.content._resolve = true;
          }
          eventObject.filename = false;
          eventObject.contentType = "text/calendar; charset=utf-8; method=" + (eventObject.method || "PUBLISH").toString().trim().toUpperCase();
          if (!eventObject.headers) {
            eventObject.headers = {};
          }
        }
        if (this.mail.html) {
          if (typeof this.mail.html === "object" && (this.mail.html.content || this.mail.html.path || this.mail.html.href || this.mail.html.raw)) {
            html = this.mail.html;
          } else {
            html = {
              content: this.mail.html
            };
          }
          html.contentType = "text/html; charset=utf-8";
        }
        [].concat(text || []).concat(watchHtml || []).concat(amp || []).concat(html || []).concat(eventObject || []).concat(this.mail.alternatives || []).forEach((alternative) => {
          let data;
          if (/^data:/i.test(alternative.path || alternative.href)) {
            alternative = this._processDataUrl(alternative);
          }
          data = {
            contentType: alternative.contentType || mimeFuncs.detectMimeType(alternative.filename || alternative.path || alternative.href || "txt"),
            contentTransferEncoding: alternative.contentTransferEncoding
          };
          if (alternative.filename) {
            data.filename = alternative.filename;
          }
          if (/^https?:\/\//i.test(alternative.path)) {
            alternative.href = alternative.path;
            alternative.path = void 0;
          }
          if (alternative.raw) {
            data.raw = alternative.raw;
          } else if (alternative.path) {
            data.content = {
              path: alternative.path
            };
          } else if (alternative.href) {
            data.content = {
              href: alternative.href
            };
          } else {
            data.content = alternative.content || "";
          }
          if (alternative.encoding) {
            data.encoding = alternative.encoding;
          }
          if (alternative.headers) {
            data.headers = alternative.headers;
          }
          alternatives.push(data);
        });
        return alternatives;
      }
      /**
       * Builds multipart/mixed node. It should always contain different type of elements on the same level
       * eg. text + attachments
       *
       * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
       * @returns {Object} MimeNode node element
       */
      _createMixed(parentNode) {
        let node;
        if (!parentNode) {
          node = new MimeNode("multipart/mixed", {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        } else {
          node = parentNode.createChild("multipart/mixed", {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        }
        if (this._useAlternative) {
          this._createAlternative(node);
        } else if (this._useRelated) {
          this._createRelated(node);
        }
        [].concat(!this._useAlternative && this._alternatives || []).concat(this._attachments.attached || []).forEach((element) => {
          if (!this._useRelated || element !== this._htmlNode) {
            this._createContentNode(node, element);
          }
        });
        return node;
      }
      /**
       * Builds multipart/alternative node. It should always contain same type of elements on the same level
       * eg. text + html view of the same data
       *
       * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
       * @returns {Object} MimeNode node element
       */
      _createAlternative(parentNode) {
        let node;
        if (!parentNode) {
          node = new MimeNode("multipart/alternative", {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        } else {
          node = parentNode.createChild("multipart/alternative", {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        }
        this._alternatives.forEach((alternative) => {
          if (this._useRelated && this._htmlNode === alternative) {
            this._createRelated(node);
          } else {
            this._createContentNode(node, alternative);
          }
        });
        return node;
      }
      /**
       * Builds multipart/related node. It should always contain html node with related attachments
       *
       * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
       * @returns {Object} MimeNode node element
       */
      _createRelated(parentNode) {
        let node;
        if (!parentNode) {
          node = new MimeNode('multipart/related; type="text/html"', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        } else {
          node = parentNode.createChild('multipart/related; type="text/html"', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        }
        this._createContentNode(node, this._htmlNode);
        this._attachments.related.forEach((alternative) => this._createContentNode(node, alternative));
        return node;
      }
      /**
       * Creates a regular node with contents
       *
       * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
       * @param {Object} element Node data
       * @returns {Object} MimeNode node element
       */
      _createContentNode(parentNode, element) {
        element = element || {};
        element.content = element.content || "";
        let node;
        let encoding = (element.encoding || "utf8").toString().toLowerCase().replace(/[-_\s]/g, "");
        if (!parentNode) {
          node = new MimeNode(element.contentType, {
            filename: element.filename,
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        } else {
          node = parentNode.createChild(element.contentType, {
            filename: element.filename,
            textEncoding: this.mail.textEncoding,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess,
            normalizeHeaderKey: this.mail.normalizeHeaderKey,
            newline: this.mail.newline
          });
        }
        if (element.headers) {
          node.addHeader(element.headers);
        }
        if (element.cid) {
          node.setHeader("Content-Id", "<" + element.cid.replace(/[<>]/g, "") + ">");
        }
        if (element.contentTransferEncoding) {
          node.setHeader("Content-Transfer-Encoding", element.contentTransferEncoding);
        } else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
          node.setHeader("Content-Transfer-Encoding", this.mail.encoding);
        }
        if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
          node.setHeader(
            "Content-Disposition",
            element.contentDisposition || (element.cid && /^image\//i.test(element.contentType) ? "inline" : "attachment")
          );
        }
        if (typeof element.content === "string" && !["utf8", "usascii", "ascii"].includes(encoding)) {
          element.content = Buffer.from(element.content, encoding);
        }
        if (element.raw) {
          node.setRaw(element.raw);
        } else {
          node.setContent(element.content);
        }
        return node;
      }
      /**
       * Parses data uri and converts it to a Buffer
       *
       * @param {Object} element Content element
       * @return {Object} Parsed element
       */
      _processDataUrl(element) {
        const dataUrl = element.path || element.href;
        if (!dataUrl || typeof dataUrl !== "string") {
          return element;
        }
        if (!dataUrl.startsWith("data:")) {
          return element;
        }
        if (dataUrl.length > 52428800) {
          let detectedType = "application/octet-stream";
          const commaPos = dataUrl.indexOf(",");
          if (commaPos > 0 && commaPos < 200) {
            const header = dataUrl.substring(5, commaPos);
            const parts = header.split(";");
            if (parts[0] && parts[0].includes("/")) {
              detectedType = parts[0].trim();
            }
          }
          return Object.assign({}, element, {
            path: false,
            href: false,
            content: Buffer.alloc(0),
            contentType: element.contentType || detectedType
          });
        }
        let parsedDataUri;
        try {
          parsedDataUri = parseDataURI(dataUrl);
        } catch (_err) {
          return element;
        }
        if (!parsedDataUri) {
          return element;
        }
        element.content = parsedDataUri.data;
        element.contentType = element.contentType || parsedDataUri.contentType;
        if ("path" in element) {
          element.path = false;
        }
        if ("href" in element) {
          element.href = false;
        }
        return element;
      }
    };
    module.exports = MailComposer;
  }
});

// ../node_modules/nodemailer/lib/dkim/message-parser.js
var require_message_parser = __commonJS({
  "../node_modules/nodemailer/lib/dkim/message-parser.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Transform = require_stream().Transform;
    var MessageParser = class extends Transform {
      static {
        __name(this, "MessageParser");
      }
      constructor(options) {
        super(options);
        this.lastBytes = Buffer.alloc(4);
        this.headersParsed = false;
        this.headerBytes = 0;
        this.headerChunks = [];
        this.rawHeaders = false;
        this.bodySize = 0;
      }
      /**
       * Keeps count of the last 4 bytes in order to detect line breaks on chunk boundaries
       *
       * @param {Buffer} data Next data chunk from the stream
       */
      updateLastBytes(data) {
        let lblen = this.lastBytes.length;
        let nblen = Math.min(data.length, lblen);
        for (let i = 0, len = lblen - nblen; i < len; i++) {
          this.lastBytes[i] = this.lastBytes[i + nblen];
        }
        for (let i = 1; i <= nblen; i++) {
          this.lastBytes[lblen - i] = data[data.length - i];
        }
      }
      /**
       * Finds and removes message headers from the remaining body. We want to keep
       * headers separated until final delivery to be able to modify these
       *
       * @param {Buffer} data Next chunk of data
       * @return {Boolean} Returns true if headers are already found or false otherwise
       */
      checkHeaders(data) {
        if (this.headersParsed) {
          return true;
        }
        let lblen = this.lastBytes.length;
        let headerPos = 0;
        this.curLinePos = 0;
        for (let i = 0, len = this.lastBytes.length + data.length; i < len; i++) {
          let chr;
          if (i < lblen) {
            chr = this.lastBytes[i];
          } else {
            chr = data[i - lblen];
          }
          if (chr === 10 && i) {
            let pr1 = i - 1 < lblen ? this.lastBytes[i - 1] : data[i - 1 - lblen];
            let pr2 = i > 1 ? i - 2 < lblen ? this.lastBytes[i - 2] : data[i - 2 - lblen] : false;
            if (pr1 === 10) {
              this.headersParsed = true;
              headerPos = i - lblen + 1;
              this.headerBytes += headerPos;
              break;
            } else if (pr1 === 13 && pr2 === 10) {
              this.headersParsed = true;
              headerPos = i - lblen + 1;
              this.headerBytes += headerPos;
              break;
            }
          }
        }
        if (this.headersParsed) {
          this.headerChunks.push(data.slice(0, headerPos));
          this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
          this.headerChunks = null;
          this.emit("headers", this.parseHeaders());
          if (data.length - 1 > headerPos) {
            let chunk = data.slice(headerPos);
            this.bodySize += chunk.length;
            setImmediate(() => this.push(chunk));
          }
          return false;
        } else {
          this.headerBytes += data.length;
          this.headerChunks.push(data);
        }
        this.updateLastBytes(data);
        return false;
      }
      _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
          return callback();
        }
        if (typeof chunk === "string") {
          chunk = Buffer.from(chunk, encoding);
        }
        let headersFound;
        try {
          headersFound = this.checkHeaders(chunk);
        } catch (E) {
          return callback(E);
        }
        if (headersFound) {
          this.bodySize += chunk.length;
          this.push(chunk);
        }
        setImmediate(callback);
      }
      _flush(callback) {
        if (this.headerChunks) {
          let chunk = Buffer.concat(this.headerChunks, this.headerBytes);
          this.bodySize += chunk.length;
          this.push(chunk);
          this.headerChunks = null;
        }
        callback();
      }
      parseHeaders() {
        let lines = (this.rawHeaders || "").toString().split(/\r?\n/);
        for (let i = lines.length - 1; i > 0; i--) {
          if (/^\s/.test(lines[i])) {
            lines[i - 1] += "\n" + lines[i];
            lines.splice(i, 1);
          }
        }
        return lines.filter((line) => line.trim()).map((line) => ({
          key: line.substr(0, line.indexOf(":")).trim().toLowerCase(),
          line
        }));
      }
    };
    module.exports = MessageParser;
  }
});

// ../node_modules/nodemailer/lib/dkim/relaxed-body.js
var require_relaxed_body = __commonJS({
  "../node_modules/nodemailer/lib/dkim/relaxed-body.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Transform = require_stream().Transform;
    var crypto = require_crypto();
    var RelaxedBody = class extends Transform {
      static {
        __name(this, "RelaxedBody");
      }
      constructor(options) {
        super();
        options = options || {};
        this.chunkBuffer = [];
        this.chunkBufferLen = 0;
        this.bodyHash = crypto.createHash(options.hashAlgo || "sha1");
        this.remainder = "";
        this.byteLength = 0;
        this.debug = options.debug;
        this._debugBody = options.debug ? [] : false;
      }
      updateHash(chunk) {
        let bodyStr;
        let nextRemainder = "";
        let state = "file";
        for (let i = chunk.length - 1; i >= 0; i--) {
          let c = chunk[i];
          if (state === "file" && (c === 10 || c === 13)) {
          } else if (state === "file" && (c === 9 || c === 32)) {
            state = "line";
          } else if (state === "line" && (c === 9 || c === 32)) {
          } else if (state === "file" || state === "line") {
            state = "body";
            if (i === chunk.length - 1) {
              break;
            }
          }
          if (i === 0) {
            if (state === "file" && (!this.remainder || /[\r\n]$/.test(this.remainder)) || state === "line" && (!this.remainder || /[ \t]$/.test(this.remainder))) {
              this.remainder += chunk.toString("binary");
              return;
            } else if (state === "line" || state === "file") {
              nextRemainder = chunk.toString("binary");
              chunk = false;
              break;
            }
          }
          if (state !== "body") {
            continue;
          }
          nextRemainder = chunk.slice(i + 1).toString("binary");
          chunk = chunk.slice(0, i + 1);
          break;
        }
        let needsFixing = !!this.remainder;
        if (chunk && !needsFixing) {
          for (let i = 0, len = chunk.length; i < len; i++) {
            if (i && chunk[i] === 10 && chunk[i - 1] !== 13) {
              needsFixing = true;
              break;
            } else if (i && chunk[i] === 13 && chunk[i - 1] === 32) {
              needsFixing = true;
              break;
            } else if (i && chunk[i] === 32 && chunk[i - 1] === 32) {
              needsFixing = true;
              break;
            } else if (chunk[i] === 9) {
              needsFixing = true;
              break;
            }
          }
        }
        if (needsFixing) {
          bodyStr = this.remainder + (chunk ? chunk.toString("binary") : "");
          this.remainder = nextRemainder;
          bodyStr = bodyStr.replace(/\r?\n/g, "\n").replace(/[ \t]*$/gm, "").replace(/[ \t]+/gm, " ").replace(/\n/g, "\r\n");
          chunk = Buffer.from(bodyStr, "binary");
        } else if (nextRemainder) {
          this.remainder = nextRemainder;
        }
        if (this.debug) {
          this._debugBody.push(chunk);
        }
        this.bodyHash.update(chunk);
      }
      _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
          return callback();
        }
        if (typeof chunk === "string") {
          chunk = Buffer.from(chunk, encoding);
        }
        this.updateHash(chunk);
        this.byteLength += chunk.length;
        this.push(chunk);
        callback();
      }
      _flush(callback) {
        if (/[\r\n]$/.test(this.remainder) && this.byteLength > 2) {
          this.bodyHash.update(Buffer.from("\r\n"));
        }
        if (!this.byteLength) {
          this.push(Buffer.from("\r\n"));
        }
        this.emit("hash", this.bodyHash.digest("base64"), this.debug ? Buffer.concat(this._debugBody) : false);
        callback();
      }
    };
    module.exports = RelaxedBody;
  }
});

// ../node_modules/nodemailer/lib/dkim/sign.js
var require_sign = __commonJS({
  "../node_modules/nodemailer/lib/dkim/sign.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var punycode = require_punycode();
    var mimeFuncs = require_mime_funcs();
    var crypto = require_crypto();
    module.exports = (headers, hashAlgo, bodyHash, options) => {
      options = options || {};
      let defaultFieldNames = "From:Sender:Reply-To:Subject:Date:Message-ID:To:Cc:MIME-Version:Content-Type:Content-Transfer-Encoding:Content-ID:Content-Description:Resent-Date:Resent-From:Resent-Sender:Resent-To:Resent-Cc:Resent-Message-ID:In-Reply-To:References:List-Id:List-Help:List-Unsubscribe:List-Subscribe:List-Post:List-Owner:List-Archive";
      let fieldNames = options.headerFieldNames || defaultFieldNames;
      let canonicalizedHeaderData = relaxedHeaders(headers, fieldNames, options.skipFields);
      let dkimHeader = generateDKIMHeader(options.domainName, options.keySelector, canonicalizedHeaderData.fieldNames, hashAlgo, bodyHash);
      let signer, signature;
      canonicalizedHeaderData.headers += "dkim-signature:" + relaxedHeaderLine(dkimHeader);
      signer = crypto.createSign(("rsa-" + hashAlgo).toUpperCase());
      signer.update(canonicalizedHeaderData.headers);
      try {
        signature = signer.sign(options.privateKey, "base64");
      } catch (_E) {
        return false;
      }
      return dkimHeader + signature.replace(/(^.{73}|.{75}(?!\r?\n|\r))/g, "$&\r\n ").trim();
    };
    module.exports.relaxedHeaders = relaxedHeaders;
    function generateDKIMHeader(domainName, keySelector, fieldNames, hashAlgo, bodyHash) {
      let dkim = [
        "v=1",
        "a=rsa-" + hashAlgo,
        "c=relaxed/relaxed",
        "d=" + punycode.toASCII(domainName),
        "q=dns/txt",
        "s=" + keySelector,
        "bh=" + bodyHash,
        "h=" + fieldNames
      ].join("; ");
      return mimeFuncs.foldLines("DKIM-Signature: " + dkim, 76) + ";\r\n b=";
    }
    __name(generateDKIMHeader, "generateDKIMHeader");
    function relaxedHeaders(headers, fieldNames, skipFields) {
      let includedFields = /* @__PURE__ */ new Set();
      let skip = /* @__PURE__ */ new Set();
      let headerFields = /* @__PURE__ */ new Map();
      (skipFields || "").toLowerCase().split(":").forEach((field) => {
        skip.add(field.trim());
      });
      (fieldNames || "").toLowerCase().split(":").filter((field) => !skip.has(field.trim())).forEach((field) => {
        includedFields.add(field.trim());
      });
      for (let i = headers.length - 1; i >= 0; i--) {
        let line = headers[i];
        if (includedFields.has(line.key) && !headerFields.has(line.key)) {
          headerFields.set(line.key, relaxedHeaderLine(line.line));
        }
      }
      let headersList = [];
      let fields = [];
      includedFields.forEach((field) => {
        if (headerFields.has(field)) {
          fields.push(field);
          headersList.push(field + ":" + headerFields.get(field));
        }
      });
      return {
        headers: headersList.join("\r\n") + "\r\n",
        fieldNames: fields.join(":")
      };
    }
    __name(relaxedHeaders, "relaxedHeaders");
    function relaxedHeaderLine(line) {
      return line.substr(line.indexOf(":") + 1).replace(/\r?\n/g, "").replace(/\s+/g, " ").trim();
    }
    __name(relaxedHeaderLine, "relaxedHeaderLine");
  }
});

// ../node_modules/nodemailer/lib/dkim/index.js
var require_dkim = __commonJS({
  "../node_modules/nodemailer/lib/dkim/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var MessageParser = require_message_parser();
    var RelaxedBody = require_relaxed_body();
    var sign = require_sign();
    var PassThrough = require_stream().PassThrough;
    var fs = require_fs();
    var path = require_path();
    var crypto = require_crypto();
    var DKIM_ALGO = "sha256";
    var MAX_MESSAGE_SIZE = 2 * 1024 * 1024;
    var DKIMSigner = class {
      static {
        __name(this, "DKIMSigner");
      }
      constructor(options, keys, input, output) {
        this.options = options || {};
        this.keys = keys;
        this.cacheTreshold = Number(this.options.cacheTreshold) || MAX_MESSAGE_SIZE;
        this.hashAlgo = this.options.hashAlgo || DKIM_ALGO;
        this.cacheDir = this.options.cacheDir || false;
        this.chunks = [];
        this.chunklen = 0;
        this.readPos = 0;
        this.cachePath = this.cacheDir ? path.join(this.cacheDir, "message." + Date.now() + "-" + crypto.randomBytes(14).toString("hex")) : false;
        this.cache = false;
        this.headers = false;
        this.bodyHash = false;
        this.parser = false;
        this.relaxedBody = false;
        this.input = input;
        this.output = output;
        this.output.usingCache = false;
        this.hasErrored = false;
        this.input.on("error", (err) => {
          this.hasErrored = true;
          this.cleanup();
          output.emit("error", err);
        });
      }
      cleanup() {
        if (!this.cache || !this.cachePath) {
          return;
        }
        fs.unlink(this.cachePath, () => false);
      }
      createReadCache() {
        this.cache = fs.createReadStream(this.cachePath);
        this.cache.once("error", (err) => {
          this.cleanup();
          this.output.emit("error", err);
        });
        this.cache.once("close", () => {
          this.cleanup();
        });
        this.cache.pipe(this.output);
      }
      sendNextChunk() {
        if (this.hasErrored) {
          return;
        }
        if (this.readPos >= this.chunks.length) {
          if (!this.cache) {
            return this.output.end();
          }
          return this.createReadCache();
        }
        let chunk = this.chunks[this.readPos++];
        if (this.output.write(chunk) === false) {
          return this.output.once("drain", () => {
            this.sendNextChunk();
          });
        }
        setImmediate(() => this.sendNextChunk());
      }
      sendSignedOutput() {
        let keyPos = 0;
        let signNextKey = /* @__PURE__ */ __name(() => {
          if (keyPos >= this.keys.length) {
            this.output.write(this.parser.rawHeaders);
            return setImmediate(() => this.sendNextChunk());
          }
          let key = this.keys[keyPos++];
          let dkimField = sign(this.headers, this.hashAlgo, this.bodyHash, {
            domainName: key.domainName,
            keySelector: key.keySelector,
            privateKey: key.privateKey,
            headerFieldNames: this.options.headerFieldNames,
            skipFields: this.options.skipFields
          });
          if (dkimField) {
            this.output.write(Buffer.from(dkimField + "\r\n"));
          }
          return setImmediate(signNextKey);
        }, "signNextKey");
        if (this.bodyHash && this.headers) {
          return signNextKey();
        }
        this.output.write(this.parser.rawHeaders);
        this.sendNextChunk();
      }
      createWriteCache() {
        this.output.usingCache = true;
        this.cache = fs.createWriteStream(this.cachePath);
        this.cache.once("error", (err) => {
          this.cleanup();
          this.relaxedBody.unpipe(this.cache);
          this.relaxedBody.on("readable", () => {
            while (this.relaxedBody.read() !== null) {
            }
          });
          this.hasErrored = true;
          this.output.emit("error", err);
        });
        this.cache.once("close", () => {
          this.sendSignedOutput();
        });
        this.relaxedBody.removeAllListeners("readable");
        this.relaxedBody.pipe(this.cache);
      }
      signStream() {
        this.parser = new MessageParser();
        this.relaxedBody = new RelaxedBody({
          hashAlgo: this.hashAlgo
        });
        this.parser.on("headers", (value) => {
          this.headers = value;
        });
        this.relaxedBody.on("hash", (value) => {
          this.bodyHash = value;
        });
        this.relaxedBody.on("readable", () => {
          let chunk;
          if (this.cache) {
            return;
          }
          while ((chunk = this.relaxedBody.read()) !== null) {
            this.chunks.push(chunk);
            this.chunklen += chunk.length;
            if (this.chunklen >= this.cacheTreshold && this.cachePath) {
              return this.createWriteCache();
            }
          }
        });
        this.relaxedBody.on("end", () => {
          if (this.cache) {
            return;
          }
          this.sendSignedOutput();
        });
        this.parser.pipe(this.relaxedBody);
        setImmediate(() => this.input.pipe(this.parser));
      }
    };
    var DKIM = class {
      static {
        __name(this, "DKIM");
      }
      constructor(options) {
        this.options = options || {};
        this.keys = [].concat(
          this.options.keys || {
            domainName: options.domainName,
            keySelector: options.keySelector,
            privateKey: options.privateKey
          }
        );
      }
      sign(input, extraOptions) {
        let output = new PassThrough();
        let inputStream = input;
        let writeValue = false;
        if (Buffer.isBuffer(input)) {
          writeValue = input;
          inputStream = new PassThrough();
        } else if (typeof input === "string") {
          writeValue = Buffer.from(input);
          inputStream = new PassThrough();
        }
        let options = this.options;
        if (extraOptions && Object.keys(extraOptions).length) {
          options = {};
          Object.keys(this.options || {}).forEach((key) => {
            options[key] = this.options[key];
          });
          Object.keys(extraOptions || {}).forEach((key) => {
            if (!(key in options)) {
              options[key] = extraOptions[key];
            }
          });
        }
        let signer = new DKIMSigner(options, this.keys, inputStream, output);
        setImmediate(() => {
          signer.signStream();
          if (writeValue) {
            setImmediate(() => {
              inputStream.end(writeValue);
            });
          }
        });
        return output;
      }
    };
    module.exports = DKIM;
  }
});

// node-built-in-modules:tls
import libDefault10 from "tls";
var require_tls = __commonJS({
  "node-built-in-modules:tls"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault10;
  }
});

// ../node_modules/nodemailer/lib/smtp-connection/http-proxy-client.js
var require_http_proxy_client = __commonJS({
  "../node_modules/nodemailer/lib/smtp-connection/http-proxy-client.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var net = require_net();
    var tls = require_tls();
    var urllib = require_url();
    function httpProxyClient(proxyUrl, destinationPort, destinationHost, callback) {
      let proxy = urllib.parse(proxyUrl);
      let options;
      let connect;
      let socket;
      options = {
        host: proxy.hostname,
        port: Number(proxy.port) ? Number(proxy.port) : proxy.protocol === "https:" ? 443 : 80
      };
      if (proxy.protocol === "https:") {
        options.rejectUnauthorized = false;
        connect = tls.connect.bind(tls);
      } else {
        connect = net.connect.bind(net);
      }
      let finished = false;
      let tempSocketErr = /* @__PURE__ */ __name((err) => {
        if (finished) {
          return;
        }
        finished = true;
        try {
          socket.destroy();
        } catch (_E) {
        }
        callback(err);
      }, "tempSocketErr");
      let timeoutErr = /* @__PURE__ */ __name(() => {
        let err = new Error("Proxy socket timed out");
        err.code = "ETIMEDOUT";
        tempSocketErr(err);
      }, "timeoutErr");
      socket = connect(options, () => {
        if (finished) {
          return;
        }
        let reqHeaders = {
          Host: destinationHost + ":" + destinationPort,
          Connection: "close"
        };
        if (proxy.auth) {
          reqHeaders["Proxy-Authorization"] = "Basic " + Buffer.from(proxy.auth).toString("base64");
        }
        socket.write(
          // HTTP method
          "CONNECT " + destinationHost + ":" + destinationPort + " HTTP/1.1\r\n" + // HTTP request headers
          Object.keys(reqHeaders).map((key) => key + ": " + reqHeaders[key]).join("\r\n") + // End request
          "\r\n\r\n"
        );
        let headers = "";
        let onSocketData = /* @__PURE__ */ __name((chunk) => {
          let match2;
          let remainder;
          if (finished) {
            return;
          }
          headers += chunk.toString("binary");
          if (match2 = headers.match(/\r\n\r\n/)) {
            socket.removeListener("data", onSocketData);
            remainder = headers.substr(match2.index + match2[0].length);
            headers = headers.substr(0, match2.index);
            if (remainder) {
              socket.unshift(Buffer.from(remainder, "binary"));
            }
            finished = true;
            match2 = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
            if (!match2 || (match2[1] || "").charAt(0) !== "2") {
              try {
                socket.destroy();
              } catch (_E) {
              }
              return callback(new Error("Invalid response from proxy" + (match2 && ": " + match2[1] || "")));
            }
            socket.removeListener("error", tempSocketErr);
            socket.removeListener("timeout", timeoutErr);
            socket.setTimeout(0);
            return callback(null, socket);
          }
        }, "onSocketData");
        socket.on("data", onSocketData);
      });
      socket.setTimeout(httpProxyClient.timeout || 30 * 1e3);
      socket.on("timeout", timeoutErr);
      socket.once("error", tempSocketErr);
    }
    __name(httpProxyClient, "httpProxyClient");
    module.exports = httpProxyClient;
  }
});

// ../node_modules/nodemailer/lib/mailer/mail-message.js
var require_mail_message = __commonJS({
  "../node_modules/nodemailer/lib/mailer/mail-message.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var shared = require_shared();
    var MimeNode = require_mime_node();
    var mimeFuncs = require_mime_funcs();
    var MailMessage = class {
      static {
        __name(this, "MailMessage");
      }
      constructor(mailer, data) {
        this.mailer = mailer;
        this.data = {};
        this.message = null;
        data = data || {};
        let options = mailer.options || {};
        let defaults = mailer._defaults || {};
        Object.keys(data).forEach((key) => {
          this.data[key] = data[key];
        });
        this.data.headers = this.data.headers || {};
        Object.keys(defaults).forEach((key) => {
          if (!(key in this.data)) {
            this.data[key] = defaults[key];
          } else if (key === "headers") {
            Object.keys(defaults.headers).forEach((key2) => {
              if (!(key2 in this.data.headers)) {
                this.data.headers[key2] = defaults.headers[key2];
              }
            });
          }
        });
        ["disableFileAccess", "disableUrlAccess", "normalizeHeaderKey"].forEach((key) => {
          if (key in options) {
            this.data[key] = options[key];
          }
        });
      }
      resolveContent(...args) {
        return shared.resolveContent(...args);
      }
      resolveAll(callback) {
        let keys = [
          [this.data, "html"],
          [this.data, "text"],
          [this.data, "watchHtml"],
          [this.data, "amp"],
          [this.data, "icalEvent"]
        ];
        if (this.data.alternatives && this.data.alternatives.length) {
          this.data.alternatives.forEach((alternative, i) => {
            keys.push([this.data.alternatives, i]);
          });
        }
        if (this.data.attachments && this.data.attachments.length) {
          this.data.attachments.forEach((attachment, i) => {
            if (!attachment.filename) {
              attachment.filename = (attachment.path || attachment.href || "").split("/").pop().split("?").shift() || "attachment-" + (i + 1);
              if (attachment.filename.indexOf(".") < 0) {
                attachment.filename += "." + mimeFuncs.detectExtension(attachment.contentType);
              }
            }
            if (!attachment.contentType) {
              attachment.contentType = mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || "bin");
            }
            keys.push([this.data.attachments, i]);
          });
        }
        let mimeNode = new MimeNode();
        let addressKeys = ["from", "to", "cc", "bcc", "sender", "replyTo"];
        addressKeys.forEach((address) => {
          let value;
          if (this.message) {
            value = [].concat(mimeNode._parseAddresses(this.message.getHeader(address === "replyTo" ? "reply-to" : address)) || []);
          } else if (this.data[address]) {
            value = [].concat(mimeNode._parseAddresses(this.data[address]) || []);
          }
          if (value && value.length) {
            this.data[address] = value;
          } else if (address in this.data) {
            this.data[address] = null;
          }
        });
        let singleKeys = ["from", "sender"];
        singleKeys.forEach((address) => {
          if (this.data[address]) {
            this.data[address] = this.data[address].shift();
          }
        });
        let pos = 0;
        let resolveNext = /* @__PURE__ */ __name(() => {
          if (pos >= keys.length) {
            return callback(null, this.data);
          }
          let args = keys[pos++];
          if (!args[0] || !args[0][args[1]]) {
            return resolveNext();
          }
          shared.resolveContent(...args, (err, value) => {
            if (err) {
              return callback(err);
            }
            let node = {
              content: value
            };
            if (args[0][args[1]] && typeof args[0][args[1]] === "object" && !Buffer.isBuffer(args[0][args[1]])) {
              Object.keys(args[0][args[1]]).forEach((key) => {
                if (!(key in node) && !["content", "path", "href", "raw"].includes(key)) {
                  node[key] = args[0][args[1]][key];
                }
              });
            }
            args[0][args[1]] = node;
            resolveNext();
          });
        }, "resolveNext");
        setImmediate(() => resolveNext());
      }
      normalize(callback) {
        let envelope = this.data.envelope || this.message.getEnvelope();
        let messageId = this.message.messageId();
        this.resolveAll((err, data) => {
          if (err) {
            return callback(err);
          }
          data.envelope = envelope;
          data.messageId = messageId;
          ["html", "text", "watchHtml", "amp"].forEach((key) => {
            if (data[key] && data[key].content) {
              if (typeof data[key].content === "string") {
                data[key] = data[key].content;
              } else if (Buffer.isBuffer(data[key].content)) {
                data[key] = data[key].content.toString();
              }
            }
          });
          if (data.icalEvent && Buffer.isBuffer(data.icalEvent.content)) {
            data.icalEvent.content = data.icalEvent.content.toString("base64");
            data.icalEvent.encoding = "base64";
          }
          if (data.alternatives && data.alternatives.length) {
            data.alternatives.forEach((alternative) => {
              if (alternative && alternative.content && Buffer.isBuffer(alternative.content)) {
                alternative.content = alternative.content.toString("base64");
                alternative.encoding = "base64";
              }
            });
          }
          if (data.attachments && data.attachments.length) {
            data.attachments.forEach((attachment) => {
              if (attachment && attachment.content && Buffer.isBuffer(attachment.content)) {
                attachment.content = attachment.content.toString("base64");
                attachment.encoding = "base64";
              }
            });
          }
          data.normalizedHeaders = {};
          Object.keys(data.headers || {}).forEach((key) => {
            let value = [].concat(data.headers[key] || []).shift();
            value = value && value.value || value;
            if (value) {
              if (["references", "in-reply-to", "message-id", "content-id"].includes(key)) {
                value = this.message._encodeHeaderValue(key, value);
              }
              data.normalizedHeaders[key] = value;
            }
          });
          if (data.list && typeof data.list === "object") {
            let listHeaders = this._getListHeaders(data.list);
            listHeaders.forEach((entry) => {
              data.normalizedHeaders[entry.key] = entry.value.map((val) => val && val.value || val).join(", ");
            });
          }
          if (data.references) {
            data.normalizedHeaders.references = this.message._encodeHeaderValue("references", data.references);
          }
          if (data.inReplyTo) {
            data.normalizedHeaders["in-reply-to"] = this.message._encodeHeaderValue("in-reply-to", data.inReplyTo);
          }
          return callback(null, data);
        });
      }
      setMailerHeader() {
        if (!this.message || !this.data.xMailer) {
          return;
        }
        this.message.setHeader("X-Mailer", this.data.xMailer);
      }
      setPriorityHeaders() {
        if (!this.message || !this.data.priority) {
          return;
        }
        switch ((this.data.priority || "").toString().toLowerCase()) {
          case "high":
            this.message.setHeader("X-Priority", "1 (Highest)");
            this.message.setHeader("X-MSMail-Priority", "High");
            this.message.setHeader("Importance", "High");
            break;
          case "low":
            this.message.setHeader("X-Priority", "5 (Lowest)");
            this.message.setHeader("X-MSMail-Priority", "Low");
            this.message.setHeader("Importance", "Low");
            break;
          default:
        }
      }
      setListHeaders() {
        if (!this.message || !this.data.list || typeof this.data.list !== "object") {
          return;
        }
        if (this.data.list && typeof this.data.list === "object") {
          this._getListHeaders(this.data.list).forEach((listHeader) => {
            listHeader.value.forEach((value) => {
              this.message.addHeader(listHeader.key, value);
            });
          });
        }
      }
      _getListHeaders(listData) {
        return Object.keys(listData).map((key) => ({
          key: "list-" + key.toLowerCase().trim(),
          value: [].concat(listData[key] || []).map((value) => ({
            prepared: true,
            foldLines: true,
            value: [].concat(value || []).map((value2) => {
              if (typeof value2 === "string") {
                value2 = {
                  url: value2
                };
              }
              if (value2 && value2.url) {
                if (key.toLowerCase().trim() === "id") {
                  let comment2 = value2.comment || "";
                  if (mimeFuncs.isPlainText(comment2)) {
                    comment2 = '"' + comment2 + '"';
                  } else {
                    comment2 = mimeFuncs.encodeWord(comment2);
                  }
                  return (value2.comment ? comment2 + " " : "") + this._formatListUrl(value2.url).replace(/^<[^:]+\/{,2}/, "");
                }
                let comment = value2.comment || "";
                if (!mimeFuncs.isPlainText(comment)) {
                  comment = mimeFuncs.encodeWord(comment);
                }
                return this._formatListUrl(value2.url) + (value2.comment ? " (" + comment + ")" : "");
              }
              return "";
            }).filter((value2) => value2).join(", ")
          }))
        }));
      }
      _formatListUrl(url) {
        url = url.replace(/[\s<]+|[\s>]+/g, "");
        if (/^(https?|mailto|ftp):/.test(url)) {
          return "<" + url + ">";
        }
        if (/^[^@]+@[^@]+$/.test(url)) {
          return "<mailto:" + url + ">";
        }
        return "<http://" + url + ">";
      }
    };
    module.exports = MailMessage;
  }
});

// ../node_modules/nodemailer/lib/mailer/index.js
var require_mailer = __commonJS({
  "../node_modules/nodemailer/lib/mailer/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EventEmitter3 = require_events();
    var shared = require_shared();
    var mimeTypes = require_mime_types();
    var MailComposer = require_mail_composer();
    var DKIM = require_dkim();
    var httpProxyClient = require_http_proxy_client();
    var util = require_util();
    var urllib = require_url();
    var packageData = require_package();
    var MailMessage = require_mail_message();
    var net = require_net();
    var dns = require_dns();
    var crypto = require_crypto();
    var Mail = class extends EventEmitter3 {
      static {
        __name(this, "Mail");
      }
      constructor(transporter3, options, defaults) {
        super();
        this.options = options || {};
        this._defaults = defaults || {};
        this._defaultPlugins = {
          compile: [(...args) => this._convertDataImages(...args)],
          stream: []
        };
        this._userPlugins = {
          compile: [],
          stream: []
        };
        this.meta = /* @__PURE__ */ new Map();
        this.dkim = this.options.dkim ? new DKIM(this.options.dkim) : false;
        this.transporter = transporter3;
        this.transporter.mailer = this;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "mail"
        });
        this.logger.debug(
          {
            tnx: "create"
          },
          "Creating transport: %s",
          this.getVersionString()
        );
        if (typeof this.transporter.on === "function") {
          this.transporter.on("log", (log3) => {
            this.logger.debug(
              {
                tnx: "transport"
              },
              "%s: %s",
              log3.type,
              log3.message
            );
          });
          this.transporter.on("error", (err) => {
            this.logger.error(
              {
                err,
                tnx: "transport"
              },
              "Transport Error: %s",
              err.message
            );
            this.emit("error", err);
          });
          this.transporter.on("idle", (...args) => {
            this.emit("idle", ...args);
          });
          this.transporter.on("clear", (...args) => {
            this.emit("clear", ...args);
          });
        }
        ["close", "isIdle", "verify"].forEach((method) => {
          this[method] = (...args) => {
            if (typeof this.transporter[method] === "function") {
              if (method === "verify" && typeof this.getSocket === "function") {
                this.transporter.getSocket = this.getSocket;
                this.getSocket = false;
              }
              return this.transporter[method](...args);
            } else {
              this.logger.warn(
                {
                  tnx: "transport",
                  methodName: method
                },
                "Non existing method %s called for transport",
                method
              );
              return false;
            }
          };
        });
        if (this.options.proxy && typeof this.options.proxy === "string") {
          this.setupProxy(this.options.proxy);
        }
      }
      use(step, plugin) {
        step = (step || "").toString();
        if (!this._userPlugins.hasOwnProperty(step)) {
          this._userPlugins[step] = [plugin];
        } else {
          this._userPlugins[step].push(plugin);
        }
        return this;
      }
      /**
       * Sends an email using the preselected transport object
       *
       * @param {Object} data E-data description
       * @param {Function?} callback Callback to run once the sending succeeded or failed
       */
      sendMail(data, callback = null) {
        let promise;
        if (!callback) {
          promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
          });
        }
        if (typeof this.getSocket === "function") {
          this.transporter.getSocket = this.getSocket;
          this.getSocket = false;
        }
        let mail = new MailMessage(this, data);
        this.logger.debug(
          {
            tnx: "transport",
            name: this.transporter.name,
            version: this.transporter.version,
            action: "send"
          },
          "Sending mail using %s/%s",
          this.transporter.name,
          this.transporter.version
        );
        this._processPlugins("compile", mail, (err) => {
          if (err) {
            this.logger.error(
              {
                err,
                tnx: "plugin",
                action: "compile"
              },
              "PluginCompile Error: %s",
              err.message
            );
            return callback(err);
          }
          mail.message = new MailComposer(mail.data).compile();
          mail.setMailerHeader();
          mail.setPriorityHeaders();
          mail.setListHeaders();
          this._processPlugins("stream", mail, (err2) => {
            if (err2) {
              this.logger.error(
                {
                  err: err2,
                  tnx: "plugin",
                  action: "stream"
                },
                "PluginStream Error: %s",
                err2.message
              );
              return callback(err2);
            }
            if (mail.data.dkim || this.dkim) {
              mail.message.processFunc((input) => {
                let dkim = mail.data.dkim ? new DKIM(mail.data.dkim) : this.dkim;
                this.logger.debug(
                  {
                    tnx: "DKIM",
                    messageId: mail.message.messageId(),
                    dkimDomains: dkim.keys.map((key) => key.keySelector + "." + key.domainName).join(", ")
                  },
                  "Signing outgoing message with %s keys",
                  dkim.keys.length
                );
                return dkim.sign(input, mail.data._dkim);
              });
            }
            this.transporter.send(mail, (...args) => {
              if (args[0]) {
                this.logger.error(
                  {
                    err: args[0],
                    tnx: "transport",
                    action: "send"
                  },
                  "Send Error: %s",
                  args[0].message
                );
              }
              callback(...args);
            });
          });
        });
        return promise;
      }
      getVersionString() {
        return util.format(
          "%s (%s; +%s; %s/%s)",
          packageData.name,
          packageData.version,
          packageData.homepage,
          this.transporter.name,
          this.transporter.version
        );
      }
      _processPlugins(step, mail, callback) {
        step = (step || "").toString();
        if (!this._userPlugins.hasOwnProperty(step)) {
          return callback();
        }
        let userPlugins = this._userPlugins[step] || [];
        let defaultPlugins = this._defaultPlugins[step] || [];
        if (userPlugins.length) {
          this.logger.debug(
            {
              tnx: "transaction",
              pluginCount: userPlugins.length,
              step
            },
            "Using %s plugins for %s",
            userPlugins.length,
            step
          );
        }
        if (userPlugins.length + defaultPlugins.length === 0) {
          return callback();
        }
        let pos = 0;
        let block = "default";
        let processPlugins = /* @__PURE__ */ __name(() => {
          let curplugins = block === "default" ? defaultPlugins : userPlugins;
          if (pos >= curplugins.length) {
            if (block === "default" && userPlugins.length) {
              block = "user";
              pos = 0;
              curplugins = userPlugins;
            } else {
              return callback();
            }
          }
          let plugin = curplugins[pos++];
          plugin(mail, (err) => {
            if (err) {
              return callback(err);
            }
            processPlugins();
          });
        }, "processPlugins");
        processPlugins();
      }
      /**
       * Sets up proxy handler for a Nodemailer object
       *
       * @param {String} proxyUrl Proxy configuration url
       */
      setupProxy(proxyUrl) {
        let proxy = urllib.parse(proxyUrl);
        this.getSocket = (options, callback) => {
          let protocol = proxy.protocol.replace(/:$/, "").toLowerCase();
          if (this.meta.has("proxy_handler_" + protocol)) {
            return this.meta.get("proxy_handler_" + protocol)(proxy, options, callback);
          }
          switch (protocol) {
            // Connect using a HTTP CONNECT method
            case "http":
            case "https":
              httpProxyClient(proxy.href, options.port, options.host, (err, socket) => {
                if (err) {
                  return callback(err);
                }
                return callback(null, {
                  connection: socket
                });
              });
              return;
            case "socks":
            case "socks5":
            case "socks4":
            case "socks4a": {
              if (!this.meta.has("proxy_socks_module")) {
                return callback(new Error("Socks module not loaded"));
              }
              let connect = /* @__PURE__ */ __name((ipaddress) => {
                let proxyV2 = !!this.meta.get("proxy_socks_module").SocksClient;
                let socksClient = proxyV2 ? this.meta.get("proxy_socks_module").SocksClient : this.meta.get("proxy_socks_module");
                let proxyType = Number(proxy.protocol.replace(/\D/g, "")) || 5;
                let connectionOpts = {
                  proxy: {
                    ipaddress,
                    port: Number(proxy.port),
                    type: proxyType
                  },
                  [proxyV2 ? "destination" : "target"]: {
                    host: options.host,
                    port: options.port
                  },
                  command: "connect"
                };
                if (proxy.auth) {
                  let username = decodeURIComponent(proxy.auth.split(":").shift());
                  let password = decodeURIComponent(proxy.auth.split(":").pop());
                  if (proxyV2) {
                    connectionOpts.proxy.userId = username;
                    connectionOpts.proxy.password = password;
                  } else if (proxyType === 4) {
                    connectionOpts.userid = username;
                  } else {
                    connectionOpts.authentication = {
                      username,
                      password
                    };
                  }
                }
                socksClient.createConnection(connectionOpts, (err, info3) => {
                  if (err) {
                    return callback(err);
                  }
                  return callback(null, {
                    connection: info3.socket || info3
                  });
                });
              }, "connect");
              if (net.isIP(proxy.hostname)) {
                return connect(proxy.hostname);
              }
              return dns.resolve(proxy.hostname, (err, address) => {
                if (err) {
                  return callback(err);
                }
                connect(Array.isArray(address) ? address[0] : address);
              });
            }
          }
          callback(new Error("Unknown proxy configuration"));
        };
      }
      _convertDataImages(mail, callback) {
        if (!this.options.attachDataUrls && !mail.data.attachDataUrls || !mail.data.html) {
          return callback();
        }
        mail.resolveContent(mail.data, "html", (err, html) => {
          if (err) {
            return callback(err);
          }
          let cidCounter = 0;
          html = (html || "").toString().replace(/(<img\b[^<>]{0,1024} src\s{0,20}=[\s"']{0,20})(data:([^;]+);[^"'>\s]+)/gi, (match2, prefix, dataUri, mimeType) => {
            let cid = crypto.randomBytes(10).toString("hex") + "@localhost";
            if (!mail.data.attachments) {
              mail.data.attachments = [];
            }
            if (!Array.isArray(mail.data.attachments)) {
              mail.data.attachments = [].concat(mail.data.attachments || []);
            }
            mail.data.attachments.push({
              path: dataUri,
              cid,
              filename: "image-" + ++cidCounter + "." + mimeTypes.detectExtension(mimeType)
            });
            return prefix + "cid:" + cid;
          });
          mail.data.html = html;
          callback();
        });
      }
      set(key, value) {
        return this.meta.set(key, value);
      }
      get(key) {
        return this.meta.get(key);
      }
    };
    module.exports = Mail;
  }
});

// ../node_modules/nodemailer/lib/smtp-connection/data-stream.js
var require_data_stream = __commonJS({
  "../node_modules/nodemailer/lib/smtp-connection/data-stream.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var stream = require_stream();
    var Transform = stream.Transform;
    var DataStream = class extends Transform {
      static {
        __name(this, "DataStream");
      }
      constructor(options) {
        super(options);
        this.options = options || {};
        this._curLine = "";
        this.inByteCount = 0;
        this.outByteCount = 0;
        this.lastByte = false;
      }
      /**
       * Escapes dots
       */
      _transform(chunk, encoding, done) {
        let chunks = [];
        let chunklen = 0;
        let i, len, lastPos = 0;
        let buf;
        if (!chunk || !chunk.length) {
          return done();
        }
        if (typeof chunk === "string") {
          chunk = Buffer.from(chunk);
        }
        this.inByteCount += chunk.length;
        for (i = 0, len = chunk.length; i < len; i++) {
          if (chunk[i] === 46) {
            if (i && chunk[i - 1] === 10 || !i && (!this.lastByte || this.lastByte === 10)) {
              buf = chunk.slice(lastPos, i + 1);
              chunks.push(buf);
              chunks.push(Buffer.from("."));
              chunklen += buf.length + 1;
              lastPos = i + 1;
            }
          } else if (chunk[i] === 10) {
            if (i && chunk[i - 1] !== 13 || !i && this.lastByte !== 13) {
              if (i > lastPos) {
                buf = chunk.slice(lastPos, i);
                chunks.push(buf);
                chunklen += buf.length + 2;
              } else {
                chunklen += 2;
              }
              chunks.push(Buffer.from("\r\n"));
              lastPos = i + 1;
            }
          }
        }
        if (chunklen) {
          if (lastPos < chunk.length) {
            buf = chunk.slice(lastPos);
            chunks.push(buf);
            chunklen += buf.length;
          }
          this.outByteCount += chunklen;
          this.push(Buffer.concat(chunks, chunklen));
        } else {
          this.outByteCount += chunk.length;
          this.push(chunk);
        }
        this.lastByte = chunk[chunk.length - 1];
        done();
      }
      /**
       * Finalizes the stream with a dot on a single line
       */
      _flush(done) {
        let buf;
        if (this.lastByte === 10) {
          buf = Buffer.from(".\r\n");
        } else if (this.lastByte === 13) {
          buf = Buffer.from("\n.\r\n");
        } else {
          buf = Buffer.from("\r\n.\r\n");
        }
        this.outByteCount += buf.length;
        this.push(buf);
        done();
      }
    };
    module.exports = DataStream;
  }
});

// ../node_modules/nodemailer/lib/smtp-connection/index.js
var require_smtp_connection = __commonJS({
  "../node_modules/nodemailer/lib/smtp-connection/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var packageInfo = require_package();
    var EventEmitter3 = require_events().EventEmitter;
    var net = require_net();
    var tls = require_tls();
    var os = require_os();
    var crypto = require_crypto();
    var DataStream = require_data_stream();
    var PassThrough = require_stream().PassThrough;
    var shared = require_shared();
    var CONNECTION_TIMEOUT = 2 * 60 * 1e3;
    var SOCKET_TIMEOUT = 10 * 60 * 1e3;
    var GREETING_TIMEOUT = 30 * 1e3;
    var DNS_TIMEOUT = 30 * 1e3;
    var SMTPConnection = class extends EventEmitter3 {
      static {
        __name(this, "SMTPConnection");
      }
      constructor(options) {
        super(options);
        this.id = crypto.randomBytes(8).toString("base64").replace(/\W/g, "");
        this.stage = "init";
        this.options = options || {};
        this.secureConnection = !!this.options.secure;
        this.alreadySecured = !!this.options.secured;
        this.port = Number(this.options.port) || (this.secureConnection ? 465 : 587);
        this.host = this.options.host || "localhost";
        this.servername = this.options.servername ? this.options.servername : !net.isIP(this.host) ? this.host : false;
        this.allowInternalNetworkInterfaces = this.options.allowInternalNetworkInterfaces || false;
        if (typeof this.options.secure === "undefined" && this.port === 465) {
          this.secureConnection = true;
        }
        this.name = this.options.name || this._getHostname();
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "smtp-connection",
          sid: this.id
        });
        this.customAuth = /* @__PURE__ */ new Map();
        Object.keys(this.options.customAuth || {}).forEach((key) => {
          let mapKey = (key || "").toString().trim().toUpperCase();
          if (!mapKey) {
            return;
          }
          this.customAuth.set(mapKey, this.options.customAuth[key]);
        });
        this.version = packageInfo.version;
        this.authenticated = false;
        this.destroyed = false;
        this.secure = !!this.secureConnection;
        this._remainder = "";
        this._responseQueue = [];
        this.lastServerResponse = false;
        this._socket = false;
        this._supportedAuth = [];
        this.allowsAuth = false;
        this._envelope = false;
        this._supportedExtensions = [];
        this._maxAllowedSize = 0;
        this._responseActions = [];
        this._recipientQueue = [];
        this._greetingTimeout = false;
        this._connectionTimeout = false;
        this._destroyed = false;
        this._closing = false;
        this._onSocketData = (chunk) => this._onData(chunk);
        this._onSocketError = (error3) => this._onError(error3, "ESOCKET", false, "CONN");
        this._onSocketClose = () => this._onClose();
        this._onSocketEnd = () => this._onEnd();
        this._onSocketTimeout = () => this._onTimeout();
      }
      /**
       * Creates a connection to a SMTP server and sets up connection
       * listener
       */
      connect(connectCallback) {
        if (typeof connectCallback === "function") {
          this.once("connect", () => {
            this.logger.debug(
              {
                tnx: "smtp"
              },
              "SMTP handshake finished"
            );
            connectCallback();
          });
          const isDestroyedMessage = this._isDestroyedMessage("connect");
          if (isDestroyedMessage) {
            return connectCallback(this._formatError(isDestroyedMessage, "ECONNECTION", false, "CONN"));
          }
        }
        let opts = {
          port: this.port,
          host: this.host,
          allowInternalNetworkInterfaces: this.allowInternalNetworkInterfaces,
          timeout: this.options.dnsTimeout || DNS_TIMEOUT
        };
        if (this.options.localAddress) {
          opts.localAddress = this.options.localAddress;
        }
        let setupConnectionHandlers = /* @__PURE__ */ __name(() => {
          this._connectionTimeout = setTimeout(() => {
            this._onError("Connection timeout", "ETIMEDOUT", false, "CONN");
          }, this.options.connectionTimeout || CONNECTION_TIMEOUT);
          this._socket.on("error", this._onSocketError);
        }, "setupConnectionHandlers");
        if (this.options.connection) {
          this._socket = this.options.connection;
          setupConnectionHandlers();
          if (this.secureConnection && !this.alreadySecured) {
            setImmediate(
              () => this._upgradeConnection((err) => {
                if (err) {
                  this._onError(new Error("Error initiating TLS - " + (err.message || err)), "ETLS", false, "CONN");
                  return;
                }
                this._onConnect();
              })
            );
          } else {
            setImmediate(() => this._onConnect());
          }
          return;
        } else if (this.options.socket) {
          this._socket = this.options.socket;
          return shared.resolveHostname(opts, (err, resolved) => {
            if (err) {
              return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
            }
            this.logger.debug(
              {
                tnx: "dns",
                source: opts.host,
                resolved: resolved.host,
                cached: !!resolved.cached
              },
              "Resolved %s as %s [cache %s]",
              opts.host,
              resolved.host,
              resolved.cached ? "hit" : "miss"
            );
            Object.keys(resolved).forEach((key) => {
              if (key.charAt(0) !== "_" && resolved[key]) {
                opts[key] = resolved[key];
              }
            });
            try {
              this._socket.connect(this.port, this.host, () => {
                this._socket.setKeepAlive(true);
                this._onConnect();
              });
              setupConnectionHandlers();
            } catch (E) {
              return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
            }
          });
        } else if (this.secureConnection) {
          if (this.options.tls) {
            Object.keys(this.options.tls).forEach((key) => {
              opts[key] = this.options.tls[key];
            });
          }
          if (this.servername && !opts.servername) {
            opts.servername = this.servername;
          }
          return shared.resolveHostname(opts, (err, resolved) => {
            if (err) {
              return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
            }
            this.logger.debug(
              {
                tnx: "dns",
                source: opts.host,
                resolved: resolved.host,
                cached: !!resolved.cached
              },
              "Resolved %s as %s [cache %s]",
              opts.host,
              resolved.host,
              resolved.cached ? "hit" : "miss"
            );
            Object.keys(resolved).forEach((key) => {
              if (key.charAt(0) !== "_" && resolved[key]) {
                opts[key] = resolved[key];
              }
            });
            try {
              this._socket = tls.connect(opts, () => {
                this._socket.setKeepAlive(true);
                this._onConnect();
              });
              setupConnectionHandlers();
            } catch (E) {
              return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
            }
          });
        } else {
          return shared.resolveHostname(opts, (err, resolved) => {
            if (err) {
              return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
            }
            this.logger.debug(
              {
                tnx: "dns",
                source: opts.host,
                resolved: resolved.host,
                cached: !!resolved.cached
              },
              "Resolved %s as %s [cache %s]",
              opts.host,
              resolved.host,
              resolved.cached ? "hit" : "miss"
            );
            Object.keys(resolved).forEach((key) => {
              if (key.charAt(0) !== "_" && resolved[key]) {
                opts[key] = resolved[key];
              }
            });
            try {
              this._socket = net.connect(opts, () => {
                this._socket.setKeepAlive(true);
                this._onConnect();
              });
              setupConnectionHandlers();
            } catch (E) {
              return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
            }
          });
        }
      }
      /**
       * Sends QUIT
       */
      quit() {
        this._sendCommand("QUIT");
        this._responseActions.push(this.close);
      }
      /**
       * Closes the connection to the server
       */
      close() {
        clearTimeout(this._connectionTimeout);
        clearTimeout(this._greetingTimeout);
        this._responseActions = [];
        if (this._closing) {
          return;
        }
        this._closing = true;
        let closeMethod = "end";
        if (this.stage === "init") {
          closeMethod = "destroy";
        }
        this.logger.debug(
          {
            tnx: "smtp"
          },
          'Closing connection to the server using "%s"',
          closeMethod
        );
        let socket = this._socket && this._socket.socket || this._socket;
        if (socket && !socket.destroyed) {
          try {
            socket[closeMethod]();
          } catch (_E) {
          }
        }
        this._destroy();
      }
      /**
       * Authenticate user
       */
      login(authData, callback) {
        const isDestroyedMessage = this._isDestroyedMessage("login");
        if (isDestroyedMessage) {
          return callback(this._formatError(isDestroyedMessage, "ECONNECTION", false, "API"));
        }
        this._auth = authData || {};
        this._authMethod = (this._auth.method || "").toString().trim().toUpperCase() || false;
        if (!this._authMethod && this._auth.oauth2 && !this._auth.credentials) {
          this._authMethod = "XOAUTH2";
        } else if (!this._authMethod || this._authMethod === "XOAUTH2" && !this._auth.oauth2) {
          this._authMethod = (this._supportedAuth[0] || "PLAIN").toUpperCase().trim();
        }
        if (this._authMethod !== "XOAUTH2" && (!this._auth.credentials || !this._auth.credentials.user || !this._auth.credentials.pass)) {
          if (this._auth.user && this._auth.pass || this.customAuth.has(this._authMethod)) {
            this._auth.credentials = {
              user: this._auth.user,
              pass: this._auth.pass,
              options: this._auth.options
            };
          } else {
            return callback(this._formatError('Missing credentials for "' + this._authMethod + '"', "EAUTH", false, "API"));
          }
        }
        if (this.customAuth.has(this._authMethod)) {
          let handler = this.customAuth.get(this._authMethod);
          let lastResponse;
          let returned = false;
          let resolve = /* @__PURE__ */ __name(() => {
            if (returned) {
              return;
            }
            returned = true;
            this.logger.info(
              {
                tnx: "smtp",
                username: this._auth.user,
                action: "authenticated",
                method: this._authMethod
              },
              "User %s authenticated",
              JSON.stringify(this._auth.user)
            );
            this.authenticated = true;
            callback(null, true);
          }, "resolve");
          let reject = /* @__PURE__ */ __name((err) => {
            if (returned) {
              return;
            }
            returned = true;
            callback(this._formatError(err, "EAUTH", lastResponse, "AUTH " + this._authMethod));
          }, "reject");
          let handlerResponse = handler({
            auth: this._auth,
            method: this._authMethod,
            extensions: [].concat(this._supportedExtensions),
            authMethods: [].concat(this._supportedAuth),
            maxAllowedSize: this._maxAllowedSize || false,
            sendCommand: /* @__PURE__ */ __name((cmd, done) => {
              let promise;
              if (!done) {
                promise = new Promise((resolve2, reject2) => {
                  done = shared.callbackPromise(resolve2, reject2);
                });
              }
              this._responseActions.push((str) => {
                lastResponse = str;
                let codes = str.match(/^(\d+)(?:\s(\d+\.\d+\.\d+))?\s/);
                let data = {
                  command: cmd,
                  response: str
                };
                if (codes) {
                  data.status = Number(codes[1]) || 0;
                  if (codes[2]) {
                    data.code = codes[2];
                  }
                  data.text = str.substr(codes[0].length);
                } else {
                  data.text = str;
                  data.status = 0;
                }
                done(null, data);
              });
              setImmediate(() => this._sendCommand(cmd));
              return promise;
            }, "sendCommand"),
            resolve,
            reject
          });
          if (handlerResponse && typeof handlerResponse.catch === "function") {
            handlerResponse.then(resolve).catch(reject);
          }
          return;
        }
        switch (this._authMethod) {
          case "XOAUTH2":
            this._handleXOauth2Token(false, callback);
            return;
          case "LOGIN":
            this._responseActions.push((str) => {
              this._actionAUTH_LOGIN_USER(str, callback);
            });
            this._sendCommand("AUTH LOGIN");
            return;
          case "PLAIN":
            this._responseActions.push((str) => {
              this._actionAUTHComplete(str, callback);
            });
            this._sendCommand(
              "AUTH PLAIN " + Buffer.from(
                //this._auth.user+'\u0000'+
                "\0" + // skip authorization identity as it causes problems with some servers
                this._auth.credentials.user + "\0" + this._auth.credentials.pass,
                "utf-8"
              ).toString("base64"),
              // log entry without passwords
              "AUTH PLAIN " + Buffer.from(
                //this._auth.user+'\u0000'+
                "\0" + // skip authorization identity as it causes problems with some servers
                this._auth.credentials.user + "\0/* secret */",
                "utf-8"
              ).toString("base64")
            );
            return;
          case "CRAM-MD5":
            this._responseActions.push((str) => {
              this._actionAUTH_CRAM_MD5(str, callback);
            });
            this._sendCommand("AUTH CRAM-MD5");
            return;
        }
        return callback(this._formatError('Unknown authentication method "' + this._authMethod + '"', "EAUTH", false, "API"));
      }
      /**
       * Sends a message
       *
       * @param {Object} envelope Envelope object, {from: addr, to: [addr]}
       * @param {Object} message String, Buffer or a Stream
       * @param {Function} callback Callback to return once sending is completed
       */
      send(envelope, message, done) {
        if (!message) {
          return done(this._formatError("Empty message", "EMESSAGE", false, "API"));
        }
        const isDestroyedMessage = this._isDestroyedMessage("send message");
        if (isDestroyedMessage) {
          return done(this._formatError(isDestroyedMessage, "ECONNECTION", false, "API"));
        }
        if (this._maxAllowedSize && envelope.size > this._maxAllowedSize) {
          return setImmediate(() => {
            done(this._formatError("Message size larger than allowed " + this._maxAllowedSize, "EMESSAGE", false, "MAIL FROM"));
          });
        }
        let returned = false;
        let callback = /* @__PURE__ */ __name(function() {
          if (returned) {
            return;
          }
          returned = true;
          done(...arguments);
        }, "callback");
        if (typeof message.on === "function") {
          message.on("error", (err) => callback(this._formatError(err, "ESTREAM", false, "API")));
        }
        let startTime = Date.now();
        this._setEnvelope(envelope, (err, info3) => {
          if (err) {
            let stream2 = new PassThrough();
            if (typeof message.pipe === "function") {
              message.pipe(stream2);
            } else {
              stream2.write(message);
              stream2.end();
            }
            return callback(err);
          }
          let envelopeTime = Date.now();
          let stream = this._createSendStream((err2, str) => {
            if (err2) {
              return callback(err2);
            }
            info3.envelopeTime = envelopeTime - startTime;
            info3.messageTime = Date.now() - envelopeTime;
            info3.messageSize = stream.outByteCount;
            info3.response = str;
            return callback(null, info3);
          });
          if (typeof message.pipe === "function") {
            message.pipe(stream);
          } else {
            stream.write(message);
            stream.end();
          }
        });
      }
      /**
       * Resets connection state
       *
       * @param {Function} callback Callback to return once connection is reset
       */
      reset(callback) {
        this._sendCommand("RSET");
        this._responseActions.push((str) => {
          if (str.charAt(0) !== "2") {
            return callback(this._formatError("Could not reset session state. response=" + str, "EPROTOCOL", str, "RSET"));
          }
          this._envelope = false;
          return callback(null, true);
        });
      }
      /**
       * Connection listener that is run when the connection to
       * the server is opened
       *
       * @event
       */
      _onConnect() {
        clearTimeout(this._connectionTimeout);
        this.logger.info(
          {
            tnx: "network",
            localAddress: this._socket.localAddress,
            localPort: this._socket.localPort,
            remoteAddress: this._socket.remoteAddress,
            remotePort: this._socket.remotePort
          },
          "%s established to %s:%s",
          this.secure ? "Secure connection" : "Connection",
          this._socket.remoteAddress,
          this._socket.remotePort
        );
        if (this._destroyed) {
          this.close();
          return;
        }
        this.stage = "connected";
        this._socket.removeListener("data", this._onSocketData);
        this._socket.removeListener("timeout", this._onSocketTimeout);
        this._socket.removeListener("close", this._onSocketClose);
        this._socket.removeListener("end", this._onSocketEnd);
        this._socket.on("data", this._onSocketData);
        this._socket.once("close", this._onSocketClose);
        this._socket.once("end", this._onSocketEnd);
        this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
        this._socket.on("timeout", this._onSocketTimeout);
        this._greetingTimeout = setTimeout(() => {
          if (this._socket && !this._destroyed && this._responseActions[0] === this._actionGreeting) {
            this._onError("Greeting never received", "ETIMEDOUT", false, "CONN");
          }
        }, this.options.greetingTimeout || GREETING_TIMEOUT);
        this._responseActions.push(this._actionGreeting);
        this._socket.resume();
      }
      /**
       * 'data' listener for data coming from the server
       *
       * @event
       * @param {Buffer} chunk Data chunk coming from the server
       */
      _onData(chunk) {
        if (this._destroyed || !chunk || !chunk.length) {
          return;
        }
        let data = (chunk || "").toString("binary");
        let lines = (this._remainder + data).split(/\r?\n/);
        let lastline;
        this._remainder = lines.pop();
        for (let i = 0, len = lines.length; i < len; i++) {
          if (this._responseQueue.length) {
            lastline = this._responseQueue[this._responseQueue.length - 1];
            if (/^\d+-/.test(lastline.split("\n").pop())) {
              this._responseQueue[this._responseQueue.length - 1] += "\n" + lines[i];
              continue;
            }
          }
          this._responseQueue.push(lines[i]);
        }
        if (this._responseQueue.length) {
          lastline = this._responseQueue[this._responseQueue.length - 1];
          if (/^\d+-/.test(lastline.split("\n").pop())) {
            return;
          }
        }
        this._processResponse();
      }
      /**
       * 'error' listener for the socket
       *
       * @event
       * @param {Error} err Error object
       * @param {String} type Error name
       */
      _onError(err, type2, data, command) {
        clearTimeout(this._connectionTimeout);
        clearTimeout(this._greetingTimeout);
        if (this._destroyed) {
          return;
        }
        err = this._formatError(err, type2, data, command);
        this.logger.error(data, err.message);
        this.emit("error", err);
        this.close();
      }
      _formatError(message, type2, response, command) {
        let err;
        if (/Error\]$/i.test(Object.prototype.toString.call(message))) {
          err = message;
        } else {
          err = new Error(message);
        }
        if (type2 && type2 !== "Error") {
          err.code = type2;
        }
        if (response) {
          err.response = response;
          err.message += ": " + response;
        }
        let responseCode = typeof response === "string" && Number((response.match(/^\d+/) || [])[0]) || false;
        if (responseCode) {
          err.responseCode = responseCode;
        }
        if (command) {
          err.command = command;
        }
        return err;
      }
      /**
       * 'close' listener for the socket
       *
       * @event
       */
      _onClose() {
        let serverResponse = false;
        if (this._remainder && this._remainder.trim()) {
          if (this.options.debug || this.options.transactionLog) {
            this.logger.debug(
              {
                tnx: "server"
              },
              this._remainder.replace(/\r?\n$/, "")
            );
          }
          this.lastServerResponse = serverResponse = this._remainder.trim();
        }
        this.logger.info(
          {
            tnx: "network"
          },
          "Connection closed"
        );
        if (this.upgrading && !this._destroyed) {
          return this._onError(new Error("Connection closed unexpectedly"), "ETLS", serverResponse, "CONN");
        } else if (![this._actionGreeting, this.close].includes(this._responseActions[0]) && !this._destroyed) {
          return this._onError(new Error("Connection closed unexpectedly"), "ECONNECTION", serverResponse, "CONN");
        } else if (/^[45]\d{2}\b/.test(serverResponse)) {
          return this._onError(new Error("Connection closed unexpectedly"), "ECONNECTION", serverResponse, "CONN");
        }
        this._destroy();
      }
      /**
       * 'end' listener for the socket
       *
       * @event
       */
      _onEnd() {
        if (this._socket && !this._socket.destroyed) {
          this._socket.destroy();
        }
      }
      /**
       * 'timeout' listener for the socket
       *
       * @event
       */
      _onTimeout() {
        return this._onError(new Error("Timeout"), "ETIMEDOUT", false, "CONN");
      }
      /**
       * Destroys the client, emits 'end'
       */
      _destroy() {
        if (this._destroyed) {
          return;
        }
        this._destroyed = true;
        this.emit("end");
      }
      /**
       * Upgrades the connection to TLS
       *
       * @param {Function} callback Callback function to run when the connection
       *        has been secured
       */
      _upgradeConnection(callback) {
        this._socket.removeListener("data", this._onSocketData);
        this._socket.removeListener("timeout", this._onSocketTimeout);
        let socketPlain = this._socket;
        let opts = {
          socket: this._socket,
          host: this.host
        };
        Object.keys(this.options.tls || {}).forEach((key) => {
          opts[key] = this.options.tls[key];
        });
        if (this.servername && !opts.servername) {
          opts.servername = this.servername;
        }
        this.upgrading = true;
        try {
          this._socket = tls.connect(opts, () => {
            this.secure = true;
            this.upgrading = false;
            this._socket.on("data", this._onSocketData);
            socketPlain.removeListener("close", this._onSocketClose);
            socketPlain.removeListener("end", this._onSocketEnd);
            return callback(null, true);
          });
        } catch (err) {
          return callback(err);
        }
        this._socket.on("error", this._onSocketError);
        this._socket.once("close", this._onSocketClose);
        this._socket.once("end", this._onSocketEnd);
        this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
        this._socket.on("timeout", this._onSocketTimeout);
        socketPlain.resume();
      }
      /**
       * Processes queued responses from the server
       *
       * @param {Boolean} force If true, ignores _processing flag
       */
      _processResponse() {
        if (!this._responseQueue.length) {
          return false;
        }
        let str = this.lastServerResponse = (this._responseQueue.shift() || "").toString();
        if (/^\d+-/.test(str.split("\n").pop())) {
          return;
        }
        if (this.options.debug || this.options.transactionLog) {
          this.logger.debug(
            {
              tnx: "server"
            },
            str.replace(/\r?\n$/, "")
          );
        }
        if (!str.trim()) {
          setImmediate(() => this._processResponse());
        }
        let action = this._responseActions.shift();
        if (typeof action === "function") {
          action.call(this, str);
          setImmediate(() => this._processResponse());
        } else {
          return this._onError(new Error("Unexpected Response"), "EPROTOCOL", str, "CONN");
        }
      }
      /**
       * Send a command to the server, append \r\n
       *
       * @param {String} str String to be sent to the server
       * @param {String} logStr Optional string to be used for logging instead of the actual string
       */
      _sendCommand(str, logStr) {
        if (this._destroyed) {
          return;
        }
        if (this._socket.destroyed) {
          return this.close();
        }
        if (this.options.debug || this.options.transactionLog) {
          this.logger.debug(
            {
              tnx: "client"
            },
            (logStr || str || "").toString().replace(/\r?\n$/, "")
          );
        }
        this._socket.write(Buffer.from(str + "\r\n", "utf-8"));
      }
      /**
       * Initiates a new message by submitting envelope data, starting with
       * MAIL FROM: command
       *
       * @param {Object} envelope Envelope object in the form of
       *        {from:'...', to:['...']}
       *        or
       *        {from:{address:'...',name:'...'}, to:[address:'...',name:'...']}
       */
      _setEnvelope(envelope, callback) {
        let args = [];
        let useSmtpUtf8 = false;
        this._envelope = envelope || {};
        this._envelope.from = (this._envelope.from && this._envelope.from.address || this._envelope.from || "").toString().trim();
        this._envelope.to = [].concat(this._envelope.to || []).map((to) => (to && to.address || to || "").toString().trim());
        if (!this._envelope.to.length) {
          return callback(this._formatError("No recipients defined", "EENVELOPE", false, "API"));
        }
        if (this._envelope.from && /[\r\n<>]/.test(this._envelope.from)) {
          return callback(this._formatError("Invalid sender " + JSON.stringify(this._envelope.from), "EENVELOPE", false, "API"));
        }
        if (/[\x80-\uFFFF]/.test(this._envelope.from)) {
          useSmtpUtf8 = true;
        }
        for (let i = 0, len = this._envelope.to.length; i < len; i++) {
          if (!this._envelope.to[i] || /[\r\n<>]/.test(this._envelope.to[i])) {
            return callback(this._formatError("Invalid recipient " + JSON.stringify(this._envelope.to[i]), "EENVELOPE", false, "API"));
          }
          if (/[\x80-\uFFFF]/.test(this._envelope.to[i])) {
            useSmtpUtf8 = true;
          }
        }
        this._envelope.rcptQueue = JSON.parse(JSON.stringify(this._envelope.to || []));
        this._envelope.rejected = [];
        this._envelope.rejectedErrors = [];
        this._envelope.accepted = [];
        if (this._envelope.dsn) {
          try {
            this._envelope.dsn = this._setDsnEnvelope(this._envelope.dsn);
          } catch (err) {
            return callback(this._formatError("Invalid DSN " + err.message, "EENVELOPE", false, "API"));
          }
        }
        this._responseActions.push((str) => {
          this._actionMAIL(str, callback);
        });
        if (useSmtpUtf8 && this._supportedExtensions.includes("SMTPUTF8")) {
          args.push("SMTPUTF8");
          this._usingSmtpUtf8 = true;
        }
        if (this._envelope.use8BitMime && this._supportedExtensions.includes("8BITMIME")) {
          args.push("BODY=8BITMIME");
          this._using8BitMime = true;
        }
        if (this._envelope.size && this._supportedExtensions.includes("SIZE")) {
          args.push("SIZE=" + this._envelope.size);
        }
        if (this._envelope.dsn && this._supportedExtensions.includes("DSN")) {
          if (this._envelope.dsn.ret) {
            args.push("RET=" + shared.encodeXText(this._envelope.dsn.ret));
          }
          if (this._envelope.dsn.envid) {
            args.push("ENVID=" + shared.encodeXText(this._envelope.dsn.envid));
          }
        }
        if (this._envelope.requireTLSExtensionEnabled) {
          if (!this.secure) {
            return callback(
              this._formatError("REQUIRETLS can only be used over TLS connections (RFC 8689)", "EREQUIRETLS", false, "MAIL FROM")
            );
          }
          if (!this._supportedExtensions.includes("REQUIRETLS")) {
            return callback(
              this._formatError("Server does not support REQUIRETLS extension (RFC 8689)", "EREQUIRETLS", false, "MAIL FROM")
            );
          }
          args.push("REQUIRETLS");
        }
        this._sendCommand("MAIL FROM:<" + this._envelope.from + ">" + (args.length ? " " + args.join(" ") : ""));
      }
      _setDsnEnvelope(params) {
        let ret = (params.ret || params.return || "").toString().toUpperCase() || null;
        if (ret) {
          switch (ret) {
            case "HDRS":
            case "HEADERS":
              ret = "HDRS";
              break;
            case "FULL":
            case "BODY":
              ret = "FULL";
              break;
          }
        }
        if (ret && !["FULL", "HDRS"].includes(ret)) {
          throw new Error("ret: " + JSON.stringify(ret));
        }
        let envid = (params.envid || params.id || "").toString() || null;
        let notify = params.notify || null;
        if (notify) {
          if (typeof notify === "string") {
            notify = notify.split(",");
          }
          notify = notify.map((n) => n.trim().toUpperCase());
          let validNotify = ["NEVER", "SUCCESS", "FAILURE", "DELAY"];
          let invalidNotify = notify.filter((n) => !validNotify.includes(n));
          if (invalidNotify.length || notify.length > 1 && notify.includes("NEVER")) {
            throw new Error("notify: " + JSON.stringify(notify.join(",")));
          }
          notify = notify.join(",");
        }
        let orcpt = (params.recipient || params.orcpt || "").toString() || null;
        if (orcpt && orcpt.indexOf(";") < 0) {
          orcpt = "rfc822;" + orcpt;
        }
        return {
          ret,
          envid,
          notify,
          orcpt
        };
      }
      _getDsnRcptToArgs() {
        let args = [];
        if (this._envelope.dsn && this._supportedExtensions.includes("DSN")) {
          if (this._envelope.dsn.notify) {
            args.push("NOTIFY=" + shared.encodeXText(this._envelope.dsn.notify));
          }
          if (this._envelope.dsn.orcpt) {
            args.push("ORCPT=" + shared.encodeXText(this._envelope.dsn.orcpt));
          }
        }
        return args.length ? " " + args.join(" ") : "";
      }
      _createSendStream(callback) {
        let dataStream = new DataStream();
        let logStream;
        if (this.options.lmtp) {
          this._envelope.accepted.forEach((recipient, i) => {
            let final = i === this._envelope.accepted.length - 1;
            this._responseActions.push((str) => {
              this._actionLMTPStream(recipient, final, str, callback);
            });
          });
        } else {
          this._responseActions.push((str) => {
            this._actionSMTPStream(str, callback);
          });
        }
        dataStream.pipe(this._socket, {
          end: false
        });
        if (this.options.debug) {
          logStream = new PassThrough();
          logStream.on("readable", () => {
            let chunk;
            while (chunk = logStream.read()) {
              this.logger.debug(
                {
                  tnx: "message"
                },
                chunk.toString("binary").replace(/\r?\n$/, "")
              );
            }
          });
          dataStream.pipe(logStream);
        }
        dataStream.once("end", () => {
          this.logger.info(
            {
              tnx: "message",
              inByteCount: dataStream.inByteCount,
              outByteCount: dataStream.outByteCount
            },
            "<%s bytes encoded mime message (source size %s bytes)>",
            dataStream.outByteCount,
            dataStream.inByteCount
          );
        });
        return dataStream;
      }
      /** ACTIONS **/
      /**
       * Will be run after the connection is created and the server sends
       * a greeting. If the incoming message starts with 220 initiate
       * SMTP session by sending EHLO command
       *
       * @param {String} str Message from the server
       */
      _actionGreeting(str) {
        clearTimeout(this._greetingTimeout);
        if (str.substr(0, 3) !== "220") {
          this._onError(new Error("Invalid greeting. response=" + str), "EPROTOCOL", str, "CONN");
          return;
        }
        if (this.options.lmtp) {
          this._responseActions.push(this._actionLHLO);
          this._sendCommand("LHLO " + this.name);
        } else {
          this._responseActions.push(this._actionEHLO);
          this._sendCommand("EHLO " + this.name);
        }
      }
      /**
       * Handles server response for LHLO command. If it yielded in
       * error, emit 'error', otherwise treat this as an EHLO response
       *
       * @param {String} str Message from the server
       */
      _actionLHLO(str) {
        if (str.charAt(0) !== "2") {
          this._onError(new Error("Invalid LHLO. response=" + str), "EPROTOCOL", str, "LHLO");
          return;
        }
        this._actionEHLO(str);
      }
      /**
       * Handles server response for EHLO command. If it yielded in
       * error, try HELO instead, otherwise initiate TLS negotiation
       * if STARTTLS is supported by the server or move into the
       * authentication phase.
       *
       * @param {String} str Message from the server
       */
      _actionEHLO(str) {
        let match2;
        if (str.substr(0, 3) === "421") {
          this._onError(new Error("Server terminates connection. response=" + str), "ECONNECTION", str, "EHLO");
          return;
        }
        if (str.charAt(0) !== "2") {
          if (this.options.requireTLS) {
            this._onError(
              new Error("EHLO failed but HELO does not support required STARTTLS. response=" + str),
              "ECONNECTION",
              str,
              "EHLO"
            );
            return;
          }
          this._responseActions.push(this._actionHELO);
          this._sendCommand("HELO " + this.name);
          return;
        }
        this._ehloLines = str.split(/\r?\n/).map((line) => line.replace(/^\d+[ -]/, "").trim()).filter((line) => line).slice(1);
        if (!this.secure && !this.options.ignoreTLS && (/[ -]STARTTLS\b/im.test(str) || this.options.requireTLS)) {
          this._sendCommand("STARTTLS");
          this._responseActions.push(this._actionSTARTTLS);
          return;
        }
        if (/[ -]SMTPUTF8\b/im.test(str)) {
          this._supportedExtensions.push("SMTPUTF8");
        }
        if (/[ -]DSN\b/im.test(str)) {
          this._supportedExtensions.push("DSN");
        }
        if (/[ -]8BITMIME\b/im.test(str)) {
          this._supportedExtensions.push("8BITMIME");
        }
        if (/[ -]REQUIRETLS\b/im.test(str)) {
          this._supportedExtensions.push("REQUIRETLS");
        }
        if (/[ -]PIPELINING\b/im.test(str)) {
          this._supportedExtensions.push("PIPELINING");
        }
        if (/[ -]AUTH\b/i.test(str)) {
          this.allowsAuth = true;
        }
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str)) {
          this._supportedAuth.push("PLAIN");
        }
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str)) {
          this._supportedAuth.push("LOGIN");
        }
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str)) {
          this._supportedAuth.push("CRAM-MD5");
        }
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str)) {
          this._supportedAuth.push("XOAUTH2");
        }
        if (match2 = str.match(/[ -]SIZE(?:[ \t]+(\d+))?/im)) {
          this._supportedExtensions.push("SIZE");
          this._maxAllowedSize = Number(match2[1]) || 0;
        }
        this.emit("connect");
      }
      /**
       * Handles server response for HELO command. If it yielded in
       * error, emit 'error', otherwise move into the authentication phase.
       *
       * @param {String} str Message from the server
       */
      _actionHELO(str) {
        if (str.charAt(0) !== "2") {
          this._onError(new Error("Invalid HELO. response=" + str), "EPROTOCOL", str, "HELO");
          return;
        }
        this.allowsAuth = true;
        this.emit("connect");
      }
      /**
       * Handles server response for STARTTLS command. If there's an error
       * try HELO instead, otherwise initiate TLS upgrade. If the upgrade
       * succeedes restart the EHLO
       *
       * @param {String} str Message from the server
       */
      _actionSTARTTLS(str) {
        if (str.charAt(0) !== "2") {
          if (this.options.opportunisticTLS) {
            this.logger.info(
              {
                tnx: "smtp"
              },
              "Failed STARTTLS upgrade, continuing unencrypted"
            );
            return this.emit("connect");
          }
          this._onError(new Error("Error upgrading connection with STARTTLS"), "ETLS", str, "STARTTLS");
          return;
        }
        this._upgradeConnection((err, secured) => {
          if (err) {
            this._onError(new Error("Error initiating TLS - " + (err.message || err)), "ETLS", false, "STARTTLS");
            return;
          }
          this.logger.info(
            {
              tnx: "smtp"
            },
            "Connection upgraded with STARTTLS"
          );
          if (secured) {
            if (this.options.lmtp) {
              this._responseActions.push(this._actionLHLO);
              this._sendCommand("LHLO " + this.name);
            } else {
              this._responseActions.push(this._actionEHLO);
              this._sendCommand("EHLO " + this.name);
            }
          } else {
            this.emit("connect");
          }
        });
      }
      /**
       * Handle the response for AUTH LOGIN command. We are expecting
       * '334 VXNlcm5hbWU6' (base64 for 'Username:'). Data to be sent as
       * response needs to be base64 encoded username. We do not need
       * exact match but settle with 334 response in general as some
       * hosts invalidly use a longer message than VXNlcm5hbWU6
       *
       * @param {String} str Message from the server
       */
      _actionAUTH_LOGIN_USER(str, callback) {
        if (!/^334[ -]/.test(str)) {
          callback(this._formatError('Invalid login sequence while waiting for "334 VXNlcm5hbWU6"', "EAUTH", str, "AUTH LOGIN"));
          return;
        }
        this._responseActions.push((str2) => {
          this._actionAUTH_LOGIN_PASS(str2, callback);
        });
        this._sendCommand(Buffer.from(this._auth.credentials.user + "", "utf-8").toString("base64"));
      }
      /**
       * Handle the response for AUTH CRAM-MD5 command. We are expecting
       * '334 <challenge string>'. Data to be sent as response needs to be
       * base64 decoded challenge string, MD5 hashed using the password as
       * a HMAC key, prefixed by the username and a space, and finally all
       * base64 encoded again.
       *
       * @param {String} str Message from the server
       */
      _actionAUTH_CRAM_MD5(str, callback) {
        let challengeMatch = str.match(/^334\s+(.+)$/);
        let challengeString = "";
        if (!challengeMatch) {
          return callback(
            this._formatError("Invalid login sequence while waiting for server challenge string", "EAUTH", str, "AUTH CRAM-MD5")
          );
        } else {
          challengeString = challengeMatch[1];
        }
        let base64decoded = Buffer.from(challengeString, "base64").toString("ascii"), hmacMD5 = crypto.createHmac("md5", this._auth.credentials.pass);
        hmacMD5.update(base64decoded);
        let prepended = this._auth.credentials.user + " " + hmacMD5.digest("hex");
        this._responseActions.push((str2) => {
          this._actionAUTH_CRAM_MD5_PASS(str2, callback);
        });
        this._sendCommand(
          Buffer.from(prepended).toString("base64"),
          // hidden hash for logs
          Buffer.from(this._auth.credentials.user + " /* secret */").toString("base64")
        );
      }
      /**
       * Handles the response to CRAM-MD5 authentication, if there's no error,
       * the user can be considered logged in. Start waiting for a message to send
       *
       * @param {String} str Message from the server
       */
      _actionAUTH_CRAM_MD5_PASS(str, callback) {
        if (!str.match(/^235\s+/)) {
          return callback(this._formatError('Invalid login sequence while waiting for "235"', "EAUTH", str, "AUTH CRAM-MD5"));
        }
        this.logger.info(
          {
            tnx: "smtp",
            username: this._auth.user,
            action: "authenticated",
            method: this._authMethod
          },
          "User %s authenticated",
          JSON.stringify(this._auth.user)
        );
        this.authenticated = true;
        callback(null, true);
      }
      /**
       * Handle the response for AUTH LOGIN command. We are expecting
       * '334 UGFzc3dvcmQ6' (base64 for 'Password:'). Data to be sent as
       * response needs to be base64 encoded password.
       *
       * @param {String} str Message from the server
       */
      _actionAUTH_LOGIN_PASS(str, callback) {
        if (!/^334[ -]/.test(str)) {
          return callback(this._formatError('Invalid login sequence while waiting for "334 UGFzc3dvcmQ6"', "EAUTH", str, "AUTH LOGIN"));
        }
        this._responseActions.push((str2) => {
          this._actionAUTHComplete(str2, callback);
        });
        this._sendCommand(
          Buffer.from((this._auth.credentials.pass || "").toString(), "utf-8").toString("base64"),
          // Hidden pass for logs
          Buffer.from("/* secret */", "utf-8").toString("base64")
        );
      }
      /**
       * Handles the response for authentication, if there's no error,
       * the user can be considered logged in. Start waiting for a message to send
       *
       * @param {String} str Message from the server
       */
      _actionAUTHComplete(str, isRetry, callback) {
        if (!callback && typeof isRetry === "function") {
          callback = isRetry;
          isRetry = false;
        }
        if (str.substr(0, 3) === "334") {
          this._responseActions.push((str2) => {
            if (isRetry || this._authMethod !== "XOAUTH2") {
              this._actionAUTHComplete(str2, true, callback);
            } else {
              setImmediate(() => this._handleXOauth2Token(true, callback));
            }
          });
          this._sendCommand("");
          return;
        }
        if (str.charAt(0) !== "2") {
          this.logger.info(
            {
              tnx: "smtp",
              username: this._auth.user,
              action: "authfail",
              method: this._authMethod
            },
            "User %s failed to authenticate",
            JSON.stringify(this._auth.user)
          );
          return callback(this._formatError("Invalid login", "EAUTH", str, "AUTH " + this._authMethod));
        }
        this.logger.info(
          {
            tnx: "smtp",
            username: this._auth.user,
            action: "authenticated",
            method: this._authMethod
          },
          "User %s authenticated",
          JSON.stringify(this._auth.user)
        );
        this.authenticated = true;
        callback(null, true);
      }
      /**
       * Handle response for a MAIL FROM: command
       *
       * @param {String} str Message from the server
       */
      _actionMAIL(str, callback) {
        let message, curRecipient;
        if (Number(str.charAt(0)) !== 2) {
          if (this._usingSmtpUtf8 && /^550 /.test(str) && /[\x80-\uFFFF]/.test(this._envelope.from)) {
            message = "Internationalized mailbox name not allowed";
          } else {
            message = "Mail command failed";
          }
          return callback(this._formatError(message, "EENVELOPE", str, "MAIL FROM"));
        }
        if (!this._envelope.rcptQueue.length) {
          return callback(this._formatError("Can't send mail - no recipients defined", "EENVELOPE", false, "API"));
        } else {
          this._recipientQueue = [];
          if (this._supportedExtensions.includes("PIPELINING")) {
            while (this._envelope.rcptQueue.length) {
              curRecipient = this._envelope.rcptQueue.shift();
              this._recipientQueue.push(curRecipient);
              this._responseActions.push((str2) => {
                this._actionRCPT(str2, callback);
              });
              this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
            }
          } else {
            curRecipient = this._envelope.rcptQueue.shift();
            this._recipientQueue.push(curRecipient);
            this._responseActions.push((str2) => {
              this._actionRCPT(str2, callback);
            });
            this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
          }
        }
      }
      /**
       * Handle response for a RCPT TO: command
       *
       * @param {String} str Message from the server
       */
      _actionRCPT(str, callback) {
        let message, err, curRecipient = this._recipientQueue.shift();
        if (Number(str.charAt(0)) !== 2) {
          if (this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)) {
            message = "Internationalized mailbox name not allowed";
          } else {
            message = "Recipient command failed";
          }
          this._envelope.rejected.push(curRecipient);
          err = this._formatError(message, "EENVELOPE", str, "RCPT TO");
          err.recipient = curRecipient;
          this._envelope.rejectedErrors.push(err);
        } else {
          this._envelope.accepted.push(curRecipient);
        }
        if (!this._envelope.rcptQueue.length && !this._recipientQueue.length) {
          if (this._envelope.rejected.length < this._envelope.to.length) {
            this._responseActions.push((str2) => {
              this._actionDATA(str2, callback);
            });
            this._sendCommand("DATA");
          } else {
            err = this._formatError("Can't send mail - all recipients were rejected", "EENVELOPE", str, "RCPT TO");
            err.rejected = this._envelope.rejected;
            err.rejectedErrors = this._envelope.rejectedErrors;
            return callback(err);
          }
        } else if (this._envelope.rcptQueue.length) {
          curRecipient = this._envelope.rcptQueue.shift();
          this._recipientQueue.push(curRecipient);
          this._responseActions.push((str2) => {
            this._actionRCPT(str2, callback);
          });
          this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
        }
      }
      /**
       * Handle response for a DATA command
       *
       * @param {String} str Message from the server
       */
      _actionDATA(str, callback) {
        if (!/^[23]/.test(str)) {
          return callback(this._formatError("Data command failed", "EENVELOPE", str, "DATA"));
        }
        let response = {
          accepted: this._envelope.accepted,
          rejected: this._envelope.rejected
        };
        if (this._ehloLines && this._ehloLines.length) {
          response.ehlo = this._ehloLines;
        }
        if (this._envelope.rejectedErrors.length) {
          response.rejectedErrors = this._envelope.rejectedErrors;
        }
        callback(null, response);
      }
      /**
       * Handle response for a DATA stream when using SMTP
       * We expect a single response that defines if the sending succeeded or failed
       *
       * @param {String} str Message from the server
       */
      _actionSMTPStream(str, callback) {
        if (Number(str.charAt(0)) !== 2) {
          return callback(this._formatError("Message failed", "EMESSAGE", str, "DATA"));
        } else {
          return callback(null, str);
        }
      }
      /**
       * Handle response for a DATA stream
       * We expect a separate response for every recipient. All recipients can either
       * succeed or fail separately
       *
       * @param {String} recipient The recipient this response applies to
       * @param {Boolean} final Is this the final recipient?
       * @param {String} str Message from the server
       */
      _actionLMTPStream(recipient, final, str, callback) {
        let err;
        if (Number(str.charAt(0)) !== 2) {
          err = this._formatError("Message failed for recipient " + recipient, "EMESSAGE", str, "DATA");
          err.recipient = recipient;
          this._envelope.rejected.push(recipient);
          this._envelope.rejectedErrors.push(err);
          for (let i = 0, len = this._envelope.accepted.length; i < len; i++) {
            if (this._envelope.accepted[i] === recipient) {
              this._envelope.accepted.splice(i, 1);
            }
          }
        }
        if (final) {
          return callback(null, str);
        }
      }
      _handleXOauth2Token(isRetry, callback) {
        this._auth.oauth2.getToken(isRetry, (err, accessToken) => {
          if (err) {
            this.logger.info(
              {
                tnx: "smtp",
                username: this._auth.user,
                action: "authfail",
                method: this._authMethod
              },
              "User %s failed to authenticate",
              JSON.stringify(this._auth.user)
            );
            return callback(this._formatError(err, "EAUTH", false, "AUTH XOAUTH2"));
          }
          this._responseActions.push((str) => {
            this._actionAUTHComplete(str, isRetry, callback);
          });
          this._sendCommand(
            "AUTH XOAUTH2 " + this._auth.oauth2.buildXOAuth2Token(accessToken),
            //  Hidden for logs
            "AUTH XOAUTH2 " + this._auth.oauth2.buildXOAuth2Token("/* secret */")
          );
        });
      }
      /**
       *
       * @param {string} command
       * @private
       */
      _isDestroyedMessage(command) {
        if (this._destroyed) {
          return "Cannot " + command + " - smtp connection is already destroyed.";
        }
        if (this._socket) {
          if (this._socket.destroyed) {
            return "Cannot " + command + " - smtp connection socket is already destroyed.";
          }
          if (!this._socket.writable) {
            return "Cannot " + command + " - smtp connection socket is already half-closed.";
          }
        }
      }
      _getHostname() {
        let defaultHostname;
        try {
          defaultHostname = os.hostname() || "";
        } catch (_err) {
          defaultHostname = "localhost";
        }
        if (!defaultHostname || defaultHostname.indexOf(".") < 0) {
          defaultHostname = "[127.0.0.1]";
        }
        if (defaultHostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          defaultHostname = "[" + defaultHostname + "]";
        }
        return defaultHostname;
      }
    };
    module.exports = SMTPConnection;
  }
});

// ../node_modules/nodemailer/lib/xoauth2/index.js
var require_xoauth2 = __commonJS({
  "../node_modules/nodemailer/lib/xoauth2/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Stream2 = require_stream().Stream;
    var nmfetch = require_fetch();
    var crypto = require_crypto();
    var shared = require_shared();
    var XOAuth2 = class extends Stream2 {
      static {
        __name(this, "XOAuth2");
      }
      constructor(options, logger) {
        super();
        this.options = options || {};
        if (options && options.serviceClient) {
          if (!options.privateKey || !options.user) {
            setImmediate(() => this.emit("error", new Error('Options "privateKey" and "user" are required for service account!')));
            return;
          }
          let serviceRequestTimeout = Math.min(Math.max(Number(this.options.serviceRequestTimeout) || 0, 0), 3600);
          this.options.serviceRequestTimeout = serviceRequestTimeout || 5 * 60;
        }
        this.logger = shared.getLogger(
          {
            logger
          },
          {
            component: this.options.component || "OAuth2"
          }
        );
        this.provisionCallback = typeof this.options.provisionCallback === "function" ? this.options.provisionCallback : false;
        this.options.accessUrl = this.options.accessUrl || "https://accounts.google.com/o/oauth2/token";
        this.options.customHeaders = this.options.customHeaders || {};
        this.options.customParams = this.options.customParams || {};
        this.accessToken = this.options.accessToken || false;
        if (this.options.expires && Number(this.options.expires)) {
          this.expires = this.options.expires;
        } else {
          let timeout = Math.max(Number(this.options.timeout) || 0, 0);
          this.expires = timeout && Date.now() + timeout * 1e3 || 0;
        }
        this.renewing = false;
        this.renewalQueue = [];
      }
      /**
       * Returns or generates (if previous has expired) a XOAuth2 token
       *
       * @param {Boolean} renew If false then use cached access token (if available)
       * @param {Function} callback Callback function with error object and token string
       */
      getToken(renew, callback) {
        if (!renew && this.accessToken && (!this.expires || this.expires > Date.now())) {
          this.logger.debug(
            {
              tnx: "OAUTH2",
              user: this.options.user,
              action: "reuse"
            },
            "Reusing existing access token for %s",
            this.options.user
          );
          return callback(null, this.accessToken);
        }
        if (!this.provisionCallback && !this.options.refreshToken && !this.options.serviceClient) {
          if (this.accessToken) {
            this.logger.debug(
              {
                tnx: "OAUTH2",
                user: this.options.user,
                action: "reuse"
              },
              "Reusing existing access token (no refresh capability) for %s",
              this.options.user
            );
            return callback(null, this.accessToken);
          }
          this.logger.error(
            {
              tnx: "OAUTH2",
              user: this.options.user,
              action: "renew"
            },
            "Cannot renew access token for %s: No refresh mechanism available",
            this.options.user
          );
          return callback(new Error("Can't create new access token for user"));
        }
        if (this.renewing) {
          return this.renewalQueue.push({ renew, callback });
        }
        this.renewing = true;
        const generateCallback = /* @__PURE__ */ __name((err, accessToken) => {
          this.renewalQueue.forEach((item) => item.callback(err, accessToken));
          this.renewalQueue = [];
          this.renewing = false;
          if (err) {
            this.logger.error(
              {
                err,
                tnx: "OAUTH2",
                user: this.options.user,
                action: "renew"
              },
              "Failed generating new Access Token for %s",
              this.options.user
            );
          } else {
            this.logger.info(
              {
                tnx: "OAUTH2",
                user: this.options.user,
                action: "renew"
              },
              "Generated new Access Token for %s",
              this.options.user
            );
          }
          callback(err, accessToken);
        }, "generateCallback");
        if (this.provisionCallback) {
          this.provisionCallback(this.options.user, !!renew, (err, accessToken, expires) => {
            if (!err && accessToken) {
              this.accessToken = accessToken;
              this.expires = expires || 0;
            }
            generateCallback(err, accessToken);
          });
        } else {
          this.generateToken(generateCallback);
        }
      }
      /**
       * Updates token values
       *
       * @param {String} accessToken New access token
       * @param {Number} timeout Access token lifetime in seconds
       *
       * Emits 'token': { user: User email-address, accessToken: the new accessToken, timeout: TTL in seconds}
       */
      updateToken(accessToken, timeout) {
        this.accessToken = accessToken;
        timeout = Math.max(Number(timeout) || 0, 0);
        this.expires = timeout && Date.now() + timeout * 1e3 || 0;
        this.emit("token", {
          user: this.options.user,
          accessToken: accessToken || "",
          expires: this.expires
        });
      }
      /**
       * Generates a new XOAuth2 token with the credentials provided at initialization
       *
       * @param {Function} callback Callback function with error object and token string
       */
      generateToken(callback) {
        let urlOptions;
        let loggedUrlOptions;
        if (this.options.serviceClient) {
          let iat = Math.floor(Date.now() / 1e3);
          let tokenData = {
            iss: this.options.serviceClient,
            scope: this.options.scope || "https://mail.google.com/",
            sub: this.options.user,
            aud: this.options.accessUrl,
            iat,
            exp: iat + this.options.serviceRequestTimeout
          };
          let token;
          try {
            token = this.jwtSignRS256(tokenData);
          } catch (_err) {
            return callback(new Error("Can't generate token. Check your auth options"));
          }
          urlOptions = {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: token
          };
          loggedUrlOptions = {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: tokenData
          };
        } else {
          if (!this.options.refreshToken) {
            return callback(new Error("Can't create new access token for user"));
          }
          urlOptions = {
            client_id: this.options.clientId || "",
            client_secret: this.options.clientSecret || "",
            refresh_token: this.options.refreshToken,
            grant_type: "refresh_token"
          };
          loggedUrlOptions = {
            client_id: this.options.clientId || "",
            client_secret: (this.options.clientSecret || "").substr(0, 6) + "...",
            refresh_token: (this.options.refreshToken || "").substr(0, 6) + "...",
            grant_type: "refresh_token"
          };
        }
        Object.keys(this.options.customParams).forEach((key) => {
          urlOptions[key] = this.options.customParams[key];
          loggedUrlOptions[key] = this.options.customParams[key];
        });
        this.logger.debug(
          {
            tnx: "OAUTH2",
            user: this.options.user,
            action: "generate"
          },
          "Requesting token using: %s",
          JSON.stringify(loggedUrlOptions)
        );
        this.postRequest(this.options.accessUrl, urlOptions, this.options, (error3, body) => {
          let data;
          if (error3) {
            return callback(error3);
          }
          try {
            data = JSON.parse(body.toString());
          } catch (E) {
            return callback(E);
          }
          if (!data || typeof data !== "object") {
            this.logger.debug(
              {
                tnx: "OAUTH2",
                user: this.options.user,
                action: "post"
              },
              "Response: %s",
              (body || "").toString()
            );
            return callback(new Error("Invalid authentication response"));
          }
          let logData = {};
          Object.keys(data).forEach((key) => {
            if (key !== "access_token") {
              logData[key] = data[key];
            } else {
              logData[key] = (data[key] || "").toString().substr(0, 6) + "...";
            }
          });
          this.logger.debug(
            {
              tnx: "OAUTH2",
              user: this.options.user,
              action: "post"
            },
            "Response: %s",
            JSON.stringify(logData)
          );
          if (data.error) {
            let errorMessage = data.error;
            if (data.error_description) {
              errorMessage += ": " + data.error_description;
            }
            if (data.error_uri) {
              errorMessage += " (" + data.error_uri + ")";
            }
            return callback(new Error(errorMessage));
          }
          if (data.access_token) {
            this.updateToken(data.access_token, data.expires_in);
            return callback(null, this.accessToken);
          }
          return callback(new Error("No access token"));
        });
      }
      /**
       * Converts an access_token and user id into a base64 encoded XOAuth2 token
       *
       * @param {String} [accessToken] Access token string
       * @return {String} Base64 encoded token for IMAP or SMTP login
       */
      buildXOAuth2Token(accessToken) {
        let authData = ["user=" + (this.options.user || ""), "auth=Bearer " + (accessToken || this.accessToken), "", ""];
        return Buffer.from(authData.join(""), "utf-8").toString("base64");
      }
      /**
       * Custom POST request handler.
       * This is only needed to keep paths short in Windows – usually this module
       * is a dependency of a dependency and if it tries to require something
       * like the request module the paths get way too long to handle for Windows.
       * As we do only a simple POST request we do not actually require complicated
       * logic support (no redirects, no nothing) anyway.
       *
       * @param {String} url Url to POST to
       * @param {String|Buffer} payload Payload to POST
       * @param {Function} callback Callback function with (err, buff)
       */
      postRequest(url, payload, params, callback) {
        let returned = false;
        let chunks = [];
        let chunklen = 0;
        let req = nmfetch(url, {
          method: "post",
          headers: params.customHeaders,
          body: payload,
          allowErrorResponse: true
        });
        req.on("readable", () => {
          let chunk;
          while ((chunk = req.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
          }
        });
        req.once("error", (err) => {
          if (returned) {
            return;
          }
          returned = true;
          return callback(err);
        });
        req.once("end", () => {
          if (returned) {
            return;
          }
          returned = true;
          return callback(null, Buffer.concat(chunks, chunklen));
        });
      }
      /**
       * Encodes a buffer or a string into Base64url format
       *
       * @param {Buffer|String} data The data to convert
       * @return {String} The encoded string
       */
      toBase64URL(data) {
        if (typeof data === "string") {
          data = Buffer.from(data);
        }
        return data.toString("base64").replace(/[=]+/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      /**
       * Creates a JSON Web Token signed with RS256 (SHA256 + RSA)
       *
       * @param {Object} payload The payload to include in the generated token
       * @return {String} The generated and signed token
       */
      jwtSignRS256(payload) {
        payload = ['{"alg":"RS256","typ":"JWT"}', JSON.stringify(payload)].map((val) => this.toBase64URL(val)).join(".");
        let signature = crypto.createSign("RSA-SHA256").update(payload).sign(this.options.privateKey);
        return payload + "." + this.toBase64URL(signature);
      }
    };
    module.exports = XOAuth2;
  }
});

// ../node_modules/nodemailer/lib/smtp-pool/pool-resource.js
var require_pool_resource = __commonJS({
  "../node_modules/nodemailer/lib/smtp-pool/pool-resource.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var SMTPConnection = require_smtp_connection();
    var assign = require_shared().assign;
    var XOAuth2 = require_xoauth2();
    var EventEmitter3 = require_events();
    var PoolResource = class extends EventEmitter3 {
      static {
        __name(this, "PoolResource");
      }
      constructor(pool) {
        super();
        this.pool = pool;
        this.options = pool.options;
        this.logger = this.pool.logger;
        if (this.options.auth) {
          switch ((this.options.auth.type || "").toString().toUpperCase()) {
            case "OAUTH2": {
              let oauth2 = new XOAuth2(this.options.auth, this.logger);
              oauth2.provisionCallback = this.pool.mailer && this.pool.mailer.get("oauth2_provision_cb") || oauth2.provisionCallback;
              this.auth = {
                type: "OAUTH2",
                user: this.options.auth.user,
                oauth2,
                method: "XOAUTH2"
              };
              oauth2.on("token", (token) => this.pool.mailer.emit("token", token));
              oauth2.on("error", (err) => this.emit("error", err));
              break;
            }
            default:
              if (!this.options.auth.user && !this.options.auth.pass) {
                break;
              }
              this.auth = {
                type: (this.options.auth.type || "").toString().toUpperCase() || "LOGIN",
                user: this.options.auth.user,
                credentials: {
                  user: this.options.auth.user || "",
                  pass: this.options.auth.pass,
                  options: this.options.auth.options
                },
                method: (this.options.auth.method || "").trim().toUpperCase() || this.options.authMethod || false
              };
          }
        }
        this._connection = false;
        this._connected = false;
        this.messages = 0;
        this.available = true;
      }
      /**
       * Initiates a connection to the SMTP server
       *
       * @param {Function} callback Callback function to run once the connection is established or failed
       */
      connect(callback) {
        this.pool.getSocket(this.options, (err, socketOptions) => {
          if (err) {
            return callback(err);
          }
          let returned = false;
          let options = this.options;
          if (socketOptions && socketOptions.connection) {
            this.logger.info(
              {
                tnx: "proxy",
                remoteAddress: socketOptions.connection.remoteAddress,
                remotePort: socketOptions.connection.remotePort,
                destHost: options.host || "",
                destPort: options.port || "",
                action: "connected"
              },
              "Using proxied socket from %s:%s to %s:%s",
              socketOptions.connection.remoteAddress,
              socketOptions.connection.remotePort,
              options.host || "",
              options.port || ""
            );
            options = assign(false, options);
            Object.keys(socketOptions).forEach((key) => {
              options[key] = socketOptions[key];
            });
          }
          this.connection = new SMTPConnection(options);
          this.connection.once("error", (err2) => {
            this.emit("error", err2);
            if (returned) {
              return;
            }
            returned = true;
            return callback(err2);
          });
          this.connection.once("end", () => {
            this.close();
            if (returned) {
              return;
            }
            returned = true;
            let timer = setTimeout(() => {
              if (returned) {
                return;
              }
              let err2 = new Error("Unexpected socket close");
              if (this.connection && this.connection._socket && this.connection._socket.upgrading) {
                err2.code = "ETLS";
              }
              callback(err2);
            }, 1e3);
            try {
              timer.unref();
            } catch (_E) {
            }
          });
          this.connection.connect(() => {
            if (returned) {
              return;
            }
            if (this.auth && (this.connection.allowsAuth || options.forceAuth)) {
              this.connection.login(this.auth, (err2) => {
                if (returned) {
                  return;
                }
                returned = true;
                if (err2) {
                  this.connection.close();
                  this.emit("error", err2);
                  return callback(err2);
                }
                this._connected = true;
                callback(null, true);
              });
            } else {
              returned = true;
              this._connected = true;
              return callback(null, true);
            }
          });
        });
      }
      /**
       * Sends an e-mail to be sent using the selected settings
       *
       * @param {Object} mail Mail object
       * @param {Function} callback Callback function
       */
      send(mail, callback) {
        if (!this._connected) {
          return this.connect((err) => {
            if (err) {
              return callback(err);
            }
            return this.send(mail, callback);
          });
        }
        let envelope = mail.message.getEnvelope();
        let messageId = mail.message.messageId();
        let recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
          recipients.push("...and " + recipients.splice(2).length + " more");
        }
        this.logger.info(
          {
            tnx: "send",
            messageId,
            cid: this.id
          },
          "Sending message %s using #%s to <%s>",
          messageId,
          this.id,
          recipients.join(", ")
        );
        if (mail.data.dsn) {
          envelope.dsn = mail.data.dsn;
        }
        if (mail.data.requireTLSExtensionEnabled) {
          envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
        }
        this.connection.send(envelope, mail.message.createReadStream(), (err, info3) => {
          this.messages++;
          if (err) {
            this.connection.close();
            this.emit("error", err);
            return callback(err);
          }
          info3.envelope = {
            from: envelope.from,
            to: envelope.to
          };
          info3.messageId = messageId;
          setImmediate(() => {
            let err2;
            if (this.messages >= this.options.maxMessages) {
              err2 = new Error("Resource exhausted");
              err2.code = "EMAXLIMIT";
              this.connection.close();
              this.emit("error", err2);
            } else {
              this.pool._checkRateLimit(() => {
                this.available = true;
                this.emit("available");
              });
            }
          });
          callback(null, info3);
        });
      }
      /**
       * Closes the connection
       */
      close() {
        this._connected = false;
        if (this.auth && this.auth.oauth2) {
          this.auth.oauth2.removeAllListeners();
        }
        if (this.connection) {
          this.connection.close();
        }
        this.emit("close");
      }
    };
    module.exports = PoolResource;
  }
});

// ../node_modules/nodemailer/lib/well-known/services.json
var require_services = __commonJS({
  "../node_modules/nodemailer/lib/well-known/services.json"(exports, module) {
    module.exports = {
      "1und1": {
        description: "1&1 Mail (German hosting provider)",
        host: "smtp.1und1.de",
        port: 465,
        secure: true,
        authMethod: "LOGIN"
      },
      "126": {
        description: "126 Mail (NetEase)",
        host: "smtp.126.com",
        port: 465,
        secure: true
      },
      "163": {
        description: "163 Mail (NetEase)",
        host: "smtp.163.com",
        port: 465,
        secure: true
      },
      Aliyun: {
        description: "Alibaba Cloud Mail",
        domains: ["aliyun.com"],
        host: "smtp.aliyun.com",
        port: 465,
        secure: true
      },
      AliyunQiye: {
        description: "Alibaba Cloud Enterprise Mail",
        host: "smtp.qiye.aliyun.com",
        port: 465,
        secure: true
      },
      AOL: {
        description: "AOL Mail",
        domains: ["aol.com"],
        host: "smtp.aol.com",
        port: 587
      },
      Aruba: {
        description: "Aruba PEC (Italian email provider)",
        domains: ["aruba.it", "pec.aruba.it"],
        aliases: ["Aruba PEC"],
        host: "smtps.aruba.it",
        port: 465,
        secure: true,
        authMethod: "LOGIN"
      },
      Bluewin: {
        description: "Bluewin (Swiss email provider)",
        host: "smtpauths.bluewin.ch",
        domains: ["bluewin.ch"],
        port: 465
      },
      BOL: {
        description: "BOL Mail (Brazilian provider)",
        domains: ["bol.com.br"],
        host: "smtp.bol.com.br",
        port: 587,
        requireTLS: true
      },
      DebugMail: {
        description: "DebugMail (email testing service)",
        host: "debugmail.io",
        port: 25
      },
      Disroot: {
        description: "Disroot (privacy-focused provider)",
        domains: ["disroot.org"],
        host: "disroot.org",
        port: 587,
        secure: false,
        authMethod: "LOGIN"
      },
      DynectEmail: {
        description: "Dyn Email Delivery",
        aliases: ["Dynect"],
        host: "smtp.dynect.net",
        port: 25
      },
      ElasticEmail: {
        description: "Elastic Email",
        aliases: ["Elastic Email"],
        host: "smtp.elasticemail.com",
        port: 465,
        secure: true
      },
      Ethereal: {
        description: "Ethereal Email (email testing service)",
        aliases: ["ethereal.email"],
        host: "smtp.ethereal.email",
        port: 587
      },
      FastMail: {
        description: "FastMail",
        domains: ["fastmail.fm"],
        host: "smtp.fastmail.com",
        port: 465,
        secure: true
      },
      "Feishu Mail": {
        description: "Feishu Mail (Lark)",
        aliases: ["Feishu", "FeishuMail"],
        domains: ["www.feishu.cn"],
        host: "smtp.feishu.cn",
        port: 465,
        secure: true
      },
      "Forward Email": {
        description: "Forward Email (email forwarding service)",
        aliases: ["FE", "ForwardEmail"],
        domains: ["forwardemail.net"],
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true
      },
      GandiMail: {
        description: "Gandi Mail",
        aliases: ["Gandi", "Gandi Mail"],
        host: "mail.gandi.net",
        port: 587
      },
      Gmail: {
        description: "Gmail",
        aliases: ["Google Mail"],
        domains: ["gmail.com", "googlemail.com"],
        host: "smtp.gmail.com",
        port: 465,
        secure: true
      },
      GMX: {
        description: "GMX Mail",
        domains: ["gmx.com", "gmx.net", "gmx.de"],
        host: "mail.gmx.com",
        port: 587
      },
      Godaddy: {
        description: "GoDaddy Email (US)",
        host: "smtpout.secureserver.net",
        port: 25
      },
      GodaddyAsia: {
        description: "GoDaddy Email (Asia)",
        host: "smtp.asia.secureserver.net",
        port: 25
      },
      GodaddyEurope: {
        description: "GoDaddy Email (Europe)",
        host: "smtp.europe.secureserver.net",
        port: 25
      },
      "hot.ee": {
        description: "Hot.ee (Estonian email provider)",
        host: "mail.hot.ee"
      },
      Hotmail: {
        description: "Outlook.com / Hotmail",
        aliases: ["Outlook", "Outlook.com", "Hotmail.com"],
        domains: ["hotmail.com", "outlook.com"],
        host: "smtp-mail.outlook.com",
        port: 587
      },
      iCloud: {
        description: "iCloud Mail",
        aliases: ["Me", "Mac"],
        domains: ["me.com", "mac.com"],
        host: "smtp.mail.me.com",
        port: 587
      },
      Infomaniak: {
        description: "Infomaniak Mail (Swiss hosting provider)",
        host: "mail.infomaniak.com",
        domains: ["ik.me", "ikmail.com", "etik.com"],
        port: 587
      },
      KolabNow: {
        description: "KolabNow (secure email service)",
        domains: ["kolabnow.com"],
        aliases: ["Kolab"],
        host: "smtp.kolabnow.com",
        port: 465,
        secure: true,
        authMethod: "LOGIN"
      },
      Loopia: {
        description: "Loopia (Swedish hosting provider)",
        host: "mailcluster.loopia.se",
        port: 465
      },
      Loops: {
        description: "Loops",
        host: "smtp.loops.so",
        port: 587
      },
      "mail.ee": {
        description: "Mail.ee (Estonian email provider)",
        host: "smtp.mail.ee"
      },
      "Mail.ru": {
        description: "Mail.ru",
        host: "smtp.mail.ru",
        port: 465,
        secure: true
      },
      "Mailcatch.app": {
        description: "Mailcatch (email testing service)",
        host: "sandbox-smtp.mailcatch.app",
        port: 2525
      },
      Maildev: {
        description: "MailDev (local email testing)",
        port: 1025,
        ignoreTLS: true
      },
      MailerSend: {
        description: "MailerSend",
        host: "smtp.mailersend.net",
        port: 587
      },
      Mailgun: {
        description: "Mailgun",
        host: "smtp.mailgun.org",
        port: 465,
        secure: true
      },
      Mailjet: {
        description: "Mailjet",
        host: "in.mailjet.com",
        port: 587
      },
      Mailosaur: {
        description: "Mailosaur (email testing service)",
        host: "mailosaur.io",
        port: 25
      },
      Mailtrap: {
        description: "Mailtrap",
        host: "live.smtp.mailtrap.io",
        port: 587
      },
      Mandrill: {
        description: "Mandrill (by Mailchimp)",
        host: "smtp.mandrillapp.com",
        port: 587
      },
      Naver: {
        description: "Naver Mail (Korean email provider)",
        host: "smtp.naver.com",
        port: 587
      },
      OhMySMTP: {
        description: "OhMySMTP (email delivery service)",
        host: "smtp.ohmysmtp.com",
        port: 587,
        secure: false
      },
      One: {
        description: "One.com Email",
        host: "send.one.com",
        port: 465,
        secure: true
      },
      OpenMailBox: {
        description: "OpenMailBox",
        aliases: ["OMB", "openmailbox.org"],
        host: "smtp.openmailbox.org",
        port: 465,
        secure: true
      },
      Outlook365: {
        description: "Microsoft 365 / Office 365",
        host: "smtp.office365.com",
        port: 587,
        secure: false
      },
      Postmark: {
        description: "Postmark",
        aliases: ["PostmarkApp"],
        host: "smtp.postmarkapp.com",
        port: 2525
      },
      Proton: {
        description: "Proton Mail",
        aliases: ["ProtonMail", "Proton.me", "Protonmail.com", "Protonmail.ch"],
        domains: ["proton.me", "protonmail.com", "pm.me", "protonmail.ch"],
        host: "smtp.protonmail.ch",
        port: 587,
        requireTLS: true
      },
      "qiye.aliyun": {
        description: "Alibaba Mail Enterprise Edition",
        host: "smtp.mxhichina.com",
        port: "465",
        secure: true
      },
      QQ: {
        description: "QQ Mail",
        domains: ["qq.com"],
        host: "smtp.qq.com",
        port: 465,
        secure: true
      },
      QQex: {
        description: "QQ Enterprise Mail",
        aliases: ["QQ Enterprise"],
        domains: ["exmail.qq.com"],
        host: "smtp.exmail.qq.com",
        port: 465,
        secure: true
      },
      Resend: {
        description: "Resend",
        host: "smtp.resend.com",
        port: 465,
        secure: true
      },
      Runbox: {
        description: "Runbox (Norwegian email provider)",
        domains: ["runbox.com"],
        host: "smtp.runbox.com",
        port: 465,
        secure: true
      },
      SendCloud: {
        description: "SendCloud (Chinese email delivery)",
        host: "smtp.sendcloud.net",
        port: 2525
      },
      SendGrid: {
        description: "SendGrid",
        host: "smtp.sendgrid.net",
        port: 587
      },
      SendinBlue: {
        description: "Brevo (formerly Sendinblue)",
        aliases: ["Brevo"],
        host: "smtp-relay.brevo.com",
        port: 587
      },
      SendPulse: {
        description: "SendPulse",
        host: "smtp-pulse.com",
        port: 465,
        secure: true
      },
      SES: {
        description: "AWS SES US East (N. Virginia)",
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-NORTHEAST-1": {
        description: "AWS SES Asia Pacific (Tokyo)",
        host: "email-smtp.ap-northeast-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-NORTHEAST-2": {
        description: "AWS SES Asia Pacific (Seoul)",
        host: "email-smtp.ap-northeast-2.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-NORTHEAST-3": {
        description: "AWS SES Asia Pacific (Osaka)",
        host: "email-smtp.ap-northeast-3.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-SOUTH-1": {
        description: "AWS SES Asia Pacific (Mumbai)",
        host: "email-smtp.ap-south-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-SOUTHEAST-1": {
        description: "AWS SES Asia Pacific (Singapore)",
        host: "email-smtp.ap-southeast-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-AP-SOUTHEAST-2": {
        description: "AWS SES Asia Pacific (Sydney)",
        host: "email-smtp.ap-southeast-2.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-CA-CENTRAL-1": {
        description: "AWS SES Canada (Central)",
        host: "email-smtp.ca-central-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-EU-CENTRAL-1": {
        description: "AWS SES Europe (Frankfurt)",
        host: "email-smtp.eu-central-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-EU-NORTH-1": {
        description: "AWS SES Europe (Stockholm)",
        host: "email-smtp.eu-north-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-EU-WEST-1": {
        description: "AWS SES Europe (Ireland)",
        host: "email-smtp.eu-west-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-EU-WEST-2": {
        description: "AWS SES Europe (London)",
        host: "email-smtp.eu-west-2.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-EU-WEST-3": {
        description: "AWS SES Europe (Paris)",
        host: "email-smtp.eu-west-3.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-SA-EAST-1": {
        description: "AWS SES South America (S\xE3o Paulo)",
        host: "email-smtp.sa-east-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-EAST-1": {
        description: "AWS SES US East (N. Virginia)",
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-EAST-2": {
        description: "AWS SES US East (Ohio)",
        host: "email-smtp.us-east-2.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-GOV-EAST-1": {
        description: "AWS SES GovCloud (US-East)",
        host: "email-smtp.us-gov-east-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-GOV-WEST-1": {
        description: "AWS SES GovCloud (US-West)",
        host: "email-smtp.us-gov-west-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-WEST-1": {
        description: "AWS SES US West (N. California)",
        host: "email-smtp.us-west-1.amazonaws.com",
        port: 465,
        secure: true
      },
      "SES-US-WEST-2": {
        description: "AWS SES US West (Oregon)",
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 465,
        secure: true
      },
      Seznam: {
        description: "Seznam Email (Czech email provider)",
        aliases: ["Seznam Email"],
        domains: ["seznam.cz", "email.cz", "post.cz", "spoluzaci.cz"],
        host: "smtp.seznam.cz",
        port: 465,
        secure: true
      },
      SMTP2GO: {
        description: "SMTP2GO",
        host: "mail.smtp2go.com",
        port: 2525
      },
      Sparkpost: {
        description: "SparkPost",
        aliases: ["SparkPost", "SparkPost Mail"],
        domains: ["sparkpost.com"],
        host: "smtp.sparkpostmail.com",
        port: 587,
        secure: false
      },
      Tipimail: {
        description: "Tipimail (email delivery service)",
        host: "smtp.tipimail.com",
        port: 587
      },
      Tutanota: {
        description: "Tutanota (Tuta Mail)",
        domains: ["tutanota.com", "tuta.com", "tutanota.de", "tuta.io"],
        host: "smtp.tutanota.com",
        port: 465,
        secure: true
      },
      Yahoo: {
        description: "Yahoo Mail",
        domains: ["yahoo.com"],
        host: "smtp.mail.yahoo.com",
        port: 465,
        secure: true
      },
      Yandex: {
        description: "Yandex Mail",
        domains: ["yandex.ru"],
        host: "smtp.yandex.ru",
        port: 465,
        secure: true
      },
      Zimbra: {
        description: "Zimbra Mail Server",
        aliases: ["Zimbra Collaboration"],
        host: "smtp.zimbra.com",
        port: 587,
        requireTLS: true
      },
      Zoho: {
        description: "Zoho Mail",
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        authMethod: "LOGIN"
      }
    };
  }
});

// ../node_modules/nodemailer/lib/well-known/index.js
var require_well_known = __commonJS({
  "../node_modules/nodemailer/lib/well-known/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var services = require_services();
    var normalized = {};
    Object.keys(services).forEach((key) => {
      let service = services[key];
      normalized[normalizeKey(key)] = normalizeService(service);
      [].concat(service.aliases || []).forEach((alias) => {
        normalized[normalizeKey(alias)] = normalizeService(service);
      });
      [].concat(service.domains || []).forEach((domain2) => {
        normalized[normalizeKey(domain2)] = normalizeService(service);
      });
    });
    function normalizeKey(key) {
      return key.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
    }
    __name(normalizeKey, "normalizeKey");
    function normalizeService(service) {
      let filter = ["domains", "aliases"];
      let response = {};
      Object.keys(service).forEach((key) => {
        if (filter.indexOf(key) < 0) {
          response[key] = service[key];
        }
      });
      return response;
    }
    __name(normalizeService, "normalizeService");
    module.exports = function(key) {
      key = normalizeKey(key.split("@").pop());
      return normalized[key] || false;
    };
  }
});

// ../node_modules/nodemailer/lib/smtp-pool/index.js
var require_smtp_pool = __commonJS({
  "../node_modules/nodemailer/lib/smtp-pool/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EventEmitter3 = require_events();
    var PoolResource = require_pool_resource();
    var SMTPConnection = require_smtp_connection();
    var wellKnown = require_well_known();
    var shared = require_shared();
    var packageData = require_package();
    var SMTPPool = class extends EventEmitter3 {
      static {
        __name(this, "SMTPPool");
      }
      constructor(options) {
        super();
        options = options || {};
        if (typeof options === "string") {
          options = {
            url: options
          };
        }
        let urlData;
        let service = options.service;
        if (typeof options.getSocket === "function") {
          this.getSocket = options.getSocket;
        }
        if (options.url) {
          urlData = shared.parseConnectionUrl(options.url);
          service = service || urlData.service;
        }
        this.options = shared.assign(
          false,
          // create new object
          options,
          // regular options
          urlData,
          // url options
          service && wellKnown(service)
          // wellknown options
        );
        this.options.maxConnections = this.options.maxConnections || 5;
        this.options.maxMessages = this.options.maxMessages || 100;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "smtp-pool"
        });
        let connection = new SMTPConnection(this.options);
        this.name = "SMTP (pool)";
        this.version = packageData.version + "[client:" + connection.version + "]";
        this._rateLimit = {
          counter: 0,
          timeout: null,
          waiting: [],
          checkpoint: false,
          delta: Number(this.options.rateDelta) || 1e3,
          limit: Number(this.options.rateLimit) || 0
        };
        this._closed = false;
        this._queue = [];
        this._connections = [];
        this._connectionCounter = 0;
        this.idling = true;
        setImmediate(() => {
          if (this.idling) {
            this.emit("idle");
          }
        });
      }
      /**
       * Placeholder function for creating proxy sockets. This method immediatelly returns
       * without a socket
       *
       * @param {Object} options Connection options
       * @param {Function} callback Callback function to run with the socket keys
       */
      getSocket(options, callback) {
        return setImmediate(() => callback(null, false));
      }
      /**
       * Queues an e-mail to be sent using the selected settings
       *
       * @param {Object} mail Mail object
       * @param {Function} callback Callback function
       */
      send(mail, callback) {
        if (this._closed) {
          return false;
        }
        this._queue.push({
          mail,
          requeueAttempts: 0,
          callback
        });
        if (this.idling && this._queue.length >= this.options.maxConnections) {
          this.idling = false;
        }
        setImmediate(() => this._processMessages());
        return true;
      }
      /**
       * Closes all connections in the pool. If there is a message being sent, the connection
       * is closed later
       */
      close() {
        let connection;
        let len = this._connections.length;
        this._closed = true;
        clearTimeout(this._rateLimit.timeout);
        if (!len && !this._queue.length) {
          return;
        }
        for (let i = len - 1; i >= 0; i--) {
          if (this._connections[i] && this._connections[i].available) {
            connection = this._connections[i];
            connection.close();
            this.logger.info(
              {
                tnx: "connection",
                cid: connection.id,
                action: "removed"
              },
              "Connection #%s removed",
              connection.id
            );
          }
        }
        if (len && !this._connections.length) {
          this.logger.debug(
            {
              tnx: "connection"
            },
            "All connections removed"
          );
        }
        if (!this._queue.length) {
          return;
        }
        let invokeCallbacks = /* @__PURE__ */ __name(() => {
          if (!this._queue.length) {
            this.logger.debug(
              {
                tnx: "connection"
              },
              "Pending queue entries cleared"
            );
            return;
          }
          let entry = this._queue.shift();
          if (entry && typeof entry.callback === "function") {
            try {
              entry.callback(new Error("Connection pool was closed"));
            } catch (E) {
              this.logger.error(
                {
                  err: E,
                  tnx: "callback",
                  cid: connection.id
                },
                "Callback error for #%s: %s",
                connection.id,
                E.message
              );
            }
          }
          setImmediate(invokeCallbacks);
        }, "invokeCallbacks");
        setImmediate(invokeCallbacks);
      }
      /**
       * Check the queue and available connections. If there is a message to be sent and there is
       * an available connection, then use this connection to send the mail
       */
      _processMessages() {
        let connection;
        let i, len;
        if (this._closed) {
          return;
        }
        if (!this._queue.length) {
          if (!this.idling) {
            this.idling = true;
            this.emit("idle");
          }
          return;
        }
        for (i = 0, len = this._connections.length; i < len; i++) {
          if (this._connections[i].available) {
            connection = this._connections[i];
            break;
          }
        }
        if (!connection && this._connections.length < this.options.maxConnections) {
          connection = this._createConnection();
        }
        if (!connection) {
          this.idling = false;
          return;
        }
        if (!this.idling && this._queue.length < this.options.maxConnections) {
          this.idling = true;
          this.emit("idle");
        }
        let entry = connection.queueEntry = this._queue.shift();
        entry.messageId = (connection.queueEntry.mail.message.getHeader("message-id") || "").replace(/[<>\s]/g, "");
        connection.available = false;
        this.logger.debug(
          {
            tnx: "pool",
            cid: connection.id,
            messageId: entry.messageId,
            action: "assign"
          },
          "Assigned message <%s> to #%s (%s)",
          entry.messageId,
          connection.id,
          connection.messages + 1
        );
        if (this._rateLimit.limit) {
          this._rateLimit.counter++;
          if (!this._rateLimit.checkpoint) {
            this._rateLimit.checkpoint = Date.now();
          }
        }
        connection.send(entry.mail, (err, info3) => {
          if (entry === connection.queueEntry) {
            try {
              entry.callback(err, info3);
            } catch (E) {
              this.logger.error(
                {
                  err: E,
                  tnx: "callback",
                  cid: connection.id
                },
                "Callback error for #%s: %s",
                connection.id,
                E.message
              );
            }
            connection.queueEntry = false;
          }
        });
      }
      /**
       * Creates a new pool resource
       */
      _createConnection() {
        let connection = new PoolResource(this);
        connection.id = ++this._connectionCounter;
        this.logger.info(
          {
            tnx: "pool",
            cid: connection.id,
            action: "conection"
          },
          "Created new pool resource #%s",
          connection.id
        );
        connection.on("available", () => {
          this.logger.debug(
            {
              tnx: "connection",
              cid: connection.id,
              action: "available"
            },
            "Connection #%s became available",
            connection.id
          );
          if (this._closed) {
            this.close();
          } else {
            this._processMessages();
          }
        });
        connection.once("error", (err) => {
          if (err.code !== "EMAXLIMIT") {
            this.logger.error(
              {
                err,
                tnx: "pool",
                cid: connection.id
              },
              "Pool Error for #%s: %s",
              connection.id,
              err.message
            );
          } else {
            this.logger.debug(
              {
                tnx: "pool",
                cid: connection.id,
                action: "maxlimit"
              },
              "Max messages limit exchausted for #%s",
              connection.id
            );
          }
          if (connection.queueEntry) {
            try {
              connection.queueEntry.callback(err);
            } catch (E) {
              this.logger.error(
                {
                  err: E,
                  tnx: "callback",
                  cid: connection.id
                },
                "Callback error for #%s: %s",
                connection.id,
                E.message
              );
            }
            connection.queueEntry = false;
          }
          this._removeConnection(connection);
          this._continueProcessing();
        });
        connection.once("close", () => {
          this.logger.info(
            {
              tnx: "connection",
              cid: connection.id,
              action: "closed"
            },
            "Connection #%s was closed",
            connection.id
          );
          this._removeConnection(connection);
          if (connection.queueEntry) {
            setTimeout(() => {
              if (connection.queueEntry) {
                if (this._shouldRequeuOnConnectionClose(connection.queueEntry)) {
                  this._requeueEntryOnConnectionClose(connection);
                } else {
                  this._failDeliveryOnConnectionClose(connection);
                }
              }
              this._continueProcessing();
            }, 50);
          } else {
            if (!this._closed && this.idling && !this._connections.length) {
              this.emit("clear");
            }
            this._continueProcessing();
          }
        });
        this._connections.push(connection);
        return connection;
      }
      _shouldRequeuOnConnectionClose(queueEntry) {
        if (this.options.maxRequeues === void 0 || this.options.maxRequeues < 0) {
          return true;
        }
        return queueEntry.requeueAttempts < this.options.maxRequeues;
      }
      _failDeliveryOnConnectionClose(connection) {
        if (connection.queueEntry && connection.queueEntry.callback) {
          try {
            connection.queueEntry.callback(new Error("Reached maximum number of retries after connection was closed"));
          } catch (E) {
            this.logger.error(
              {
                err: E,
                tnx: "callback",
                messageId: connection.queueEntry.messageId,
                cid: connection.id
              },
              "Callback error for #%s: %s",
              connection.id,
              E.message
            );
          }
          connection.queueEntry = false;
        }
      }
      _requeueEntryOnConnectionClose(connection) {
        connection.queueEntry.requeueAttempts = connection.queueEntry.requeueAttempts + 1;
        this.logger.debug(
          {
            tnx: "pool",
            cid: connection.id,
            messageId: connection.queueEntry.messageId,
            action: "requeue"
          },
          "Re-queued message <%s> for #%s. Attempt: #%s",
          connection.queueEntry.messageId,
          connection.id,
          connection.queueEntry.requeueAttempts
        );
        this._queue.unshift(connection.queueEntry);
        connection.queueEntry = false;
      }
      /**
       * Continue to process message if the pool hasn't closed
       */
      _continueProcessing() {
        if (this._closed) {
          this.close();
        } else {
          setTimeout(() => this._processMessages(), 100);
        }
      }
      /**
       * Remove resource from pool
       *
       * @param {Object} connection The PoolResource to remove
       */
      _removeConnection(connection) {
        let index = this._connections.indexOf(connection);
        if (index !== -1) {
          this._connections.splice(index, 1);
        }
      }
      /**
       * Checks if connections have hit current rate limit and if so, queues the availability callback
       *
       * @param {Function} callback Callback function to run once rate limiter has been cleared
       */
      _checkRateLimit(callback) {
        if (!this._rateLimit.limit) {
          return callback();
        }
        let now = Date.now();
        if (this._rateLimit.counter < this._rateLimit.limit) {
          return callback();
        }
        this._rateLimit.waiting.push(callback);
        if (this._rateLimit.checkpoint <= now - this._rateLimit.delta) {
          return this._clearRateLimit();
        } else if (!this._rateLimit.timeout) {
          this._rateLimit.timeout = setTimeout(() => this._clearRateLimit(), this._rateLimit.delta - (now - this._rateLimit.checkpoint));
          this._rateLimit.checkpoint = now;
        }
      }
      /**
       * Clears current rate limit limitation and runs paused callback
       */
      _clearRateLimit() {
        clearTimeout(this._rateLimit.timeout);
        this._rateLimit.timeout = null;
        this._rateLimit.counter = 0;
        this._rateLimit.checkpoint = false;
        while (this._rateLimit.waiting.length) {
          let cb = this._rateLimit.waiting.shift();
          setImmediate(cb);
        }
      }
      /**
       * Returns true if there are free slots in the queue
       */
      isIdle() {
        return this.idling;
      }
      /**
       * Verifies SMTP configuration
       *
       * @param {Function} callback Callback function
       */
      verify(callback) {
        let promise;
        if (!callback) {
          promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
          });
        }
        let auth = new PoolResource(this).auth;
        this.getSocket(this.options, (err, socketOptions) => {
          if (err) {
            return callback(err);
          }
          let options = this.options;
          if (socketOptions && socketOptions.connection) {
            this.logger.info(
              {
                tnx: "proxy",
                remoteAddress: socketOptions.connection.remoteAddress,
                remotePort: socketOptions.connection.remotePort,
                destHost: options.host || "",
                destPort: options.port || "",
                action: "connected"
              },
              "Using proxied socket from %s:%s to %s:%s",
              socketOptions.connection.remoteAddress,
              socketOptions.connection.remotePort,
              options.host || "",
              options.port || ""
            );
            options = shared.assign(false, options);
            Object.keys(socketOptions).forEach((key) => {
              options[key] = socketOptions[key];
            });
          }
          let connection = new SMTPConnection(options);
          let returned = false;
          connection.once("error", (err2) => {
            if (returned) {
              return;
            }
            returned = true;
            connection.close();
            return callback(err2);
          });
          connection.once("end", () => {
            if (returned) {
              return;
            }
            returned = true;
            return callback(new Error("Connection closed"));
          });
          let finalize = /* @__PURE__ */ __name(() => {
            if (returned) {
              return;
            }
            returned = true;
            connection.quit();
            return callback(null, true);
          }, "finalize");
          connection.connect(() => {
            if (returned) {
              return;
            }
            if (auth && (connection.allowsAuth || options.forceAuth)) {
              connection.login(auth, (err2) => {
                if (returned) {
                  return;
                }
                if (err2) {
                  returned = true;
                  connection.close();
                  return callback(err2);
                }
                finalize();
              });
            } else if (!auth && connection.allowsAuth && options.forceAuth) {
              let err2 = new Error("Authentication info was not provided");
              err2.code = "NoAuth";
              returned = true;
              connection.close();
              return callback(err2);
            } else {
              finalize();
            }
          });
        });
        return promise;
      }
    };
    module.exports = SMTPPool;
  }
});

// ../node_modules/nodemailer/lib/smtp-transport/index.js
var require_smtp_transport = __commonJS({
  "../node_modules/nodemailer/lib/smtp-transport/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EventEmitter3 = require_events();
    var SMTPConnection = require_smtp_connection();
    var wellKnown = require_well_known();
    var shared = require_shared();
    var XOAuth2 = require_xoauth2();
    var packageData = require_package();
    var SMTPTransport = class extends EventEmitter3 {
      static {
        __name(this, "SMTPTransport");
      }
      constructor(options) {
        super();
        options = options || {};
        if (typeof options === "string") {
          options = {
            url: options
          };
        }
        let urlData;
        let service = options.service;
        if (typeof options.getSocket === "function") {
          this.getSocket = options.getSocket;
        }
        if (options.url) {
          urlData = shared.parseConnectionUrl(options.url);
          service = service || urlData.service;
        }
        this.options = shared.assign(
          false,
          // create new object
          options,
          // regular options
          urlData,
          // url options
          service && wellKnown(service)
          // wellknown options
        );
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "smtp-transport"
        });
        let connection = new SMTPConnection(this.options);
        this.name = "SMTP";
        this.version = packageData.version + "[client:" + connection.version + "]";
        if (this.options.auth) {
          this.auth = this.getAuth({});
        }
      }
      /**
       * Placeholder function for creating proxy sockets. This method immediatelly returns
       * without a socket
       *
       * @param {Object} options Connection options
       * @param {Function} callback Callback function to run with the socket keys
       */
      getSocket(options, callback) {
        return setImmediate(() => callback(null, false));
      }
      getAuth(authOpts) {
        if (!authOpts) {
          return this.auth;
        }
        let hasAuth = false;
        let authData = {};
        if (this.options.auth && typeof this.options.auth === "object") {
          Object.keys(this.options.auth).forEach((key) => {
            hasAuth = true;
            authData[key] = this.options.auth[key];
          });
        }
        if (authOpts && typeof authOpts === "object") {
          Object.keys(authOpts).forEach((key) => {
            hasAuth = true;
            authData[key] = authOpts[key];
          });
        }
        if (!hasAuth) {
          return false;
        }
        switch ((authData.type || "").toString().toUpperCase()) {
          case "OAUTH2": {
            if (!authData.service && !authData.user) {
              return false;
            }
            let oauth2 = new XOAuth2(authData, this.logger);
            oauth2.provisionCallback = this.mailer && this.mailer.get("oauth2_provision_cb") || oauth2.provisionCallback;
            oauth2.on("token", (token) => this.mailer.emit("token", token));
            oauth2.on("error", (err) => this.emit("error", err));
            return {
              type: "OAUTH2",
              user: authData.user,
              oauth2,
              method: "XOAUTH2"
            };
          }
          default:
            return {
              type: (authData.type || "").toString().toUpperCase() || "LOGIN",
              user: authData.user,
              credentials: {
                user: authData.user || "",
                pass: authData.pass,
                options: authData.options
              },
              method: (authData.method || "").trim().toUpperCase() || this.options.authMethod || false
            };
        }
      }
      /**
       * Sends an e-mail using the selected settings
       *
       * @param {Object} mail Mail object
       * @param {Function} callback Callback function
       */
      send(mail, callback) {
        this.getSocket(this.options, (err, socketOptions) => {
          if (err) {
            return callback(err);
          }
          let returned = false;
          let options = this.options;
          if (socketOptions && socketOptions.connection) {
            this.logger.info(
              {
                tnx: "proxy",
                remoteAddress: socketOptions.connection.remoteAddress,
                remotePort: socketOptions.connection.remotePort,
                destHost: options.host || "",
                destPort: options.port || "",
                action: "connected"
              },
              "Using proxied socket from %s:%s to %s:%s",
              socketOptions.connection.remoteAddress,
              socketOptions.connection.remotePort,
              options.host || "",
              options.port || ""
            );
            options = shared.assign(false, options);
            Object.keys(socketOptions).forEach((key) => {
              options[key] = socketOptions[key];
            });
          }
          let connection = new SMTPConnection(options);
          connection.once("error", (err2) => {
            if (returned) {
              return;
            }
            returned = true;
            connection.close();
            return callback(err2);
          });
          connection.once("end", () => {
            if (returned) {
              return;
            }
            let timer = setTimeout(() => {
              if (returned) {
                return;
              }
              returned = true;
              let err2 = new Error("Unexpected socket close");
              if (connection && connection._socket && connection._socket.upgrading) {
                err2.code = "ETLS";
              }
              callback(err2);
            }, 1e3);
            try {
              timer.unref();
            } catch (_E) {
            }
          });
          let sendMessage = /* @__PURE__ */ __name(() => {
            let envelope = mail.message.getEnvelope();
            let messageId = mail.message.messageId();
            let recipients = [].concat(envelope.to || []);
            if (recipients.length > 3) {
              recipients.push("...and " + recipients.splice(2).length + " more");
            }
            if (mail.data.dsn) {
              envelope.dsn = mail.data.dsn;
            }
            if (mail.data.requireTLSExtensionEnabled) {
              envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
            }
            this.logger.info(
              {
                tnx: "send",
                messageId
              },
              "Sending message %s to <%s>",
              messageId,
              recipients.join(", ")
            );
            connection.send(envelope, mail.message.createReadStream(), (err2, info3) => {
              returned = true;
              connection.close();
              if (err2) {
                this.logger.error(
                  {
                    err: err2,
                    tnx: "send"
                  },
                  "Send error for %s: %s",
                  messageId,
                  err2.message
                );
                return callback(err2);
              }
              info3.envelope = {
                from: envelope.from,
                to: envelope.to
              };
              info3.messageId = messageId;
              try {
                return callback(null, info3);
              } catch (E) {
                this.logger.error(
                  {
                    err: E,
                    tnx: "callback"
                  },
                  "Callback error for %s: %s",
                  messageId,
                  E.message
                );
              }
            });
          }, "sendMessage");
          connection.connect(() => {
            if (returned) {
              return;
            }
            let auth = this.getAuth(mail.data.auth);
            if (auth && (connection.allowsAuth || options.forceAuth)) {
              connection.login(auth, (err2) => {
                if (auth && auth !== this.auth && auth.oauth2) {
                  auth.oauth2.removeAllListeners();
                }
                if (returned) {
                  return;
                }
                if (err2) {
                  returned = true;
                  connection.close();
                  return callback(err2);
                }
                sendMessage();
              });
            } else {
              sendMessage();
            }
          });
        });
      }
      /**
       * Verifies SMTP configuration
       *
       * @param {Function} callback Callback function
       */
      verify(callback) {
        let promise;
        if (!callback) {
          promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
          });
        }
        this.getSocket(this.options, (err, socketOptions) => {
          if (err) {
            return callback(err);
          }
          let options = this.options;
          if (socketOptions && socketOptions.connection) {
            this.logger.info(
              {
                tnx: "proxy",
                remoteAddress: socketOptions.connection.remoteAddress,
                remotePort: socketOptions.connection.remotePort,
                destHost: options.host || "",
                destPort: options.port || "",
                action: "connected"
              },
              "Using proxied socket from %s:%s to %s:%s",
              socketOptions.connection.remoteAddress,
              socketOptions.connection.remotePort,
              options.host || "",
              options.port || ""
            );
            options = shared.assign(false, options);
            Object.keys(socketOptions).forEach((key) => {
              options[key] = socketOptions[key];
            });
          }
          let connection = new SMTPConnection(options);
          let returned = false;
          connection.once("error", (err2) => {
            if (returned) {
              return;
            }
            returned = true;
            connection.close();
            return callback(err2);
          });
          connection.once("end", () => {
            if (returned) {
              return;
            }
            returned = true;
            return callback(new Error("Connection closed"));
          });
          let finalize = /* @__PURE__ */ __name(() => {
            if (returned) {
              return;
            }
            returned = true;
            connection.quit();
            return callback(null, true);
          }, "finalize");
          connection.connect(() => {
            if (returned) {
              return;
            }
            let authData = this.getAuth({});
            if (authData && (connection.allowsAuth || options.forceAuth)) {
              connection.login(authData, (err2) => {
                if (returned) {
                  return;
                }
                if (err2) {
                  returned = true;
                  connection.close();
                  return callback(err2);
                }
                finalize();
              });
            } else if (!authData && connection.allowsAuth && options.forceAuth) {
              let err2 = new Error("Authentication info was not provided");
              err2.code = "NoAuth";
              returned = true;
              connection.close();
              return callback(err2);
            } else {
              finalize();
            }
          });
        });
        return promise;
      }
      /**
       * Releases resources
       */
      close() {
        if (this.auth && this.auth.oauth2) {
          this.auth.oauth2.removeAllListeners();
        }
        this.emit("close");
      }
    };
    module.exports = SMTPTransport;
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/child_process.mjs
var ChildProcess, _forkChild, exec, execFile, execFileSync, execSync, fork, spawn, spawnSync, child_process_default;
var init_child_process = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/child_process.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    ChildProcess = /* @__PURE__ */ notImplementedClass("child_process.ChildProcess");
    _forkChild = /* @__PURE__ */ notImplemented("child_process.ChildProcess");
    exec = /* @__PURE__ */ notImplemented("child_process.exec");
    execFile = /* @__PURE__ */ notImplemented("child_process.execFile");
    execFileSync = /* @__PURE__ */ notImplemented("child_process.execFileSync");
    execSync = /* @__PURE__ */ notImplemented("child_process.execSyn");
    fork = /* @__PURE__ */ notImplemented("child_process.fork");
    spawn = /* @__PURE__ */ notImplemented("child_process.spawn");
    spawnSync = /* @__PURE__ */ notImplemented("child_process.spawnSync");
    child_process_default = {
      ChildProcess,
      _forkChild,
      exec,
      execFile,
      execFileSync,
      execSync,
      fork,
      spawn,
      spawnSync
    };
  }
});

// node-built-in-modules:child_process
var require_child_process = __commonJS({
  "node-built-in-modules:child_process"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_child_process();
    module.exports = child_process_default;
  }
});

// ../node_modules/nodemailer/lib/sendmail-transport/index.js
var require_sendmail_transport = __commonJS({
  "../node_modules/nodemailer/lib/sendmail-transport/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var spawn2 = require_child_process().spawn;
    var packageData = require_package();
    var shared = require_shared();
    var SendmailTransport = class {
      static {
        __name(this, "SendmailTransport");
      }
      constructor(options) {
        options = options || {};
        this._spawn = spawn2;
        this.options = options || {};
        this.name = "Sendmail";
        this.version = packageData.version;
        this.path = "sendmail";
        this.args = false;
        this.winbreak = false;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "sendmail"
        });
        if (options) {
          if (typeof options === "string") {
            this.path = options;
          } else if (typeof options === "object") {
            if (options.path) {
              this.path = options.path;
            }
            if (Array.isArray(options.args)) {
              this.args = options.args;
            }
            this.winbreak = ["win", "windows", "dos", "\r\n"].includes((options.newline || "").toString().toLowerCase());
          }
        }
      }
      /**
       * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
       *
       * @param {Object} emailMessage MailComposer object
       * @param {Function} callback Callback function to run when the sending is completed
       */
      send(mail, done) {
        mail.message.keepBcc = true;
        let envelope = mail.data.envelope || mail.message.getEnvelope();
        let messageId = mail.message.messageId();
        let args;
        let sendmail;
        let returned;
        const hasInvalidAddresses = [].concat(envelope.from || []).concat(envelope.to || []).some((addr) => /^-/.test(addr));
        if (hasInvalidAddresses) {
          return done(new Error("Can not send mail. Invalid envelope addresses."));
        }
        if (this.args) {
          args = ["-i"].concat(this.args).concat(envelope.to);
        } else {
          args = ["-i"].concat(envelope.from ? ["-f", envelope.from] : []).concat(envelope.to);
        }
        let callback = /* @__PURE__ */ __name((err) => {
          if (returned) {
            return;
          }
          returned = true;
          if (typeof done === "function") {
            if (err) {
              return done(err);
            } else {
              return done(null, {
                envelope: mail.data.envelope || mail.message.getEnvelope(),
                messageId,
                response: "Messages queued for delivery"
              });
            }
          }
        }, "callback");
        try {
          sendmail = this._spawn(this.path, args);
        } catch (E) {
          this.logger.error(
            {
              err: E,
              tnx: "spawn",
              messageId
            },
            "Error occurred while spawning sendmail. %s",
            E.message
          );
          return callback(E);
        }
        if (sendmail) {
          sendmail.on("error", (err) => {
            this.logger.error(
              {
                err,
                tnx: "spawn",
                messageId
              },
              "Error occurred when sending message %s. %s",
              messageId,
              err.message
            );
            callback(err);
          });
          sendmail.once("exit", (code) => {
            if (!code) {
              return callback();
            }
            let err;
            if (code === 127) {
              err = new Error("Sendmail command not found, process exited with code " + code);
            } else {
              err = new Error("Sendmail exited with code " + code);
            }
            this.logger.error(
              {
                err,
                tnx: "stdin",
                messageId
              },
              "Error sending message %s to sendmail. %s",
              messageId,
              err.message
            );
            callback(err);
          });
          sendmail.once("close", callback);
          sendmail.stdin.on("error", (err) => {
            this.logger.error(
              {
                err,
                tnx: "stdin",
                messageId
              },
              "Error occurred when piping message %s to sendmail. %s",
              messageId,
              err.message
            );
            callback(err);
          });
          let recipients = [].concat(envelope.to || []);
          if (recipients.length > 3) {
            recipients.push("...and " + recipients.splice(2).length + " more");
          }
          this.logger.info(
            {
              tnx: "send",
              messageId
            },
            "Sending message %s to <%s>",
            messageId,
            recipients.join(", ")
          );
          let sourceStream = mail.message.createReadStream();
          sourceStream.once("error", (err) => {
            this.logger.error(
              {
                err,
                tnx: "stdin",
                messageId
              },
              "Error occurred when generating message %s. %s",
              messageId,
              err.message
            );
            sendmail.kill("SIGINT");
            callback(err);
          });
          sourceStream.pipe(sendmail.stdin);
        } else {
          return callback(new Error("sendmail was not found"));
        }
      }
    };
    module.exports = SendmailTransport;
  }
});

// ../node_modules/nodemailer/lib/stream-transport/index.js
var require_stream_transport = __commonJS({
  "../node_modules/nodemailer/lib/stream-transport/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var packageData = require_package();
    var shared = require_shared();
    var StreamTransport = class {
      static {
        __name(this, "StreamTransport");
      }
      constructor(options) {
        options = options || {};
        this.options = options || {};
        this.name = "StreamTransport";
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "stream-transport"
        });
        this.winbreak = ["win", "windows", "dos", "\r\n"].includes((options.newline || "").toString().toLowerCase());
      }
      /**
       * Compiles a mailcomposer message and forwards it to handler that sends it
       *
       * @param {Object} emailMessage MailComposer object
       * @param {Function} callback Callback function to run when the sending is completed
       */
      send(mail, done) {
        mail.message.keepBcc = true;
        let envelope = mail.data.envelope || mail.message.getEnvelope();
        let messageId = mail.message.messageId();
        let recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
          recipients.push("...and " + recipients.splice(2).length + " more");
        }
        this.logger.info(
          {
            tnx: "send",
            messageId
          },
          "Sending message %s to <%s> using %s line breaks",
          messageId,
          recipients.join(", "),
          this.winbreak ? "<CR><LF>" : "<LF>"
        );
        setImmediate(() => {
          let stream;
          try {
            stream = mail.message.createReadStream();
          } catch (E) {
            this.logger.error(
              {
                err: E,
                tnx: "send",
                messageId
              },
              "Creating send stream failed for %s. %s",
              messageId,
              E.message
            );
            return done(E);
          }
          if (!this.options.buffer) {
            stream.once("error", (err) => {
              this.logger.error(
                {
                  err,
                  tnx: "send",
                  messageId
                },
                "Failed creating message for %s. %s",
                messageId,
                err.message
              );
            });
            return done(null, {
              envelope: mail.data.envelope || mail.message.getEnvelope(),
              messageId,
              message: stream
            });
          }
          let chunks = [];
          let chunklen = 0;
          stream.on("readable", () => {
            let chunk;
            while ((chunk = stream.read()) !== null) {
              chunks.push(chunk);
              chunklen += chunk.length;
            }
          });
          stream.once("error", (err) => {
            this.logger.error(
              {
                err,
                tnx: "send",
                messageId
              },
              "Failed creating message for %s. %s",
              messageId,
              err.message
            );
            return done(err);
          });
          stream.on(
            "end",
            () => done(null, {
              envelope: mail.data.envelope || mail.message.getEnvelope(),
              messageId,
              message: Buffer.concat(chunks, chunklen)
            })
          );
        });
      }
    };
    module.exports = StreamTransport;
  }
});

// ../node_modules/nodemailer/lib/json-transport/index.js
var require_json_transport = __commonJS({
  "../node_modules/nodemailer/lib/json-transport/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var packageData = require_package();
    var shared = require_shared();
    var JSONTransport = class {
      static {
        __name(this, "JSONTransport");
      }
      constructor(options) {
        options = options || {};
        this.options = options || {};
        this.name = "JSONTransport";
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "json-transport"
        });
      }
      /**
       * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
       *
       * @param {Object} emailMessage MailComposer object
       * @param {Function} callback Callback function to run when the sending is completed
       */
      send(mail, done) {
        mail.message.keepBcc = true;
        let envelope = mail.data.envelope || mail.message.getEnvelope();
        let messageId = mail.message.messageId();
        let recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
          recipients.push("...and " + recipients.splice(2).length + " more");
        }
        this.logger.info(
          {
            tnx: "send",
            messageId
          },
          "Composing JSON structure of %s to <%s>",
          messageId,
          recipients.join(", ")
        );
        setImmediate(() => {
          mail.normalize((err, data) => {
            if (err) {
              this.logger.error(
                {
                  err,
                  tnx: "send",
                  messageId
                },
                "Failed building JSON structure for %s. %s",
                messageId,
                err.message
              );
              return done(err);
            }
            delete data.envelope;
            delete data.normalizedHeaders;
            return done(null, {
              envelope,
              messageId,
              message: this.options.skipEncoding ? data : JSON.stringify(data)
            });
          });
        });
      }
    };
    module.exports = JSONTransport;
  }
});

// ../node_modules/nodemailer/lib/ses-transport/index.js
var require_ses_transport = __commonJS({
  "../node_modules/nodemailer/lib/ses-transport/index.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EventEmitter3 = require_events();
    var packageData = require_package();
    var shared = require_shared();
    var LeWindows = require_le_windows();
    var MimeNode = require_mime_node();
    var SESTransport = class extends EventEmitter3 {
      static {
        __name(this, "SESTransport");
      }
      constructor(options) {
        super();
        options = options || {};
        this.options = options || {};
        this.ses = this.options.SES;
        this.name = "SESTransport";
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
          component: this.options.component || "ses-transport"
        });
      }
      getRegion(cb) {
        if (this.ses.sesClient.config && typeof this.ses.sesClient.config.region === "function") {
          return this.ses.sesClient.config.region().then((region) => cb(null, region)).catch((err) => cb(err));
        }
        return cb(null, false);
      }
      /**
       * Compiles a mailcomposer message and forwards it to SES
       *
       * @param {Object} emailMessage MailComposer object
       * @param {Function} callback Callback function to run when the sending is completed
       */
      send(mail, callback) {
        let statObject = {
          ts: Date.now(),
          pending: true
        };
        let fromHeader = mail.message._headers.find((header) => /^from$/i.test(header.key));
        if (fromHeader) {
          let mimeNode = new MimeNode("text/plain");
          fromHeader = mimeNode._convertAddresses(mimeNode._parseAddresses(fromHeader.value));
        }
        let envelope = mail.data.envelope || mail.message.getEnvelope();
        let messageId = mail.message.messageId();
        let recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
          recipients.push("...and " + recipients.splice(2).length + " more");
        }
        this.logger.info(
          {
            tnx: "send",
            messageId
          },
          "Sending message %s to <%s>",
          messageId,
          recipients.join(", ")
        );
        let getRawMessage = /* @__PURE__ */ __name((next) => {
          if (!mail.data._dkim) {
            mail.data._dkim = {};
          }
          if (mail.data._dkim.skipFields && typeof mail.data._dkim.skipFields === "string") {
            mail.data._dkim.skipFields += ":date:message-id";
          } else {
            mail.data._dkim.skipFields = "date:message-id";
          }
          let sourceStream = mail.message.createReadStream();
          let stream = sourceStream.pipe(new LeWindows());
          let chunks = [];
          let chunklen = 0;
          stream.on("readable", () => {
            let chunk;
            while ((chunk = stream.read()) !== null) {
              chunks.push(chunk);
              chunklen += chunk.length;
            }
          });
          sourceStream.once("error", (err) => stream.emit("error", err));
          stream.once("error", (err) => {
            next(err);
          });
          stream.once("end", () => next(null, Buffer.concat(chunks, chunklen)));
        }, "getRawMessage");
        setImmediate(
          () => getRawMessage((err, raw) => {
            if (err) {
              this.logger.error(
                {
                  err,
                  tnx: "send",
                  messageId
                },
                "Failed creating message for %s. %s",
                messageId,
                err.message
              );
              statObject.pending = false;
              return callback(err);
            }
            let sesMessage = {
              Content: {
                Raw: {
                  // required
                  Data: raw
                  // required
                }
              },
              FromEmailAddress: fromHeader ? fromHeader : envelope.from,
              Destination: {
                ToAddresses: envelope.to
              }
            };
            Object.keys(mail.data.ses || {}).forEach((key) => {
              sesMessage[key] = mail.data.ses[key];
            });
            this.getRegion((err2, region) => {
              if (err2 || !region) {
                region = "us-east-1";
              }
              const command = new this.ses.SendEmailCommand(sesMessage);
              const sendPromise = this.ses.sesClient.send(command);
              sendPromise.then((data) => {
                if (region === "us-east-1") {
                  region = "email";
                }
                statObject.pending = true;
                callback(null, {
                  envelope: {
                    from: envelope.from,
                    to: envelope.to
                  },
                  messageId: "<" + data.MessageId + (!/@/.test(data.MessageId) ? "@" + region + ".amazonses.com" : "") + ">",
                  response: data.MessageId,
                  raw
                });
              }).catch((err3) => {
                this.logger.error(
                  {
                    err: err3,
                    tnx: "send"
                  },
                  "Send error for %s: %s",
                  messageId,
                  err3.message
                );
                statObject.pending = false;
                callback(err3);
              });
            });
          })
        );
      }
      /**
       * Verifies SES configuration
       *
       * @param {Function} callback Callback function
       */
      verify(callback) {
        let promise;
        if (!callback) {
          promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
          });
        }
        const cb = /* @__PURE__ */ __name((err) => {
          if (err && !["InvalidParameterValue", "MessageRejected"].includes(err.code || err.Code || err.name)) {
            return callback(err);
          }
          return callback(null, true);
        }, "cb");
        const sesMessage = {
          Content: {
            Raw: {
              Data: Buffer.from("From: <invalid@invalid>\r\nTo: <invalid@invalid>\r\n Subject: Invalid\r\n\r\nInvalid")
            }
          },
          FromEmailAddress: "invalid@invalid",
          Destination: {
            ToAddresses: ["invalid@invalid"]
          }
        };
        this.getRegion((err, region) => {
          if (err || !region) {
            region = "us-east-1";
          }
          const command = new this.ses.SendEmailCommand(sesMessage);
          const sendPromise = this.ses.sesClient.send(command);
          sendPromise.then((data) => cb(null, data)).catch((err2) => cb(err2));
        });
        return promise;
      }
    };
    module.exports = SESTransport;
  }
});

// ../node_modules/nodemailer/lib/nodemailer.js
var require_nodemailer = __commonJS({
  "../node_modules/nodemailer/lib/nodemailer.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mailer = require_mailer();
    var shared = require_shared();
    var SMTPPool = require_smtp_pool();
    var SMTPTransport = require_smtp_transport();
    var SendmailTransport = require_sendmail_transport();
    var StreamTransport = require_stream_transport();
    var JSONTransport = require_json_transport();
    var SESTransport = require_ses_transport();
    var nmfetch = require_fetch();
    var packageData = require_package();
    var ETHEREAL_API = (process.env.ETHEREAL_API || "https://api.nodemailer.com").replace(/\/+$/, "");
    var ETHEREAL_WEB = (process.env.ETHEREAL_WEB || "https://ethereal.email").replace(/\/+$/, "");
    var ETHEREAL_API_KEY = (process.env.ETHEREAL_API_KEY || "").replace(/\s*/g, "") || null;
    var ETHEREAL_CACHE = ["true", "yes", "y", "1"].includes((process.env.ETHEREAL_CACHE || "yes").toString().trim().toLowerCase());
    var testAccount = false;
    module.exports.createTransport = function(transporter3, defaults) {
      let urlConfig;
      let options;
      let mailer;
      if (
        // provided transporter is a configuration object, not transporter plugin
        typeof transporter3 === "object" && typeof transporter3.send !== "function" || // provided transporter looks like a connection url
        typeof transporter3 === "string" && /^(smtps?|direct):/i.test(transporter3)
      ) {
        if (urlConfig = typeof transporter3 === "string" ? transporter3 : transporter3.url) {
          options = shared.parseConnectionUrl(urlConfig);
        } else {
          options = transporter3;
        }
        if (options.pool) {
          transporter3 = new SMTPPool(options);
        } else if (options.sendmail) {
          transporter3 = new SendmailTransport(options);
        } else if (options.streamTransport) {
          transporter3 = new StreamTransport(options);
        } else if (options.jsonTransport) {
          transporter3 = new JSONTransport(options);
        } else if (options.SES) {
          if (options.SES.ses && options.SES.aws) {
            let error3 = new Error(
              "Using legacy SES configuration, expecting @aws-sdk/client-sesv2, see https://nodemailer.com/transports/ses/"
            );
            error3.code = "LegacyConfig";
            throw error3;
          }
          transporter3 = new SESTransport(options);
        } else {
          transporter3 = new SMTPTransport(options);
        }
      }
      mailer = new Mailer(transporter3, options, defaults);
      return mailer;
    };
    module.exports.createTestAccount = function(apiUrl, callback) {
      let promise;
      if (!callback && typeof apiUrl === "function") {
        callback = apiUrl;
        apiUrl = false;
      }
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      if (ETHEREAL_CACHE && testAccount) {
        setImmediate(() => callback(null, testAccount));
        return promise;
      }
      apiUrl = apiUrl || ETHEREAL_API;
      let chunks = [];
      let chunklen = 0;
      let requestHeaders = {};
      let requestBody = {
        requestor: packageData.name,
        version: packageData.version
      };
      if (ETHEREAL_API_KEY) {
        requestHeaders.Authorization = "Bearer " + ETHEREAL_API_KEY;
      }
      let req = nmfetch(apiUrl + "/user", {
        contentType: "application/json",
        method: "POST",
        headers: requestHeaders,
        body: Buffer.from(JSON.stringify(requestBody))
      });
      req.on("readable", () => {
        let chunk;
        while ((chunk = req.read()) !== null) {
          chunks.push(chunk);
          chunklen += chunk.length;
        }
      });
      req.once("error", (err) => callback(err));
      req.once("end", () => {
        let res = Buffer.concat(chunks, chunklen);
        let data;
        let err;
        try {
          data = JSON.parse(res.toString());
        } catch (E) {
          err = E;
        }
        if (err) {
          return callback(err);
        }
        if (data.status !== "success" || data.error) {
          return callback(new Error(data.error || "Request failed"));
        }
        delete data.status;
        testAccount = data;
        callback(null, testAccount);
      });
      return promise;
    };
    module.exports.getTestMessageUrl = function(info3) {
      if (!info3 || !info3.response) {
        return false;
      }
      let infoProps = /* @__PURE__ */ new Map();
      info3.response.replace(/\[([^\]]+)\]$/, (m, props) => {
        props.replace(/\b([A-Z0-9]+)=([^\s]+)/g, (m2, key, value) => {
          infoProps.set(key, value);
        });
      });
      if (infoProps.has("STATUS") && infoProps.has("MSGID")) {
        return (testAccount.web || ETHEREAL_WEB) + "/message/" + infoProps.get("MSGID");
      }
      return false;
    };
  }
});

// config.ts
function validateConfig(env2) {
  const errors = [];
  if (!env2.TURSO_CONNECTION_URL) {
    errors.push("TURSO_CONNECTION_URL is missing");
  }
  if (!env2.TURSO_AUTH_TOKEN) {
    errors.push("TURSO_AUTH_TOKEN is missing");
  }
  if (!env2.GMAIL_USER) {
    errors.push("GMAIL_USER is missing");
  }
  if (!env2.GMAIL_APP_PASSWORD) {
    errors.push("GMAIL_APP_PASSWORD is missing");
  }
  if (errors.length > 0) {
    console.error("\u274C CONFIGURATION ERRORS:");
    errors.forEach((err) => console.error(`   - ${err}`));
    throw new Error(`Configuration validation failed: ${errors.join(", ")}`);
  }
  return {
    turso: {
      connectionUrl: env2.TURSO_CONNECTION_URL,
      authToken: env2.TURSO_AUTH_TOKEN
    },
    gmail: {
      user: env2.GMAIL_USER,
      appPassword: env2.GMAIL_APP_PASSWORD
    }
  };
}
function logConfig(config2) {
  console.log("\u2705 CONFIGURATION LOADED:");
  console.log(`   - Turso: ${config2.turso.connectionUrl.substring(0, 30)}...`);
  console.log(`   - Gmail: ${config2.gmail.user}`);
}
var init_config = __esm({
  "config.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(validateConfig, "validateConfig");
    __name(logConfig, "logConfig");
  }
});

// api/send-email-simple.ts
function getConfig(env2) {
  if (!configCache) {
    configCache = validateConfig(env2);
    logConfig(configCache);
  }
  return configCache;
}
function initTransporter(env2) {
  if (!transporter) {
    const config2 = getConfig(env2);
    try {
      console.log("\u{1F4E7} Initializing Gmail transporter...");
      transporter = import_nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: config2.gmail.user,
          pass: config2.gmail.appPassword
        }
      });
      console.log("\u2705 Gmail transporter initialized");
    } catch (err) {
      console.error("\u274C Transporter failed:", err.message);
      throw new Error(`Email transporter failed: ${err.message}`);
    }
  }
  return transporter;
}
function generateEmailTemplate(subject, content, language = "en") {
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "right" : "left";
  let htmlContent = content;
  if (!content.includes("<") && !content.includes(">")) {
    htmlContent = content.split("\n\n").map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`).join("");
  }
  return `<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style>
body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; direction: ${direction}; }
.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
.header h1 { margin: 0; font-size: 28px; font-weight: bold; }
.content { padding: 40px 20px; text-align: ${textAlign}; line-height: 1.6; color: #333; }
.content p { margin: 0 0 15px 0; font-size: 14px; }
.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
.footer a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>${subject}</h1>
</div>
<div class="content">
${htmlContent}
</div>
<div class="footer">
<p>\xA9 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a> | <a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div>
</div>
</body>
</html>`;
}
async function onRequestPost4(context2) {
  try {
    const { recipients, subject, content, language = "en" } = await context2.request.json();
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Recipients required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: "Subject and content required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    try {
      const transporter_instance = initTransporter(context2.env);
      const htmlContent = generateEmailTemplate(subject, content, language);
      let sent = 0;
      let failed = 0;
      for (const recipient of recipients) {
        try {
          await transporter_instance.sendMail({
            from: context2.env.GMAIL_USER,
            to: recipient,
            subject,
            html: htmlContent,
            replyTo: context2.env.GMAIL_USER
          });
          sent++;
          console.log(`\u2705 Email sent to ${recipient}`);
        } catch (err) {
          failed++;
          console.error(`\u274C Failed to send to ${recipient}:`, err.message);
        }
      }
      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: recipients.length
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("\u274C Email service error:", err.message);
      return new Response(
        JSON.stringify({
          error: "Email service not configured",
          details: err.message
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error3) {
    console.error("\u274C Request error:", error3);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error3.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var import_nodemailer, transporter, configCache;
var init_send_email_simple = __esm({
  "api/send-email-simple.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_nodemailer = __toESM(require_nodemailer(), 1);
    init_config();
    transporter = null;
    configCache = null;
    __name(getConfig, "getConfig");
    __name(initTransporter, "initTransporter");
    __name(generateEmailTemplate, "generateEmailTemplate");
    __name(onRequestPost4, "onRequestPost");
  }
});

// api/send-newsletter.ts
function generateNewsletterTemplate(subject, content, language = "en") {
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "right" : "left";
  let htmlContent = content;
  if (!content.includes("<") && !content.includes(">")) {
    htmlContent = content.split("\n\n").map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`).join("");
  }
  return `
    <!DOCTYPE html>
    <html lang="${language}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          padding: 20px;
          direction: ${direction};
          min-height: 100vh;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: oklch(0.145 0 0);
          padding: 60px 30px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .header-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: inline-block;
          width: 60px;
          height: 60px;
        }
        .header-icon svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .header h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
          word-break: break-word;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        .content {
          padding: 50px 40px;
          text-align: ${textAlign};
          line-height: 1.8;
          color: #333;
        }
        .content p {
          font-size: 15px;
          margin-bottom: 20px;
          color: #555;
        }
        .content h2 {
          color: #333;
          font-size: 22px;
          margin: 30px 0 15px 0;
          font-weight: 600;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }
        .content h3 {
          color: #555;
          font-size: 18px;
          margin: 20px 0 10px 0;
          font-weight: 600;
        }
        .content ul, .content ol {
          margin: 20px 0;
          padding-${isArabic ? "right" : "left"}: 25px;
        }
        .content li {
          margin-bottom: 12px;
          color: #555;
          font-size: 15px;
        }
        .cta-button {
          display: inline-block;
          background: oklch(0.145 0 0);
          color: white;
          padding: 16px 40px;
          border-radius: 8px;
          text-decoration: none;
          margin: 25px 0;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        .highlight {
          background: linear-gradient(120deg, #f0f0f015 0%, #e0e0e015 100%);
          padding: 20px;
          border-radius: 8px;
          border-${isArabic ? "right" : "left"}: 4px solid #333;
          margin: 20px 0;
        }
        .highlight p {
          margin: 0;
          color: #333;
        }
        .divider {
          height: 1px;
          background: #e0e0e0;
          margin: 30px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 40px 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        .footer-text {
          color: #888;
          font-size: 13px;
          margin-bottom: 15px;
        }
        .footer-links {
          margin-top: 15px;
        }
        .footer-links a {
          color: #333;
          text-decoration: none;
          margin: 0 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .code-block {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #333;
          margin: 15px 0;
          word-break: break-all;
        }
        @media (max-width: 600px) {
          .container {
            border-radius: 0;
          }
          .header {
            padding: 40px 20px;
          }
          .header h1 {
            font-size: 28px;
          }
          .content {
            padding: 30px 20px;
          }
          .footer {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="header-content">
              <div class="header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1>${subject}</h1>
            </div>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p class="footer-text">
              ${isArabic ? "\xA9 2026 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629" : "\xA9 2026 All rights reserved"}
            </p>
            <div class="footer-links">
              <a href="https://main.author-fatima-76r-eis.pages.dev">${isArabic ? "\u0627\u0644\u0645\u0648\u0642\u0639" : "Website"}</a>
              <a href="mailto:AuthorFSK@gmail.com">${isArabic ? "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" : "Email"}</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function onRequestPost5(context2) {
  try {
    const { recipients, subject, content, language = "en" } = await context2.request.json();
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Recipients required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!subject || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "Subject and content required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(`[NEWSLETTER] Sending to ${recipients.length} recipients`);
    const htmlContent = generateNewsletterTemplate(subject, content, language);
    const resendApiKey = context2.env.RESEND_API_KEY;
    const gmailUser = context2.env.GMAIL_USER;
    if (resendApiKey && gmailUser) {
      let sent = 0;
      let failed = 0;
      for (const recipient of recipients) {
        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              from: gmailUser,
              to: recipient,
              subject,
              html: htmlContent
            })
          });
          if (response.ok) {
            sent++;
          } else {
            failed++;
            console.error(`Failed to send to ${recipient}:`, await response.text());
          }
        } catch (error3) {
          failed++;
          console.error(`Failed to send to ${recipient}:`, error3.message);
        }
      }
      return new Response(
        JSON.stringify({
          success: failed === 0,
          sent,
          failed,
          total: recipients.length
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const backendUrl = context2.env.BACKEND_URL;
      if (!backendUrl) {
        console.warn("[NEWSLETTER] No email service configured");
        return new Response(
          JSON.stringify({
            success: false,
            error: "Email service not configured",
            sent: 0,
            failed: recipients.length,
            total: recipients.length
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      const base = backendUrl.replace(/\/api\/?$/, "");
      try {
        const response = await fetch(`${base}/api/send-newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipients,
            subject,
            content: htmlContent,
            language
          })
        });
        if (response.ok) {
          const result = await response.json();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          const error3 = await response.text();
          console.error("[NEWSLETTER] Backend error:", error3);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Backend email service failed",
              sent: 0,
              failed: recipients.length,
              total: recipients.length
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (error3) {
        console.error("[NEWSLETTER] Backend request failed:", error3.message);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to reach email service",
            sent: 0,
            failed: recipients.length,
            total: recipients.length
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  } catch (error3) {
    console.error("[NEWSLETTER] Error:", error3);
    return new Response(
      JSON.stringify({ success: false, error: error3.message || "Failed to send newsletter" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
var init_send_newsletter = __esm({
  "api/send-newsletter.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(generateNewsletterTemplate, "generateNewsletterTemplate");
    __name(onRequestPost5, "onRequestPost");
  }
});

// api/debug-env.ts
async function onRequest4(context2) {
  const env2 = context2.env || {};
  return new Response(JSON.stringify({
    envKeys: Object.keys(env2),
    hasTursoUrl: !!env2.TURSO_CONNECTION_URL,
    hasTursoToken: !!env2.TURSO_AUTH_TOKEN,
    hasGmailUser: !!env2.GMAIL_USER,
    hasGmailPass: !!env2.GMAIL_APP_PASSWORD,
    branch: env2.CF_PAGES_BRANCH,
    commitSha: env2.CF_PAGES_COMMIT_SHA,
    pagesUrl: env2.CF_PAGES_URL,
    backendUrl: env2.BACKEND_URL,
    environment: env2.ENVIRONMENT
  }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
var init_debug_env = __esm({
  "api/debug-env.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequest4, "onRequest");
  }
});

// ../node_modules/@libsql/core/lib-esm/api.js
var LibsqlError, LibsqlBatchError;
var init_api = __esm({
  "../node_modules/@libsql/core/lib-esm/api.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    LibsqlError = class extends Error {
      static {
        __name(this, "LibsqlError");
      }
      /** Machine-readable error code. */
      code;
      /** Extended error code with more specific information (e.g., SQLITE_CONSTRAINT_PRIMARYKEY). */
      extendedCode;
      /** Raw numeric error code */
      rawCode;
      constructor(message, code, extendedCode, rawCode, cause) {
        if (code !== void 0) {
          message = `${code}: ${message}`;
        }
        super(message, { cause });
        this.code = code;
        this.extendedCode = extendedCode;
        this.rawCode = rawCode;
        this.name = "LibsqlError";
      }
    };
    LibsqlBatchError = class extends LibsqlError {
      static {
        __name(this, "LibsqlBatchError");
      }
      /** The zero-based index of the statement that failed in the batch. */
      statementIndex;
      constructor(message, statementIndex, code, extendedCode, rawCode, cause) {
        super(message, code, extendedCode, rawCode, cause);
        this.statementIndex = statementIndex;
        this.name = "LibsqlBatchError";
      }
    };
  }
});

// ../node_modules/@libsql/core/lib-esm/uri.js
function parseUri(text) {
  const match2 = URI_RE.exec(text);
  if (match2 === null) {
    throw new LibsqlError(`The URL '${text}' is not in a valid format`, "URL_INVALID");
  }
  const groups = match2.groups;
  const scheme = groups["scheme"];
  const authority = groups["authority"] !== void 0 ? parseAuthority(groups["authority"]) : void 0;
  const path = percentDecode(groups["path"]);
  const query = groups["query"] !== void 0 ? parseQuery(groups["query"]) : void 0;
  const fragment = groups["fragment"] !== void 0 ? percentDecode(groups["fragment"]) : void 0;
  return { scheme, authority, path, query, fragment };
}
function parseAuthority(text) {
  const match2 = AUTHORITY_RE.exec(text);
  if (match2 === null) {
    throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
  }
  const groups = match2.groups;
  const host = percentDecode(groups["host_br"] ?? groups["host"]);
  const port = groups["port"] ? parseInt(groups["port"], 10) : void 0;
  const userinfo = groups["username"] !== void 0 ? {
    username: percentDecode(groups["username"]),
    password: groups["password"] !== void 0 ? percentDecode(groups["password"]) : void 0
  } : void 0;
  return { host, port, userinfo };
}
function parseQuery(text) {
  const sequences = text.split("&");
  const pairs = [];
  for (const sequence of sequences) {
    if (sequence === "") {
      continue;
    }
    let key;
    let value;
    const splitIdx = sequence.indexOf("=");
    if (splitIdx < 0) {
      key = sequence;
      value = "";
    } else {
      key = sequence.substring(0, splitIdx);
      value = sequence.substring(splitIdx + 1);
    }
    pairs.push({
      key: percentDecode(key.replaceAll("+", " ")),
      value: percentDecode(value.replaceAll("+", " "))
    });
  }
  return { pairs };
}
function percentDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    if (e instanceof URIError) {
      throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", void 0, void 0, e);
    }
    throw e;
  }
}
function encodeBaseUrl(scheme, authority, path) {
  if (authority === void 0) {
    throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
  }
  const schemeText = `${scheme}:`;
  const hostText = encodeHost(authority.host);
  const portText = encodePort(authority.port);
  const userinfoText = encodeUserinfo(authority.userinfo);
  const authorityText = `//${userinfoText}${hostText}${portText}`;
  let pathText = path.split("/").map(encodeURIComponent).join("/");
  if (pathText !== "" && !pathText.startsWith("/")) {
    pathText = "/" + pathText;
  }
  return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
  return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
  return port !== void 0 ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
  if (userinfo === void 0) {
    return "";
  }
  const usernameText = encodeURIComponent(userinfo.username);
  const passwordText = userinfo.password !== void 0 ? `:${encodeURIComponent(userinfo.password)}` : "";
  return `${usernameText}${passwordText}@`;
}
var URI_RE, AUTHORITY_RE;
var init_uri = __esm({
  "../node_modules/@libsql/core/lib-esm/uri.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_api();
    __name(parseUri, "parseUri");
    URI_RE = (() => {
      const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
      const AUTHORITY = "(?<authority>[^/?#]*)";
      const PATH = "(?<path>[^?#]*)";
      const QUERY = "(?<query>[^#]*)";
      const FRAGMENT = "(?<fragment>.*)";
      return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
    })();
    __name(parseAuthority, "parseAuthority");
    AUTHORITY_RE = (() => {
      return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
    })();
    __name(parseQuery, "parseQuery");
    __name(percentDecode, "percentDecode");
    __name(encodeBaseUrl, "encodeBaseUrl");
    __name(encodeHost, "encodeHost");
    __name(encodePort, "encodePort");
    __name(encodeUserinfo, "encodeUserinfo");
  }
});

// ../node_modules/js-base64/base64.mjs
var version3, VERSION, _hasBuffer, _TD, _TE, b64ch, b64chs, b64tab, b64re, _fromCC, _U8Afrom, _mkUriSafe, _tidyB64, btoaPolyfill, _btoa, _fromUint8Array, fromUint8Array, cb_utob, re_utob, utob, _encode, encode, encodeURI2, re_btou, cb_btou, btou, atobPolyfill, _atob, _toUint8Array, toUint8Array, _decode, _unURI, decode, isValid, _noEnum, extendString, extendUint8Array, extendBuiltins, gBase64;
var init_base64 = __esm({
  "../node_modules/js-base64/base64.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    version3 = "3.7.8";
    VERSION = version3;
    _hasBuffer = typeof Buffer === "function";
    _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
    _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
    b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    b64chs = Array.prototype.slice.call(b64ch);
    b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => tab[c] = i);
      return tab;
    })(b64chs);
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    _fromCC = String.fromCharCode.bind(String);
    _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
    _mkUriSafe = /* @__PURE__ */ __name((src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_"), "_mkUriSafe");
    _tidyB64 = /* @__PURE__ */ __name((s) => s.replace(/[^A-Za-z0-9\+\/]/g, ""), "_tidyB64");
    btoaPolyfill = /* @__PURE__ */ __name((bin) => {
      let u32, c0, c1, c2, asc = "";
      const pad = bin.length % 3;
      for (let i = 0; i < bin.length; ) {
        if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
          throw new TypeError("invalid character found");
        u32 = c0 << 16 | c1 << 8 | c2;
        asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
      }
      return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
    }, "btoaPolyfill");
    _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
    _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
      const maxargs = 4096;
      let strs = [];
      for (let i = 0, l = u8a.length; i < l; i += maxargs) {
        strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
      }
      return _btoa(strs.join(""));
    };
    fromUint8Array = /* @__PURE__ */ __name((u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a), "fromUint8Array");
    cb_utob = /* @__PURE__ */ __name((c) => {
      if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      } else {
        var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
        return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      }
    }, "cb_utob");
    re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    utob = /* @__PURE__ */ __name((u) => u.replace(re_utob, cb_utob), "utob");
    _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
    encode = /* @__PURE__ */ __name((src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src), "encode");
    encodeURI2 = /* @__PURE__ */ __name((src) => encode(src, true), "encodeURI");
    re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    cb_btou = /* @__PURE__ */ __name((cccc) => {
      switch (cccc.length) {
        case 4:
          var cp3 = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp3 - 65536;
          return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
        case 3:
          return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
        default:
          return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
      }
    }, "cb_btou");
    btou = /* @__PURE__ */ __name((b) => b.replace(re_btou, cb_btou), "btou");
    atobPolyfill = /* @__PURE__ */ __name((asc) => {
      asc = asc.replace(/\s+/g, "");
      if (!b64re.test(asc))
        throw new TypeError("malformed base64.");
      asc += "==".slice(2 - (asc.length & 3));
      let u24, r1, r2;
      let binArray = [];
      for (let i = 0; i < asc.length; ) {
        u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
        if (r1 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255));
        } else if (r2 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
        } else {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
        }
      }
      return binArray.join("");
    }, "atobPolyfill");
    _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
    _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
    toUint8Array = /* @__PURE__ */ __name((a) => _toUint8Array(_unURI(a)), "toUint8Array");
    _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
    _unURI = /* @__PURE__ */ __name((a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/")), "_unURI");
    decode = /* @__PURE__ */ __name((src) => _decode(_unURI(src)), "decode");
    isValid = /* @__PURE__ */ __name((src) => {
      if (typeof src !== "string")
        return false;
      const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
      return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
    }, "isValid");
    _noEnum = /* @__PURE__ */ __name((v) => {
      return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true
      };
    }, "_noEnum");
    extendString = /* @__PURE__ */ __name(function() {
      const _add = /* @__PURE__ */ __name((name, body) => Object.defineProperty(String.prototype, name, _noEnum(body)), "_add");
      _add("fromBase64", function() {
        return decode(this);
      });
      _add("toBase64", function(urlsafe) {
        return encode(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return encode(this, true);
      });
      _add("toBase64URL", function() {
        return encode(this, true);
      });
      _add("toUint8Array", function() {
        return toUint8Array(this);
      });
    }, "extendString");
    extendUint8Array = /* @__PURE__ */ __name(function() {
      const _add = /* @__PURE__ */ __name((name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body)), "_add");
      _add("toBase64", function(urlsafe) {
        return fromUint8Array(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return fromUint8Array(this, true);
      });
      _add("toBase64URL", function() {
        return fromUint8Array(this, true);
      });
    }, "extendUint8Array");
    extendBuiltins = /* @__PURE__ */ __name(() => {
      extendString();
      extendUint8Array();
    }, "extendBuiltins");
    gBase64 = {
      version: version3,
      VERSION,
      atob: _atob,
      atobPolyfill,
      btoa: _btoa,
      btoaPolyfill,
      fromBase64: decode,
      toBase64: encode,
      encode,
      encodeURI: encodeURI2,
      encodeURL: encodeURI2,
      utob,
      btou,
      decode,
      isValid,
      fromUint8Array,
      toUint8Array,
      extendString,
      extendUint8Array,
      extendBuiltins
    };
  }
});

// ../node_modules/@libsql/core/lib-esm/util.js
function transactionModeToBegin(mode) {
  if (mode === "write") {
    return "BEGIN IMMEDIATE";
  } else if (mode === "read") {
    return "BEGIN TRANSACTION READONLY";
  } else if (mode === "deferred") {
    return "BEGIN DEFERRED";
  } else {
    throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
  }
}
function rowToJson(row) {
  return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
  if (typeof value === "bigint") {
    return "" + value;
  } else if (value instanceof ArrayBuffer) {
    return gBase64.fromUint8Array(new Uint8Array(value));
  } else {
    return value;
  }
}
var supportedUrlLink, ResultSetImpl;
var init_util = __esm({
  "../node_modules/@libsql/core/lib-esm/util.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_base64();
    supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
    __name(transactionModeToBegin, "transactionModeToBegin");
    ResultSetImpl = class {
      static {
        __name(this, "ResultSetImpl");
      }
      columns;
      columnTypes;
      rows;
      rowsAffected;
      lastInsertRowid;
      constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
        this.columns = columns;
        this.columnTypes = columnTypes;
        this.rows = rows;
        this.rowsAffected = rowsAffected;
        this.lastInsertRowid = lastInsertRowid;
      }
      toJSON() {
        return {
          columns: this.columns,
          columnTypes: this.columnTypes,
          rows: this.rows.map(rowToJson),
          rowsAffected: this.rowsAffected,
          lastInsertRowid: this.lastInsertRowid !== void 0 ? "" + this.lastInsertRowid : null
        };
      }
    };
    __name(rowToJson, "rowToJson");
    __name(valueToJson, "valueToJson");
  }
});

// ../node_modules/@libsql/core/lib-esm/config.js
function expandConfig(config2, preferHttp) {
  if (typeof config2 !== "object") {
    throw new TypeError(`Expected client configuration as object, got ${typeof config2}`);
  }
  let { url, authToken, tls, intMode, concurrency } = config2;
  concurrency = Math.max(0, concurrency || 20);
  intMode ??= "number";
  let connectionQueryParams = [];
  if (url === inMemoryMode) {
    url = "file::memory:";
  }
  const uri = parseUri(url);
  const originalUriScheme = uri.scheme.toLowerCase();
  const isInMemoryMode = originalUriScheme === "file" && uri.path === inMemoryMode && uri.authority === void 0;
  let queryParamsDef;
  if (isInMemoryMode) {
    queryParamsDef = {
      cache: {
        values: ["shared", "private"],
        update: /* @__PURE__ */ __name((key, value) => connectionQueryParams.push(`${key}=${value}`), "update")
      }
    };
  } else {
    queryParamsDef = {
      tls: {
        values: ["0", "1"],
        update: /* @__PURE__ */ __name((_, value) => tls = value === "1", "update")
      },
      authToken: {
        update: /* @__PURE__ */ __name((_, value) => authToken = value, "update")
      }
    };
  }
  for (const { key, value } of uri.query?.pairs ?? []) {
    if (!Object.hasOwn(queryParamsDef, key)) {
      throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
    }
    const queryParamDef = queryParamsDef[key];
    if (queryParamDef.values !== void 0 && !queryParamDef.values.includes(value)) {
      throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
    }
    if (queryParamDef.update !== void 0) {
      queryParamDef?.update(key, value);
    }
  }
  const connectionQueryParamsString = connectionQueryParams.length === 0 ? "" : `?${connectionQueryParams.join("&")}`;
  const path = uri.path + connectionQueryParamsString;
  let scheme;
  if (originalUriScheme === "libsql") {
    if (tls === false) {
      if (uri.authority?.port === void 0) {
        throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
      }
      scheme = preferHttp ? "http" : "ws";
    } else {
      scheme = preferHttp ? "https" : "wss";
    }
  } else {
    scheme = originalUriScheme;
  }
  if (scheme === "http" || scheme === "ws") {
    tls ??= false;
  } else {
    tls ??= true;
  }
  if (scheme !== "http" && scheme !== "ws" && scheme !== "https" && scheme !== "wss" && scheme !== "file") {
    throw new LibsqlError(`The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, got ${JSON.stringify(uri.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
    throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
  }
  if (uri.fragment !== void 0) {
    throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
  }
  if (isInMemoryMode) {
    return {
      scheme: "file",
      tls: false,
      path,
      intMode,
      concurrency,
      syncUrl: config2.syncUrl,
      syncInterval: config2.syncInterval,
      readYourWrites: config2.readYourWrites,
      offline: config2.offline,
      fetch: config2.fetch,
      authToken: void 0,
      encryptionKey: void 0,
      remoteEncryptionKey: void 0,
      authority: void 0
    };
  }
  return {
    scheme,
    tls,
    authority: uri.authority,
    path,
    authToken,
    intMode,
    concurrency,
    encryptionKey: config2.encryptionKey,
    remoteEncryptionKey: config2.remoteEncryptionKey,
    syncUrl: config2.syncUrl,
    syncInterval: config2.syncInterval,
    readYourWrites: config2.readYourWrites,
    offline: config2.offline,
    fetch: config2.fetch
  };
}
var inMemoryMode;
var init_config2 = __esm({
  "../node_modules/@libsql/core/lib-esm/config.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_api();
    init_uri();
    init_util();
    inMemoryMode = ":memory:";
    __name(expandConfig, "expandConfig");
  }
});

// ../node_modules/@libsql/isomorphic-ws/web.mjs
var _WebSocket;
var init_web = __esm({
  "../node_modules/@libsql/isomorphic-ws/web.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    if (typeof WebSocket !== "undefined") {
      _WebSocket = WebSocket;
    } else if (typeof global !== "undefined") {
      _WebSocket = global.WebSocket;
    } else if (typeof window !== "undefined") {
      _WebSocket = window.WebSocket;
    } else if (typeof self !== "undefined") {
      _WebSocket = self.WebSocket;
    }
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/client.js
var Client;
var init_client = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/client.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Client = class {
      static {
        __name(this, "Client");
      }
      /** @private */
      constructor() {
        this.intMode = "number";
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
       * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
       */
      intMode;
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/errors.js
var ClientError, ProtoError, ResponseError, ClosedError, WebSocketUnsupportedError, WebSocketError, HttpServerError, ProtocolVersionError, InternalError, MisuseError;
var init_errors = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/errors.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ClientError = class extends Error {
      static {
        __name(this, "ClientError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ClientError";
      }
    };
    ProtoError = class extends ClientError {
      static {
        __name(this, "ProtoError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtoError";
      }
    };
    ResponseError = class extends ClientError {
      static {
        __name(this, "ResponseError");
      }
      code;
      /** @internal */
      proto;
      /** @private */
      constructor(message, protoError) {
        super(message);
        this.name = "ResponseError";
        this.code = protoError.code;
        this.proto = protoError;
        this.stack = void 0;
      }
    };
    ClosedError = class extends ClientError {
      static {
        __name(this, "ClosedError");
      }
      /** @private */
      constructor(message, cause) {
        if (cause !== void 0) {
          super(`${message}: ${cause}`);
          this.cause = cause;
        } else {
          super(message);
        }
        this.name = "ClosedError";
      }
    };
    WebSocketUnsupportedError = class extends ClientError {
      static {
        __name(this, "WebSocketUnsupportedError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketUnsupportedError";
      }
    };
    WebSocketError = class extends ClientError {
      static {
        __name(this, "WebSocketError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketError";
      }
    };
    HttpServerError = class extends ClientError {
      static {
        __name(this, "HttpServerError");
      }
      status;
      /** @private */
      constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "HttpServerError";
      }
    };
    ProtocolVersionError = class extends ClientError {
      static {
        __name(this, "ProtocolVersionError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtocolVersionError";
      }
    };
    InternalError = class extends ClientError {
      static {
        __name(this, "InternalError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "InternalError";
      }
    };
    MisuseError = class extends ClientError {
      static {
        __name(this, "MisuseError");
      }
      /** @private */
      constructor(message) {
        super(message);
        this.name = "MisuseError";
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js
function string(value) {
  if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string");
}
function stringOpt(value) {
  if (value === null || value === void 0) {
    return void 0;
  } else if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string or null");
}
function number(value) {
  if (typeof value === "number") {
    return value;
  }
  throw typeError(value, "number");
}
function boolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  throw typeError(value, "boolean");
}
function array(value) {
  if (Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "array");
}
function object(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
  return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
  if (value === void 0) {
    return new ProtoError(`Expected ${expected}, but the property was missing`);
  }
  let received = typeof value;
  if (value === null) {
    received = "null";
  } else if (Array.isArray(value)) {
    received = "array";
  }
  return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
  return fun(object(value));
}
var init_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    __name(string, "string");
    __name(stringOpt, "stringOpt");
    __name(number, "number");
    __name(boolean, "boolean");
    __name(array, "array");
    __name(object, "object");
    __name(arrayObjectsMap, "arrayObjectsMap");
    __name(typeError, "typeError");
    __name(readJsonObject, "readJsonObject");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js
function writeJsonObject(value, fun) {
  const output = [];
  const writer = new ObjectWriter(output);
  writer.begin();
  fun(writer, value);
  writer.end();
  return output.join("");
}
var ObjectWriter;
var init_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ObjectWriter = class {
      static {
        __name(this, "ObjectWriter");
      }
      #output;
      #isFirst;
      constructor(output) {
        this.#output = output;
        this.#isFirst = false;
      }
      begin() {
        this.#output.push("{");
        this.#isFirst = true;
      }
      end() {
        this.#output.push("}");
        this.#isFirst = false;
      }
      #key(name) {
        if (this.#isFirst) {
          this.#output.push('"');
          this.#isFirst = false;
        } else {
          this.#output.push(',"');
        }
        this.#output.push(name);
        this.#output.push('":');
      }
      string(name, value) {
        this.#key(name);
        this.#output.push(JSON.stringify(value));
      }
      stringRaw(name, value) {
        this.#key(name);
        this.#output.push('"');
        this.#output.push(value);
        this.#output.push('"');
      }
      number(name, value) {
        this.#key(name);
        this.#output.push("" + value);
      }
      boolean(name, value) {
        this.#key(name);
        this.#output.push(value ? "true" : "false");
      }
      object(name, value, valueFun) {
        this.#key(name);
        this.begin();
        valueFun(this, value);
        this.end();
      }
      arrayObjects(name, values, valueFun) {
        this.#key(name);
        this.#output.push("[");
        for (let i = 0; i < values.length; ++i) {
          if (i !== 0) {
            this.#output.push(",");
          }
          this.begin();
          valueFun(this, values[i]);
          this.end();
        }
        this.#output.push("]");
      }
    };
    __name(writeJsonObject, "writeJsonObject");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js
var VARINT, FIXED_64, LENGTH_DELIMITED, FIXED_32;
var init_util2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    VARINT = 0;
    FIXED_64 = 1;
    LENGTH_DELIMITED = 2;
    FIXED_32 = 5;
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js
function readProtobufMessage(data, def) {
  const msgReader = new MessageReader(data);
  const fieldReader = new FieldReader(msgReader);
  let value = def.default();
  while (!msgReader.eof()) {
    const key = msgReader.varint();
    const tag = key >> 3;
    const wireType = key & 7;
    fieldReader.setup(wireType);
    const tagFun = def[tag];
    if (tagFun !== void 0) {
      const returnedValue = tagFun(fieldReader, value);
      if (returnedValue !== void 0) {
        value = returnedValue;
      }
    }
    fieldReader.maybeSkip();
  }
  return value;
}
var MessageReader, FieldReader;
var init_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_util2();
    MessageReader = class {
      static {
        __name(this, "MessageReader");
      }
      #array;
      #view;
      #pos;
      constructor(array2) {
        this.#array = array2;
        this.#view = new DataView(array2.buffer, array2.byteOffset, array2.byteLength);
        this.#pos = 0;
      }
      varint() {
        let value = 0;
        for (let shift = 0; ; shift += 7) {
          const byte = this.#array[this.#pos++];
          value |= (byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      varintBig() {
        let value = 0n;
        for (let shift = 0n; ; shift += 7n) {
          const byte = this.#array[this.#pos++];
          value |= BigInt(byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      bytes(length) {
        const array2 = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
        this.#pos += length;
        return array2;
      }
      double() {
        const value = this.#view.getFloat64(this.#pos, true);
        this.#pos += 8;
        return value;
      }
      skipVarint() {
        for (; ; ) {
          const byte = this.#array[this.#pos++];
          if (!(byte & 128)) {
            break;
          }
        }
      }
      skip(count3) {
        this.#pos += count3;
      }
      eof() {
        return this.#pos >= this.#array.byteLength;
      }
    };
    FieldReader = class {
      static {
        __name(this, "FieldReader");
      }
      #reader;
      #wireType;
      constructor(reader) {
        this.#reader = reader;
        this.#wireType = -1;
      }
      setup(wireType) {
        this.#wireType = wireType;
      }
      #expect(expectedWireType) {
        if (this.#wireType !== expectedWireType) {
          throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
      bytes() {
        this.#expect(LENGTH_DELIMITED);
        const length = this.#reader.varint();
        return this.#reader.bytes(length);
      }
      string() {
        return new TextDecoder().decode(this.bytes());
      }
      message(def) {
        return readProtobufMessage(this.bytes(), def);
      }
      int32() {
        this.#expect(VARINT);
        return this.#reader.varint();
      }
      uint32() {
        return this.int32();
      }
      bool() {
        return this.int32() !== 0;
      }
      uint64() {
        this.#expect(VARINT);
        return this.#reader.varintBig();
      }
      sint64() {
        const value = this.uint64();
        return value >> 1n ^ -(value & 1n);
      }
      double() {
        this.#expect(FIXED_64);
        return this.#reader.double();
      }
      maybeSkip() {
        if (this.#wireType < 0) {
          return;
        } else if (this.#wireType === VARINT) {
          this.#reader.skipVarint();
        } else if (this.#wireType === FIXED_64) {
          this.#reader.skip(8);
        } else if (this.#wireType === LENGTH_DELIMITED) {
          const length = this.#reader.varint();
          this.#reader.skip(length);
        } else if (this.#wireType === FIXED_32) {
          this.#reader.skip(4);
        } else {
          throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
    };
    __name(readProtobufMessage, "readProtobufMessage");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js
function writeProtobufMessage(value, fun) {
  const w = new MessageWriter();
  fun(w, value);
  return w.data();
}
var MessageWriter;
var init_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_util2();
    MessageWriter = class _MessageWriter {
      static {
        __name(this, "MessageWriter");
      }
      #buf;
      #array;
      #view;
      #pos;
      constructor() {
        this.#buf = new ArrayBuffer(256);
        this.#array = new Uint8Array(this.#buf);
        this.#view = new DataView(this.#buf);
        this.#pos = 0;
      }
      #ensure(extra) {
        if (this.#pos + extra <= this.#buf.byteLength) {
          return;
        }
        let newCap = this.#buf.byteLength;
        while (newCap < this.#pos + extra) {
          newCap *= 2;
        }
        const newBuf = new ArrayBuffer(newCap);
        const newArray = new Uint8Array(newBuf);
        const newView = new DataView(newBuf);
        newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
        this.#buf = newBuf;
        this.#array = newArray;
        this.#view = newView;
      }
      #varint(value) {
        this.#ensure(5);
        value = 0 | value;
        do {
          let byte = value & 127;
          value >>>= 7;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #varintBig(value) {
        this.#ensure(10);
        value = value & 0xffffffffffffffffn;
        do {
          let byte = Number(value & 0x7fn);
          value >>= 7n;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #tag(tag, wireType) {
        this.#varint(tag << 3 | wireType);
      }
      bytes(tag, value) {
        this.#tag(tag, LENGTH_DELIMITED);
        this.#varint(value.byteLength);
        this.#ensure(value.byteLength);
        this.#array.set(value, this.#pos);
        this.#pos += value.byteLength;
      }
      string(tag, value) {
        this.bytes(tag, new TextEncoder().encode(value));
      }
      message(tag, value, fun) {
        const writer = new _MessageWriter();
        fun(writer, value);
        this.bytes(tag, writer.data());
      }
      int32(tag, value) {
        this.#tag(tag, VARINT);
        this.#varint(value);
      }
      uint32(tag, value) {
        this.int32(tag, value);
      }
      bool(tag, value) {
        this.int32(tag, value ? 1 : 0);
      }
      sint64(tag, value) {
        this.#tag(tag, VARINT);
        this.#varintBig(value << 1n ^ value >> 63n);
      }
      double(tag, value) {
        this.#tag(tag, FIXED_64);
        this.#ensure(8);
        this.#view.setFloat64(this.#pos, value, true);
        this.#pos += 8;
      }
      data() {
        return new Uint8Array(this.#buf, 0, this.#pos);
      }
    };
    __name(writeProtobufMessage, "writeProtobufMessage");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/encoding/index.js
var init_encoding = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/encoding/index.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_decode();
    init_encode();
    init_decode2();
    init_encode2();
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/id_alloc.js
var IdAlloc;
var init_id_alloc = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/id_alloc.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    IdAlloc = class {
      static {
        __name(this, "IdAlloc");
      }
      // Set of all allocated ids
      #usedIds;
      // Set of all free ids lower than `#usedIds.size`
      #freeIds;
      constructor() {
        this.#usedIds = /* @__PURE__ */ new Set();
        this.#freeIds = /* @__PURE__ */ new Set();
      }
      // Returns an id that was free, and marks it as used.
      alloc() {
        for (const freeId2 of this.#freeIds) {
          this.#freeIds.delete(freeId2);
          this.#usedIds.add(freeId2);
          if (!this.#usedIds.has(this.#usedIds.size - 1)) {
            this.#freeIds.add(this.#usedIds.size - 1);
          }
          return freeId2;
        }
        const freeId = this.#usedIds.size;
        this.#usedIds.add(freeId);
        return freeId;
      }
      free(id) {
        if (!this.#usedIds.delete(id)) {
          throw new InternalError("Freeing an id that is not allocated");
        }
        this.#freeIds.delete(this.#usedIds.size);
        if (id < this.#usedIds.size) {
          this.#freeIds.add(id);
        }
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/util.js
function impossible(value, message) {
  throw new InternalError(message);
}
var init_util3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/util.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    __name(impossible, "impossible");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/value.js
function valueToProto(value) {
  if (value === null) {
    return null;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger || value > maxInteger) {
      throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1n : 0n;
  } else if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  } else if (value instanceof Uint8Array) {
    return value;
  } else if (value instanceof Date) {
    return +value.valueOf();
  } else if (typeof value === "object") {
    return "" + value.toString();
  } else {
    throw new TypeError("Unsupported type of value");
  }
}
function valueFromProto(value, intMode) {
  if (value === null) {
    return null;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "bigint") {
    if (intMode === "number") {
      const num = Number(value);
      if (!Number.isSafeInteger(num)) {
        throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
      }
      return num;
    } else if (intMode === "bigint") {
      return value;
    } else if (intMode === "string") {
      return "" + value;
    } else {
      throw new MisuseError("Invalid value for IntMode");
    }
  } else if (value instanceof Uint8Array) {
    return value.slice().buffer;
  } else if (value === void 0) {
    throw new ProtoError("Received unrecognized type of Value");
  } else {
    throw impossible(value, "Impossible type of Value");
  }
}
var minInteger, maxInteger;
var init_value = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/value.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_util3();
    __name(valueToProto, "valueToProto");
    minInteger = -9223372036854775808n;
    maxInteger = 9223372036854775807n;
    __name(valueFromProto, "valueFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/result.js
function stmtResultFromProto(result) {
  return {
    affectedRowCount: result.affectedRowCount,
    lastInsertRowid: result.lastInsertRowid,
    columnNames: result.cols.map((col) => col.name),
    columnDecltypes: result.cols.map((col) => col.decltype)
  };
}
function rowsResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  const rows = result.rows.map((row) => rowFromProto(stmtResult.columnNames, row, intMode));
  return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let row;
  if (result.rows.length > 0) {
    row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
  }
  return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let value;
  if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
    value = valueFromProto(result.rows[0][0], intMode);
  }
  return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: values.length });
  for (let i = 0; i < values.length; ++i) {
    const value = valueFromProto(values[i], intMode);
    Object.defineProperty(row, i, { value });
    const colName = colNames[i];
    if (colName !== void 0 && !Object.hasOwn(row, colName)) {
      Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
    }
  }
  return row;
}
function errorFromProto(error3) {
  return new ResponseError(error3.message, error3);
}
var init_result = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/result.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_value();
    __name(stmtResultFromProto, "stmtResultFromProto");
    __name(rowsResultFromProto, "rowsResultFromProto");
    __name(rowResultFromProto, "rowResultFromProto");
    __name(valueResultFromProto, "valueResultFromProto");
    __name(rowFromProto, "rowFromProto");
    __name(errorFromProto, "errorFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/sql.js
function sqlToProto(owner, sql) {
  if (sql instanceof Sql) {
    return { sqlId: sql._getSqlId(owner) };
  } else {
    return { sql: "" + sql };
  }
}
var Sql;
var init_sql = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/sql.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    Sql = class {
      static {
        __name(this, "Sql");
      }
      #owner;
      #sqlId;
      #closed;
      /** @private */
      constructor(owner, sqlId) {
        this.#owner = owner;
        this.#sqlId = sqlId;
        this.#closed = void 0;
      }
      /** @private */
      _getSqlId(owner) {
        if (this.#owner !== owner) {
          throw new MisuseError("Attempted to use SQL text opened with other object");
        } else if (this.#closed !== void 0) {
          throw new ClosedError("SQL text is closed", this.#closed);
        }
        return this.#sqlId;
      }
      /** Remove the SQL text from the server, releasing resouces. */
      close() {
        this._setClosed(new ClientError("SQL text was manually closed"));
      }
      /** @private */
      _setClosed(error3) {
        if (this.#closed === void 0) {
          this.#closed = error3;
          this.#owner._closeSql(this.#sqlId);
        }
      }
      /** True if the SQL text is closed (removed from the server). */
      get closed() {
        return this.#closed !== void 0;
      }
    };
    __name(sqlToProto, "sqlToProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/queue.js
var Queue;
var init_queue = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/queue.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Queue = class {
      static {
        __name(this, "Queue");
      }
      #pushStack;
      #shiftStack;
      constructor() {
        this.#pushStack = [];
        this.#shiftStack = [];
      }
      get length() {
        return this.#pushStack.length + this.#shiftStack.length;
      }
      push(elem) {
        this.#pushStack.push(elem);
      }
      shift() {
        if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
          this.#shiftStack = this.#pushStack.reverse();
          this.#pushStack = [];
        }
        return this.#shiftStack.pop();
      }
      first() {
        return this.#shiftStack.length !== 0 ? this.#shiftStack[this.#shiftStack.length - 1] : this.#pushStack[0];
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/stmt.js
function stmtToProto(sqlOwner, stmt, wantRows) {
  let inSql;
  let args = [];
  let namedArgs = [];
  if (stmt instanceof Stmt) {
    inSql = stmt.sql;
    args = stmt._args;
    for (const [name, value] of stmt._namedArgs.entries()) {
      namedArgs.push({ name, value });
    }
  } else if (Array.isArray(stmt)) {
    inSql = stmt[0];
    if (Array.isArray(stmt[1])) {
      args = stmt[1].map((arg) => valueToProto(arg));
    } else {
      namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
        return { name, value: valueToProto(value) };
      });
    }
  } else {
    inSql = stmt;
  }
  const { sql, sqlId } = sqlToProto(sqlOwner, inSql);
  return { sql, sqlId, args, namedArgs, wantRows };
}
var Stmt;
var init_stmt = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/stmt.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_sql();
    init_value();
    Stmt = class {
      static {
        __name(this, "Stmt");
      }
      /** The SQL statement text. */
      sql;
      /** @private */
      _args;
      /** @private */
      _namedArgs;
      /** Initialize the statement with given SQL text. */
      constructor(sql) {
        this.sql = sql;
        this._args = [];
        this._namedArgs = /* @__PURE__ */ new Map();
      }
      /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
      bindIndexes(values) {
        this._args.length = 0;
        for (const value of values) {
          this._args.push(valueToProto(value));
        }
        return this;
      }
      /** Binds a parameter by a 1-based index. */
      bindIndex(index, value) {
        if (index !== (index | 0) || index <= 0) {
          throw new RangeError("Index of a positional argument must be positive integer");
        }
        while (this._args.length < index) {
          this._args.push(null);
        }
        this._args[index - 1] = valueToProto(value);
        return this;
      }
      /** Binds a parameter by name. */
      bindName(name, value) {
        this._namedArgs.set(name, valueToProto(value));
        return this;
      }
      /** Clears all bindings. */
      unbindAll() {
        this._args.length = 0;
        this._namedArgs.clear();
        return this;
      }
    };
    __name(stmtToProto, "stmtToProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/batch.js
function executeRegular(stream, steps, batch) {
  return stream._batch(batch).then((result) => {
    for (let step = 0; step < steps.length; ++step) {
      const stepResult = result.stepResults.get(step);
      const stepError = result.stepErrors.get(step);
      steps[step].callback(stepResult, stepError);
    }
  });
}
async function executeCursor(stream, steps, batch) {
  const cursor = await stream._openCursor(batch);
  try {
    let nextStep = 0;
    let beginEntry = void 0;
    let rows = [];
    for (; ; ) {
      const entry = await cursor.next();
      if (entry === void 0) {
        break;
      }
      if (entry.type === "step_begin") {
        if (entry.step < nextStep || entry.step >= steps.length) {
          throw new ProtoError("Server produced StepBeginEntry for unexpected step");
        } else if (beginEntry !== void 0) {
          throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
        }
        for (let step = nextStep; step < entry.step; ++step) {
          steps[step].callback(void 0, void 0);
        }
        nextStep = entry.step + 1;
        beginEntry = entry;
        rows = [];
      } else if (entry.type === "step_end") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced StepEndEntry but no step is active");
        }
        const stmtResult = {
          cols: beginEntry.cols,
          rows,
          affectedRowCount: entry.affectedRowCount,
          lastInsertRowid: entry.lastInsertRowid
        };
        steps[beginEntry.step].callback(stmtResult, void 0);
        beginEntry = void 0;
        rows = [];
      } else if (entry.type === "step_error") {
        if (beginEntry === void 0) {
          if (entry.step >= steps.length) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          for (let step = nextStep; step < entry.step; ++step) {
            steps[step].callback(void 0, void 0);
          }
        } else {
          if (entry.step !== beginEntry.step) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          beginEntry = void 0;
          rows = [];
        }
        steps[entry.step].callback(void 0, entry.error);
        nextStep = entry.step + 1;
      } else if (entry.type === "row") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced RowEntry but no step is active");
        }
        rows.push(entry.row);
      } else if (entry.type === "error") {
        throw errorFromProto(entry.error);
      } else if (entry.type === "none") {
        throw new ProtoError("Server produced unrecognized CursorEntry");
      } else {
        throw impossible(entry, "Impossible CursorEntry");
      }
    }
    if (beginEntry !== void 0) {
      throw new ProtoError("Server closed Cursor before terminating active step");
    }
    for (let step = nextStep; step < steps.length; ++step) {
      steps[step].callback(void 0, void 0);
    }
  } finally {
    cursor.close();
  }
}
function stepIndex(step) {
  if (step._index === void 0) {
    throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
  }
  return step._index;
}
function checkCondBatch(expectedBatch, cond) {
  if (cond._batch !== expectedBatch) {
    throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
  }
}
var Batch, BatchStep, BatchCond;
var init_batch = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/batch.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_result();
    init_stmt();
    init_util3();
    Batch = class {
      static {
        __name(this, "Batch");
      }
      /** @private */
      _stream;
      #useCursor;
      /** @private */
      _steps;
      #executed;
      /** @private */
      constructor(stream, useCursor) {
        this._stream = stream;
        this.#useCursor = useCursor;
        this._steps = [];
        this.#executed = false;
      }
      /** Return a builder for adding a step to the batch. */
      step() {
        return new BatchStep(this);
      }
      /** Execute the batch. */
      execute() {
        if (this.#executed) {
          throw new MisuseError("This batch has already been executed");
        }
        this.#executed = true;
        const batch = {
          steps: this._steps.map((step) => step.proto)
        };
        if (this.#useCursor) {
          return executeCursor(this._stream, this._steps, batch);
        } else {
          return executeRegular(this._stream, this._steps, batch);
        }
      }
    };
    __name(executeRegular, "executeRegular");
    __name(executeCursor, "executeCursor");
    BatchStep = class {
      static {
        __name(this, "BatchStep");
      }
      /** @private */
      _batch;
      #conds;
      /** @private */
      _index;
      /** @private */
      constructor(batch) {
        this._batch = batch;
        this.#conds = [];
        this._index = void 0;
      }
      /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
       * times, we join the conditions with a logical AND. */
      condition(cond) {
        this.#conds.push(cond._proto);
        return this;
      }
      /** Add a statement that returns rows. */
      query(stmt) {
        return this.#add(stmt, true, rowsResultFromProto);
      }
      /** Add a statement that returns at most a single row. */
      queryRow(stmt) {
        return this.#add(stmt, true, rowResultFromProto);
      }
      /** Add a statement that returns at most a single value. */
      queryValue(stmt) {
        return this.#add(stmt, true, valueResultFromProto);
      }
      /** Add a statement without returning rows. */
      run(stmt) {
        return this.#add(stmt, false, stmtResultFromProto);
      }
      #add(inStmt, wantRows, fromProto) {
        if (this._index !== void 0) {
          throw new MisuseError("This BatchStep has already been added to the batch");
        }
        const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
        let condition;
        if (this.#conds.length === 0) {
          condition = void 0;
        } else if (this.#conds.length === 1) {
          condition = this.#conds[0];
        } else {
          condition = { type: "and", conds: this.#conds.slice() };
        }
        const proto = { stmt, condition };
        return new Promise((outputCallback, errorCallback) => {
          const callback = /* @__PURE__ */ __name((stepResult, stepError) => {
            if (stepResult !== void 0 && stepError !== void 0) {
              errorCallback(new ProtoError("Server returned both result and error"));
            } else if (stepError !== void 0) {
              errorCallback(errorFromProto(stepError));
            } else if (stepResult !== void 0) {
              outputCallback(fromProto(stepResult, this._batch._stream.intMode));
            } else {
              outputCallback(void 0);
            }
          }, "callback");
          this._index = this._batch._steps.length;
          this._batch._steps.push({ proto, callback });
        });
      }
    };
    BatchCond = class _BatchCond {
      static {
        __name(this, "BatchCond");
      }
      /** @private */
      _batch;
      /** @private */
      _proto;
      /** @private */
      constructor(batch, proto) {
        this._batch = batch;
        this._proto = proto;
      }
      /** Create a condition that evaluates to true when the given step executes successfully.
       *
       * If the given step fails error or is skipped because its condition evaluated to false, this
       * condition evaluates to false.
       */
      static ok(step) {
        return new _BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
      }
      /** Create a condition that evaluates to true when the given step fails.
       *
       * If the given step succeeds or is skipped because its condition evaluated to false, this condition
       * evaluates to false.
       */
      static error(step) {
        return new _BatchCond(step._batch, { type: "error", step: stepIndex(step) });
      }
      /** Create a condition that is a logical negation of another condition.
       */
      static not(cond) {
        return new _BatchCond(cond._batch, { type: "not", cond: cond._proto });
      }
      /** Create a condition that is a logical AND of other conditions.
       */
      static and(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "and", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that is a logical OR of other conditions.
       */
      static or(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "or", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      static isAutocommit(batch) {
        batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
        return new _BatchCond(batch, { type: "is_autocommit" });
      }
    };
    __name(stepIndex, "stepIndex");
    __name(checkCondBatch, "checkCondBatch");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/describe.js
function describeResultFromProto(result) {
  return {
    paramNames: result.params.map((p) => p.name),
    columns: result.cols,
    isExplain: result.isExplain,
    isReadonly: result.isReadonly
  };
}
var init_describe = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/describe.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(describeResultFromProto, "describeResultFromProto");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/stream.js
var Stream;
var init_stream = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/stream.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_batch();
    init_describe();
    init_result();
    init_sql();
    init_stmt();
    Stream = class {
      static {
        __name(this, "Stream");
      }
      /** @private */
      constructor(intMode) {
        this.intMode = intMode;
      }
      /** Execute a statement and return rows. */
      query(stmt) {
        return this.#execute(stmt, true, rowsResultFromProto);
      }
      /** Execute a statement and return at most a single row. */
      queryRow(stmt) {
        return this.#execute(stmt, true, rowResultFromProto);
      }
      /** Execute a statement and return at most a single value. */
      queryValue(stmt) {
        return this.#execute(stmt, true, valueResultFromProto);
      }
      /** Execute a statement without returning rows. */
      run(stmt) {
        return this.#execute(stmt, false, stmtResultFromProto);
      }
      #execute(inStmt, wantRows, fromProto) {
        const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
        return this._execute(stmt).then((r) => fromProto(r, this.intMode));
      }
      /** Return a builder for creating and executing a batch.
       *
       * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
       * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
       * higher.
       */
      batch(useCursor = false) {
        return new Batch(this, useCursor);
      }
      /** Parse and analyze a statement. This requires protocol version 2 or higher. */
      describe(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._describe(protoSql).then(describeResultFromProto);
      }
      /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
       * */
      sequence(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._sequence(protoSql);
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value affects the results of all operations on this stream.
       */
      intMode;
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/cursor.js
var Cursor;
var init_cursor = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/cursor.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Cursor = class {
      static {
        __name(this, "Cursor");
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js
var fetchChunkSize, fetchQueueSize, WsCursor;
var init_cursor2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_cursor();
    init_queue();
    fetchChunkSize = 1e3;
    fetchQueueSize = 10;
    WsCursor = class extends Cursor {
      static {
        __name(this, "WsCursor");
      }
      #client;
      #stream;
      #cursorId;
      #entryQueue;
      #fetchQueue;
      #closed;
      #done;
      /** @private */
      constructor(client, stream, cursorId) {
        super();
        this.#client = client;
        this.#stream = stream;
        this.#cursorId = cursorId;
        this.#entryQueue = new Queue();
        this.#fetchQueue = new Queue();
        this.#closed = void 0;
        this.#done = false;
      }
      /** Fetch the next entry from the cursor. */
      async next() {
        for (; ; ) {
          if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
            this.#fetchQueue.push(this.#fetch());
          }
          const entry = this.#entryQueue.shift();
          if (this.#done || entry !== void 0) {
            return entry;
          }
          await this.#fetchQueue.shift().then((response) => {
            if (response === void 0) {
              return;
            }
            for (const entry2 of response.entries) {
              this.#entryQueue.push(entry2);
            }
            this.#done ||= response.done;
          });
        }
      }
      #fetch() {
        return this.#stream._sendCursorRequest(this, {
          type: "fetch_cursor",
          cursorId: this.#cursorId,
          maxCount: fetchChunkSize
        }).then((resp) => resp, (error3) => {
          this._setClosed(error3);
          return void 0;
        });
      }
      /** @private */
      _setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        this.#stream._sendCursorRequest(this, {
          type: "close_cursor",
          cursorId: this.#cursorId
        }).catch(() => void 0);
        this.#stream._cursorClosed(this);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/stream.js
var WsStream;
var init_stream2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/stream.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_queue();
    init_stream();
    init_cursor2();
    WsStream = class _WsStream extends Stream {
      static {
        __name(this, "WsStream");
      }
      #client;
      #streamId;
      #queue;
      #cursor;
      #closing;
      #closed;
      /** @private */
      static open(client) {
        const streamId = client._streamIdAlloc.alloc();
        const stream = new _WsStream(client, streamId);
        const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => stream.#setClosed(e), "errorCallback");
        const request3 = { type: "open_stream", streamId };
        client._sendRequest(request3, { responseCallback, errorCallback });
        return stream;
      }
      /** @private */
      constructor(client, streamId) {
        super(client.intMode);
        this.#client = client;
        this.#streamId = streamId;
        this.#queue = new Queue();
        this.#cursor = void 0;
        this.#closing = false;
        this.#closed = void 0;
      }
      /** Get the {@link WsClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this.#client;
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({
          type: "execute",
          streamId: this.#streamId,
          stmt
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({
          type: "batch",
          streamId: this.#streamId,
          batch
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        this.#client._ensureVersion(2, "describe()");
        return this.#sendStreamRequest({
          type: "describe",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        this.#client._ensureVersion(2, "sequence()");
        return this.#sendStreamRequest({
          type: "sequence",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit",
          streamId: this.#streamId
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request3) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "request", request: request3, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        this.#client._ensureVersion(3, "cursor");
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _sendCursorRequest(cursor, request3) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor not associated with the stream attempted to execute a request");
        }
        return new Promise((responseCallback, errorCallback) => {
          if (this.#closed !== void 0) {
            errorCallback(new ClosedError("Stream is closed", this.#closed));
          } else {
            this.#client._sendRequest(request3, { responseCallback, errorCallback });
          }
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        this.#flushQueue();
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
        } else if (this.#closing) {
          entry.errorCallback(new ClosedError("Stream is closing", void 0));
        } else {
          this.#queue.push(entry);
          this.#flushQueue();
        }
      }
      #flushQueue() {
        for (; ; ) {
          const entry = this.#queue.first();
          if (entry === void 0 && this.#cursor === void 0 && this.#closing) {
            this.#setClosed(new ClientError("Stream was gracefully closed"));
            break;
          } else if (entry?.type === "request" && this.#cursor === void 0) {
            const { request: request3, responseCallback, errorCallback } = entry;
            this.#queue.shift();
            this.#client._sendRequest(request3, { responseCallback, errorCallback });
          } else if (entry?.type === "cursor" && this.#cursor === void 0) {
            const { batch, cursorCallback } = entry;
            this.#queue.shift();
            const cursorId = this.#client._cursorIdAlloc.alloc();
            const cursor = new WsCursor(this.#client, this, cursorId);
            const request3 = {
              type: "open_cursor",
              streamId: this.#streamId,
              cursorId,
              batch
            };
            const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
            const errorCallback = /* @__PURE__ */ __name((e) => cursor._setClosed(e), "errorCallback");
            this.#client._sendRequest(request3, { responseCallback, errorCallback });
            this.#cursor = cursor;
            cursorCallback(cursor);
          } else {
            break;
          }
        }
      }
      #setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error3);
        }
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error3);
          } else {
            break;
          }
        }
        const request3 = { type: "close_stream", streamId: this.#streamId };
        const responseCallback = /* @__PURE__ */ __name(() => this.#client._streamIdAlloc.free(this.#streamId), "responseCallback");
        const errorCallback = /* @__PURE__ */ __name(() => void 0, "errorCallback");
        this.#client._sendRequest(request3, { responseCallback, errorCallback });
      }
      /** Immediately close the stream. */
      close() {
        this.#setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        this.#flushQueue();
      }
      /** True if the stream is closed or closing. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js
function Stmt2(w, msg) {
  if (msg.sql !== void 0) {
    w.string("sql", msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.number("sql_id", msg.sqlId);
  }
  w.arrayObjects("args", msg.args, Value);
  w.arrayObjects("named_args", msg.namedArgs, NamedArg);
  w.boolean("want_rows", msg.wantRows);
}
function NamedArg(w, msg) {
  w.string("name", msg.name);
  w.object("value", msg.value, Value);
}
function Batch2(w, msg) {
  w.arrayObjects("steps", msg.steps, BatchStep2);
}
function BatchStep2(w, msg) {
  if (msg.condition !== void 0) {
    w.object("condition", msg.condition, BatchCond2);
  }
  w.object("stmt", msg.stmt, Stmt2);
}
function BatchCond2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "ok" || msg.type === "error") {
    w.number("step", msg.step);
  } else if (msg.type === "not") {
    w.object("cond", msg.cond, BatchCond2);
  } else if (msg.type === "and" || msg.type === "or") {
    w.arrayObjects("conds", msg.conds, BatchCond2);
  } else if (msg.type === "is_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function Value(w, msg) {
  if (msg === null) {
    w.stringRaw("type", "null");
  } else if (typeof msg === "bigint") {
    w.stringRaw("type", "integer");
    w.stringRaw("value", "" + msg);
  } else if (typeof msg === "number") {
    w.stringRaw("type", "float");
    w.number("value", msg);
  } else if (typeof msg === "string") {
    w.stringRaw("type", "text");
    w.string("value", msg);
  } else if (msg instanceof Uint8Array) {
    w.stringRaw("type", "blob");
    w.stringRaw("base64", gBase64.fromUint8Array(msg));
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
var init_json_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_base64();
    init_util3();
    __name(Stmt2, "Stmt");
    __name(NamedArg, "NamedArg");
    __name(Batch2, "Batch");
    __name(BatchStep2, "BatchStep");
    __name(BatchCond2, "BatchCond");
    __name(Value, "Value");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js
function ClientMsg(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "hello") {
    if (msg.jwt !== void 0) {
      w.string("jwt", msg.jwt);
    }
  } else if (msg.type === "request") {
    w.number("request_id", msg.requestId);
    w.object("request", msg.request, Request2);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function Request2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "open_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "close_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "execute") {
    w.number("stream_id", msg.streamId);
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.number("stream_id", msg.streamId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "open_cursor") {
    w.number("stream_id", msg.streamId);
    w.number("cursor_id", msg.cursorId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "close_cursor") {
    w.number("cursor_id", msg.cursorId);
  } else if (msg.type === "fetch_cursor") {
    w.number("cursor_id", msg.cursorId);
    w.number("max_count", msg.maxCount);
  } else if (msg.type === "sequence") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
    w.number("stream_id", msg.streamId);
  } else {
    throw impossible(msg, "Impossible type of Request");
  }
}
var init_json_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_json_encode();
    init_util3();
    __name(ClientMsg, "ClientMsg");
    __name(Request2, "Request");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js
function Stmt3(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
  for (const arg of msg.args) {
    w.message(3, arg, Value2);
  }
  for (const arg of msg.namedArgs) {
    w.message(4, arg, NamedArg2);
  }
  w.bool(5, msg.wantRows);
}
function NamedArg2(w, msg) {
  w.string(1, msg.name);
  w.message(2, msg.value, Value2);
}
function Batch3(w, msg) {
  for (const step of msg.steps) {
    w.message(1, step, BatchStep3);
  }
}
function BatchStep3(w, msg) {
  if (msg.condition !== void 0) {
    w.message(1, msg.condition, BatchCond3);
  }
  w.message(2, msg.stmt, Stmt3);
}
function BatchCond3(w, msg) {
  if (msg.type === "ok") {
    w.uint32(1, msg.step);
  } else if (msg.type === "error") {
    w.uint32(2, msg.step);
  } else if (msg.type === "not") {
    w.message(3, msg.cond, BatchCond3);
  } else if (msg.type === "and") {
    w.message(4, msg.conds, BatchCondList);
  } else if (msg.type === "or") {
    w.message(5, msg.conds, BatchCondList);
  } else if (msg.type === "is_autocommit") {
    w.message(6, void 0, Empty);
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function BatchCondList(w, msg) {
  for (const cond of msg) {
    w.message(1, cond, BatchCond3);
  }
}
function Value2(w, msg) {
  if (msg === null) {
    w.message(1, void 0, Empty);
  } else if (typeof msg === "bigint") {
    w.sint64(2, msg);
  } else if (typeof msg === "number") {
    w.double(3, msg);
  } else if (typeof msg === "string") {
    w.string(4, msg);
  } else if (msg instanceof Uint8Array) {
    w.bytes(5, msg);
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
function Empty(_w, _msg) {
}
var init_protobuf_encode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_util3();
    __name(Stmt3, "Stmt");
    __name(NamedArg2, "NamedArg");
    __name(Batch3, "Batch");
    __name(BatchStep3, "BatchStep");
    __name(BatchCond3, "BatchCond");
    __name(BatchCondList, "BatchCondList");
    __name(Value2, "Value");
    __name(Empty, "Empty");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js
function ClientMsg2(w, msg) {
  if (msg.type === "hello") {
    w.message(1, msg, HelloMsg);
  } else if (msg.type === "request") {
    w.message(2, msg, RequestMsg);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function HelloMsg(w, msg) {
  if (msg.jwt !== void 0) {
    w.string(1, msg.jwt);
  }
}
function RequestMsg(w, msg) {
  w.int32(1, msg.requestId);
  const request3 = msg.request;
  if (request3.type === "open_stream") {
    w.message(2, request3, OpenStreamReq);
  } else if (request3.type === "close_stream") {
    w.message(3, request3, CloseStreamReq);
  } else if (request3.type === "execute") {
    w.message(4, request3, ExecuteReq);
  } else if (request3.type === "batch") {
    w.message(5, request3, BatchReq);
  } else if (request3.type === "open_cursor") {
    w.message(6, request3, OpenCursorReq);
  } else if (request3.type === "close_cursor") {
    w.message(7, request3, CloseCursorReq);
  } else if (request3.type === "fetch_cursor") {
    w.message(8, request3, FetchCursorReq);
  } else if (request3.type === "sequence") {
    w.message(9, request3, SequenceReq);
  } else if (request3.type === "describe") {
    w.message(10, request3, DescribeReq);
  } else if (request3.type === "store_sql") {
    w.message(11, request3, StoreSqlReq);
  } else if (request3.type === "close_sql") {
    w.message(12, request3, CloseSqlReq);
  } else if (request3.type === "get_autocommit") {
    w.message(13, request3, GetAutocommitReq);
  } else {
    throw impossible(request3, "Impossible type of Request");
  }
}
function OpenStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function CloseStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.stmt, Stmt3);
}
function BatchReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.batch, Batch3);
}
function OpenCursorReq(w, msg) {
  w.int32(1, msg.streamId);
  w.int32(2, msg.cursorId);
  w.message(3, msg.batch, Batch3);
}
function CloseCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
  w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function DescribeReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function StoreSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
  w.int32(1, msg.streamId);
}
var init_protobuf_encode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_protobuf_encode();
    init_util3();
    __name(ClientMsg2, "ClientMsg");
    __name(HelloMsg, "HelloMsg");
    __name(RequestMsg, "RequestMsg");
    __name(OpenStreamReq, "OpenStreamReq");
    __name(CloseStreamReq, "CloseStreamReq");
    __name(ExecuteReq, "ExecuteReq");
    __name(BatchReq, "BatchReq");
    __name(OpenCursorReq, "OpenCursorReq");
    __name(CloseCursorReq, "CloseCursorReq");
    __name(FetchCursorReq, "FetchCursorReq");
    __name(SequenceReq, "SequenceReq");
    __name(DescribeReq, "DescribeReq");
    __name(StoreSqlReq, "StoreSqlReq");
    __name(CloseSqlReq, "CloseSqlReq");
    __name(GetAutocommitReq, "GetAutocommitReq");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js
function Error2(obj) {
  const message = string(obj["message"]);
  const code = stringOpt(obj["code"]);
  return { message, code };
}
function StmtResult(obj) {
  const cols = arrayObjectsMap(obj["cols"], Col);
  const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value3));
  const affectedRowCount = number(obj["affected_row_count"]);
  const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
  const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
  return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col(obj) {
  const name = stringOpt(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function BatchResult(obj) {
  const stepResults = /* @__PURE__ */ new Map();
  array(obj["step_results"]).forEach((value, i) => {
    if (value !== null) {
      stepResults.set(i, StmtResult(object(value)));
    }
  });
  const stepErrors = /* @__PURE__ */ new Map();
  array(obj["step_errors"]).forEach((value, i) => {
    if (value !== null) {
      stepErrors.set(i, Error2(object(value)));
    }
  });
  return { stepResults, stepErrors };
}
function CursorEntry(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "step_begin") {
    const step = number(obj["step"]);
    const cols = arrayObjectsMap(obj["cols"], Col);
    return { type: "step_begin", step, cols };
  } else if (type2 === "step_end") {
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
    return { type: "step_end", affectedRowCount, lastInsertRowid };
  } else if (type2 === "step_error") {
    const step = number(obj["step"]);
    const error3 = Error2(object(obj["error"]));
    return { type: "step_error", step, error: error3 };
  } else if (type2 === "row") {
    const row = arrayObjectsMap(obj["row"], Value3);
    return { type: "row", row };
  } else if (type2 === "error") {
    const error3 = Error2(object(obj["error"]));
    return { type: "error", error: error3 };
  } else {
    throw new ProtoError("Unexpected type of CursorEntry");
  }
}
function DescribeResult(obj) {
  const params = arrayObjectsMap(obj["params"], DescribeParam);
  const cols = arrayObjectsMap(obj["cols"], DescribeCol);
  const isExplain = boolean(obj["is_explain"]);
  const isReadonly = boolean(obj["is_readonly"]);
  return { params, cols, isExplain, isReadonly };
}
function DescribeParam(obj) {
  const name = stringOpt(obj["name"]);
  return { name };
}
function DescribeCol(obj) {
  const name = string(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function Value3(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "null") {
    return null;
  } else if (type2 === "integer") {
    const value = string(obj["value"]);
    return BigInt(value);
  } else if (type2 === "float") {
    return number(obj["value"]);
  } else if (type2 === "text") {
    return string(obj["value"]);
  } else if (type2 === "blob") {
    return gBase64.toUint8Array(string(obj["base64"]));
  } else {
    throw new ProtoError("Unexpected type of Value");
  }
}
var init_json_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_base64();
    init_errors();
    init_decode();
    __name(Error2, "Error");
    __name(StmtResult, "StmtResult");
    __name(Col, "Col");
    __name(BatchResult, "BatchResult");
    __name(CursorEntry, "CursorEntry");
    __name(DescribeResult, "DescribeResult");
    __name(DescribeParam, "DescribeParam");
    __name(DescribeCol, "DescribeCol");
    __name(Value3, "Value");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js
function ServerMsg(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "hello_ok") {
    return { type: "hello_ok" };
  } else if (type2 === "hello_error") {
    const error3 = Error2(object(obj["error"]));
    return { type: "hello_error", error: error3 };
  } else if (type2 === "response_ok") {
    const requestId = number(obj["request_id"]);
    const response = Response2(object(obj["response"]));
    return { type: "response_ok", requestId, response };
  } else if (type2 === "response_error") {
    const requestId = number(obj["request_id"]);
    const error3 = Error2(object(obj["error"]));
    return { type: "response_error", requestId, error: error3 };
  } else {
    throw new ProtoError("Unexpected type of ServerMsg");
  }
}
function Response2(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "open_stream") {
    return { type: "open_stream" };
  } else if (type2 === "close_stream") {
    return { type: "close_stream" };
  } else if (type2 === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type2 === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type2 === "open_cursor") {
    return { type: "open_cursor" };
  } else if (type2 === "close_cursor") {
    return { type: "close_cursor" };
  } else if (type2 === "fetch_cursor") {
    const entries = arrayObjectsMap(obj["entries"], CursorEntry);
    const done = boolean(obj["done"]);
    return { type: "fetch_cursor", entries, done };
  } else if (type2 === "sequence") {
    return { type: "sequence" };
  } else if (type2 === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type2 === "store_sql") {
    return { type: "store_sql" };
  } else if (type2 === "close_sql") {
    return { type: "close_sql" };
  } else if (type2 === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of Response");
  }
}
var init_json_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_decode();
    init_json_decode();
    __name(ServerMsg, "ServerMsg");
    __name(Response2, "Response");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js
var Error3, StmtResult2, Col2, Row, BatchResult2, BatchResultStepResult, BatchResultStepError, CursorEntry2, StepBeginEntry, StepEndEntry, StepErrorEntry, DescribeResult2, DescribeParam2, DescribeCol2, Value4;
var init_protobuf_decode = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Error3 = {
      default() {
        return { message: "", code: void 0 };
      },
      1(r, msg) {
        msg.message = r.string();
      },
      2(r, msg) {
        msg.code = r.string();
      }
    };
    StmtResult2 = {
      default() {
        return {
          cols: [],
          rows: [],
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.cols.push(r.message(Col2));
      },
      2(r, msg) {
        msg.rows.push(r.message(Row));
      },
      3(r, msg) {
        msg.affectedRowCount = Number(r.uint64());
      },
      4(r, msg) {
        msg.lastInsertRowid = r.sint64();
      }
    };
    Col2 = {
      default() {
        return { name: void 0, decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Row = {
      default() {
        return [];
      },
      1(r, msg) {
        msg.push(r.message(Value4));
      }
    };
    BatchResult2 = {
      default() {
        return { stepResults: /* @__PURE__ */ new Map(), stepErrors: /* @__PURE__ */ new Map() };
      },
      1(r, msg) {
        const [key, value] = r.message(BatchResultStepResult);
        msg.stepResults.set(key, value);
      },
      2(r, msg) {
        const [key, value] = r.message(BatchResultStepError);
        msg.stepErrors.set(key, value);
      }
    };
    BatchResultStepResult = {
      default() {
        return [0, StmtResult2.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(StmtResult2);
      }
    };
    BatchResultStepError = {
      default() {
        return [0, Error3.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(Error3);
      }
    };
    CursorEntry2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return r.message(StepBeginEntry);
      },
      2(r) {
        return r.message(StepEndEntry);
      },
      3(r) {
        return r.message(StepErrorEntry);
      },
      4(r) {
        return { type: "row", row: r.message(Row) };
      },
      5(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StepBeginEntry = {
      default() {
        return { type: "step_begin", step: 0, cols: [] };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.cols.push(r.message(Col2));
      }
    };
    StepEndEntry = {
      default() {
        return {
          type: "step_end",
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.affectedRowCount = r.uint32();
      },
      2(r, msg) {
        msg.lastInsertRowid = r.uint64();
      }
    };
    StepErrorEntry = {
      default() {
        return {
          type: "step_error",
          step: 0,
          error: Error3.default()
        };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    DescribeResult2 = {
      default() {
        return {
          params: [],
          cols: [],
          isExplain: false,
          isReadonly: false
        };
      },
      1(r, msg) {
        msg.params.push(r.message(DescribeParam2));
      },
      2(r, msg) {
        msg.cols.push(r.message(DescribeCol2));
      },
      3(r, msg) {
        msg.isExplain = r.bool();
      },
      4(r, msg) {
        msg.isReadonly = r.bool();
      }
    };
    DescribeParam2 = {
      default() {
        return { name: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      }
    };
    DescribeCol2 = {
      default() {
        return { name: "", decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Value4 = {
      default() {
        return void 0;
      },
      1(r) {
        return null;
      },
      2(r) {
        return r.sint64();
      },
      3(r) {
        return r.double();
      },
      4(r) {
        return r.string();
      },
      5(r) {
        return r.bytes();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js
var ServerMsg2, HelloErrorMsg, ResponseErrorMsg, ResponseOkMsg, ExecuteResp, BatchResp, FetchCursorResp, DescribeResp, GetAutocommitResp;
var init_protobuf_decode2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_protobuf_decode();
    ServerMsg2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "hello_ok" };
      },
      2(r) {
        return r.message(HelloErrorMsg);
      },
      3(r) {
        return r.message(ResponseOkMsg);
      },
      4(r) {
        return r.message(ResponseErrorMsg);
      }
    };
    HelloErrorMsg = {
      default() {
        return { type: "hello_error", error: Error3.default() };
      },
      1(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseErrorMsg = {
      default() {
        return { type: "response_error", requestId: 0, error: Error3.default() };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseOkMsg = {
      default() {
        return {
          type: "response_ok",
          requestId: 0,
          response: { type: "none" }
        };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.response = { type: "open_stream" };
      },
      3(r, msg) {
        msg.response = { type: "close_stream" };
      },
      4(r, msg) {
        msg.response = r.message(ExecuteResp);
      },
      5(r, msg) {
        msg.response = r.message(BatchResp);
      },
      6(r, msg) {
        msg.response = { type: "open_cursor" };
      },
      7(r, msg) {
        msg.response = { type: "close_cursor" };
      },
      8(r, msg) {
        msg.response = r.message(FetchCursorResp);
      },
      9(r, msg) {
        msg.response = { type: "sequence" };
      },
      10(r, msg) {
        msg.response = r.message(DescribeResp);
      },
      11(r, msg) {
        msg.response = { type: "store_sql" };
      },
      12(r, msg) {
        msg.response = { type: "close_sql" };
      },
      13(r, msg) {
        msg.response = r.message(GetAutocommitResp);
      }
    };
    ExecuteResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    FetchCursorResp = {
      default() {
        return { type: "fetch_cursor", entries: [], done: false };
      },
      1(r, msg) {
        msg.entries.push(r.message(CursorEntry2));
      },
      2(r, msg) {
        msg.done = r.bool();
      }
    };
    DescribeResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/ws/client.js
var subprotocolsV2, subprotocolsV3, WsClient;
var init_client2 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/ws/client.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_client();
    init_encoding();
    init_errors();
    init_id_alloc();
    init_result();
    init_sql();
    init_util3();
    init_stream2();
    init_json_encode2();
    init_protobuf_encode2();
    init_json_decode2();
    init_protobuf_decode2();
    subprotocolsV2 = /* @__PURE__ */ new Map([
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    subprotocolsV3 = /* @__PURE__ */ new Map([
      ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
      ["hrana3", { version: 3, encoding: "json" }],
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    WsClient = class extends Client {
      static {
        __name(this, "WsClient");
      }
      #socket;
      // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
      #openCallbacks;
      // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
      #opened;
      // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
      // `undefined`.
      #closed;
      // Have we received a response to our "hello" from the server?
      #recvdHello;
      // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
      // state.
      #subprotocol;
      // Has the `getVersion()` function been called? This is only used to validate that the API is used
      // correctly.
      #getVersionCalled;
      // A map from request id to the responses that we expect to receive from the server.
      #responseMap;
      // An allocator of request ids.
      #requestIdAlloc;
      // An allocator of stream ids.
      /** @private */
      _streamIdAlloc;
      // An allocator of cursor ids.
      /** @private */
      _cursorIdAlloc;
      // An allocator of SQL text ids.
      #sqlIdAlloc;
      /** @private */
      constructor(socket, jwt) {
        super();
        this.#socket = socket;
        this.#openCallbacks = [];
        this.#opened = false;
        this.#closed = void 0;
        this.#recvdHello = false;
        this.#subprotocol = void 0;
        this.#getVersionCalled = false;
        this.#responseMap = /* @__PURE__ */ new Map();
        this.#requestIdAlloc = new IdAlloc();
        this._streamIdAlloc = new IdAlloc();
        this._cursorIdAlloc = new IdAlloc();
        this.#sqlIdAlloc = new IdAlloc();
        this.#socket.binaryType = "arraybuffer";
        this.#socket.addEventListener("open", () => this.#onSocketOpen());
        this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
        this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
        this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
        this.#send({ type: "hello", jwt });
      }
      // Send (or enqueue to send) a message to the server.
      #send(msg) {
        if (this.#closed !== void 0) {
          throw new InternalError("Trying to send a message on a closed client");
        }
        if (this.#opened) {
          this.#sendToSocket(msg);
        } else {
          const openCallback = /* @__PURE__ */ __name(() => this.#sendToSocket(msg), "openCallback");
          const errorCallback = /* @__PURE__ */ __name(() => void 0, "errorCallback");
          this.#openCallbacks.push({ openCallback, errorCallback });
        }
      }
      // The socket transitioned from CONNECTING to OPEN
      #onSocketOpen() {
        const protocol = this.#socket.protocol;
        if (protocol === void 0) {
          this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket implementation provided by the environment is broken. If you are using Miniflare 2, please update to Miniflare 3, which fixes this problem."));
          return;
        } else if (protocol === "") {
          this.#subprotocol = { version: 1, encoding: "json" };
        } else {
          this.#subprotocol = subprotocolsV3.get(protocol);
          if (this.#subprotocol === void 0) {
            this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
            return;
          }
        }
        for (const callbacks of this.#openCallbacks) {
          callbacks.openCallback();
        }
        this.#openCallbacks.length = 0;
        this.#opened = true;
      }
      #sendToSocket(msg) {
        const encoding = this.#subprotocol.encoding;
        if (encoding === "json") {
          const jsonMsg = writeJsonObject(msg, ClientMsg);
          this.#socket.send(jsonMsg);
        } else if (encoding === "protobuf") {
          const protobufMsg = writeProtobufMessage(msg, ClientMsg2);
          this.#socket.send(protobufMsg);
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
      }
      /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
      getVersion() {
        return new Promise((versionCallback, errorCallback) => {
          this.#getVersionCalled = true;
          if (this.#closed !== void 0) {
            errorCallback(this.#closed);
          } else if (!this.#opened) {
            const openCallback = /* @__PURE__ */ __name(() => versionCallback(this.#subprotocol.version), "openCallback");
            this.#openCallbacks.push({ openCallback, errorCallback });
          } else {
            versionCallback(this.#subprotocol.version);
          }
        });
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (this.#subprotocol === void 0 || !this.#getVersionCalled) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the WebSocket server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this.#subprotocol.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, but the WebSocket server only supports version ${this.#subprotocol.version}`);
        }
      }
      // Send a request to the server and invoke a callback when we get the response.
      /** @private */
      _sendRequest(request3, callbacks) {
        if (this.#closed !== void 0) {
          callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
          return;
        }
        const requestId = this.#requestIdAlloc.alloc();
        this.#responseMap.set(requestId, { ...callbacks, type: request3.type });
        this.#send({ type: "request", requestId, request: request3 });
      }
      // The socket encountered an error.
      #onSocketError(event) {
        const eventMessage = event.message;
        const message = eventMessage ?? "WebSocket was closed due to an error";
        this.#setClosed(new WebSocketError(message));
      }
      // The socket was closed.
      #onSocketClose(event) {
        let message = `WebSocket was closed with code ${event.code}`;
        if (event.reason) {
          message += `: ${event.reason}`;
        }
        this.#setClosed(new WebSocketError(message));
      }
      // Close the client with the given error.
      #setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        for (const callbacks of this.#openCallbacks) {
          callbacks.errorCallback(error3);
        }
        this.#openCallbacks.length = 0;
        for (const [requestId, responseState] of this.#responseMap.entries()) {
          responseState.errorCallback(error3);
          this.#requestIdAlloc.free(requestId);
        }
        this.#responseMap.clear();
        this.#socket.close();
      }
      // We received a message from the socket.
      #onSocketMessage(event) {
        if (this.#closed !== void 0) {
          return;
        }
        try {
          let msg;
          const encoding = this.#subprotocol.encoding;
          if (encoding === "json") {
            if (typeof event.data !== "string") {
              this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
              this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
              return;
            }
            msg = readJsonObject(JSON.parse(event.data), ServerMsg);
          } else if (encoding === "protobuf") {
            if (!(event.data instanceof ArrayBuffer)) {
              this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
              this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
              return;
            }
            msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg2);
          } else {
            throw impossible(encoding, "Impossible encoding");
          }
          this.#handleMsg(msg);
        } catch (e) {
          this.#socket.close(3007, "Could not handle message");
          this.#setClosed(e);
        }
      }
      // Handle a message from the server.
      #handleMsg(msg) {
        if (msg.type === "none") {
          throw new ProtoError("Received an unrecognized ServerMsg");
        } else if (msg.type === "hello_ok" || msg.type === "hello_error") {
          if (this.#recvdHello) {
            throw new ProtoError("Received a duplicated hello response");
          }
          this.#recvdHello = true;
          if (msg.type === "hello_error") {
            throw errorFromProto(msg.error);
          }
          return;
        } else if (!this.#recvdHello) {
          throw new ProtoError("Received a non-hello message before a hello response");
        }
        if (msg.type === "response_ok") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected OK response");
          }
          this.#requestIdAlloc.free(requestId);
          try {
            if (responseState.type !== msg.response.type) {
              console.dir({ responseState, msg });
              throw new ProtoError("Received unexpected type of response");
            }
            responseState.responseCallback(msg.response);
          } catch (e) {
            responseState.errorCallback(e);
            throw e;
          }
        } else if (msg.type === "response_error") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected error response");
          }
          this.#requestIdAlloc.free(requestId);
          responseState.errorCallback(errorFromProto(msg.error));
        } else {
          throw impossible(msg, "Impossible ServerMsg type");
        }
      }
      /** Open a {@link WsStream}, a stream for executing SQL statements. */
      openStream() {
        return WsStream.open(this);
      }
      /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
      storeSql(sql) {
        this._ensureVersion(2, "storeSql()");
        const sqlId = this.#sqlIdAlloc.alloc();
        const sqlObj = new Sql(this, sqlId);
        const responseCallback = /* @__PURE__ */ __name(() => void 0, "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => sqlObj._setClosed(e), "errorCallback");
        const request3 = { type: "store_sql", sqlId, sql };
        this._sendRequest(request3, { responseCallback, errorCallback });
        return sqlObj;
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        const responseCallback = /* @__PURE__ */ __name(() => this.#sqlIdAlloc.free(sqlId), "responseCallback");
        const errorCallback = /* @__PURE__ */ __name((e) => this.#setClosed(e), "errorCallback");
        const request3 = { type: "close_sql", sqlId };
        this._sendRequest(request3, { responseCallback, errorCallback });
      }
      /** Close the client and the WebSocket. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/npm/cross-fetch.mjs
var fetch2, Headers, Request3, Response3;
var init_cross_fetch = __esm({
  "../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/npm/cross-fetch.mjs"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    fetch2 = /* @__PURE__ */ __name((...args) => globalThis.fetch(...args), "fetch");
    Headers = globalThis.Headers;
    Request3 = globalThis.Request;
    Response3 = globalThis.Response;
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js
var _queueMicrotask;
var init_queue_microtask = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    if (typeof queueMicrotask !== "undefined") {
      _queueMicrotask = queueMicrotask;
    } else {
      const resolved = Promise.resolve();
      _queueMicrotask = /* @__PURE__ */ __name((callback) => {
        resolved.then(callback);
      }, "_queueMicrotask");
    }
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/byte_queue.js
var ByteQueue;
var init_byte_queue = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/byte_queue.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ByteQueue = class {
      static {
        __name(this, "ByteQueue");
      }
      #array;
      #shiftPos;
      #pushPos;
      constructor(initialCap) {
        this.#array = new Uint8Array(new ArrayBuffer(initialCap));
        this.#shiftPos = 0;
        this.#pushPos = 0;
      }
      get length() {
        return this.#pushPos - this.#shiftPos;
      }
      data() {
        return this.#array.slice(this.#shiftPos, this.#pushPos);
      }
      push(chunk) {
        this.#ensurePush(chunk.byteLength);
        this.#array.set(chunk, this.#pushPos);
        this.#pushPos += chunk.byteLength;
      }
      #ensurePush(pushLength) {
        if (this.#pushPos + pushLength <= this.#array.byteLength) {
          return;
        }
        const filledLength = this.#pushPos - this.#shiftPos;
        if (filledLength + pushLength <= this.#array.byteLength && 2 * this.#pushPos >= this.#array.byteLength) {
          this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
        } else {
          let newCap = this.#array.byteLength;
          do {
            newCap *= 2;
          } while (filledLength + pushLength > newCap);
          const newArray = new Uint8Array(new ArrayBuffer(newCap));
          newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
          this.#array = newArray;
        }
        this.#pushPos = filledLength;
        this.#shiftPos = 0;
      }
      shift(length) {
        this.#shiftPos += length;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js
function PipelineRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  const results = arrayObjectsMap(obj["results"], StreamResult);
  return { baton, baseUrl, results };
}
function StreamResult(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "ok") {
    const response = StreamResponse(object(obj["response"]));
    return { type: "ok", response };
  } else if (type2 === "error") {
    const error3 = Error2(object(obj["error"]));
    return { type: "error", error: error3 };
  } else {
    throw new ProtoError("Unexpected type of StreamResult");
  }
}
function StreamResponse(obj) {
  const type2 = string(obj["type"]);
  if (type2 === "close") {
    return { type: "close" };
  } else if (type2 === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type2 === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type2 === "sequence") {
    return { type: "sequence" };
  } else if (type2 === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type2 === "store_sql") {
    return { type: "store_sql" };
  } else if (type2 === "close_sql") {
    return { type: "close_sql" };
  } else if (type2 === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of StreamResponse");
  }
}
function CursorRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  return { baton, baseUrl };
}
var init_json_decode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_decode();
    init_json_decode();
    __name(PipelineRespBody, "PipelineRespBody");
    __name(StreamResult, "StreamResult");
    __name(StreamResponse, "StreamResponse");
    __name(CursorRespBody, "CursorRespBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js
var PipelineRespBody2, StreamResult2, StreamResponse2, ExecuteStreamResp, BatchStreamResp, DescribeStreamResp, GetAutocommitStreamResp, CursorRespBody2;
var init_protobuf_decode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_protobuf_decode();
    PipelineRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0, results: [] };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      },
      3(r, msg) {
        msg.results.push(r.message(StreamResult2));
      }
    };
    StreamResult2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "ok", response: r.message(StreamResponse2) };
      },
      2(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StreamResponse2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "close" };
      },
      2(r) {
        return r.message(ExecuteStreamResp);
      },
      3(r) {
        return r.message(BatchStreamResp);
      },
      4(r) {
        return { type: "sequence" };
      },
      5(r) {
        return r.message(DescribeStreamResp);
      },
      6(r) {
        return { type: "store_sql" };
      },
      7(r) {
        return { type: "close_sql" };
      },
      8(r) {
        return r.message(GetAutocommitStreamResp);
      }
    };
    ExecuteStreamResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchStreamResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    DescribeStreamResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitStreamResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
    CursorRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0 };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/cursor.js
var HttpCursor;
var init_cursor3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/cursor.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_byte_queue();
    init_cursor();
    init_decode();
    init_decode2();
    init_errors();
    init_util3();
    init_json_decode3();
    init_protobuf_decode3();
    init_json_decode();
    init_protobuf_decode();
    HttpCursor = class extends Cursor {
      static {
        __name(this, "HttpCursor");
      }
      #stream;
      #encoding;
      #reader;
      #queue;
      #closed;
      #done;
      /** @private */
      constructor(stream, encoding) {
        super();
        this.#stream = stream;
        this.#encoding = encoding;
        this.#reader = void 0;
        this.#queue = new ByteQueue(16 * 1024);
        this.#closed = void 0;
        this.#done = false;
      }
      async open(response) {
        if (response.body === null) {
          throw new ProtoError("No response body for cursor request");
        }
        this.#reader = response.body[Symbol.asyncIterator]();
        const respBody = await this.#nextItem(CursorRespBody, CursorRespBody2);
        if (respBody === void 0) {
          throw new ProtoError("Empty response to cursor request");
        }
        return respBody;
      }
      /** Fetch the next entry from the cursor. */
      next() {
        return this.#nextItem(CursorEntry, CursorEntry2);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** @private */
      _setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        this.#stream._cursorClosed(this);
        if (this.#reader !== void 0) {
          this.#reader.return();
        }
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      async #nextItem(jsonFun, protobufDef) {
        for (; ; ) {
          if (this.#done) {
            return void 0;
          } else if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          if (this.#encoding === "json") {
            const jsonData = this.#parseItemJson();
            if (jsonData !== void 0) {
              const jsonText = new TextDecoder().decode(jsonData);
              const jsonValue = JSON.parse(jsonText);
              return readJsonObject(jsonValue, jsonFun);
            }
          } else if (this.#encoding === "protobuf") {
            const protobufData = this.#parseItemProtobuf();
            if (protobufData !== void 0) {
              return readProtobufMessage(protobufData, protobufDef);
            }
          } else {
            throw impossible(this.#encoding, "Impossible encoding");
          }
          if (this.#reader === void 0) {
            throw new InternalError("Attempted to read from HTTP cursor before it was opened");
          }
          const { value, done } = await this.#reader.next();
          if (done && this.#queue.length === 0) {
            this.#done = true;
          } else if (done) {
            throw new ProtoError("Unexpected end of cursor stream");
          } else {
            this.#queue.push(value);
          }
        }
      }
      #parseItemJson() {
        const data = this.#queue.data();
        const newlineByte = 10;
        const newlinePos = data.indexOf(newlineByte);
        if (newlinePos < 0) {
          return void 0;
        }
        const jsonData = data.slice(0, newlinePos);
        this.#queue.shift(newlinePos + 1);
        return jsonData;
      }
      #parseItemProtobuf() {
        const data = this.#queue.data();
        let varintValue = 0;
        let varintLength = 0;
        for (; ; ) {
          if (varintLength >= data.byteLength) {
            return void 0;
          }
          const byte = data[varintLength];
          varintValue |= (byte & 127) << 7 * varintLength;
          varintLength += 1;
          if (!(byte & 128)) {
            break;
          }
        }
        if (data.byteLength < varintLength + varintValue) {
          return void 0;
        }
        const protobufData = data.slice(varintLength, varintLength + varintValue);
        this.#queue.shift(varintLength + varintValue);
        return protobufData;
      }
    };
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js
function PipelineReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.arrayObjects("requests", msg.requests, StreamRequest);
}
function StreamRequest(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "close") {
  } else if (msg.type === "execute") {
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "sequence") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CursorReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.object("batch", msg.batch, Batch2);
}
var init_json_encode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_json_encode();
    init_util3();
    __name(PipelineReqBody, "PipelineReqBody");
    __name(StreamRequest, "StreamRequest");
    __name(CursorReqBody, "CursorReqBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js
function PipelineReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  for (const req of msg.requests) {
    w.message(2, req, StreamRequest2);
  }
}
function StreamRequest2(w, msg) {
  if (msg.type === "close") {
    w.message(1, msg, CloseStreamReq2);
  } else if (msg.type === "execute") {
    w.message(2, msg, ExecuteStreamReq);
  } else if (msg.type === "batch") {
    w.message(3, msg, BatchStreamReq);
  } else if (msg.type === "sequence") {
    w.message(4, msg, SequenceStreamReq);
  } else if (msg.type === "describe") {
    w.message(5, msg, DescribeStreamReq);
  } else if (msg.type === "store_sql") {
    w.message(6, msg, StoreSqlStreamReq);
  } else if (msg.type === "close_sql") {
    w.message(7, msg, CloseSqlStreamReq);
  } else if (msg.type === "get_autocommit") {
    w.message(8, msg, GetAutocommitStreamReq);
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CloseStreamReq2(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
  w.message(1, msg.stmt, Stmt3);
}
function BatchStreamReq(w, msg) {
  w.message(1, msg.batch, Batch3);
}
function SequenceStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function DescribeStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function StoreSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  w.message(2, msg.batch, Batch3);
}
var init_protobuf_encode3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_protobuf_encode();
    init_util3();
    __name(PipelineReqBody2, "PipelineReqBody");
    __name(StreamRequest2, "StreamRequest");
    __name(CloseStreamReq2, "CloseStreamReq");
    __name(ExecuteStreamReq, "ExecuteStreamReq");
    __name(BatchStreamReq, "BatchStreamReq");
    __name(SequenceStreamReq, "SequenceStreamReq");
    __name(DescribeStreamReq, "DescribeStreamReq");
    __name(StoreSqlStreamReq, "StoreSqlStreamReq");
    __name(CloseSqlStreamReq, "CloseSqlStreamReq");
    __name(GetAutocommitStreamReq, "GetAutocommitStreamReq");
    __name(CursorReqBody2, "CursorReqBody");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/stream.js
function handlePipelineResponse(pipeline, respBody) {
  if (respBody.results.length !== pipeline.length) {
    throw new ProtoError("Server returned unexpected number of pipeline results");
  }
  for (let i = 0; i < pipeline.length; ++i) {
    const result = respBody.results[i];
    const entry = pipeline[i];
    if (result.type === "ok") {
      if (result.response.type !== entry.request.type) {
        throw new ProtoError("Received unexpected type of response");
      }
      entry.responseCallback(result.response);
    } else if (result.type === "error") {
      entry.errorCallback(errorFromProto(result.error));
    } else if (result.type === "none") {
      throw new ProtoError("Received unrecognized type of StreamResult");
    } else {
      throw impossible(result, "Received impossible type of StreamResult");
    }
  }
}
async function decodePipelineResponse(resp, encoding) {
  if (encoding === "json") {
    const respJson = await resp.json();
    return readJsonObject(respJson, PipelineRespBody);
  }
  if (encoding === "protobuf") {
    const respData = await resp.arrayBuffer();
    return readProtobufMessage(new Uint8Array(respData), PipelineRespBody2);
  }
  await resp.body?.cancel();
  throw impossible(encoding, "Impossible encoding");
}
async function errorFromResponse(resp) {
  const respType = resp.headers.get("content-type") ?? "text/plain";
  let message = `Server returned HTTP status ${resp.status}`;
  if (respType === "application/json") {
    const respBody = await resp.json();
    if ("message" in respBody) {
      return errorFromProto(respBody);
    }
    return new HttpServerError(message, resp.status);
  }
  if (respType === "text/plain") {
    const respBody = (await resp.text()).trim();
    if (respBody !== "") {
      message += `: ${respBody}`;
    }
    return new HttpServerError(message, resp.status);
  }
  await resp.body?.cancel();
  return new HttpServerError(message, resp.status);
}
var HttpStream;
var init_stream3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/stream.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_cross_fetch();
    init_errors();
    init_encoding();
    init_id_alloc();
    init_queue();
    init_queue_microtask();
    init_result();
    init_sql();
    init_stream();
    init_util3();
    init_cursor3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_decode3();
    init_protobuf_decode3();
    HttpStream = class extends Stream {
      static {
        __name(this, "HttpStream");
      }
      #client;
      #baseUrl;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #baton;
      #queue;
      #flushing;
      #cursor;
      #closing;
      #closeQueued;
      #closed;
      #sqlIdAlloc;
      /** @private */
      constructor(client, baseUrl, jwt, customFetch, remoteEncryptionKey) {
        super(client.intMode);
        this.#client = client;
        this.#baseUrl = baseUrl.toString();
        this.#jwt = jwt;
        this.#fetch = customFetch;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#baton = void 0;
        this.#queue = new Queue();
        this.#flushing = false;
        this.#closing = false;
        this.#closeQueued = false;
        this.#closed = void 0;
        this.#sqlIdAlloc = new IdAlloc();
      }
      /** Get the {@link HttpClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this;
      }
      /** Cache a SQL text on the server. */
      storeSql(sql) {
        const sqlId = this.#sqlIdAlloc.alloc();
        this.#sendStreamRequest({ type: "store_sql", sqlId, sql }).then(() => void 0, (error3) => this._setClosed(error3));
        return new Sql(this, sqlId);
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error3) => this._setClosed(error3));
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        return this.#sendStreamRequest({
          type: "describe",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        return this.#sendStreamRequest({
          type: "sequence",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit"
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request3) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "pipeline", request: request3, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** Immediately close the stream. */
      close() {
        this._setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** True if the stream is closed. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
      /** @private */
      _setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error3);
        }
        this.#client._streamClosed(this);
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error3);
          } else {
            break;
          }
        }
        if ((this.#baton !== void 0 || this.#flushing) && !this.#closeQueued) {
          this.#queue.push({
            type: "pipeline",
            request: { type: "close" },
            responseCallback: /* @__PURE__ */ __name(() => void 0, "responseCallback"),
            errorCallback: /* @__PURE__ */ __name(() => void 0, "errorCallback")
          });
          this.#closeQueued = true;
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          throw new ClosedError("Stream is closed", this.#closed);
        } else if (this.#closing) {
          throw new ClosedError("Stream is closing", void 0);
        } else {
          this.#queue.push(entry);
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #flushQueue() {
        if (this.#flushing || this.#cursor !== void 0) {
          return;
        }
        if (this.#closing && this.#queue.length === 0) {
          this._setClosed(new ClientError("Stream was gracefully closed"));
          return;
        }
        const endpoint = this.#client._endpoint;
        if (endpoint === void 0) {
          this.#client._endpointPromise.then(() => this.#flushQueue(), (error3) => this._setClosed(error3));
          return;
        }
        const firstEntry = this.#queue.shift();
        if (firstEntry === void 0) {
          return;
        } else if (firstEntry.type === "pipeline") {
          const pipeline = [firstEntry];
          for (; ; ) {
            const entry = this.#queue.first();
            if (entry !== void 0 && entry.type === "pipeline") {
              pipeline.push(entry);
              this.#queue.shift();
            } else if (entry === void 0 && this.#closing && !this.#closeQueued) {
              pipeline.push({
                type: "pipeline",
                request: { type: "close" },
                responseCallback: /* @__PURE__ */ __name(() => void 0, "responseCallback"),
                errorCallback: /* @__PURE__ */ __name(() => void 0, "errorCallback")
              });
              this.#closeQueued = true;
              break;
            } else {
              break;
            }
          }
          this.#flushPipeline(endpoint, pipeline);
        } else if (firstEntry.type === "cursor") {
          this.#flushCursor(endpoint, firstEntry);
        } else {
          throw impossible(firstEntry, "Impossible type of QueueEntry");
        }
      }
      #flushPipeline(endpoint, pipeline) {
        this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error3) => pipeline.forEach((entry) => entry.errorCallback(error3)));
      }
      #flushCursor(endpoint, entry) {
        const cursor = new HttpCursor(this, endpoint.encoding);
        this.#cursor = cursor;
        this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error3) => entry.errorCallback(error3));
      }
      #flush(createRequest, decodeResponse, getBaton, getBaseUrl, handleResponse, handleError) {
        let promise;
        try {
          const request3 = createRequest();
          const fetch3 = this.#fetch;
          promise = fetch3(request3);
        } catch (error3) {
          promise = Promise.reject(error3);
        }
        this.#flushing = true;
        promise.then((resp) => {
          if (!resp.ok) {
            return errorFromResponse(resp).then((error3) => {
              throw error3;
            });
          }
          return decodeResponse(resp);
        }).then((r) => {
          this.#baton = getBaton(r);
          this.#baseUrl = getBaseUrl(r) ?? this.#baseUrl;
          handleResponse(r);
        }).catch((error3) => {
          this._setClosed(error3);
          handleError(error3);
        }).finally(() => {
          this.#flushing = false;
          this.#flushQueue();
        });
      }
      #createPipelineRequest(pipeline, endpoint) {
        return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
          baton: this.#baton,
          requests: pipeline.map((entry) => entry.request)
        }, endpoint.encoding, PipelineReqBody, PipelineReqBody2);
      }
      #createCursorRequest(entry, endpoint) {
        if (endpoint.cursorPath === void 0) {
          throw new ProtocolVersionError(`Cursors are supported only on protocol version 3 and higher, but the HTTP server only supports version ${endpoint.version}.`);
        }
        return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
          baton: this.#baton,
          batch: entry.batch
        }, endpoint.encoding, CursorReqBody, CursorReqBody2);
      }
      #createRequest(url, reqBody, encoding, jsonFun, protobufFun) {
        let bodyData;
        let contentType;
        if (encoding === "json") {
          bodyData = writeJsonObject(reqBody, jsonFun);
          contentType = "application/json";
        } else if (encoding === "protobuf") {
          bodyData = writeProtobufMessage(reqBody, protobufFun);
          contentType = "application/x-protobuf";
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
        const headers = new Headers();
        headers.set("content-type", contentType);
        if (this.#jwt !== void 0) {
          headers.set("authorization", `Bearer ${this.#jwt}`);
        }
        if (this.#remoteEncryptionKey !== void 0) {
          headers.set("x-turso-encryption-key", this.#remoteEncryptionKey);
        }
        return new Request3(url.toString(), { method: "POST", headers, body: bodyData });
      }
    };
    __name(handlePipelineResponse, "handlePipelineResponse");
    __name(decodePipelineResponse, "decodePipelineResponse");
    __name(errorFromResponse, "errorFromResponse");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/http/client.js
async function findEndpoint(customFetch, clientUrl) {
  const fetch3 = customFetch;
  for (const endpoint of checkEndpoints) {
    const url = new URL(endpoint.versionPath, clientUrl);
    const request3 = new Request3(url.toString(), { method: "GET" });
    const response = await fetch3(request3);
    await response.arrayBuffer();
    if (response.ok) {
      return endpoint;
    }
  }
  return fallbackEndpoint;
}
var checkEndpoints, fallbackEndpoint, HttpClient;
var init_client3 = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/http/client.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_cross_fetch();
    init_client();
    init_errors();
    init_stream3();
    checkEndpoints = [
      {
        versionPath: "v3-protobuf",
        pipelinePath: "v3-protobuf/pipeline",
        cursorPath: "v3-protobuf/cursor",
        version: 3,
        encoding: "protobuf"
      }
      /*
      {
          versionPath: "v3",
          pipelinePath: "v3/pipeline",
          cursorPath: "v3/cursor",
          version: 3,
          encoding: "json",
      },
      */
    ];
    fallbackEndpoint = {
      versionPath: "v2",
      pipelinePath: "v2/pipeline",
      cursorPath: void 0,
      version: 2,
      encoding: "json"
    };
    HttpClient = class extends Client {
      static {
        __name(this, "HttpClient");
      }
      #url;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #closed;
      #streams;
      /** @private */
      _endpointPromise;
      /** @private */
      _endpoint;
      /** @private */
      constructor(url, jwt, customFetch, remoteEncryptionKey, protocolVersion = 2) {
        super();
        this.#url = url;
        this.#jwt = jwt;
        this.#fetch = customFetch ?? fetch2;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#closed = void 0;
        this.#streams = /* @__PURE__ */ new Set();
        if (protocolVersion == 3) {
          this._endpointPromise = findEndpoint(this.#fetch, this.#url);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error3) => this.#setClosed(error3));
        } else {
          this._endpointPromise = Promise.resolve(fallbackEndpoint);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error3) => this.#setClosed(error3));
        }
      }
      /** Get the protocol version supported by the server. */
      async getVersion() {
        if (this._endpoint !== void 0) {
          return this._endpoint.version;
        }
        return (await this._endpointPromise).version;
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (minVersion <= fallbackEndpoint.version) {
          return;
        } else if (this._endpoint === void 0) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the HTTP server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this._endpoint.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the HTTP server only supports version ${this._endpoint.version}.`);
        }
      }
      /** Open a {@link HttpStream}, a stream for executing SQL statements. */
      openStream() {
        if (this.#closed !== void 0) {
          throw new ClosedError("Client is closed", this.#closed);
        }
        const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch, this.#remoteEncryptionKey);
        this.#streams.add(stream);
        return stream;
      }
      /** @private */
      _streamClosed(stream) {
        this.#streams.delete(stream);
      }
      /** Close the client and all its streams. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      #setClosed(error3) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error3;
        for (const stream of Array.from(this.#streams)) {
          stream._setClosed(new ClosedError("Client was closed", error3));
        }
      }
    };
    __name(findEndpoint, "findEndpoint");
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/libsql_url.js
var init_libsql_url = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/libsql_url.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
  }
});

// ../node_modules/@libsql/hrana-client/lib-esm/index.js
function openWs(url, jwt, protocolVersion = 2) {
  if (typeof _WebSocket === "undefined") {
    throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
  }
  var subprotocols = void 0;
  if (protocolVersion == 3) {
    subprotocols = Array.from(subprotocolsV3.keys());
  } else {
    subprotocols = Array.from(subprotocolsV2.keys());
  }
  const socket = new _WebSocket(url, subprotocols);
  return new WsClient(socket, jwt);
}
function openHttp(url, jwt, customFetch, remoteEncryptionKey, protocolVersion = 2) {
  return new HttpClient(url instanceof URL ? url : new URL(url), jwt, customFetch, remoteEncryptionKey, protocolVersion);
}
var init_lib_esm = __esm({
  "../node_modules/@libsql/hrana-client/lib-esm/index.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web();
    init_client2();
    init_errors();
    init_client3();
    init_client2();
    init_web();
    init_cross_fetch();
    init_client();
    init_errors();
    init_batch();
    init_libsql_url();
    init_sql();
    init_stmt();
    init_stream();
    init_client3();
    init_stream3();
    init_client2();
    init_stream2();
    __name(openWs, "openWs");
    __name(openHttp, "openHttp");
  }
});

// ../node_modules/@libsql/client/lib-esm/hrana.js
async function executeHranaBatch(mode, version4, batch, hranaStmts, disableForeignKeys = false) {
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=off");
  }
  const beginStep = batch.step();
  const beginPromise = beginStep.run(transactionModeToBegin(mode));
  let lastStep = beginStep;
  const stmtPromises = hranaStmts.map((hranaStmt) => {
    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version4 >= 3) {
      stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const stmtPromise = stmtStep.query(hranaStmt);
    lastStep = stmtStep;
    return stmtPromise;
  });
  const commitStep = batch.step().condition(BatchCond.ok(lastStep));
  if (version4 >= 3) {
    commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
  }
  const commitPromise = commitStep.run("COMMIT");
  const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
  rollbackStep.run("ROLLBACK").catch((_) => void 0);
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=on");
  }
  await batch.execute();
  const resultSets = [];
  await beginPromise;
  for (let i = 0; i < stmtPromises.length; i++) {
    try {
      const hranaRows = await stmtPromises[i];
      if (hranaRows === void 0) {
        throw new LibsqlBatchError("Statement in a batch was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
      }
      resultSets.push(resultSetFromHrana(hranaRows));
    } catch (e) {
      if (e instanceof LibsqlBatchError) {
        throw e;
      }
      const mappedError = mapHranaError(e);
      if (mappedError instanceof LibsqlError) {
        throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
      }
      throw mappedError;
    }
  }
  await commitPromise;
  return resultSets;
}
function stmtToHrana(stmt) {
  let sql;
  let args;
  if (Array.isArray(stmt)) {
    [sql, args] = stmt;
  } else if (typeof stmt === "string") {
    sql = stmt;
  } else {
    sql = stmt.sql;
    args = stmt.args;
  }
  const hranaStmt = new Stmt(sql);
  if (args) {
    if (Array.isArray(args)) {
      hranaStmt.bindIndexes(args);
    } else {
      for (const [key, value] of Object.entries(args)) {
        hranaStmt.bindName(key, value);
      }
    }
  }
  return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
  const columns = hranaRows.columnNames.map((c) => c ?? "");
  const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
  const rows = hranaRows.rows;
  const rowsAffected = hranaRows.affectedRowCount;
  const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
  return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
  if (e instanceof ClientError) {
    const code = mapHranaErrorCode(e);
    return new LibsqlError(e.message, code, void 0, void 0, e);
  }
  return e;
}
function mapHranaErrorCode(e) {
  if (e instanceof ResponseError && e.code !== void 0) {
    return e.code;
  } else if (e instanceof ProtoError) {
    return "HRANA_PROTO_ERROR";
  } else if (e instanceof ClosedError) {
    return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
  } else if (e instanceof WebSocketError) {
    return "HRANA_WEBSOCKET_ERROR";
  } else if (e instanceof HttpServerError) {
    return "SERVER_ERROR";
  } else if (e instanceof ProtocolVersionError) {
    return "PROTOCOL_VERSION_ERROR";
  } else if (e instanceof InternalError) {
    return "INTERNAL_ERROR";
  } else {
    return "UNKNOWN";
  }
}
var HranaTransaction;
var init_hrana = __esm({
  "../node_modules/@libsql/client/lib-esm/hrana.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_lib_esm();
    init_api();
    init_util();
    HranaTransaction = class {
      static {
        __name(this, "HranaTransaction");
      }
      #mode;
      #version;
      // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
      // BEGIN statement yet.
      #started;
      /** @private */
      constructor(mode, version4) {
        this.#mode = mode;
        this.#version = version4;
        this.#started = void 0;
      }
      execute(stmt) {
        return this.batch([stmt]).then((results) => results[0]);
      }
      async batch(stmts) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          const hranaStmts = stmts.map(stmtToHrana);
          let rowsPromises;
          if (this.#started === void 0) {
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            const beginStep = batch.step();
            const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
            let lastStep = beginStep;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            if (this.#version < 3) {
              await this.#started;
            } else {
            }
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            let lastStep = void 0;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step();
              if (lastStep !== void 0) {
                stmtStep.condition(BatchCond.ok(lastStep));
              }
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            await batch.execute();
          }
          const resultSets = [];
          for (let i = 0; i < rowsPromises.length; i++) {
            try {
              const rows = await rowsPromises[i];
              if (rows === void 0) {
                throw new LibsqlBatchError("Statement in a transaction was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
              }
              resultSets.push(resultSetFromHrana(rows));
            } catch (e) {
              if (e instanceof LibsqlBatchError) {
                throw e;
              }
              const mappedError = mapHranaError(e);
              if (mappedError instanceof LibsqlError) {
                throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
              }
              throw mappedError;
            }
          }
          return resultSets;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async executeMultiple(sql) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          if (this.#started === void 0) {
            this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            await this.#started;
          }
          await stream.sequence(sql);
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async rollback() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            return;
          }
          if (this.#started !== void 0) {
          } else {
            return;
          }
          const promise = stream.run("ROLLBACK").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
      async commit() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
          }
          if (this.#started !== void 0) {
            await this.#started;
          } else {
            return;
          }
          const promise = stream.run("COMMIT").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
    };
    __name(executeHranaBatch, "executeHranaBatch");
    __name(stmtToHrana, "stmtToHrana");
    __name(resultSetFromHrana, "resultSetFromHrana");
    __name(mapHranaError, "mapHranaError");
    __name(mapHranaErrorCode, "mapHranaErrorCode");
  }
});

// ../node_modules/@libsql/client/lib-esm/sql_cache.js
var SqlCache, Lru;
var init_sql_cache = __esm({
  "../node_modules/@libsql/client/lib-esm/sql_cache.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    SqlCache = class {
      static {
        __name(this, "SqlCache");
      }
      #owner;
      #sqls;
      capacity;
      constructor(owner, capacity) {
        this.#owner = owner;
        this.#sqls = new Lru();
        this.capacity = capacity;
      }
      // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
      // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
      // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
      // server).
      //
      // In practice, this means that after calling this function, you can use the statements only up to the
      // first `await`, because concurrent code may also use the cache and invalidate those statements.
      apply(hranaStmts) {
        if (this.capacity <= 0) {
          return;
        }
        const usedSqlObjs = /* @__PURE__ */ new Set();
        for (const hranaStmt of hranaStmts) {
          if (typeof hranaStmt.sql !== "string") {
            continue;
          }
          const sqlText = hranaStmt.sql;
          if (sqlText.length >= 5e3) {
            continue;
          }
          let sqlObj = this.#sqls.get(sqlText);
          if (sqlObj === void 0) {
            while (this.#sqls.size + 1 > this.capacity) {
              const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
              if (usedSqlObjs.has(evictSqlObj)) {
                break;
              }
              evictSqlObj.close();
              this.#sqls.delete(evictSqlText);
            }
            if (this.#sqls.size + 1 <= this.capacity) {
              sqlObj = this.#owner.storeSql(sqlText);
              this.#sqls.set(sqlText, sqlObj);
            }
          }
          if (sqlObj !== void 0) {
            hranaStmt.sql = sqlObj;
            usedSqlObjs.add(sqlObj);
          }
        }
      }
    };
    Lru = class {
      static {
        __name(this, "Lru");
      }
      // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
      // most recently are at the end).
      #cache;
      constructor() {
        this.#cache = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.#cache.get(key);
        if (value !== void 0) {
          this.#cache.delete(key);
          this.#cache.set(key, value);
        }
        return value;
      }
      set(key, value) {
        this.#cache.set(key, value);
      }
      peekLru() {
        for (const entry of this.#cache.entries()) {
          return entry;
        }
        return void 0;
      }
      delete(key) {
        this.#cache.delete(key);
      }
      get size() {
        return this.#cache.size;
      }
    };
  }
});

// ../node_modules/promise-limit/index.js
var require_promise_limit = __commonJS({
  "../node_modules/promise-limit/index.js"(exports, module) {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function limiter(count3) {
      var outstanding = 0;
      var jobs = [];
      function remove() {
        outstanding--;
        if (outstanding < count3) {
          dequeue();
        }
      }
      __name(remove, "remove");
      function dequeue() {
        var job = jobs.shift();
        semaphore.queue = jobs.length;
        if (job) {
          run(job.fn).then(job.resolve).catch(job.reject);
        }
      }
      __name(dequeue, "dequeue");
      function queue(fn) {
        return new Promise(function(resolve, reject) {
          jobs.push({ fn, resolve, reject });
          semaphore.queue = jobs.length;
        });
      }
      __name(queue, "queue");
      function run(fn) {
        outstanding++;
        try {
          return Promise.resolve(fn()).then(function(result) {
            remove();
            return result;
          }, function(error3) {
            remove();
            throw error3;
          });
        } catch (err) {
          remove();
          return Promise.reject(err);
        }
      }
      __name(run, "run");
      var semaphore = /* @__PURE__ */ __name(function(fn) {
        if (outstanding >= count3) {
          return queue(fn);
        } else {
          return run(fn);
        }
      }, "semaphore");
      return semaphore;
    }
    __name(limiter, "limiter");
    function map(items, mapper) {
      var failed = false;
      var limit = this;
      return Promise.all(items.map(function() {
        var args = arguments;
        return limit(function() {
          if (!failed) {
            return mapper.apply(void 0, args).catch(function(e) {
              failed = true;
              throw e;
            });
          }
        });
      }));
    }
    __name(map, "map");
    function addExtras(fn) {
      fn.queue = 0;
      fn.map = map;
      return fn;
    }
    __name(addExtras, "addExtras");
    module.exports = function(count3) {
      if (count3) {
        return addExtras(limiter(count3));
      } else {
        return addExtras(function(fn) {
          return fn();
        });
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/ws.js
function _createClient(config2) {
  if (config2.scheme !== "wss" && config2.scheme !== "ws") {
    throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config2.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config2.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config2.scheme === "ws" && config2.tls) {
    throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config2.scheme === "wss" && !config2.tls) {
    throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config2.scheme, config2.authority, config2.path);
  let client;
  try {
    client = openWs(url, config2.authToken);
  } catch (e) {
    if (e instanceof WebSocketUnsupportedError) {
      const suggestedScheme = config2.scheme === "wss" ? "https" : "http";
      const suggestedUrl = encodeBaseUrl(suggestedScheme, config2.authority, config2.path);
      throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
    }
    throw mapHranaError(e);
  }
  return new WsClient2(client, url, config2.authToken, config2.intMode, config2.concurrency);
}
var import_promise_limit, maxConnAgeMillis, sqlCacheCapacity, WsClient2, WsTransaction;
var init_ws = __esm({
  "../node_modules/@libsql/client/lib-esm/ws.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_lib_esm();
    init_api();
    init_config2();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit = __toESM(require_promise_limit(), 1);
    init_api();
    __name(_createClient, "_createClient");
    maxConnAgeMillis = 60 * 1e3;
    sqlCacheCapacity = 100;
    WsClient2 = class {
      static {
        __name(this, "WsClient");
      }
      #url;
      #authToken;
      #intMode;
      // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
      // asynchronous error.
      #connState;
      // If defined, this is a connection that will be used in the future, once it is ready.
      #futureConnState;
      closed;
      protocol;
      #isSchemaDatabase;
      #promiseLimitFunction;
      /** @private */
      constructor(client, url, authToken, intMode, concurrency) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#connState = this.#openConn(client);
        this.#futureConnState = void 0;
        this.closed = false;
        this.protocol = "ws";
        this.#promiseLimitFunction = (0, import_promise_limit.default)(concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmt = stmtToHrana(stmt);
            streamState.conn.sqlCache.apply([hranaStmt]);
            const hranaRowsPromise = streamState.stream.query(hranaStmt);
            streamState.stream.closeGracefully();
            const hranaRowsResult = await hranaRowsPromise;
            return resultSetFromHrana(hranaRowsResult);
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version4 = await streamState.conn.client.getVersion();
            streamState.conn.sqlCache.apply(hranaStmts);
            const batch = streamState.stream.batch(version4 >= 3);
            const resultsPromise = executeHranaBatch(mode, version4, batch, hranaStmts);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version4 = await streamState.conn.client.getVersion();
            const batch = streamState.stream.batch(version4 >= 3);
            const resultsPromise = executeHranaBatch("deferred", version4, batch, hranaStmts, true);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const version4 = await streamState.conn.client.getVersion();
            return new WsTransaction(this, streamState, mode, version4);
          } catch (e) {
            this._closeStream(streamState);
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const promise = streamState.stream.sequence(sql);
            streamState.stream.closeGracefully();
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
      }
      async #openStream() {
        if (this.closed) {
          throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
        const now = /* @__PURE__ */ new Date();
        const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
        if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
          const futureConnState = this.#openConn();
          this.#futureConnState = futureConnState;
          futureConnState.client.getVersion().then((_version) => {
            if (this.#connState !== futureConnState) {
              if (this.#connState.streamStates.size === 0) {
                this.#connState.client.close();
              } else {
              }
            }
            this.#connState = futureConnState;
            this.#futureConnState = void 0;
          }, (_e) => {
            this.#futureConnState = void 0;
          });
        }
        if (this.#connState.client.closed) {
          try {
            if (this.#futureConnState !== void 0) {
              this.#connState = this.#futureConnState;
            } else {
              this.#connState = this.#openConn();
            }
          } catch (e) {
            throw mapHranaError(e);
          }
        }
        const connState = this.#connState;
        try {
          if (connState.useSqlCache === void 0) {
            connState.useSqlCache = await connState.client.getVersion() >= 2;
            if (connState.useSqlCache) {
              connState.sqlCache.capacity = sqlCacheCapacity;
            }
          }
          const stream = connState.client.openStream();
          stream.intMode = this.#intMode;
          const streamState = { conn: connState, stream };
          connState.streamStates.add(streamState);
          return streamState;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      #openConn(client) {
        try {
          client ??= openWs(this.#url, this.#authToken);
          return {
            client,
            useSqlCache: void 0,
            sqlCache: new SqlCache(client, 0),
            openTime: /* @__PURE__ */ new Date(),
            streamStates: /* @__PURE__ */ new Set()
          };
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async reconnect() {
        try {
          for (const st of Array.from(this.#connState.streamStates)) {
            try {
              st.stream.close();
            } catch {
            }
          }
          this.#connState.client.close();
        } catch {
        }
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        const next = this.#openConn();
        const version4 = await next.client.getVersion();
        next.useSqlCache = version4 >= 2;
        if (next.useSqlCache) {
          next.sqlCache.capacity = sqlCacheCapacity;
        }
        this.#connState = next;
        this.closed = false;
      }
      _closeStream(streamState) {
        streamState.stream.close();
        const connState = streamState.conn;
        connState.streamStates.delete(streamState);
        if (connState.streamStates.size === 0 && connState !== this.#connState) {
          connState.client.close();
        }
      }
      close() {
        this.#connState.client.close();
        this.closed = true;
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        this.closed = true;
      }
    };
    WsTransaction = class extends HranaTransaction {
      static {
        __name(this, "WsTransaction");
      }
      #client;
      #streamState;
      /** @private */
      constructor(client, state, mode, version4) {
        super(mode, version4);
        this.#client = client;
        this.#streamState = state;
      }
      /** @private */
      _getStream() {
        return this.#streamState.stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#streamState.conn.sqlCache;
      }
      close() {
        this.#client._closeStream(this.#streamState);
      }
      get closed() {
        return this.#streamState.stream.closed;
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/http.js
function _createClient2(config2) {
  if (config2.scheme !== "https" && config2.scheme !== "http") {
    throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config2.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config2.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config2.scheme === "http" && config2.tls) {
    throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config2.scheme === "https" && !config2.tls) {
    throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config2.scheme, config2.authority, config2.path);
  return new HttpClient2(url, config2.authToken, config2.intMode, config2.fetch, config2.concurrency, config2.remoteEncryptionKey);
}
var import_promise_limit2, sqlCacheCapacity2, HttpClient2, HttpTransaction;
var init_http2 = __esm({
  "../node_modules/@libsql/client/lib-esm/http.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_lib_esm();
    init_api();
    init_config2();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit2 = __toESM(require_promise_limit(), 1);
    init_api();
    __name(_createClient2, "_createClient");
    sqlCacheCapacity2 = 30;
    HttpClient2 = class {
      static {
        __name(this, "HttpClient");
      }
      #client;
      protocol;
      #url;
      #intMode;
      #customFetch;
      #concurrency;
      #authToken;
      #remoteEncryptionKey;
      #promiseLimitFunction;
      /** @private */
      constructor(url, authToken, intMode, customFetch, concurrency, remoteEncryptionKey) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#customFetch = customFetch;
        this.#concurrency = concurrency;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, remoteEncryptionKey);
        this.#client.intMode = this.#intMode;
        this.protocol = "http";
        this.#promiseLimitFunction = (0, import_promise_limit2.default)(this.#concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          try {
            const hranaStmt = stmtToHrana(stmt);
            let rowsPromise;
            const stream = this.#client.openStream();
            try {
              rowsPromise = stream.query(hranaStmt);
            } finally {
              stream.closeGracefully();
            }
            const rowsResult = await rowsPromise;
            return resultSetFromHrana(rowsResult);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version4 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const sqlCache = new SqlCache(stream, sqlCacheCapacity2);
              sqlCache.apply(hranaStmts);
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch(mode, version4, batch, hranaStmts);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version4 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch("deferred", version4, batch, hranaStmts, true);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          try {
            const version4 = await this.#client.getVersion();
            return new HttpTransaction(this.#client.openStream(), mode, version4);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql) {
        return this.limit(async () => {
          try {
            let promise;
            const stream = this.#client.openStream();
            try {
              promise = stream.sequence(sql);
            } finally {
              stream.closeGracefully();
            }
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
      }
      close() {
        this.#client.close();
      }
      async reconnect() {
        try {
          if (!this.closed) {
            this.#client.close();
          }
        } finally {
          this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, this.#remoteEncryptionKey);
          this.#client.intMode = this.#intMode;
        }
      }
      get closed() {
        return this.#client.closed;
      }
    };
    HttpTransaction = class extends HranaTransaction {
      static {
        __name(this, "HttpTransaction");
      }
      #stream;
      #sqlCache;
      /** @private */
      constructor(stream, mode, version4) {
        super(mode, version4);
        this.#stream = stream;
        this.#sqlCache = new SqlCache(stream, sqlCacheCapacity2);
      }
      /** @private */
      _getStream() {
        return this.#stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#sqlCache;
      }
      close() {
        this.#stream.close();
      }
      get closed() {
        return this.#stream.closed;
      }
    };
  }
});

// ../node_modules/@libsql/client/lib-esm/web.js
function createClient(config2) {
  return _createClient3(expandConfig(config2, true));
}
function _createClient3(config2) {
  if (config2.scheme === "ws" || config2.scheme === "wss") {
    return _createClient(config2);
  } else if (config2.scheme === "http" || config2.scheme === "https") {
    return _createClient2(config2);
  } else {
    throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config2.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
}
var init_web2 = __esm({
  "../node_modules/@libsql/client/lib-esm/web.js"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_api();
    init_config2();
    init_util();
    init_ws();
    init_http2();
    init_api();
    __name(createClient, "createClient");
    __name(_createClient3, "_createClient");
  }
});

// api/newsletters.ts
function getDb(env2) {
  const url = env2.TURSO_CONNECTION_URL?.split("?")[0];
  const authToken = env2.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      `Database not configured. Missing: ${!url ? "TURSO_CONNECTION_URL " : ""}${!authToken ? "TURSO_AUTH_TOKEN" : ""}`
    );
  }
  return createClient({ url, authToken });
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}
async function onRequest5(context2) {
  const { request: request3, env: env2 } = context2;
  if (request3.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const token = request3.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return json({ error: "Unauthorized" }, 401);
  let db2;
  try {
    db2 = getDb(env2);
  } catch (err) {
    return json({ error: "Database not configured", details: err.message }, 503);
  }
  if (request3.method === "GET") {
    try {
      const result = await db2.execute("SELECT * FROM newsletters ORDER BY created_at DESC");
      const newsletters = result.rows.map((r) => ({
        id: r.id,
        subject: r.title,
        // map title → subject for frontend compatibility
        title: r.title,
        content: r.content,
        language: r.language,
        status: r.status,
        sentAt: r.sent_at,
        createdAt: r.created_at
      }));
      return json({ success: true, newsletters, total: newsletters.length });
    } catch (err) {
      return json({ error: "Failed to get newsletters", details: err.message }, 500);
    }
  }
  if (request3.method === "POST") {
    let body;
    try {
      body = await request3.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    const { subject, title: title2, content, language = "en" } = body;
    const newsletterTitle = title2 || subject;
    if (!newsletterTitle || !content) return json({ error: "Title/subject and content required" }, 400);
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const id = `nl-${Date.now()}`;
      await db2.execute(
        "INSERT INTO newsletters (id, title, content, language, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [id, newsletterTitle, content, language, "draft", now]
      );
      return json({
        success: true,
        newsletter: { id, title: newsletterTitle, subject: newsletterTitle, content, language, status: "draft", createdAt: now, sentAt: null }
      });
    } catch (err) {
      return json({ error: "Failed to create newsletter", details: err.message }, 500);
    }
  }
  if (request3.method === "DELETE") {
    let body;
    try {
      body = await request3.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }
    const { id } = body;
    if (!id) return json({ error: "ID required" }, 400);
    try {
      const result = await db2.execute("DELETE FROM newsletters WHERE id = ?", [id]);
      if (result.rowsAffected === 0) return json({ error: "Newsletter not found" }, 404);
      return json({ success: true });
    } catch (err) {
      return json({ error: "Database error", details: err.message }, 500);
    }
  }
  return json({ error: "Method not allowed" }, 405);
}
var cors;
var init_newsletters = __esm({
  "api/newsletters.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    __name(getDb, "getDb");
    cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    __name(json, "json");
    __name(onRequest5, "onRequest");
  }
});

// api/schema-check.ts
async function onRequest6(context2) {
  const env2 = context2.env;
  const url = env2.TURSO_CONNECTION_URL?.split("?")[0];
  const authToken = env2.TURSO_AUTH_TOKEN;
  const db2 = createClient({ url, authToken });
  try {
    const tables = await db2.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const results = { tables: tables.rows.map((r) => r.name) };
    for (const row of tables.rows) {
      const schema = await db2.execute(`PRAGMA table_info(${row.name})`);
      results[String(row.name)] = schema.rows.map((r) => ({ name: r.name, type: r.type }));
    }
    return new Response(JSON.stringify(results, null, 2), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
var init_schema_check = __esm({
  "api/schema-check.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    __name(onRequest6, "onRequest");
  }
});

// api/send-email.ts
function json2(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors2 });
}
async function onRequest7(context2) {
  const { request: request3, env: env2 } = context2;
  if (request3.method === "OPTIONS") return new Response(null, { status: 204, headers: cors2 });
  if (request3.method !== "POST") return json2({ error: "Method not allowed" }, 405);
  let body;
  try {
    body = await request3.json();
  } catch {
    return json2({ error: "Invalid JSON body" }, 400);
  }
  const rawBackend = env2.BACKEND_URL || "";
  const backendUrl = rawBackend.startsWith("http://localhost") ? "https://writer-website-landing-page-1.vercel.app/api" : rawBackend || "https://writer-website-landing-page-1.vercel.app/api";
  try {
    const resp = await fetch(`${backendUrl}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    return json2(data, resp.ok ? 200 : resp.status);
  } catch (err) {
    return json2({ success: false, error: err.message || "Failed to reach email backend" }, 502);
  }
}
var cors2;
var init_send_email = __esm({
  "api/send-email.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    cors2 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    __name(json2, "json");
    __name(onRequest7, "onRequest");
  }
});

// api/send-email-worker.ts
var onRequest8;
var init_send_email_worker = __esm({
  "api/send-email-worker.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequest8 = /* @__PURE__ */ __name(async (context2) => {
      const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      };
      if (context2.request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      if (context2.request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: corsHeaders
        });
      }
      try {
        const { recipients, subject, content, language } = await context2.request.json();
        if (!recipients || recipients.length === 0) {
          return new Response(JSON.stringify({ error: "Recipients required" }), {
            status: 400,
            headers: corsHeaders
          });
        }
        if (!subject || !content) {
          return new Response(JSON.stringify({ error: "Subject and content required" }), {
            status: 400,
            headers: corsHeaders
          });
        }
        const mailgunApiKey = context2.env.MAILGUN_API_KEY;
        const mailgunDomain = context2.env.MAILGUN_DOMAIN;
        const emailFrom = context2.env.EMAIL_USER || "AuthorFSK@gmail.com";
        if (!mailgunApiKey || !mailgunDomain) {
          console.error("Mailgun credentials not configured");
          return new Response(JSON.stringify({
            error: "Email service not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN."
          }), {
            status: 503,
            headers: corsHeaders
          });
        }
        let sentCount = 0;
        const errors = [];
        for (const recipient of recipients) {
          try {
            const formData = new FormData();
            formData.append("from", emailFrom);
            formData.append("to", recipient);
            formData.append("subject", subject);
            formData.append("html", content);
            const mailgunResponse = await fetch(
              `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Basic ${btoa(`api:${mailgunApiKey}`)}`
                },
                body: formData
              }
            );
            if (mailgunResponse.ok) {
              sentCount++;
              console.log(`\u2713 Email sent to ${recipient}`);
            } else {
              const error3 = await mailgunResponse.text();
              console.error(`\u2717 Failed to send to ${recipient}:`, error3);
              errors.push(`${recipient}: Failed to send`);
            }
          } catch (err) {
            console.error(`Error sending to ${recipient}:`, err);
            errors.push(`${recipient}: ${err.message}`);
          }
        }
        return new Response(JSON.stringify({
          success: sentCount > 0,
          message: `Email sent to ${sentCount} recipient(s)`,
          recipientCount: sentCount,
          totalRecipients: recipients.length,
          errors: errors.length > 0 ? errors : void 0
        }), {
          status: sentCount > 0 ? 200 : 500,
          headers: corsHeaders
        });
      } catch (err) {
        console.error("Send email error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }, "onRequest");
  }
});

// api/stats.ts
function getDb2(env2) {
  const url = env2.TURSO_CONNECTION_URL?.split("?")[0];
  const authToken = env2.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(`Database not configured. Missing: ${!url ? "TURSO_CONNECTION_URL " : ""}${!authToken ? "TURSO_AUTH_TOKEN" : ""}`);
  }
  return createClient({ url, authToken });
}
function json3(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors3 });
}
async function onRequest9(context2) {
  const { request: request3, env: env2 } = context2;
  if (request3.method === "OPTIONS") return new Response(null, { status: 204, headers: cors3 });
  if (request3.method !== "GET") return json3({ error: "Method not allowed" }, 405);
  let db2;
  try {
    db2 = getDb2(env2);
  } catch (err) {
    return json3({ error: "Database not configured", details: err.message }, 503);
  }
  try {
    const [subResult, nlResult] = await Promise.all([
      db2.execute("SELECT COUNT(*) as count FROM subscribers"),
      db2.execute("SELECT COUNT(*) as count FROM newsletters")
    ]);
    const totalSubscribers = Number(subResult.rows[0]?.count ?? 0);
    const totalNewsletters = Number(nlResult.rows[0]?.count ?? 0);
    const recentNl = await db2.execute(
      "SELECT id, title, created_at, sent_at, status FROM newsletters ORDER BY created_at DESC LIMIT 5"
    );
    return json3({
      success: true,
      stats: {
        totalSubscribers,
        totalNewsletters,
        recentNewsletters: recentNl.rows
      }
    });
  } catch (err) {
    return json3({ error: "Failed to fetch stats", details: err.message }, 500);
  }
}
var cors3;
var init_stats = __esm({
  "api/stats.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    __name(getDb2, "getDb");
    cors3 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    __name(json3, "json");
    __name(onRequest9, "onRequest");
  }
});

// api/subscribers.ts
function getDb3(env2) {
  const url = env2.TURSO_CONNECTION_URL?.split("?")[0];
  const authToken = env2.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      `Database not configured. Missing: ${!url ? "TURSO_CONNECTION_URL " : ""}${!authToken ? "TURSO_AUTH_TOKEN" : ""}`
    );
  }
  return createClient({ url, authToken });
}
function json4(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors4 });
}
async function onRequest10(context2) {
  const { request: request3, env: env2 } = context2;
  if (request3.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors4 });
  }
  let db2;
  try {
    db2 = getDb3(env2);
  } catch (err) {
    return json4({ error: "Database not configured", details: err.message }, 503);
  }
  if (request3.method === "POST") {
    let body;
    try {
      body = await request3.json();
    } catch {
      return json4({ error: "Invalid JSON body" }, 400);
    }
    const { email, language = "en", name = "" } = body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return json4({ error: "Valid email required" }, 400);
    }
    try {
      const existing = await db2.execute(
        "SELECT email FROM subscribers WHERE email = ?",
        [email]
      );
      if (existing.rows.length > 0) {
        return json4({ error: "Already subscribed" }, 400);
      }
      await db2.execute(
        "INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)",
        [email, language, name]
      );
      if (env2.GMAIL_USER && env2.GMAIL_APP_PASSWORD) {
        sendWelcomeEmail(email, language, env2).catch(() => {
        });
      }
      return json4({ success: true, subscriber: { email, language, name } });
    } catch (err) {
      return json4({ error: "Database error", details: err.message }, 500);
    }
  }
  if (request3.method === "GET") {
    const token = request3.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json4({ error: "Unauthorized" }, 401);
    try {
      const result = await db2.execute("SELECT * FROM subscribers ORDER BY subscribedAt DESC");
      const subscribers = result.rows.map((r) => ({
        id: r.id,
        email: r.email,
        language: r.language,
        name: r.name,
        subscribedAt: r.subscribedAt
      }));
      return json4({ subscribers, total: subscribers.length });
    } catch (err) {
      return json4({ error: "Database error", details: err.message }, 500);
    }
  }
  if (request3.method === "DELETE") {
    const token = request3.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json4({ error: "Unauthorized" }, 401);
    let body;
    try {
      body = await request3.json();
    } catch {
      return json4({ error: "Invalid JSON body" }, 400);
    }
    const { email } = body;
    if (!email) return json4({ error: "Email required" }, 400);
    try {
      const result = await db2.execute("DELETE FROM subscribers WHERE email = ?", [email]);
      if (result.rowsAffected === 0) return json4({ error: "Subscriber not found" }, 404);
      return json4({ success: true });
    } catch (err) {
      return json4({ error: "Database error", details: err.message }, 500);
    }
  }
  return json4({ error: "Method not allowed" }, 405);
}
async function sendWelcomeEmail(email, language, env2) {
  const isAr = language === "ar";
  const subject = isAr ? "\u0645\u0631\u062D\u0628\u0627 \u0628\u0643 \u0641\u064A \u0642\u0627\u0626\u0645\u062A\u0646\u0627 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629" : "Welcome to Our Newsletter";
  const body = isAr ? "<p>\u0634\u0643\u0631\u0627\u064B \u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0643! \u0633\u0646\u0628\u0642\u064A\u0643 \u0639\u0644\u0649 \u0627\u0637\u0644\u0627\u0639 \u0628\u0622\u062E\u0631 \u0627\u0644\u0623\u062E\u0628\u0627\u0631.</p>" : "<p>Thank you for subscribing! We will keep you updated with the latest news.</p>";
  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: env2.GMAIL_USER, name: "Author Fatima" },
        subject,
        content: [{ type: "text/html", value: body }]
      })
    });
  } catch {
  }
}
var cors4;
var init_subscribers = __esm({
  "api/subscribers.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    __name(getDb3, "getDb");
    cors4 = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };
    __name(json4, "json");
    __name(onRequest10, "onRequest");
    __name(sendWelcomeEmail, "sendWelcomeEmail");
  }
});

// api/subscribers-kv.ts
async function onRequest11(context2) {
  const { request: request3 } = context2;
  const env2 = context2.env;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  if (request3.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const kv = env2.SUBSCRIBERS_KV;
    if (!kv) {
      console.error("\u274C KV namespace not found");
      return new Response(
        JSON.stringify({ error: "KV storage not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }
    console.log("\u2705 KV namespace connected");
    if (request3.method === "POST") {
      const body = await request3.json();
      const { email, language } = body;
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      try {
        const existing = await kv.get(`subscriber:${email}`);
        if (existing) {
          return new Response(
            JSON.stringify({ error: "Already subscribed" }),
            { status: 400, headers: corsHeaders }
          );
        }
        const subscriber = {
          email,
          language: language || "en",
          subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
          name: ""
        };
        await kv.put(`subscriber:${email}`, JSON.stringify(subscriber));
        const listKey = "subscribers:list";
        const listData = await kv.get(listKey);
        const subscribers = listData ? JSON.parse(listData) : [];
        subscribers.push(email);
        await kv.put(listKey, JSON.stringify(subscribers));
        console.log(`\u2705 Subscriber saved to KV: ${email}`);
        return new Response(
          JSON.stringify({ success: true, subscriber }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C KV error:", err.message);
        return new Response(
          JSON.stringify({ error: "Storage error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    if (request3.method === "GET") {
      const token = request3.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: corsHeaders }
        );
      }
      try {
        const listKey = "subscribers:list";
        const listData = await kv.get(listKey);
        const subscriberEmails = listData ? JSON.parse(listData) : [];
        const subscribers = [];
        for (const email of subscriberEmails) {
          const data = await kv.get(`subscriber:${email}`);
          if (data) {
            subscribers.push(JSON.parse(data));
          }
        }
        console.log(`\u2705 Retrieved ${subscribers.length} subscribers from KV`);
        return new Response(
          JSON.stringify({ subscribers, total: subscribers.length }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C KV error:", err.message);
        return new Response(
          JSON.stringify({ error: "Storage error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    if (request3.method === "DELETE") {
      const token = request3.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: corsHeaders }
        );
      }
      try {
        const body = await request3.json();
        const { email } = body;
        await kv.delete(`subscriber:${email}`);
        const listKey = "subscribers:list";
        const listData = await kv.get(listKey);
        const subscribers = listData ? JSON.parse(listData) : [];
        const filtered = subscribers.filter((e) => e !== email);
        await kv.put(listKey, JSON.stringify(filtered));
        console.log(`\u2705 Subscriber deleted from KV: ${email}`);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C KV error:", err.message);
        return new Response(
          JSON.stringify({ error: "Storage error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  } catch (err) {
    console.error("\u274C API error:", err.message);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
var init_subscribers_kv = __esm({
  "api/subscribers-kv.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequest11, "onRequest");
  }
});

// api/subscribers-turso.ts
function initDb(env2) {
  if (!db) {
    let connectionUrl = env2?.TURSO_CONNECTION_URL;
    let authToken = env2?.TURSO_AUTH_TOKEN;
    if (!connectionUrl) {
      connectionUrl = process.env.TURSO_CONNECTION_URL;
    }
    if (!authToken) {
      authToken = process.env.TURSO_AUTH_TOKEN;
    }
    console.log("\u{1F50D} Initializing Turso...");
    console.log("   URL exists:", !!connectionUrl);
    console.log("   Token exists:", !!authToken);
    console.log("   URL starts with:", connectionUrl?.substring(0, 20) || "N/A");
    if (!connectionUrl || !authToken) {
      console.error("\u274C Turso credentials missing!");
      console.error("   env.TURSO_CONNECTION_URL:", !!env2?.TURSO_CONNECTION_URL);
      console.error("   env.TURSO_AUTH_TOKEN:", !!env2?.TURSO_AUTH_TOKEN);
      console.error("   process.env.TURSO_CONNECTION_URL:", !!process.env.TURSO_CONNECTION_URL);
      console.error("   process.env.TURSO_AUTH_TOKEN:", !!process.env.TURSO_AUTH_TOKEN);
      throw new Error("Turso not configured");
    }
    try {
      db = createClient({
        url: connectionUrl,
        authToken
      });
      console.log("\u2705 Turso connected successfully");
    } catch (err) {
      console.error("\u274C Turso connection failed:", err.message);
      throw err;
    }
  }
  return db;
}
function initTransporter2(env2) {
  if (!transporter2) {
    const gmailUser = env2.GMAIL_USER;
    const gmailPass = env2.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
      console.error("Gmail credentials missing");
      return null;
    }
    transporter2 = import_nodemailer2.default.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
  }
  return transporter2;
}
function generateWelcomeEmailTemplate(subscriberEmail, language = "en") {
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "right" : "left";
  const subject = isArabic ? "\u0645\u0631\u062D\u0628\u0627 \u0628\u0643 \u0641\u064A \u0642\u0627\u0626\u0645\u062A\u0646\u0627 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629" : "Welcome to Our Newsletter";
  const content = isArabic ? `
<p>\u0645\u0631\u062D\u0628\u0627 \u0628\u0643!</p>
<p>\u0634\u0643\u0631\u0627\u064B \u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0643 \u0641\u064A \u0642\u0627\u0626\u0645\u062A\u0646\u0627 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629. \u0646\u062D\u0646 \u0633\u0639\u062F\u0627\u0621 \u062C\u062F\u0627\u064B \u0628\u0627\u0646\u0636\u0645\u0627\u0645\u0643 \u0625\u0644\u064A\u0646\u0627.</p>
<p>\u0633\u062A\u062A\u0644\u0642\u0649 \u0645\u0646\u0627:</p>
<ul>
<li>\u0622\u062E\u0631 \u0627\u0644\u0623\u062E\u0628\u0627\u0631 \u0648\u0627\u0644\u062A\u062D\u062F\u064A\u062B\u0627\u062A</li>
<li>\u0645\u062D\u062A\u0648\u0649 \u062D\u0635\u0631\u064A \u0648\u062E\u0627\u0635</li>
<li>\u0639\u0631\u0648\u0636 \u0648\u0641\u0631\u0635 \u062E\u0627\u0635\u0629</li>
</ul>
<p>\u0625\u0630\u0627 \u0643\u0627\u0646 \u0644\u062F\u064A\u0643 \u0623\u064A \u0623\u0633\u0626\u0644\u0629\u060C \u0644\u0627 \u062A\u062A\u0631\u062F\u062F \u0641\u064A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627.</p>
<p>\u0634\u0643\u0631\u0627\u064B \u0644\u0643!</p>
  ` : `
<p>Hello!</p>
<p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
<p>You'll receive:</p>
<ul>
<li>Latest news and updates</li>
<li>Exclusive content</li>
<li>Special offers and opportunities</li>
</ul>
<p>If you have any questions, feel free to reach out to us.</p>
<p>Thank you!</p>
  `;
  return `<!DOCTYPE html>
<html lang="${language}" dir="${direction}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style type="text/css">
body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; direction: ${direction}; }
.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
.header-icon { font-size: 48px; margin-bottom: 15px; }
.header h1 { margin: 0; font-size: 28px; font-weight: bold; }
.content { padding: 40px 20px; text-align: ${textAlign}; line-height: 1.6; color: #333; }
.content p { margin: 0 0 15px 0; font-size: 14px; }
.content ul { margin: 15px 0; padding-${isArabic ? "right" : "left"}: 20px; }
.content li { margin-bottom: 8px; font-size: 14px; }
.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
.footer a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="header-icon">\u2709\uFE0F</div>
<h1>${subject}</h1>
</div>
<div class="content">
${content}
</div>
<div class="footer">
<p>\xA9 2026 All rights reserved</p>
<p><a href="https://main.author-fatima-76r-eis.pages.dev">Website</a> | <a href="mailto:AuthorFSK@gmail.com">Email</a></p>
</div>
</div>
</body>
</html>`;
}
async function sendWelcomeEmail2(email, language, env2) {
  try {
    const mailer = initTransporter2(env2);
    if (!mailer) {
      console.warn("Email service not available");
      return false;
    }
    const subject = language === "ar" ? "\u0645\u0631\u062D\u0628\u0627 \u0628\u0643 \u0641\u064A \u0642\u0627\u0626\u0645\u062A\u0646\u0627 \u0627\u0644\u0628\u0631\u064A\u062F\u064A\u0629" : "Welcome to Our Newsletter";
    const htmlContent = generateWelcomeEmailTemplate(email, language);
    const mailOptions = {
      from: env2.GMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
      replyTo: env2.GMAIL_USER,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "MIME-Version": "1.0"
      }
    };
    const info3 = await mailer.sendMail(mailOptions);
    console.log(`\u2705 Welcome email sent to ${email}`);
    return true;
  } catch (err) {
    console.error(`\u274C Failed to send welcome email:`, err.message);
    return false;
  }
}
async function onRequest12(context2) {
  const { request: request3 } = context2;
  const env2 = context2.env;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  if (request3.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    console.log("\u{1F4CB} Environment Check:");
    console.log("   TURSO_CONNECTION_URL:", env2.TURSO_CONNECTION_URL ? "\u2705 Present" : "\u274C Missing");
    console.log("   TURSO_AUTH_TOKEN:", env2.TURSO_AUTH_TOKEN ? "\u2705 Present" : "\u274C Missing");
    console.log("   GMAIL_USER:", env2.GMAIL_USER ? "\u2705 Present" : "\u274C Missing");
    console.log("   GMAIL_APP_PASSWORD:", env2.GMAIL_APP_PASSWORD ? "\u2705 Present" : "\u274C Missing");
    const db_instance = initDb(env2);
    if (request3.method === "POST") {
      const body = await request3.json();
      const { email, language } = body;
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      try {
        const existing = await db_instance.execute(
          "SELECT * FROM subscribers WHERE email = ?",
          [email]
        );
        if (existing.rows.length > 0) {
          return new Response(
            JSON.stringify({ error: "Already subscribed" }),
            { status: 400, headers: corsHeaders }
          );
        }
        await db_instance.execute(
          "INSERT INTO subscribers (email, language, name) VALUES (?, ?, ?)",
          [email, language || "en", ""]
        );
        console.log(`\u2705 Subscriber saved to Turso: ${email}`);
        const subscriber = {
          email,
          language: language || "en",
          subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
          name: ""
        };
        if (env2.GMAIL_USER && env2.GMAIL_APP_PASSWORD) {
          sendWelcomeEmail2(email, language || "en", env2).catch((err) => {
            console.error("Error sending welcome email:", err);
          });
        }
        return new Response(
          JSON.stringify({ success: true, subscriber }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C Database error:", err.message);
        return new Response(
          JSON.stringify({ error: "Database error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    if (request3.method === "GET") {
      const token = request3.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: corsHeaders }
        );
      }
      try {
        const result = await db_instance.execute("SELECT * FROM subscribers ORDER BY subscribedAt DESC");
        const subscribers = result.rows.map((row) => ({
          email: row.email,
          language: row.language,
          subscribedAt: row.subscribedAt,
          name: row.name
        }));
        console.log(`\u2705 Retrieved ${subscribers.length} subscribers from Turso`);
        return new Response(
          JSON.stringify({ subscribers, total: subscribers.length }),
          { status: 200, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C Database error:", err.message);
        return new Response(
          JSON.stringify({ error: "Database error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    if (request3.method === "DELETE") {
      const token = request3.headers.get("authorization")?.split(" ")[1];
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: corsHeaders }
        );
      }
      try {
        const body = await request3.json();
        const { email } = body;
        const result = await db_instance.execute(
          "DELETE FROM subscribers WHERE email = ?",
          [email]
        );
        if (result.rowsAffected > 0) {
          console.log(`\u2705 Subscriber deleted from Turso: ${email}`);
          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: corsHeaders }
          );
        }
        return new Response(
          JSON.stringify({ error: "Subscriber not found" }),
          { status: 404, headers: corsHeaders }
        );
      } catch (err) {
        console.error("\u274C Database error:", err.message);
        return new Response(
          JSON.stringify({ error: "Database error", details: err.message }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  } catch (err) {
    console.error("\u274C API error:", err.message);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
var import_nodemailer2, db, transporter2;
var init_subscribers_turso = __esm({
  "api/subscribers-turso.ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    import_nodemailer2 = __toESM(require_nodemailer(), 1);
    __name(initDb, "initDb");
    __name(initTransporter2, "initTransporter");
    __name(generateWelcomeEmailTemplate, "generateWelcomeEmailTemplate");
    __name(sendWelcomeEmail2, "sendWelcomeEmail");
    __name(onRequest12, "onRequest");
  }
});

// api/[[route]].ts
async function onRequest13(context2) {
  const url = new URL(context2.request.url);
  if (context2.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  return new Response(
    JSON.stringify({ error: "Not found", path: url.pathname }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}
var init_route = __esm({
  "api/[[route]].ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequest13, "onRequest");
  }
});

// make-server-53bed28f/[[route]].ts
var onRequest14;
var init_route2 = __esm({
  "make-server-53bed28f/[[route]].ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_web2();
    onRequest14 = /* @__PURE__ */ __name(async (context2) => {
      const url = new URL(context2.request.url);
      const path = url.pathname;
      const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      };
      if (context2.request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
      const db2 = createClient({
        url: context2.env.TURSO_CONNECTION_URL,
        authToken: context2.env.TURSO_AUTH_TOKEN
      });
      try {
        if (path.includes("/subscribers/stats") && context2.request.method === "GET") {
          try {
            const result = await db2.execute("SELECT COUNT(*) as count FROM subscribers");
            const totalSubscribers = result.rows[0]?.count || 0;
            return new Response(JSON.stringify({
              success: true,
              stats: {
                totalSubscribers,
                activeSubscribers: totalSubscribers,
                monthlyStats: [
                  { month: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7), count: totalSubscribers }
                ]
              }
            }), { status: 200, headers: corsHeaders });
          } catch (err) {
            console.error("Stats error:", err);
            return new Response(JSON.stringify({
              success: true,
              stats: {
                totalSubscribers: 0,
                activeSubscribers: 0,
                monthlyStats: []
              }
            }), { status: 200, headers: corsHeaders });
          }
        }
        if (path.includes("/subscribers") && context2.request.method === "GET" && !path.includes("/stats")) {
          try {
            const result = await db2.execute("SELECT * FROM subscribers ORDER BY subscribedAt DESC LIMIT 100");
            const subscribers = result.rows.map((row) => ({
              email: row.email,
              name: row.name || "",
              language: row.language || "en",
              subscribedAt: row.subscribedAt || (/* @__PURE__ */ new Date()).toISOString()
            }));
            return new Response(JSON.stringify({
              success: true,
              subscribers
            }), { status: 200, headers: corsHeaders });
          } catch (err) {
            console.error("Get subscribers error:", err);
            return new Response(JSON.stringify({
              success: true,
              subscribers: []
            }), { status: 200, headers: corsHeaders });
          }
        }
        if (path.includes("/subscribers") && context2.request.method === "POST") {
          try {
            const { email, language } = await context2.request.json();
            if (!email) {
              return new Response(JSON.stringify({ error: "Email required" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            const existing = await db2.execute("SELECT * FROM subscribers WHERE email = ?", [email]);
            if (existing.rows.length > 0) {
              return new Response(JSON.stringify({ error: "Email already subscribed" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            await db2.execute(
              "INSERT INTO subscribers (email, language, subscribedAt) VALUES (?, ?, ?)",
              [email, language || "en", (/* @__PURE__ */ new Date()).toISOString()]
            );
            return new Response(JSON.stringify({ success: true, message: "Subscriber added" }), {
              status: 200,
              headers: corsHeaders
            });
          } catch (err) {
            console.error("Add subscriber error:", err);
            return new Response(JSON.stringify({ error: err.message }), {
              status: 500,
              headers: corsHeaders
            });
          }
        }
        if (path.includes("/newsletters") && context2.request.method === "GET" && !path.includes("/send")) {
          try {
            const result = await db2.execute("SELECT * FROM newsletters ORDER BY id DESC LIMIT 100");
            const newsletters = result.rows.map((row) => ({
              id: row.id,
              title: row.title,
              content: row.content,
              language: row.language || "en",
              status: row.status || "draft",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              sentAt: row.sentAt
            }));
            return new Response(JSON.stringify({
              success: true,
              newsletters
            }), { status: 200, headers: corsHeaders });
          } catch (err) {
            console.error("Get newsletters error:", err);
            return new Response(JSON.stringify({
              success: true,
              newsletters: []
            }), { status: 200, headers: corsHeaders });
          }
        }
        if (path.includes("/newsletters") && context2.request.method === "POST" && !path.includes("/send")) {
          try {
            const { title: title2, content, language } = await context2.request.json();
            if (!title2 || !content) {
              return new Response(JSON.stringify({ error: "Title and content required" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            const id = "nl-" + Date.now();
            await db2.execute(
              "INSERT INTO newsletters (id, title, content, language, status) VALUES (?, ?, ?, ?, ?)",
              [id, title2, content, language || "en", "draft"]
            );
            return new Response(JSON.stringify({ success: true, message: "Newsletter created", id }), {
              status: 200,
              headers: corsHeaders
            });
          } catch (err) {
            console.error("Create newsletter error:", err);
            return new Response(JSON.stringify({ error: err.message }), {
              status: 500,
              headers: corsHeaders
            });
          }
        }
        if (path.includes("/newsletters") && path.includes("/send") && context2.request.method === "POST") {
          try {
            const pathParts = path.split("/");
            const id = pathParts[pathParts.length - 2];
            const { recipients, subject, content } = await context2.request.json();
            if (!recipients || recipients.length === 0) {
              return new Response(JSON.stringify({ error: "Recipients required" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            const nlResult = await db2.execute("SELECT * FROM newsletters WHERE id = ?", [id]);
            if (nlResult.rows.length === 0) {
              return new Response(JSON.stringify({ error: "Newsletter not found" }), {
                status: 404,
                headers: corsHeaders
              });
            }
            await db2.execute(
              "UPDATE newsletters SET status = ? WHERE id = ?",
              ["sent", id]
            );
            return new Response(JSON.stringify({
              success: true,
              message: "Newsletter sent",
              count: recipients.length,
              recipientCount: recipients.length
            }), { status: 200, headers: corsHeaders });
          } catch (err) {
            console.error("Send newsletter error:", err);
            return new Response(JSON.stringify({ error: err.message }), {
              status: 500,
              headers: corsHeaders
            });
          }
        }
        if (path.endsWith("/send-email") && context2.request.method === "POST") {
          try {
            const { recipients, subject, content, language } = await context2.request.json();
            if (!recipients || recipients.length === 0) {
              return new Response(JSON.stringify({ error: "Recipients required" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            if (!subject || !content) {
              return new Response(JSON.stringify({ error: "Subject and content required" }), {
                status: 400,
                headers: corsHeaders
              });
            }
            console.log(`Email would be sent to: ${recipients.join(", ")}`);
            return new Response(JSON.stringify({
              success: true,
              message: `Email sent to ${recipients.length} recipient(s)`,
              recipientCount: recipients.length,
              totalRecipients: recipients.length
            }), {
              status: 200,
              headers: corsHeaders
            });
          } catch (err) {
            console.error("Send email error:", err);
            return new Response(JSON.stringify({ error: err.message }), {
              status: 500,
              headers: corsHeaders
            });
          }
        }
        if (path.includes("/api/admin/")) {
          if (path.includes("/change-password") && context2.request.method === "POST") {
            return new Response(JSON.stringify({ success: true, message: "Password changed" }), {
              status: 200,
              headers: corsHeaders
            });
          }
          if (path.includes("/profile") && context2.request.method === "GET") {
            return new Response(JSON.stringify({
              success: true,
              admin: {
                id: "1",
                email: "admin@authorfatima.com",
                name: "Admin",
                username: "admin",
                created_at: (/* @__PURE__ */ new Date()).toISOString()
              }
            }), { status: 200, headers: corsHeaders });
          }
          if (path.includes("/profile") && context2.request.method === "PUT") {
            return new Response(JSON.stringify({ success: true, message: "Profile updated" }), {
              status: 200,
              headers: corsHeaders
            });
          }
        }
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: corsHeaders });
      } catch (err) {
        console.error("API error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }, "onRequest");
  }
});

// [[route]].ts
var onRequest15;
var init_route3 = __esm({
  "[[route]].ts"() {
    init_functionsRoutes_0_7590748747458169();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequest15 = /* @__PURE__ */ __name(async (context2) => {
      const url = new URL(context2.request.url);
      if (context2.request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          }
        });
      }
      if (url.pathname.startsWith("/api/")) {
        return context2.next();
      }
      return context2.next();
    }, "onRequest");
  }
});

// ../.wrangler/tmp/pages-8jqltj/functionsRoutes-0.7590748747458169.mjs
var routes;
var init_functionsRoutes_0_7590748747458169 = __esm({
  "../.wrangler/tmp/pages-8jqltj/functionsRoutes-0.7590748747458169.mjs"() {
    init_change_password();
    init_login();
    init_send();
    init_forgot_password();
    init_profile();
    init_reset_password();
    init_send_email_simple();
    init_send_newsletter();
    init_debug_env();
    init_newsletters();
    init_schema_check();
    init_send_email();
    init_send_email_worker();
    init_stats();
    init_subscribers();
    init_subscribers_kv();
    init_subscribers_turso();
    init_route();
    init_route2();
    init_route3();
    routes = [
      {
        routePath: "/api/admin/change-password",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/admin/login",
        mountPath: "/api/admin",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/api/newsletters/send",
        mountPath: "/api/newsletters",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost3]
      },
      {
        routePath: "/api/admin/forgot-password",
        mountPath: "/api/admin",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/api/admin/profile",
        mountPath: "/api/admin",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      },
      {
        routePath: "/api/admin/reset-password",
        mountPath: "/api/admin",
        method: "",
        middlewares: [],
        modules: [onRequest3]
      },
      {
        routePath: "/api/send-email-simple",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/send-newsletter",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/debug-env",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest4]
      },
      {
        routePath: "/api/newsletters",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest5]
      },
      {
        routePath: "/api/schema-check",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest6]
      },
      {
        routePath: "/api/send-email",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest7]
      },
      {
        routePath: "/api/send-email-worker",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest8]
      },
      {
        routePath: "/api/stats",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest9]
      },
      {
        routePath: "/api/subscribers",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest10]
      },
      {
        routePath: "/api/subscribers-kv",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest11]
      },
      {
        routePath: "/api/subscribers-turso",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest12]
      },
      {
        routePath: "/api/:route*",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest13]
      },
      {
        routePath: "/make-server-53bed28f/:route*",
        mountPath: "/make-server-53bed28f",
        method: "",
        middlewares: [],
        modules: [onRequest14]
      },
      {
        routePath: "/:route*",
        mountPath: "/",
        method: "",
        middlewares: [],
        modules: [onRequest15]
      }
    ];
  }
});

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_7590748747458169();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_7590748747458169();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type2) {
    if (i < tokens.length && tokens[i].type === type2)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type2) {
    var value2 = tryConsume(type2);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type2));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open3 = tryConsume("OPEN");
    if (open3) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode2 = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode2(value, key);
        });
      } else {
        params[key.name] = decode2(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode2 = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode2(token));
    } else {
      var prefix = escapeString(encode2(token.prefix));
      var suffix = escapeString(encode2(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request3) {
  const requestPath = new URL(request3.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request3.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request3.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request3 = originalRequest;
    const handlerIterator = executeRequest(request3);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request3.url).toString();
        }
        request3 = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request3.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request3);
        return cloneResponse(response);
      } else {
        const response = await fetch(request3);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request3);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
