// Turns what Kenny drops in the chat into images Claude can read. Claude's API has
// no video input, so a clip becomes frames, sampled evenly and labelled by time.
// Everything is shrunk here so a long thread doesn't outgrow the request limit.

const MAX_EDGE = 1568; // Larger images are downscaled by the API anyway.
const MAX_FRAMES = 16;
const JPEG_QUALITY = 0.85;

// Pure so the sampling is testable: about one frame a second, capped, mid-interval
// so a clip's first and last black frames are skipped.
export function frameTimes(duration, maxFrames = MAX_FRAMES) {
  const count = Math.min(maxFrames, Math.max(1, Math.ceil(duration)));
  return Array.from({ length: count }, (_, i) => ((i + 0.5) * duration) / count);
}

function toJpeg(source, width, height) {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  return {
    media_type: 'image/jpeg',
    data: canvas.toDataURL('image/jpeg', JPEG_QUALITY).split(',')[1],
  };
}

async function imageFile(file) {
  const bitmap = await createImageBitmap(file);
  const out = toJpeg(bitmap, bitmap.width, bitmap.height);
  bitmap.close();
  return [{ ...out, label: null, name: file.name }];
}

function once(target, event) {
  return new Promise((resolve, reject) => {
    target.addEventListener(event, resolve, { once: true });
    target.addEventListener('error', () => reject(new Error('unreadable')), { once: true });
  });
}

async function videoFile(file) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.muted = true;
  video.preload = 'auto';
  try {
    const loaded = once(video, 'loadeddata');
    video.src = url;
    await loaded;
    if (!Number.isFinite(video.duration) || !video.videoWidth) throw new Error('unreadable');
    const frames = [];
    for (const t of frameTimes(video.duration)) {
      const seeked = once(video, 'seeked');
      video.currentTime = t;
      await seeked;
      frames.push({
        ...toJpeg(video, video.videoWidth, video.videoHeight),
        label: `${file.name}, ${t.toFixed(1)}s of ${video.duration.toFixed(1)}s`,
        name: file.name,
      });
    }
    return frames;
  } catch {
    throw new Error(`Could not read ${file.name}. Export it as an H.264 MP4 and try again.`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function filesToAttachments(files) {
  const out = [];
  for (const file of files) {
    if (file.type.startsWith('image/')) out.push(...(await imageFile(file)));
    else if (file.type.startsWith('video/')) out.push(...(await videoFile(file)));
    else throw new Error(`${file.name} isn't an image or a video.`);
  }
  return out;
}
