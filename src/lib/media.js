// بيحدد لو الرابط فيديو ولا صورة، بناءً على امتداد الملف
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];

export function isVideoUrl(url) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

// بيستخرج ID الفيديو من أي شكل لينك يوتيوب ويرجع رابط تضمين (embed) جاهز
export function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = null;

    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.split("/embed/")[1];
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.split("/shorts/")[1];
      } else {
        videoId = u.searchParams.get("v");
      }
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
