import { testApiHandler } from "next-test-api-route-handler";
import reservationHandler from "@/pages/api/reservations/[reservationId]";
import userReservationsHandler from "@/pages/api/users/[userId]/reservations";
import { expect } from "@jest/globals";
import { validateToken } from "@/lib/auth/utils";

jest.mock("@/lib/auth/utils");
const mockValidateToken = validateToken as jest.Mock;

// after making reservations, there should be 3 for user 1
test("User can create reservation and it gets added to their reservations", async () => {
  // make reservations
  await testApiHandler({
    handler: reservationHandler,
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

test("POST /api/reservations/[reservationId] returns 401 status when not authorized", async () => {
  mockValidateToken.mockResolvedValue(false);

  // make reservations
  await testApiHandler({
    handler: reservationHandler,
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
      expect(res.status).toBe(401);
    },
  });
});
