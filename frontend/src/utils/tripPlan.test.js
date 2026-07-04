import { describe, it, expect } from "vitest";
import { buildMap, toText, validCoord } from "./tripPlan";

const sample = {
  destination: "Kyoto, Japan",
  summary: "Cultural food journey.",
  itinerary: [
    {
      day: 1,
      title: "Temples",
      morning: { activity: "Kinkaku-ji", location: "Kinkaku-ji", lat: 35.0394, lng: 135.7292 },
      afternoon: { activity: "Nishiki", location: "Nishiki", lat: 35.005, lng: 135.764 },
      estimated_cost: "$80",
    },
  ],
  budget: { accommodation: "$120", total: "$210", currency: "USD" },
  hidden_gems: [{ name: "Secret garden", lat: 35.01, lng: 135.77 }],
  travel_tips: ["Carry cash"],
};

describe("validCoord", () => {
  it("accepts finite non-zero coords", () => {
    expect(validCoord(35.0, 135.0)).toBe(true);
  });
  it("rejects 0,0 and non-numbers", () => {
    expect(validCoord(0, 0)).toBe(false);
    expect(validCoord(undefined, 10)).toBe(false);
    expect(validCoord(NaN, 10)).toBe(false);
  });
});

describe("buildMap", () => {
  it("derives points from itinerary + gems when no map_points", () => {
    const { points, routes } = buildMap(sample);
    expect(points.length).toBe(3); // 2 stops + 1 gem
    expect(points.some((p) => p.type === "gem")).toBe(true);
    expect(routes).toHaveLength(1); // one day with two coords
    expect(routes[0]).toHaveLength(2);
  });

  it("prefers explicit map_points when provided", () => {
    const withPoints = { ...sample, map_points: [{ name: "A", type: "stop", lat: 1, lng: 1 }] };
    const { points } = buildMap(withPoints);
    expect(points).toHaveLength(1);
    expect(points[0].name).toBe("A");
  });

  it("handles empty input safely", () => {
    expect(buildMap({})).toEqual({ points: [], routes: [] });
    expect(buildMap()).toEqual({ points: [], routes: [] });
  });
});

describe("toText", () => {
  it("serializes destination, itinerary and budget", () => {
    const text = toText(sample);
    expect(text).toContain("Kyoto, Japan");
    expect(text).toContain("DAY 1");
    expect(text).toContain("BUDGET:");
    expect(text).toContain("TRAVEL TIPS:");
  });
});
