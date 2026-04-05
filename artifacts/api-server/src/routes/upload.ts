import { Router, type IRouter } from "express";
import { createWriteStream, mkdirSync } from "fs";
import path from "path";
import crypto from "crypto";
import busboy from "busboy";

const router: IRouter = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

function ensureUploadDir(subdir: string): string {
  const dir = path.join(UPLOAD_DIR, subdir);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function handleUpload(
  req: import("express").Request,
  res: import("express").Response,
  subdir: string,
  allowedMimes: RegExp,
): void {
  const bb = busboy({ headers: req.headers });
  let saved = false;

  bb.on("file", (_name, stream, info) => {
    const { filename, mimeType } = info;

    if (!allowedMimes.test(mimeType)) {
      stream.resume();
      res.status(400).json({ error: `Invalid file type: ${mimeType}` });
      return;
    }

    const ext = path.extname(filename) || "";
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const dir = ensureUploadDir(subdir);
    const filePath = path.join(dir, uniqueName);
    const writeStream = createWriteStream(filePath);

    stream.pipe(writeStream);

    writeStream.on("finish", () => {
      saved = true;
      const publicUrl = `/api/static/${subdir}/${uniqueName}`;
      res.json({ url: publicUrl, filename: uniqueName });
    });

    writeStream.on("error", () => {
      if (!res.headersSent) {
        res.status(500).json({ error: "File write failed" });
      }
    });
  });

  bb.on("finish", () => {
    if (!saved && !res.headersSent) {
      res.status(400).json({ error: "No file provided" });
    }
  });

  bb.on("error", () => {
    if (!res.headersSent) {
      res.status(400).json({ error: "Upload failed" });
    }
  });

  req.pipe(bb);
}

router.post("/upload/audio", (req, res): void => {
  handleUpload(req, res, "audio", /^audio\//);
});

router.post("/upload/image", (req, res): void => {
  handleUpload(req, res, "images", /^image\//);
});

export default router;
