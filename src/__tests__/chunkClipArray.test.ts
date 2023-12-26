import { chunkClipArray } from "../pipeline/utils/chunkClipArray";

test("chunkClipArray works", () => {
  const clips = [
    {
      videoId: "1",
    },
    {
      videoId: "2",
    },
    {
      videoId: "2",
    },
    {
      videoId: "3",
    },
    {
      videoId: "3",
    },
    {
      videoId: "3",
    },
  ];

  const chunks = chunkClipArray({
    clips,
    windowSize: 2,
    shuffle: false,
  });

  expect(chunks).toEqual([
    {
      type: "same-video",
      clips: [
        {
          videoId: "2",
        },
        {
          videoId: "2",
        },
      ],
    },
    {
      type: "same-video",
      clips: [
        {
          videoId: "3",
        },
        {
          videoId: "3",
        },
      ],
    },
    {
      type: "mix",
      clips: [
        {
          videoId: "1",
        },
        {
          videoId: "3",
        },
      ],
    },
  ]);
});
