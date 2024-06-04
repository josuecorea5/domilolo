import multer from "multer";

const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  const imageExtension = file.mimetype.split("/")[1];
  const validImageExtension = ["jpg", "jpeg", "png"];
  if(validImageExtension.includes(imageExtension)) {
    return cb(null, true);
  }
  return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Format not allowed"), null);
}

const upload = multer(
  { 
    storage,
    fileFilter: fileFilter
  }
);

export default upload;
