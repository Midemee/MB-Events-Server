const router = require("express").Router()
const {createEvent, getAllEvents, getHostingEvents, getSearchEvents, getUpcomingEvents, getNearbyEvents} = require ("../Controllers/eventController")
const {upload} = require("../Config/cloudinaryConfig")
const auth = require("../Middleware/auth")



router.get("/all", getAllEvents);
router.get("/search", getSearchEvents);
router.post("/createEvent", auth,  upload.single("photo"), createEvent)
router.get("/hosting/:userId", auth, getHostingEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/nearby", getNearbyEvents);

module.exports = router