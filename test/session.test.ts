import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The module keeps per-page state (in-memory token, single-flight renewal, the
// one-redirect guard), exactly as a real page load would. Each test gets a
// fresh copy, like a fresh page load.
type Session = typeof import("../src/session.js");
let session: Session;

const SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1";
const APP_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 SkipLeagueApp/1.0.0 (host 1)";

let realLocation: Location;
let assign: ReturnType<typeof vi.fn>;

/** Swap window.location for a fake whose assign() we can observe (jsdom cannot navigate). */
function fakeLocation(href: string) {
  realLocation = window.location;
  assign = vi.fn();
  const u = new URL(href);
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { href: u.href, origin: u.origin, pathname: u.pathname, search: u.search, hash: u.hash, assign },
  });
}

beforeEach(async () => {
  vi.resetModules();
  window.localStorage.clear();
  window.sessionStorage.clear();
  session = await import("../src/session.js");
});

afterEach(() => {
  if (realLocation) Object.defineProperty(window, "location", { configurable: true, value: realLocation });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

for (const [hostName, ua] of [
  ["browser", SAFARI_UA],
  ["iSkip app", APP_UA],
] as const) {
  describe(`session in the ${hostName}`, () => {
    beforeEach(() => {
      vi.spyOn(navigator, "userAgent", "get").mockReturnValue(ua);
    });

    describe("captureTokenFromUrl", () => {
      it("stores ?token under skipplatform_token and strips it, keeping the rest of the URL", () => {
        window.history.replaceState({ router: "state" }, "", "/lists/42?token=jwt.abc&view=grid#item-3");
        expect(session.captureTokenFromUrl()).toBe(true);
        expect(window.localStorage.getItem("skipplatform_token")).toBe("jwt.abc");
        expect(session.getAccessToken()).toBe("jwt.abc");
        expect(window.location.pathname).toBe("/lists/42");
        expect(window.location.search).toBe("?view=grid");
        expect(window.location.hash).toBe("#item-3");
        expect(window.history.state).toEqual({ router: "state" });
      });

      it("does nothing without a token", () => {
        window.history.replaceState(null, "", "/lists?view=grid");
        expect(session.captureTokenFromUrl()).toBe(false);
        expect(window.location.search).toBe("?view=grid");
        expect(session.getAccessToken()).toBeNull();
      });

      it("strips an empty ?token= without storing anything", () => {
        window.history.replaceState(null, "", "/?token=");
        expect(session.captureTokenFromUrl()).toBe(false);
        expect(window.location.search).toBe("");
        expect(session.getAccessToken()).toBeNull();
      });
    });

    describe("token storage", () => {
      it("falls back to memory when localStorage silently drops writes (iOS strict tracking protection)", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
        session.setAccessToken("t1");
        expect(session.getAccessToken()).toBe("t1");
      });

      it("never returns a stale stored token when a newer write fails", () => {
        window.localStorage.setItem("skipplatform_token", "old");
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new DOMException("full", "QuotaExceededError");
        });
        session.setAccessToken("new");
        expect(session.getAccessToken()).toBe("new");
      });

      it("works when localStorage throws on every access", () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
          throw new DOMException("blocked", "SecurityError");
        });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new DOMException("blocked", "SecurityError");
        });
        session.setAccessToken("t1");
        expect(session.getAccessToken()).toBe("t1");
      });

      it("clearAccessToken removes the token and the legacy skipleague_token key", () => {
        window.localStorage.setItem("skipleague_token", "legacy");
        session.setAccessToken("t1");
        session.clearAccessToken();
        expect(session.getAccessToken()).toBeNull();
        expect(window.localStorage.getItem("skipplatform_token")).toBeNull();
        expect(window.localStorage.getItem("skipleague_token")).toBeNull();
      });

      it("a clear whose removal silently fails does not resurrect the old token", () => {
        session.setAccessToken("t1");
        vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
        session.clearAccessToken();
        expect(session.getAccessToken()).toBeNull();
      });
    });

    describe("renew", () => {
      it("POSTs /auth/refresh with credentials and stores the new token", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: "fresh" }), { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);
        await expect(session.renew()).resolves.toBe("fresh");
        expect(fetchMock).toHaveBeenCalledWith("https://skipleague.com/auth/refresh", { method: "POST", credentials: "include" });
        expect(session.getAccessToken()).toBe("fresh");
      });

      it("collapses concurrent renewals into one request", async () => {
        let resolve!: (r: Response) => void;
        const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((r) => (resolve = r)));
        vi.stubGlobal("fetch", fetchMock);
        const a = session.renew();
        const b = session.renew();
        resolve(new Response(JSON.stringify({ access_token: "fresh" }), { status: 200 }));
        await expect(Promise.all([a, b])).resolves.toEqual(["fresh", "fresh"]);
        expect(fetchMock).toHaveBeenCalledOnce();
      });

      it("resolves null (never rejects) on a 401, a bad body, or a network error", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 })));
        await expect(session.renew()).resolves.toBeNull();
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: 5 }), { status: 200 })));
        await expect(session.renew()).resolves.toBeNull();
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));
        await expect(session.renew()).resolves.toBeNull();
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
        await expect(session.renew()).resolves.toBeNull();
        expect(session.getAccessToken()).toBeNull();
      });

      it("uses the configured platform URL", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 401 }));
        vi.stubGlobal("fetch", fetchMock);
        session.configureSession({ platformUrl: "http://localhost:5173/" });
        await session.renew();
        expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:5173/auth/refresh");
      });
    });

    describe("redirectToSignIn", () => {
      it("goes to /login with this page as return_to", () => {
        fakeLocation("https://lists.skipleague.com/lists/42?view=grid");
        session.redirectToSignIn();
        expect(assign).toHaveBeenCalledWith(
          "https://skipleague.com/login?return_to=" + encodeURIComponent("https://lists.skipleague.com/lists/42?view=grid"),
        );
      });

      it("navigates only once per page load, however many requests fail", () => {
        fakeLocation("https://lists.skipleague.com/");
        session.redirectToSignIn();
        session.redirectToSignIn();
        session.redirectToSignIn("https://lists.skipleague.com/other");
        expect(assign).toHaveBeenCalledOnce();
      });

      it("a stale token left from an earlier visit is never counted as a loop", () => {
        window.sessionStorage.setItem("skl_session_reauth", JSON.stringify({ n: 5, at: Date.now() }));
        fakeLocation("https://lists.skipleague.com/");
        session.redirectToSignIn();
        expect(assign.mock.calls[0][0]).toContain("/login?return_to=");
      });

      it("parks the user on /account when a token fresh from sign-in is rejected twice in a row", async () => {
        // First page load: arrived with a token, which was rejected.
        window.history.replaceState(null, "", "/?token=t1");
        session.captureTokenFromUrl();
        fakeLocation("https://lists.skipleague.com/");
        session.redirectToSignIn();
        expect(assign.mock.calls[0][0]).toContain("/login?return_to=");

        // Second page load, moments later: the new fresh token is rejected too.
        Object.defineProperty(window, "location", { configurable: true, value: realLocation });
        vi.resetModules();
        session = await import("../src/session.js");
        window.history.replaceState(null, "", "/?token=t2");
        session.captureTokenFromUrl();
        fakeLocation("https://lists.skipleague.com/");
        session.redirectToSignIn();
        expect(assign).toHaveBeenCalledWith("https://skipleague.com/account");
      });

      it("markSessionConfirmed resets the loop guard", async () => {
        window.history.replaceState(null, "", "/?token=t1");
        session.captureTokenFromUrl();
        fakeLocation("https://lists.skipleague.com/");
        session.redirectToSignIn();
        session.markSessionConfirmed();
        expect(window.sessionStorage.getItem("skl_session_reauth")).toBeNull();
      });
    });

    describe("signOut", () => {
      it("clears the token and ALWAYS goes through /logout, returning to this product's home", () => {
        session.setAccessToken("t1");
        fakeLocation("https://lists.skipleague.com/lists/42");
        session.signOut();
        expect(session.getAccessToken()).toBeNull();
        expect(window.localStorage.getItem("skipplatform_token")).toBeNull();
        expect(assign).toHaveBeenCalledWith(
          "https://skipleague.com/logout?return_to=" + encodeURIComponent("https://lists.skipleague.com/"),
        );
      });

      it("honours an explicit returnTo", () => {
        fakeLocation("https://reading.skipleague.com/books/1");
        session.signOut({ returnTo: "https://reading.skipleague.com/welcome" });
        expect(assign).toHaveBeenCalledWith(
          "https://skipleague.com/logout?return_to=" + encodeURIComponent("https://reading.skipleague.com/welcome"),
        );
      });
    });
  });
}

describe("configureSession", () => {
  it("rejects a relative or non-http platform URL", () => {
    expect(() => session.configureSession({ platformUrl: "/auth" })).toThrow();
    expect(() => session.configureSession({ platformUrl: "javascript:alert(1)" })).toThrow();
    expect(session.getPlatformUrl()).toBe("https://skipleague.com");
  });
});
