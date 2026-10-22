/**
 * @jest-environment node
 */
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns status ok and 200 code", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe("ok");
    expect(Number.isNaN(Date.parse(json.timestamp))).toBe(false);
    expect(new Date(json.timestamp).toISOString()).toBe(json.timestamp);
  });
});
