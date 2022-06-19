import { testApiHandler } from "next-test-api-route-handler";
import createReservationHandler from "@/pages/api/reservations/[reservationId]";
import userReservationsHandler from "@/pages/api/users/[userId]/reservations";
import { expect } from "@jest/globals";

jest.mock("@/lib/auth/utils");

// after making reservations, there should be 3 for user 1
test("User can create reservation and it gets added to their reservations", async () => {
  // make reservations
  await testApiHandler({
    handler: createReservationHandler,
    paramsPatcher: (params) => {
      params.reservationId = 100;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          seatCount: 5,
          userId: 1,
          showId: 0,
        }),
      });
      expect(res.status).toBe(201);
    },
  });

  // check in database that user has 3 reservations
  await testApiHandler({
    handler: userReservationsHandler,
    paramsPatcher: (params) => {
      params.id = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: "GET" });
      expect(res.status).toBe(200);
      const json = await res.json();
      console.log(json);
      expect(json.userReservations).toHaveLength(3);
    },
  });
});
