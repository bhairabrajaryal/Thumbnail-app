
/**
 * Extracts the YouTube video ID from a URL.
 * Supports various YouTube URL formats.
 * @param url The YouTube URL.
 * @returns The video ID or null if not found.
 */
export const extractVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
