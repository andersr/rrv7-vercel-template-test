import { http, HttpResponse } from "msw";
import { TEST_GAME, TEST_GAME_ID, TEST_THREAD_ID } from "~/shared/testData";

export const handlers = [
  http.get("*/api/games/new", () => {
    return HttpResponse.json({
      id: TEST_GAME_ID,
      game: TEST_GAME,
    });
  }),
  http.get("*/api/store/*", () => {
    return HttpResponse.json({
      threadId: TEST_THREAD_ID,
      game: TEST_GAME,
    });
  }),
];
