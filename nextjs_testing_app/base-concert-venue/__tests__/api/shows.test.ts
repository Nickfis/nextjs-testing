import { testApiHandler } from "next-test-api-route-handler";

import showsHandler from "@/pages/api/shows/index";
import showIdHandler from "@/pages/api/shows/[showId]";
import { expect } from "@jest/globals";
import { readFakeData } from "@/__tests__/__mocks__/fakeData";

test("/api/shows returns shows from database", async () => {
  await testApiHandler({
    handler: showsHandler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: "GET" });
      expect(res.status).toBe(200);
      const json = await res.json();

      const { fakeShows } = await readFakeData();
      expect(json).toEqual({ shows: fakeShows });
    },
  });
});

test("GET /api/shows/[showId] returns the data for the correct show ID", async () => {
  await testApiHandler({
    handler: showIdHandler,
    paramsPatcher: (params) => {
      params.showId = 0;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: "GET" });
      expect(res.status).toBe(200);

      const json = await res.json();
      const { fakeShows } = await readFakeData();
      const expectedShow = fakeShows.find((show) => show.id === 0);
      expect(json).toEqual({ show: expectedShow });
    },
  });
});

test("POST /api/shows returns 401 if revalidation secret is not correct", async () => {
  await testApiHandler({
    handler: showsHandler,
    paramsPatcher: (params) => {
      params.queryStringURLParams = { secret: "Not the real secret" };
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: "POST" });
      expect(res.status).toEqual(401);
    },
  });
});
