import { chunkClipArray } from "../pipeline/utils/chunkClipArray";

test("chunkClipArray works", async () => {
  const clips = [
    {
      text: ".",
      videoId: "2",
    },
    {
      text: ".",
      videoId: "2",
    },
    {
      text: ".",
      videoId: "3",
    },
    {
      text: ".",
      videoId: "3",
    },
    {
      text: ".",
      videoId: "3",
    },
    {
      text: ".",
      videoId: "1",
    },
  ];

  const chunks = await chunkClipArray({
    clips,
    maxTokensPerChunk: Number.MAX_SAFE_INTEGER,
    shuffle: false,
  });

  expect(chunks.length).toEqual(1);
  expect(chunks[0]).toEqual(clips);

  const chunks2 = await chunkClipArray({
    clips,
    maxTokensPerChunk: 2,
    shuffle: false,
  });

  expect(chunks2.length).toEqual(3);
  expect(chunks2).toEqual([
    [
      { text: ".", videoId: "2" },
      { text: ".", videoId: "2" },
    ],
    [
      { text: ".", videoId: "3" },
      { text: ".", videoId: "3" },
    ],
    [
      { text: ".", videoId: "3" },
      { text: ".", videoId: "1" },
    ],
  ]);
});
