import { describe, it, expect, beforeEach } from "vitest";
import { initCard, review } from "./spacedRepetition";

let card = initCard(1, "foo", "bar");

beforeEach(() => {
  card = initCard(1, "foo", "bar");
});

describe("review()", () => {
  it("sets interval to 1 on low quality", () => {
    const updated = review(card, 2);
    expect(updated.interval).toBe(1);
  });

  it("increases interval on good quality", () => {
    const first = review(card, 4);
    expect(first.interval).toBeGreaterThan(0);
    const second = review(first, 5);
    expect(second.interval).toBeGreaterThan(first.interval);
  });

  it("never lets ease drop below 1300", () => {
    const updated = review(card, 0);
    expect(updated.ease).toBeGreaterThanOrEqual(1300);
  });
});