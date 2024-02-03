import { ratio } from "fuzzball";
import { SequenceMatcher } from "difflib";

// modified from: https://github.com/nol13/fuzzball.js/blob/773b82991f2bcacc950b413615802aa953193423/fuzzball.js#L942
function partial_ratio(str1: string, str2: string) {
  if (str1.length <= str2.length) {
    var shorter = str1;
    var longer = str2;
  } else {
    var shorter = str2;
    var longer = str1;
  }
  var m = new SequenceMatcher(null, shorter, longer);
  var blocks = m.getMatchingBlocks();
  let bestScore: number = 0;
  let bestMatch: string | null = null;
  let bestStartIdx: number = -1;
  for (var b = 0; b < blocks.length; b++) {
    var long_start =
      blocks[b][1] - blocks[b][0] > 0 ? blocks[b][1] - blocks[b][0] : 0;
    var long_end = long_start + shorter.length;
    var long_substr = longer.substring(long_start, long_end);
    var r = ratio(shorter, long_substr);
    if (r > bestScore) {
      bestScore = r;
      bestMatch = long_substr;
      bestStartIdx = long_start;
    }
    if (r > 99.5) {
      break;
    }
  }
  return {
    bestMatch,
    bestScore,
    bestStartIdx,
  };
}

export function nearestSubstring(searchTerm: string, text: string) {
  return partial_ratio(searchTerm, text);
}
