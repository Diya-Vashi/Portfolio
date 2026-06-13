const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

async function testUpload() {
  // Create a dummy PDF file buffer
  const buffer = Buffer.from("%PDF-1.4\n%EOF");
  
  const uploadOptions = { 
    folder: 'portfolio', 
    resource_type: 'auto',
    format: 'pdf'
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error("Upload error:", error);
        reject(error);
      } else {
        console.log("Upload success:", result);
        resolve(result);
      }
    }).end(buffer);
  });
}

testUpload();
