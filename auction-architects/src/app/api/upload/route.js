import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the upload directory exists
const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Save files to the uploads directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  }),
}).array("images", 10); // Allow up to 10 images

// Wrap multer in a promise for async/await compatibility
const multerMiddleware = (req) =>
  new Promise((resolve, reject) => {
    upload(req, null, (err) => {
      if (err) {
        return reject(err);
      }

      if (!req.files || req.files.length === 0) {
        return reject(new Error("No files uploaded"));
      }

      // Extract and map file paths
      const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
      resolve(filePaths);
    });
  });

export async function POST(req) {
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    // Parse the form data and upload files
    const filePaths = await multerMiddleware(req);

    // Respond with the file paths
    return new Response(JSON.stringify({ files: filePaths }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading files:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

