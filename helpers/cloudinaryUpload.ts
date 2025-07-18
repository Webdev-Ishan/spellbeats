import { UploadApiErrorResponse } from "cloudinary";
import { cloudinary } from "../lib/cloudinary.config";
import ytdl from "@distube/ytdl-core";

type UploadResponse =
  | { success: true; url: string }
  | { success: false; error: UploadApiErrorResponse };

export async function uploadToCloudinary(
  vedioURL: string
): Promise<UploadResponse> {
  const audioStream = ytdl(vedioURL, { filter: "audioonly" });

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        invalidate: true,
        resource_type: "video",
        filename_override: `video-${Date.now()}-${Math.random().toString(36).substring(2, 10)}.mp4`,
        folder: "audio-uploads-youtube",
        use_filename: true,
      },
      (error, result) => {
        if (error || !result)
          return resolve({
            success: false,
            error: error as UploadApiErrorResponse,
          });

        const cloudinaryURL = result?.url;
        resolve({ success: true, url: cloudinaryURL });
      }
    );
    audioStream.pipe(uploadStream);
  });
}
