import { render, screen } from "@testing-library/react";

import { Reservation } from "@/components/reservations/Reservation";

test("Reservation page shows the correct number of seats left", async () => {
  render(<Reservation showId={10} submitPurchase={jest.fn()} />);

  const seatCountText = await screen.findByText(/10 seats left/i);
  expect(seatCountText).toBeInTheDocument();
});
