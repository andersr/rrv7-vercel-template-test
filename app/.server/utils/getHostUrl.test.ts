import { describe, expect, it } from "vitest";
import { getHostUrl } from "./getHostUrl";

describe("getHostUrl", () => {
  it("should use X-Forwarded-Host header when available", () => {
    const request = new Request("https://example.com", {
      headers: {
        "X-Forwarded-Host": "forwarded.example.com",
      },
    });

    expect(getHostUrl(request)).toBe("https://forwarded.example.com");
  });

  it("should fallback to host header when X-Forwarded-Host is not available", () => {
    const request = new Request("https://example.com", {
      headers: {
        host: "host.example.com",
      },
    });

    expect(getHostUrl(request)).toBe("https://host.example.com");
  });

  it("should fallback to URL host when no headers are available", () => {
    const request = new Request("https://url.example.com");

    expect(getHostUrl(request)).toBe("https://url.example.com");
  });

  it("should use http protocol for localhost", () => {
    const request = new Request("http://localhost:3000");

    expect(getHostUrl(request)).toBe("http://localhost:3000");
  });

  it("should use https protocol for non-localhost domains", () => {
    const request = new Request("http://example.com");

    expect(getHostUrl(request)).toBe("https://example.com");
  });

  it("should handle localhost with different ports", () => {
    const request = new Request("http://localhost:8080");

    expect(getHostUrl(request)).toBe("http://localhost:8080");
  });

  it("should prioritize headers correctly", () => {
    const request = new Request("https://url.example.com", {
      headers: {
        "X-Forwarded-Host": "forwarded.example.com",
        host: "host.example.com",
      },
    });

    expect(getHostUrl(request)).toBe("https://forwarded.example.com");
  });
});
