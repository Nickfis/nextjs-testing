import { UserReservations } from "@/components/user/UserReservations";
import { render, screen } from "@testing-library/react";

test("Users can purchase more tickets, if they already have tickets to some shows", async () => {
  render(<UserReservations userId={5} />);
  const getMoreTicketsButton = await screen.findByText(/purchase more/i);
  expect(getMoreTicketsButton).toBeInTheDocument();
});

test("User without any reservations don't see tickets heading and the buton reads 'purchase tickets'", async () => {
  render(<UserReservations userId={0} />);
  const purchaseButton = await screen.findByText(/purchase tickets/i);
  expect(purchaseButton).toBeInTheDocument();
  const ticketsHeading = screen.queryByRole("heading", {
    name: /your tickets/i,
  });
  expect(ticketsHeading).not.toBeInTheDocument();
});
