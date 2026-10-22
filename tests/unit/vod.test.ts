import { describe, it, expect } from "vitest";
import {
  detectVideoProvider,
  isCloudinaryEmbed,
  getCloudinaryEcoUrl,
  getCloudinaryPosterUrl,
  getCloudinaryAudioUrl,
} from "../../src/lib/video-helpers";
import { INITIAL_VOD_VIDEOS } from "../../src/lib/domain/vod";

describe("Video On Demand (VOD) & Cloudinary Helpers", () => {
  it("detects Cloudinary URLs accurately", () => {
    expect(detectVideoProvider("https://res.cloudinary.com/demo/video/upload/sample.mp4")).toBe("cloudinary");
    expect(detectVideoProvider("https://player.cloudinary.com/embed/?cloud_name=demo&public_id=dog")).toBe("cloudinary");
  });

  it("detects YouTube URLs accurately", () => {
    expect(detectVideoProvider("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("youtube");
    expect(detectVideoProvider("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
  });

  it("detects Vimeo URLs accurately", () => {
    expect(detectVideoProvider("https://vimeo.com/123456789")).toBe("vimeo");
  });

  it("detects HLS .m3u8 streaming links", () => {
    expect(detectVideoProvider("https://example.com/live/stream.m3u8")).toBe("hls");
  });

  it("identifies Cloudinary interactive player embeds", () => {
    expect(isCloudinaryEmbed("https://player.cloudinary.com/embed/?cloud_name=demo")).toBe(true);
    expect(isCloudinaryEmbed("https://res.cloudinary.com/demo/video/upload/sample.mp4")).toBe(false);
  });

  it("generates 3G Eco URL for Cloudinary videos", () => {
    const raw = "https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4";
    const eco = getCloudinaryEcoUrl(raw);
    expect(eco).toContain("q_auto:eco,w_480");
  });

  it("generates poster thumbnail from Cloudinary video", () => {
    const raw = "https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4";
    const poster = getCloudinaryPosterUrl(raw);
    expect(poster).toContain("so_0,w_800");
    expect(poster).toMatch(/\.jpg$/);
  });

  it("generates audio-only MP3 stream from Cloudinary video", () => {
    const raw = "https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4";
    const audio = getCloudinaryAudioUrl(raw);
    expect(audio).toContain("f_mp3");
    expect(audio).toMatch(/\.mp3$/);
  });

  it("has valid default seed VOD videos", () => {
    expect(INITIAL_VOD_VIDEOS.length).toBeGreaterThanOrEqual(4);
    const cloudinaryVideos = INITIAL_VOD_VIDEOS.filter((v) => v.provider === "cloudinary");
    expect(cloudinaryVideos.length).toBeGreaterThan(0);
  });
});
