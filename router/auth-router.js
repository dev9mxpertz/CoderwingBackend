// const express = require("express")
// const router = express.Router()
// const {register,login, registerdata, resetPassword, forgetPassword} = require("../controllers/auth-controllers")

// const {clientApi,clientdata} = require("../controllers/client-controllers")



// router.post("/register",register)
// router.get("/registerdata",registerdata)
// router.post("/login",login)
// router.post("/client",clientApi)
// router.get("/clientdata",clientdata)
// router.post("/forget-password",forgetPassword)
// router.post("/reset-password/:token",resetPassword)







// module.exports = router




const express = require("express");
const router = express.Router();
const { register, login, registerdata, resetPassword, forgetPassword , getForgetPasswordRequests , getResetPasswordRequests , logout} = require("../controllers/auth-controllers");
const { clientApi, clientdata } = require("../controllers/client-controllers");
const { applyJob ,getAllApplications ,getMonthlyApplications } = require("../controllers/inqury-controllers"); 
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sendEmailRoute } = require("../controllers/sendEmail-controllers");
const { getAllEvents, addEvent } = require("../controllers/Meeting"); 



router.get("/allevents", getAllEvents);
router.post("/events", addEvent);
router.post("/logout", logout); 

router.post("/send-email", sendEmailRoute);
router.post("/register", register);
router.get("/registerdata", registerdata);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/forget-password-requests", getForgetPasswordRequests);



router.get("/reset-password-requests", getResetPasswordRequests);
router.post("/client", clientApi);
router.get("/clientdata", clientdata);
router.get("/applications/monthly", getMonthlyApplications);






const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });

router.post('/apply', upload.single('cv'), applyJob);

router.get("/applications", getAllApplications);



module.exports = router;



