const EVENT = require("../models/Event");
const USER = require("../Models/User");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createEvent = async (req, res) => {
    console.log("Incoming create event request");

    const { date, title, timeStart, timeEnd, location, online, description, category, tags, free, regularEnabled, regular, vip, vipEnabled, hostedBy } = req.body;

    const isOnline = online === "true";
    const isFree = free === "true";
    const isRegularEnabled = regularEnabled === "true";
    const isVipEnabled = vipEnabled === "true";
    const parsedTags = JSON.parse(tags || "[]");

    console.log(req.body);
    try {
        if (!title || !date || !timeStart || !timeEnd || !description || !category || !tags || !hostedBy) {
           return res.status(400).json({message :  "Missing required fields"}) 
        }
        //if event is not online, location is required
        if ( !isOnline && !location) {
            return res.status(400).json({ message : "Location is required"})
        }
        //if event is not free, check pricing
        if (!isFree) {
           if (isRegularEnabled && (regular === undefined || regular < 0)) {
            return res.status(400).json({ message : "Regular price is required"})
           }
           if (isVipEnabled && (vip === undefined || vip < 0)) {
            return res.status(400).json({message : "Vip price is required"})
           }
        }

        //upload photo to cloudinary
        // if (!req.file) return res.status(400).json({ message : "Event Photo is required"})
        //     const result = await cloudinary.uploader.upload(req.file.path, {folder : "events"});

        const photoUrl = req.file?.path;
        if (!photoUrl) {
            return res.status(400).json({ message : "Event Photo is required"})
        }
        //;Create Event
        const newEvent = new EVENT({
            photo: photoUrl,
            title,
            date,
            timeStart,
            timeEnd,
            location,
            online: isOnline,
            description,
            category,
            tags: parsedTags,
            free: isFree,
            regular,
            regularEnabled: isRegularEnabled,
            vip,
            vipEnabled: isVipEnabled,
            hostedBy
        });
        await newEvent.save();
        res.status(201).json({ message :  "Event created successfully", event : newEvent})
        console.log("event created");
    } catch (error) {
        console.error("Error creating an event",  error)
        res.status(500).json({ message : "server error"})
    }
}

module.exports = {createEvent}