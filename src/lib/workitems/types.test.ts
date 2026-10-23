import { toKey, parseKey } from "./types";

describe("Work Item key helpers", () => {
  describe("toKey", () => {
    it("converts positive integer IDs to JF-<id>", () => {
      expect(toKey(1)).toBe("JF-1");
      expect(toKey(42)).toBe("JF-42");
    });

    it("throws for non-positive or non-integer IDs", () => {
      expect(() => toKey(0)).toThrow();
      expect(() => toKey(-1)).toThrow();
      expect(() => toKey(1.5)).toThrow();
    });
  });

  describe("parseKey", () => {
    it("parses valid keys to positive integers", () => {
      expect(parseKey("JF-1")).toBe(1);
      expect(parseKey("JF-42")).toBe(42);
    });

    it("rejects malformed keys by returning null", () => {
      expect(parseKey("JF-abc")).toBeNull();
      expect(parseKey("XX-1")).toBeNull();
      expect(parseKey("JF-0")).toBeNull();
      expect(parseKey("JF--1")).toBeNull();
      expect(parseKey("JF-")).toBeNull();
      expect(parseKey("jf-1")).toBeNull();
      expect(parseKey("JF-1.5")).toBeNull();
      expect(parseKey("")).toBeNull();
    });
  });
});
