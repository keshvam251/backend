import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "./public/temp";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });