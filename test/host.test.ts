import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getHost, parseHostUserAgent, productUrl } from "../src/host.js";

// Real user-agents: Safari on iPhone, and the iSkip product WebView (phase 0
// spike evidence: WebKit's Mobile/15E148 kept, then the app token).
const SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1";
const APP_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 SkipLeagueApp/1.2.3 (host 4)";

function useUserAgent(ua: string) {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(ua);
}

let realLocation: Location;
let assign: ReturnType<typeof vi.fn>;

beforeEach(() => {
  realLocation = window.location;
  assign = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { href: realLocation.href, origin: realLocation.origin, assign },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", { configurable: true, value: realLocation });
  vi.restoreAllMocks();
  // navigator.share / canShare are added per test.
  delete (navigator as { share?: unknown }).share;
  delete (navigator as { canShare?: unknown }).canShare;
});

describe("parseHostUserAgent", () => {
  it("treats an ordinary browser as the browser host", () => {
    expect(parseHostUserAgent(SAFARI_UA)).toEqual({ kind: "browser", hostVersion: 0, appVersion: null });
    expect(parseHostUserAgent("")).toEqual({ kind: "browser", hostVersion: 0, appVersion: null });
    expect(parseHostUserAgent(undefined)).toEqual({ kind: "browser", hostVersion: 0, appVersion: null });
  });

  it("reads the app token's version and host contract number", () => {
    expect(parseHostUserAgent(APP_UA)).toEqual({ kind: "skipleague-ios", hostVersion: 4, appVersion: "1.2.3" });
  });

  it("accepts a prerelease version, as the phase 0 spike sent", () => {
    expect(parseHostUserAgent("Mobile/15E148 SkipLeagueApp/0.0.0-spike (host 0)")).toEqual({
      kind: "skipleague-ios",
      hostVersion: 0,
      appVersion: "0.0.0-spike",
    });
  });

  it("does not match a malformed or look-alike token", () => {
    for (const ua of [
      "Mobile/15E148 SkipLeagueApp/1.2 (host 1)",
      "Mobile/15E148 SkipLeagueApp/1.2.3",
      "Mobile/15E148 SkipLeagueApp/1.2.3 (host x)",
      "Mobile/15E148 NotSkipLeagueApp/1.2.3 (host 1)",
    ]) {
      expect(parseHostUserAgent(ua).kind).toBe("browser");
    }
  });
});

describe("getHost in a browser", () => {
  beforeEach(() => useUserAgent(SAFARI_UA));

  it("reports the browser host", () => {
    const host = getHost();
    expect(host.kind).toBe("browser");
    expect(host.hostVersion).toBe(0);
    expect(host.appVersion).toBeNull();
  });

  it("can print, save files, and open links, but has no haptics", () => {
    const host = getHost();
    expect(host.has("print")).toBe(true);
    expect(host.has("saveFile")).toBe(true);
    expect(host.has("openExternal")).toBe(true);
    expect(host.has("openProduct")).toBe(true);
    expect(host.has("haptics")).toBe(false);
  });

  it("can share only when Web Share exists", () => {
    expect(getHost().has("share")).toBe(false);
    (navigator as { share?: unknown }).share = vi.fn();
    expect(getHost().has("share")).toBe(true);
  });

  it("print() calls window.print", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    await expect(getHost().print()).resolves.toBe("printed");
    expect(print).toHaveBeenCalledOnce();
  });

  it("openExternal opens a new tab without an opener, and ignores non-http URLs", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const host = getHost();
    host.openExternal("https://example.com/x");
    expect(open).toHaveBeenCalledWith("https://example.com/x", "_blank", "noopener,noreferrer");
    host.openExternal("javascript:alert(1)");
    host.openExternal("file:///etc/passwd");
    host.openExternal("data:text/html,hi");
    expect(open).toHaveBeenCalledOnce();
    expect(assign).not.toHaveBeenCalled();
  });

  it("openProduct navigates this tab to the product", () => {
    getHost().openProduct("skiptrips", "/trips/42?tab=plan#day-2");
    expect(assign).toHaveBeenCalledWith("https://trips.skipleague.com/trips/42?tab=plan#day-2");
  });
});

describe("getHost in the iSkip app", () => {
  beforeEach(() => useUserAgent(APP_UA));

  it("reports the app host", () => {
    const host = getHost();
    expect(host.kind).toBe("skipleague-ios");
    expect(host.hostVersion).toBe(4);
    expect(host.appVersion).toBe("1.2.3");
  });

  it("cannot print (window.print is a silent no-op in WKWebView)", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    const host = getHost();
    expect(host.has("print")).toBe(false);
    await expect(host.print()).resolves.toBe("unsupported");
    expect(print).not.toHaveBeenCalled();
  });

  it("still saves files, shares, and has no haptics (no bridge)", () => {
    (navigator as { share?: unknown }).share = vi.fn();
    const host = getHost();
    expect(host.has("saveFile")).toBe(true);
    expect(host.has("share")).toBe(true);
    expect(host.has("haptics")).toBe(false);
  });

  it("openExternal navigates the page so the app's policy can open Safari View Controller", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const host = getHost();
    host.openExternal("https://example.com/x");
    expect(assign).toHaveBeenCalledWith("https://example.com/x");
    expect(open).not.toHaveBeenCalled();
    host.openExternal("javascript:alert(1)");
    expect(assign).toHaveBeenCalledOnce();
  });

  it("openProduct navigates the page so the app switches product WebViews", () => {
    getHost().openProduct("skiplists");
    expect(assign).toHaveBeenCalledWith("https://lists.skipleague.com/");
  });
});

describe("share", () => {
  beforeEach(() => useUserAgent(APP_UA));

  it("is unsupported without Web Share", async () => {
    await expect(getHost().share({ url: "https://x.skipleague.com" })).resolves.toBe("unsupported");
  });

  it("shares, and reports a dismissed sheet as cancelled", async () => {
    const share = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new DOMException("x", "AbortError"));
    (navigator as { share?: unknown }).share = share;
    const host = getHost();
    await expect(host.share({ title: "Trip", url: "https://trips.skipleague.com/t/1" })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({ title: "Trip", url: "https://trips.skipleague.com/t/1" });
    await expect(host.share({ url: "https://trips.skipleague.com/t/1" })).resolves.toBe("cancelled");
  });

  it("reports other failures as unsupported so the caller can fall back", async () => {
    (navigator as { share?: unknown }).share = vi.fn().mockRejectedValue(new DOMException("x", "NotAllowedError"));
    await expect(getHost().share({ url: "https://x.skipleague.com" })).resolves.toBe("unsupported");
  });

  it("checks canShare for files, and drops an empty files list", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    (navigator as { share?: unknown }).share = share;
    (navigator as { canShare?: unknown }).canShare = vi.fn().mockReturnValue(false);
    const file = new File(["x"], "a.pdf", { type: "application/pdf" });
    await expect(getHost().share({ files: [file] })).resolves.toBe("unsupported");
    expect(share).not.toHaveBeenCalled();
    await expect(getHost().share({ text: "hi", files: [] })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({ text: "hi" });
  });
});

describe("saveFile", () => {
  for (const [name, ua] of [
    ["browser", SAFARI_UA],
    ["app", APP_UA],
  ] as const) {
    it(`clicks a hidden <a download> for the blob (${name})`, async () => {
      useUserAgent(ua);
      vi.useFakeTimers();
      const createObjectURL = vi.fn().mockReturnValue("blob:fake");
      const revokeObjectURL = vi.fn();
      Object.assign(URL, { createObjectURL, revokeObjectURL });
      let clicked: HTMLAnchorElement | null = null;
      const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
        clicked = this;
      });
      try {
        await getHost().saveFile(new Blob(["pdf"]), "trip.pdf");
        expect(click).toHaveBeenCalledOnce();
        expect(clicked!.download).toBe("trip.pdf");
        expect(clicked!.getAttribute("href")).toBe("blob:fake");
        expect(clicked!.isConnected).toBe(false); // removed again
        // Not revoked synchronously (WebKit reads the URL after the click).
        expect(revokeObjectURL).not.toHaveBeenCalled();
        vi.runAllTimers();
        expect(revokeObjectURL).toHaveBeenCalledWith("blob:fake");
      } finally {
        vi.useRealTimers();
      }
    });
  }
});

describe("productUrl", () => {
  it("builds the product's URL from its slug", () => {
    expect(productUrl("skipcontacts")).toBe("https://contacts.skipleague.com/");
    expect(productUrl("skipracquetball", "/players/7")).toBe("https://racquetball.skipleague.com/players/7");
  });

  it("rejects anything that could point off the product", () => {
    expect(() => productUrl("trips")).toThrow();
    expect(() => productUrl("skip")).toThrow();
    expect(() => productUrl("skipTrips")).toThrow();
    expect(() => productUrl("skiptrips.evil.com")).toThrow();
    expect(() => productUrl("skiptrips", "trips")).toThrow();
    expect(() => productUrl("skiptrips", "//evil.com/x")).toThrow();
    expect(() => productUrl("skiptrips", "/\\evil.com/x")).toThrow();
    expect(() => productUrl("skiptrips", "https://evil.com/")).toThrow();
  });
});
