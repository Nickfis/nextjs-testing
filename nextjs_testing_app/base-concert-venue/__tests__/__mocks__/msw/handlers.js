import { rest } from "msw";

import { readFakeData } from "@/__tests__/__mocks__/fakeData";
import { fakeUserReservations } from "../fakeData/userReservations";

export const handlers = [
  rest.get("http://localhost:3000/api/shows/:showId", async (req, res, ctx) => {
    const { showId } = req.params;
    const { fakeShows } = await readFakeData();

    // fakeShows[0] has seats available
    // fakeShows[1] has NO seats available
    return res(
      ctx.json({
        show: fakeShows[Number(showId)],
      })
    );
  }),
  rest.get(
    `http://localhost:3000/api/users/:userId/reservations`,
    (req, res, ctx) =>
      res(
        ctx.json({
          userReservations: fakeUserReservations,
        })
      )
  ),
];
