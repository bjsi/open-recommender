import { TranscriptClipWithScore } from "shared/src/manual/TranscriptClip";
import { HighlightMetadata, RAGChunk, YTMetadata } from "../rag/rag";
import { last } from "remeda";
import { ArticleSnippetWithScore } from "shared/src/manual/ArticleSnippet";
import {
  MetaphorArticleResult,
  VideoResultWithTranscriptFile,
} from "../metaphor/search";
import { youtubeUrlWithTimestamp } from "shared/src/youtube";
import { transcriptToString } from "../youtube/transcript";
import { yt } from "../youtube";

export const chunksToClips = async (args: {
  results: Record<string, RAGChunk[]>;
  scoreCutOff: number;
  searchResults: (VideoResultWithTranscriptFile | MetaphorArticleResult)[];
}) => {
  const clips: Record<
    string,
    (TranscriptClipWithScore | ArticleSnippetWithScore)[]
  > = {};
  for (const [question, chunks] of Object.entries(args.results)) {
    for (const chunk of chunks) {
      if (chunk.score < args.scoreCutOff) {
        continue;
      }
      const transcript =
        chunk.metadata.type === "youtube"
          ? await yt.transcript.fetch({
              id: chunk.metadata.videoId,
              title: chunk.metadata.videoTitle,
            })
          : undefined;
      const searchResult = args.searchResults.find((searchResult) =>
        chunk.metadata.type === "youtube"
          ? searchResult.type === "youtube" &&
            transcript!.videoId === chunk.metadata.videoId
          : chunk.metadata.articleId === searchResult.id
      );
      if (!searchResult) {
        console.error("Search result not found for chunk", chunk);
        continue;
      } else if (searchResult.type === "article") {
        const articleHighlight = chunk as RAGChunk & {
          metadata: HighlightMetadata;
        };
        if (!clips[question]) {
          clips[question] = [];
        }
        clips[question].push({
          type: "article",
          title: question,
          question: question,
          text: articleHighlight.content,
          score: chunk.score,
          rank: chunk.rank,
          articleTitle: searchResult.title,
          articleUrl: searchResult.url,
        });
      } else {
        const videoChunk = chunk as RAGChunk & { metadata: YTMetadata };
        const cues = transcript!.cues.slice(
          videoChunk.metadata.minCueIdx,
          videoChunk.metadata.maxCueIdx
        );
        if (!clips[question]) {
          clips[question] = [];
        }
        clips[question].push({
          type: "youtube",
          title: question,
          question: question,
          start: cues[0].start,
          end: last(cues)!.end,
          videoTitle: transcript!.videoTitle,
          videoUrl: youtubeUrlWithTimestamp(transcript!.videoId, cues[0].start),
          videoId: transcript!.videoId,
          text: transcriptToString(cues),
          score: chunk.score,
          rank: chunk.rank,
          cues,
        });
      }
    }
  }
  return clips;
};
