// import multer from "multer";

// const UPLOAD_DIR = "uploads/";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
//   filename: (req, file, cb) => cb(null, file.originalname),
// });

// const createMulterUpload = (fileFilter?: multer.Options["fileFilter"]) =>
//   multer({ storage, fileFilter });

// export const FileUploadConfig = {
//   upload: createMulterUpload(),
// };

import multer from "multer";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const createMulterUpload = (fileFilter?: multer.Options["fileFilter"]) =>
  multer({ storage, fileFilter });

// Helper function to upload to Vercel Blob
export const uploadToBlob = async (file: Express.Multer.File) => {
  const filename = `${uuidv4()}-${file.originalname}`;

  const blob = await put(filename, file.buffer, {
    access: "public",
    contentType: file.mimetype,
  });

  return {
    url: blob.url,
    filename: filename,
    size: file.size,
    mimetype: file.mimetype,
  };
};

export const FileUploadConfig = {
  upload: createMulterUpload(),
  uploadToBlob,
};
