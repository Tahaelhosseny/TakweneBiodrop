import path from 'path';
import fs from 'fs';
import logger from "@config/logger";
import multer from 'multer';

export const config = {
    api: {
        bodyParser: false,
    },
  };

  const uploadDir = path.join(process.cwd(), 'public', 'releaseImages');
// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
  });
  
  const upload = multer({ storage: storage }).single('image');
  
  export default async function  UploadReleaseImage(req, res) {
    try {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          logger.info(err);
          logger.info('---------');
  
          return res.status(500).json({ message: 'Error uploading file' });
        } else if (err) {
          logger.info(err);
          logger.info('77777');
          return res.status(500).json({ message: 'Error uploading file' });
        }
        
        // File uploaded successfully
        const imageUrl = `/releaseImages/${req.file.filename}`;
        res.status(200).json({ imageUrl: imageUrl });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  