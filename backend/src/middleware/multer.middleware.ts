import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Setup file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
  

const upload = multer({ storage });

export {upload}