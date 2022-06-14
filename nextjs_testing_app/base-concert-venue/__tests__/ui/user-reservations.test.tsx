import { UserReservations } from "@/components/user/UserReservations";
import { render, screen } from "@testing-library/react";

test("Users can purchase more tickets, if they already have tickets to some shows", async () => {
  render(<UserReservations userId={5} />);
  const getMoreTicketsButton = await screen.findByText(/purchase more/i);
  expect(getMoreTicketsButton).toBeInTheDocument();
});

// test("Users asked", async () => {
//   render(<UserReservations userId={5} />);
//   const getMoreTicketsButton = await screen.findByText(/purchase tickets/i);
//   expect(getMoreTicketsButton).toBeInTheDocument();
// });
