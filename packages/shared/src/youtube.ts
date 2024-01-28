export function youtubeUrlToId(url: string): string | undefined {
  const regex =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  return url.match(regex)?.[1];
}

export function youtubeUrlToTimestampSeconds(url: string) {
  try {
    const startSeconds = url.match(/t=(\d+)/)?.[1];
    return Number.parseInt(startSeconds ?? "0", 10);
  } catch (e) {
    return 0;
  }
}

export function youtubeUrlWithoutTimestamp(url: string) {
  return url.replace(/&t=\d+/, "");
}

export function youtubeUrlWithTimestamp(id: string, seconds: number) {
  return `https://www.youtube.com/watch?v=${id}&t=${seconds}`;
}
