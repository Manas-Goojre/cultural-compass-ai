import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TripPlanner from "./TripPlanner";

const DEFAULT_PLAN = {
  destination: "",
  budget: 2000,
  days: 4,
  travelers: 2,
  travel_style: "adventure",
  interests: [],
  transport: "Any",
  hotel_preference: "Mid-range",
  start_date: "",
  currency: "USD",
};

function Harness() {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  return <TripPlanner plan={plan} setPlan={setPlan} onSubmit={() => {}} loading={false} />;
}

describe("TripPlanner", () => {
  it("renders the consultant form", () => {
    render(<Harness />);
    expect(screen.getByText(/Plan my perfect trip/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate AI Itinerary/i })).toBeInTheDocument();
  });

  it("toggles an interest chip via aria-pressed", () => {
    render(<Harness />);
    const chip = screen.getByRole("button", { name: "Food" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("selects a travel style card", () => {
    render(<Harness />);
    const luxury = screen.getByRole("button", { name: /Luxury/i });
    fireEvent.click(luxury);
    expect(luxury).toHaveAttribute("aria-pressed", "true");
  });
});
