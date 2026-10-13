/**
 * Extracts a YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Plain 11-char VIDEO_ID
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return '';
  const trimmed = url.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  return match ? match[1] : '';
};

/**
 * Returns safe embed URL with full controls
 */
export const getYouTubeEmbedUrl = (url, autoplay = false) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1${
    autoplay ? '&autoplay=1' : ''
  }`;
};

/**
 * Returns YouTube high-quality thumbnail URL
 */
export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
