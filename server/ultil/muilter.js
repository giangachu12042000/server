const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const createStorage = ( imagePath='' )=>
{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/tmp/my-uploads')
        },
        filename: function (req, file, cb) {
            let ext = null;
            const storage = multer.diskStorage({
              destination: path.resolve(process.cwd(), `images/${img_path}`),
              filename(req, file, cb) {
                switch (file.mimetype) {
                  case "image/jpeg":
                    ext = ".jpeg";
                    break;
                  case "image/png":
                    ext = ".png";
                    break;
                  case "image/jpg":
                    ext = ".jpg";
                    break;
                  case "image/gif":
                    ext = ".gif";
                    break;
                }
                cb(null, file.originalname.slice(0, 4) + Date.now() + ext);
              }
            });
            return storage;
        }
    })
}

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only!");
  }

const uploadImage = img_path => {
    const uploadSingle = multer({
      storage: createStorage(img_path),
      limits: {
        fileSize: 10000000
      },
      fileFilter(req, file, cb) {
        checkFileType(file, cb);
      }
    });
    return uploadSingle.single("file");
  };

module.exports = {
    uploadImage
}

