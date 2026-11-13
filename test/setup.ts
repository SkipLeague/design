import "@testing-library/jest-dom/vitest";

// Node 25+ ships its own Web Storage globals (`localStorage`, `sessionStorage`),
// which stay undefined unless Node is started with --localstorage-file. They
// shadow jsdom's working ones, so tests that touch storage would fail on a newer
// local Node while passing in CI (Node 22). Put jsdom's back.
const dom = (globalThis as { jsdom?: { window: Window } }).jsdom;
if (dom) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    if (!(globalThis[key] instanceof dom.window.Storage)) {
      Object.defineProperty(globalThis, key, { configurable: true, get: () => dom.window[key] });
    }
  }
}
