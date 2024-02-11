import { TranscriptClipWithScore } from "shared/src/manual/TranscriptClip";
import { HighlightMetadata, RAGChunk, YTMetadata } from "../rag/rag";
import { last } from "remeda";
import { ArticleSnippetWithScore } from "shared/src/manual/ArticleSnippet";
import {
  MetaphorArticleResult,
  VideoResultWithTranscript,
} from "../metaphor/search";
import { youtubeUrlWithTimestamp } from "shared/src/youtube";
import { transcriptToString } from "../youtube/transcript";

export const chunksToClips = (args: {
  results: Record<string, RAGChunk[]>;
  scoreCutOff: number;
  searchResults: (VideoResultWithTranscript | MetaphorArticleResult)[];
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
      const searchResult = args.searchResults.find((searchResult) =>
        chunk.metadata.type === "youtube"
          ? searchResult.type === "youtube" &&
            searchResult.transcript.videoId === chunk.metadata.videoId
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
        const cues = searchResult.transcript.cues.slice(
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
          videoTitle: searchResult.transcript.videoTitle,
          videoUrl: youtubeUrlWithTimestamp(
            searchResult.transcript.videoId,
            cues[0].start
          ),
          videoId: searchResult.transcript.videoId,
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
