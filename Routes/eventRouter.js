const router = require("express").Router()
const {createEvent} = require ("../Controllers/eventController")
const {upload} = require("../Config/cloudinaryConfig")

router.post("/createEvent", upload.single("photo"), createEvent)

module.exports = router