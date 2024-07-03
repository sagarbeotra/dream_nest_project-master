const router = require("express").Router();
const multer = require("multer");
const { userSignup, userLogin, verifyUser, userLogout } = require("./user-controllers.js");
// const { signupValidator } = require("./validators.js");
const { loginValidator, signupValidator, validate } = require('./validators.js')
// Configuration Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Middleware to handle file upload
const handleFileUpload = upload.single("profileImage");

/* USER REGISTER */
router.post("/register", handleFileUpload, validate(signupValidator), async (req, res, next) => {
  try {
    // Extract the profileImage from the request and add its path to req.body
    if (req.file) {
      req.body.profileImagePath = req.file.path;
    }
    await userSignup(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed!", error: err.message });
  }
});

/* USER LOGIN */
router.post("/login", validate(loginValidator), async (req, res, next) => {
  try {
    await userLogin(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* USER LOGOUT */
router.get("/logout", async (req, res, next) => {
  try {
    await userLogout(req, res, next);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
});

module.exports = router;