const router = require("express").Router()
const {signUp, signIn, subscribe, forgotpassword, resetPassword}= require ("../Controllers/userController")

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/subscribe", subscribe)
router.post("/forgotpassword", forgotpassword)
router.post("/resetpassword/:token", resetPassword)


module.exports = router