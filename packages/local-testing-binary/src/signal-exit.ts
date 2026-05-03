/**
 * Inlined from the `signal-exit` package (v4.1.0).
 * https://github.com/tapjs/signal-exit
 * https://github.com/tapjs/signal-exit/blob/v4.1.0/LICENSE.txt
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2023 Benjamin Coe, Isaac Z. Schlueter, and Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * This is not the set of all possible signals.
 *
 * It IS, however, the set of all signals that trigger
 * an exit on either Linux or BSD systems.  Linux is a
 * superset of the signal names supported on BSD, and
 * the unknown signals just fail to register, so we can
 * catch that easily enough.
 *
 * Windows signals are a different set, since there are
 * signals that terminate Windows processes, but don't
 * terminate (or don't even exist) on Posix systems.
 *
 * Don't bother with SIGKILL.  It's uncatchable, which
 * means that we can't fire any callbacks anyway.
 *
 * If a user does happen to register a handler on a non-
 * fatal signal like SIGWINCH or something, and then
 * exit, it'll end up firing `process.emit('exit')`, so
 * the handler will be fired anyway.
 *
 * SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
 * artificially, inherently leave the process in a
 * state from which it is not safe to try and enter JS
 * listeners.
 */
export const signals: NodeJS.Signals[] = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");

if (process.platform !== "win32") {
  signals.push(
    "SIGALRM",
    "SIGABRT",
    "SIGVTALRM",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGUSR2",
    "SIGTRAP",
    "SIGSYS",
    "SIGQUIT",
    "SIGIOT",
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}

if (process.platform === "linux") {
  signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}

// just a loosened process type so we can do some evil things
type ProcessRE = NodeJS.Process & {
  reallyExit: (code?: number | undefined | null) => unknown;
  emit: (ev: string, ...a: unknown[]) => unknown;
};

const processOk = (proc: unknown): proc is ProcessRE =>
  !!proc &&
  typeof proc === "object" &&
  typeof (proc as ProcessRE).removeListener === "function" &&
  typeof (proc as ProcessRE).emit === "function" &&
  typeof (proc as ProcessRE).reallyExit === "function" &&
  typeof (proc as ProcessRE).listeners === "function" &&
  typeof (proc as ProcessRE).kill === "function" &&
  typeof (proc as ProcessRE).pid === "number" &&
  typeof (proc as ProcessRE).on === "function";

const kExitEmitter = Symbol.for("signal-exit emitter");
const globalScope: typeof globalThis & { [kExitEmitter]?: Emitter } = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);

/**
 * A function that takes an exit code and signal as arguments
 *
 * In the case of signal exits *only*, a return value of true
 * will indicate that the signal is being handled, and we should
 * not synthetically exit with the signal we received. Regardless
 * of the handler return value, the handler is unloaded when an
 * otherwise fatal signal is received, so you get exactly 1 shot
 * at it, unless you add another onExit handler at that point.
 *
 * In the case of numeric code exits, we may already have committed
 * to exiting the process, for example via a fatal exception or
 * unhandled promise rejection, so it is impossible to stop safely.
 */
export type Handler = (
  code: number | null | undefined,
  signal: NodeJS.Signals | null,
) => true | void;
type ExitEvent = "afterExit" | "exit";
type Emitted = { [k in ExitEvent]: boolean };
type Listeners = { [k in ExitEvent]: Handler[] };

// teeny special purpose ee
class Emitter {
  emitted: Emitted = {
    afterExit: false,
    exit: false,
  };

  listeners: Listeners = {
    afterExit: [],
    exit: [],
  };

  count: number = 0;
  id: number = Math.random();

  constructor() {
    if (globalScope[kExitEmitter]) {
      // eslint-disable-next-line no-constructor-return
      return globalScope[kExitEmitter];
    }
    ObjectDefineProperty(globalScope, kExitEmitter, {
      value: this,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  on(ev: ExitEvent, fn: Handler) {
    this.listeners[ev].push(fn);
  }

  removeListener(ev: ExitEvent, fn: Handler) {
    const list = this.listeners[ev];
    const i = list.indexOf(fn);
    if (i === -1) {
      return;
    }
    if (i === 0 && list.length === 1) {
      list.length = 0;
    } else {
      list.splice(i, 1);
    }
  }

  emit(
    ev: ExitEvent,
    code: number | null | undefined,
    signal: NodeJS.Signals | null,
  ): boolean {
    if (this.emitted[ev]) {
      return false;
    }
    this.emitted[ev] = true;
    let ret: boolean = false;
    for (const fn of this.listeners[ev]) {
      ret = fn(code, signal) === true || ret;
    }
    if (ev === "exit") {
      ret = this.emit("afterExit", code, signal) || ret;
    }
    return ret;
  }
}

abstract class SignalExitBase {
  abstract onExit(cb: Handler, opts?: { alwaysLast?: boolean }): () => void;
  abstract load(): void;
  abstract unload(): void;
}

const signalExitWrap = <T extends SignalExitBase>(handler: T) => {
  return {
    onExit(cb: Handler, opts?: { alwaysLast?: boolean }) {
      return handler.onExit(cb, opts);
    },
    load() {
      return handler.load();
    },
    unload() {
      return handler.unload();
    },
  };
};

class SignalExitFallback extends SignalExitBase {
  onExit() {
    return () => {};
  }
  load() {}
  unload() {}
}

class SignalExit extends SignalExitBase {
  // "SIGHUP" throws an `ENOSYS` error on Windows,
  // so use a supported signal instead
  #hupSig: NodeJS.Signals = process.platform === "win32" ? "SIGINT" : "SIGHUP";
  #emitter = new Emitter();
  #process: ProcessRE;
  #originalProcessEmit: ProcessRE["emit"];
  #originalProcessReallyExit: ProcessRE["reallyExit"];

  #sigListeners: { [k in NodeJS.Signals]?: () => void } = {};
  #loaded: boolean = false;

  constructor(proc: ProcessRE) {
    super();
    this.#process = proc;
    this.#sigListeners = {};
    for (const sig of signals) {
      this.#sigListeners[sig] = () => {
        // If there are no other listeners, an exit is coming!
        // Simplest way: remove us and then re-send the signal.
        // We know that this will kill the process, so we can
        // safely emit now.
        const listeners = this.#process.listeners(sig);
        let { count } = this.#emitter;
        // Workaround for signal-exit v3 / v4 coexistence: detect the
        // older emitter and add its listener count.
        const p = proc as unknown as {
          __signal_exit_emitter__?: { count: number };
        };
        if (
          typeof p.__signal_exit_emitter__ === "object" &&
          typeof p.__signal_exit_emitter__.count === "number"
        ) {
          count += p.__signal_exit_emitter__.count;
        }
        if (listeners.length === count) {
          this.unload();
          const ret = this.#emitter.emit("exit", null, sig);
          const s = sig === "SIGHUP" ? this.#hupSig : sig;
          if (!ret) proc.kill(proc.pid, s);
        }
      };
    }

    this.#originalProcessReallyExit = proc.reallyExit;
    this.#originalProcessEmit = proc.emit;
  }

  onExit(cb: Handler, opts?: { alwaysLast?: boolean }) {
    if (!processOk(this.#process)) {
      return () => {};
    }

    if (this.#loaded === false) {
      this.load();
    }

    const ev = opts?.alwaysLast ? "afterExit" : "exit";
    this.#emitter.on(ev, cb);
    return () => {
      this.#emitter.removeListener(ev, cb);
      if (
        this.#emitter.listeners["exit"].length === 0 &&
        this.#emitter.listeners["afterExit"].length === 0
      ) {
        this.unload();
      }
    };
  }

  load() {
    if (this.#loaded) {
      return;
    }
    this.#loaded = true;

    this.#emitter.count += 1;

    for (const sig of signals) {
      try {
        const fn = this.#sigListeners[sig];
        if (fn) this.#process.on(sig, fn);
      } catch (_) {
        /* ignore unsupported signals */
      }
    }

    this.#process.emit = (ev: string, ...a: unknown[]) => {
      return this.#processEmit(ev, ...a);
    };
    this.#process.reallyExit = (code?: number | null | undefined) => {
      return this.#processReallyExit(code);
    };
  }

  unload() {
    if (!this.#loaded) {
      return;
    }
    this.#loaded = false;

    signals.forEach((sig) => {
      const listener = this.#sigListeners[sig];
      if (!listener) {
        throw new Error("Listener not defined for signal: " + sig);
      }
      try {
        this.#process.removeListener(sig, listener);
      } catch (_) {
        /* ignore */
      }
    });
    this.#process.emit = this.#originalProcessEmit;
    this.#process.reallyExit = this.#originalProcessReallyExit;
    this.#emitter.count -= 1;
  }

  #processReallyExit(code?: number | null | undefined) {
    if (!processOk(this.#process)) {
      return 0;
    }
    this.#process.exitCode = code || 0;

    this.#emitter.emit("exit", this.#process.exitCode, null);
    return this.#originalProcessReallyExit.call(
      this.#process,
      this.#process.exitCode,
    );
  }

  #processEmit(ev: string, ...args: unknown[]): unknown {
    const og = this.#originalProcessEmit;
    if (ev === "exit" && processOk(this.#process)) {
      if (typeof args[0] === "number") {
        this.#process.exitCode = args[0];
      }
      const ret = og.call(this.#process, ev, ...args);
      this.#emitter.emit("exit", this.#process.exitCode, null);
      return ret;
    } else {
      return og.call(this.#process, ev, ...args);
    }
  }
}

const proc = globalThis.process;
// wrap so that we call the method on the actual handler, without
// exporting it directly.
export const {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit,

  /**
   * Load the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   *
   * @internal
   */
  load,

  /**
   * Unload the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   *
   * @internal
   */
  unload,
} = signalExitWrap(
  processOk(proc) ? new SignalExit(proc) : new SignalExitFallback(),
);
