const router = require("express").Router()
const {createEvent, getAllEvents, getAttendingEvents, getPreviousEvents,getHostingEvents, getSearchEvents, getUpcomingEvents, getNearbyEvents} = require ("../Controllers/eventController")
const {upload} = require("../Config/cloudinaryConfig")
const auth = require("../Middleware/auth")


router.post("/createEvent", auth,  upload.single("photo"), createEvent)
router.get("/all", getAllEvents);
router.get("/search", getSearchEvents);
router.get("/hosting/:userId", auth, getHostingEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/nearby", getNearbyEvents);
router.get("/attending/:userId", getAttendingEvents);
router.get("/previous/:userId", getPreviousEvents);

module.exports = router