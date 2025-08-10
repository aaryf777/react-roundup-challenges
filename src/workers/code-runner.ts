// Deep equality checker
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  )
    return false;
  if (a.constructor !== b.constructor) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]));
};

// Extended expect with async matchers
interface Matchers {
  toBe(expected: any): void;
  toEqual(expected: any): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(item: any): void;
  toBeGreaterThanOrEqual(expected: number): void;
  toBeLessThanOrEqual(expected: number): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  toHaveBeenCalledTimes(times: number): void;
  toHaveBeenCalledWith(...args: any[]): void;
  not: Omit<Matchers, "not">;
}

interface PromiseMatchers {
  resolves:
    | Omit<Matchers, "resolves" | "rejects">
    | {
        not: Omit<Matchers, "resolves" | "rejects">;
      };
  rejects: Omit<Matchers, "resolves" | "rejects"> & {
    not: Omit<Matchers, "resolves" | "rejects">;
  };
}

const expect = (actual: any): Matchers & Partial<PromiseMatchers> => {
  const match = (pass: boolean, failMsg: string) => {
    if (!pass) throw new Error(failMsg);
  };

  const baseMatchers: Omit<Matchers, "not"> = {
    toBe: (expected: any) =>
      match(
        Object.is(actual, expected),
        `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`
      ),
    toEqual: (expected: any) =>
      match(
        deepEqual(actual, expected),
        `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`
      ),
    toBeTruthy: () =>
      match(!!actual, `Expected ${JSON.stringify(actual)} to be truthy`),
    toBeFalsy: () =>
      match(!actual, `Expected ${JSON.stringify(actual)} to be falsy`),
    toContain: (item: any) =>
      match(
        (Array.isArray(actual) || typeof actual === "string") &&
          actual.includes(item),
        `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`
      ),
    toBeGreaterThanOrEqual: (expected: number) =>
      match(
        actual >= expected,
        `Expected ${actual} to be greater than or equal to ${expected}`
      ),
    toBeLessThanOrEqual: (expected: number) =>
      match(
        actual <= expected,
        `Expected ${actual} to be less than or equal to ${expected}`
      ),
    toBeGreaterThan: (expected: number) =>
      match(
        actual > expected,
        `Expected ${actual} to be greater than ${expected}`
      ),
    toBeLessThan: (expected: number) =>
      match(
        actual < expected,
        `Expected ${actual} to be less than ${expected}`
      ),
    toHaveBeenCalledTimes: (times: number) =>
      match(
        actual?.mock?.calls?.length === times,
        `Expected mock to be called ${times} times, but was called ${actual?.mock?.calls?.length || 0}`
      ),
    toHaveBeenCalledWith: (...args: any[]) =>
      match(
        actual?.mock?.calls?.some((call: any[]) => deepEqual(call, args)),
        `Expected mock to be called with ${JSON.stringify(args)}, but actual calls were:\n` +
          actual?.mock?.calls?.map((c: any[]) => JSON.stringify(c)).join("\n")
      ),
  };

  const matchers: Matchers = {
    ...baseMatchers,
    not: {
      ...baseMatchers,
      toBe: (expected: any) =>
        match(
          !Object.is(actual, expected),
          `Expected ${JSON.stringify(actual)} not to be ${JSON.stringify(expected)}`
        ),
      toEqual: (expected: any) =>
        match(
          !deepEqual(actual, expected),
          `Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`
        ),
      toContain: (item: any) =>
        match(
          !(Array.isArray(actual) || typeof actual === "string") ||
            !actual.includes(item),
          `Expected ${JSON.stringify(actual)} not to contain ${JSON.stringify(item)}`
        ),
      toBeGreaterThanOrEqual: (expected: number) =>
        match(
          actual < expected,
          `Expected ${actual} to be less than ${expected}`
        ),
      toBeLessThanOrEqual: (expected: number) =>
        match(
          actual > expected,
          `Expected ${actual} to be greater than ${expected}`
        ),
      toBeGreaterThan: (expected: number) =>
        match(
          actual <= expected,
          `Expected ${actual} to be less than or equal to ${expected}`
        ),
      toBeLessThan: (expected: number) =>
        match(
          actual >= expected,
          `Expected ${actual} to be greater than or equal to ${expected}`
        ),
    },
  };

  // Add promise matchers if the actual is a promise
  if (actual && typeof actual.then === "function") {
    const promiseMatchers: PromiseMatchers = {
      resolves: {
        not: {
          toBe: (expected: any) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBe(expected);
              return resolved;
            });
          },
          toEqual: (expected: any) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toEqual(expected);
              return resolved;
            });
          },
          toBeTruthy: () => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeTruthy();
              return resolved;
            });
          },
          toBeFalsy: () => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeFalsy();
              return resolved;
            });
          },
          toContain: (item: any) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toContain(item);
              return resolved;
            });
          },
          toBeGreaterThanOrEqual: (expected: number) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeGreaterThanOrEqual(expected);
              return resolved;
            });
          },
          toBeLessThanOrEqual: (expected: number) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeLessThanOrEqual(expected);
              return resolved;
            });
          },
          toBeGreaterThan: (expected: number) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeGreaterThan(expected);
              return resolved;
            });
          },
          toBeLessThan: (expected: number) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toBeLessThan(expected);
              return resolved;
            });
          },
          toHaveBeenCalledTimes: (times: number) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toHaveBeenCalledTimes(times);
              return resolved;
            });
          },
          toHaveBeenCalledWith: (...args: any[]) => {
            return actual.then((resolved: any) => {
              expect(resolved).not.toHaveBeenCalledWith(...args);
              return resolved;
            });
          },
        },
        toBe: (expected: any) => {
          return actual.then((resolved: any) => {
            expect(resolved).toBe(expected);
            return resolved;
          });
        },
        toEqual: (expected: any) => {
          return actual.then((resolved: any) => {
            expect(resolved).toEqual(expected);
            return resolved;
          });
        },
        toBeTruthy: () => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeTruthy();
            return resolved;
          });
        },
        toBeFalsy: () => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeFalsy();
            return resolved;
          });
        },
        toContain: (item: any) => {
          return actual.then((resolved: any) => {
            expect(resolved).toContain(item);
            return resolved;
          });
        },
        toBeGreaterThanOrEqual: (expected: number) => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeGreaterThanOrEqual(expected);
            return resolved;
          });
        },
        toBeLessThanOrEqual: (expected: number) => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeLessThanOrEqual(expected);
            return resolved;
          });
        },
        toBeGreaterThan: (expected: number) => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeGreaterThan(expected);
            return resolved;
          });
        },
        toBeLessThan: (expected: number) => {
          return actual.then((resolved: any) => {
            expect(resolved).toBeLessThan(expected);
            return resolved;
          });
        },
        toHaveBeenCalledTimes: (times: number) => {
          return actual.then((resolved: any) => {
            expect(resolved).toHaveBeenCalledTimes(times);
            return resolved;
          });
        },
        toHaveBeenCalledWith: (...args: any[]) => {
          return actual.then((resolved: any) => {
            expect(resolved).toHaveBeenCalledWith(...args);
            return resolved;
          });
        },
      },
      rejects: {
        // @ts-ignore
        not: {
          toBe: async (expected: any) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${JSON.stringify(expected)}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toBe(expected);
            }
          },
          toEqual: async (expected: any) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${JSON.stringify(expected)}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toEqual(expected);
            }
          },
          toBeTruthy: async () => {
            try {
              await actual;
              throw new Error(
                "Expected promise to reject with a truthy value, but it resolved"
              );
            } catch (err) {
              return expect(err).not.toBeTruthy();
            }
          },
          toBeFalsy: async () => {
            try {
              await actual;
              throw new Error(
                "Expected promise to reject with a falsy value, but it resolved"
              );
            } catch (err) {
              return expect(err).not.toBeFalsy();
            }
          },
          toContain: async (item: any) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${JSON.stringify(item)}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toContain(item);
            }
          },
          toBeGreaterThanOrEqual: async (expected: number) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${expected}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toBeGreaterThanOrEqual(expected);
            }
          },
          toBeLessThanOrEqual: async (expected: number) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${expected}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toBeLessThanOrEqual(expected);
            }
          },
          toBeGreaterThan: async (expected: number) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${expected}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toBeGreaterThan(expected);
            }
          },
          toBeLessThan: async (expected: number) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${expected}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toBeLessThan(expected);
            }
          },
          toHaveBeenCalledTimes: async (times: number) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${times}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toHaveBeenCalledTimes(times);
            }
          },
          toHaveBeenCalledWith: async (...args: any[]) => {
            try {
              await actual;
              throw new Error(
                `Expected promise to reject with ${JSON.stringify(args)}, but it resolved`
              );
            } catch (err) {
              return expect(err).not.toHaveBeenCalledWith(...args);
            }
          },
        },
        toBe: async (expected: any) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${JSON.stringify(expected)}, but it resolved`
            );
          } catch (err) {
            return expect(err).toBe(expected);
          }
        },
        toEqual: async (expected: any) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${JSON.stringify(expected)}, but it resolved`
            );
          } catch (err) {
            return expect(err).toEqual(expected);
          }
        },
        toBeTruthy: async () => {
          try {
            await actual;
            throw new Error(
              "Expected promise to reject with a truthy value, but it resolved"
            );
          } catch (err) {
            return expect(err).toBeTruthy();
          }
        },
        toBeFalsy: async () => {
          try {
            await actual;
            throw new Error(
              "Expected promise to reject with a falsy value, but it resolved"
            );
          } catch (err) {
            return expect(err).toBeFalsy();
          }
        },
        toContain: async (item: any) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${JSON.stringify(item)}, but it resolved`
            );
          } catch (err) {
            return expect(err).toContain(item);
          }
        },
        toBeGreaterThanOrEqual: async (expected: number) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${expected}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toBeGreaterThanOrEqual(expected);
          }
        },
        toBeLessThanOrEqual: async (expected: number) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${expected}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toBeLessThanOrEqual(expected);
          }
        },
        toBeGreaterThan: async (expected: number) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${expected}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toBeGreaterThan(expected);
          }
        },
        toBeLessThan: async (expected: number) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${expected}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toBeLessThan(expected);
          }
        },
        toHaveBeenCalledTimes: async (times: number) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${times}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toHaveBeenCalledTimes(times);
          }
        },
        toHaveBeenCalledWith: async (...args: any[]) => {
          try {
            await actual;
            throw new Error(
              `Expected promise to reject with ${JSON.stringify(args)}, but it resolved`
            );
          } catch (err) {
            return expect(err).not.toHaveBeenCalledWith(...args);
          }
        },
      },
    };

    return { ...matchers, ...promiseMatchers };
  }

  return matchers;
};

// Jest mock helpers
const jest = {
  setTimeout: () => jest,
  fn: (impl?: any) => {
    const callQueue: any[] = [];

    const mockFn: any = (...args: any[]) => {
      mockFn.mock.calls.push(args);
      if (callQueue.length) {
        const nextImpl = callQueue.shift();
        return nextImpl(...args);
      }
      return impl ? impl(...args) : undefined;
    };

    mockFn.mock = { calls: [] };

    mockFn.mockImplementation = (newImpl: any) => {
      impl = newImpl;
      return mockFn;
    };
    mockFn.mockReturnValue = (value: any) => {
      impl = () => value;
      return mockFn;
    };
    mockFn.mockResolvedValue = (value: any) => {
      impl = () => Promise.resolve(value);
      return mockFn;
    };
    mockFn.mockRejectedValue = (err: any) => {
      impl = () => Promise.reject(err);
      return mockFn;
    };

    // "Once" variants
    mockFn.mockResolvedValueOnce = (value: any) => {
      callQueue.push(() => Promise.resolve(value));
      return mockFn;
    };
    mockFn.mockRejectedValueOnce = (err: any) => {
      callQueue.push(() => Promise.reject(err));
      return mockFn;
    };
    mockFn.mockReturnValueOnce = (value: any) => {
      callQueue.push(() => value);
      return mockFn;
    };
    mockFn.mockImplementationOnce = (newImpl: any) => {
      callQueue.push(newImpl);
      return mockFn;
    };

    return mockFn;
  },
  spyOn: (obj: any, method: string) => {
    const originalMethod = obj[method];
    const mockFn = jest.fn((...args: any[]) => originalMethod.apply(obj, args));
    obj[method] = mockFn;
    return {
      mockRestore: () => (obj[method] = originalMethod),
      ...mockFn,
    };
  },
  useFakeTimers: () => {},
  advanceTimersByTime: () => {},
};

// Make available globally
(self as any).expect = expect;
(self as any).jest = jest;

self.onmessage = async (e: MessageEvent) => {
  const { code, testCode } = e.data;
  const testResults: any[] = [];
  const logs: string[] = [];
  const startTime = performance.now();

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const captureLog = (...args: any[]) => {
    try {
      logs.push(args.map((arg) => JSON.stringify(arg, null, 2)).join(" "));
    } catch {
      logs.push("Could not serialize log arguments");
    }
  };

  console.log = (...args) => {
    captureLog(...args);
    originalLog(...args);
  };
  console.error = (...args) => {
    captureLog("ERROR:", ...args);
    originalError(...args);
  };
  console.warn = (...args) => {
    captureLog("WARN:", ...args);
    originalWarn(...args);
  };

  try {
    const pendingTests: Promise<void>[] = [];

    const test = (name: string, fn: () => any) => {
      const p = (async () => {
        try {
          await fn(); // Always await directly
          testResults.push({ name, status: "success", message: "Test passed" });
        } catch (error: any) {
          testResults.push({
            name,
            status: "failure",
            message: error?.message || "Test failed",
          });
        }
      })();
      pendingTests.push(p);
    };

    const describe = (name: string, fn: () => any) => {
      try {
        const maybePromise = fn();
        if (maybePromise instanceof Promise) {
          return maybePromise.catch((err: Error) => {
            testResults.push({
              name: `Describe Block: ${name}`,
              status: "error",
              message: err.message,
            });
          });
        }
      } catch (error: any) {
        testResults.push({
          name: `Describe Block: ${name}`,
          status: "error",
          message: error.message,
        });
      }
    };

    const trackableFn = (fn: any) => {
      let calls = 0;
      const trackedFn = (...args: any[]) => {
        calls++;
        return fn(...args);
      };
      trackedFn.getCalls = () => calls;
      return trackedFn;
    };

    const runTestSuite = new Function(
      "describe",
      "test",
      "expect",
      "jest",
      "trackableFn",
      `return (async () => { ${code}\n\n${testCode} })();`
    );

    // Run test suite first to register tests
    await runTestSuite(describe, test, expect, jest, trackableFn);

    // Wait for all async tests to finish
    await Promise.all(pendingTests);
  } catch (error: any) {
    logs.push(`Worker: CRITICAL ERROR: ${error.message}`);
    testResults.push({
      name: "Execution Error",
      status: "error",
      message: error.message,
    });
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const passedCount = testResults.filter(
      (r) => r.status === "success"
    ).length;

    self.postMessage({
      results: testResults,
      logs,
      executionTime,
      testCasesPassed: passedCount,
      totalTestCases: testResults.length,
    });
  }
};
