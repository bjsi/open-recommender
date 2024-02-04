import { createSaga } from "graphile-saga";
import { z } from "zod";

const twitterPipelineSaga = createSaga(
  "twitterPipeline",
  z.object({
    hotelId: z.number(),
    airlineId: z.number(),
    carId: z.number(),
  })
).addStep({
  name: "reserveHotel",
  run: async (initialPayload, priorResults, helpers) => {},
  cancel: async (initialPayload, priorResults, runResult, helpers) => {},
});
