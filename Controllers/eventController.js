const EVENT = require("../models/Event");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
    console.log("Incoming create event request");

    const { date, title, host, timeStart, timeEnd, location, online, description, category, tags, free, regularEnabled, regular, vip, vipEnabled } = req.body;

    const isOnline = online === "true";
    const isFree = free === "true";
    const isRegularEnabled = regularEnabled === "true";
    const isVipEnabled = vipEnabled === "true";
    const parsedTags = JSON.parse(tags || "[]");

    console.log(req.body);
    try {
        if (!title || !date || !host || !timeStart || !timeEnd || !description || !category || !tags) {
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
        console.log("Authenticated user:", req.user);
        //;Create Event
        const newEvent = new EVENT({
            photo: photoUrl,
            title,
            host: req.user.userId,
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
            hostName: req.user.userId,
            createdBy: req.user.userId,
            hostedBy: req.user.userId,
        });

        await newEvent.save();
        console.log(newEvent);
        
        res.status(201).json({ message :  "Event created successfully", event : newEvent})
        console.log("event created");
    } catch (error) {
        console.error("Error creating an event",  error)
        res.status(500).json({ message : "server error"})
    }
}

const getAllEvents = async (req, res) => {
    try {
        console.log("All events request received");
        const events = await EVENT.find().sort({ date: 1});
        res.status(200).json({events});
        console.log(events);
    } catch (error) {
        console.log("Error fetching all events:", error);
        res.status(500).json({message: "Server error"});
    }
};

const getHostingEvents = async (req,res) => {
    console.log("Incoming hosting events request");
    
    try {
        const userId = req.user.userId;
        const events = await EVENT.find({ host: userId}).sort({date: 1});
        res.status(200).json({ events });
        console.log(events);
        
    } catch (error) {
        console.log("Error fetching hosting events:", error);
        res.status(500).json({message: "Server error"});
    }
};

const getSearchEvents = async (req, res) => {
  try {
    const {
      query,
      location,
      category,
      tags,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const andConditions = [];

    if (query) {
      const regex = { $regex: query, $options: "i" };
      andConditions.push({
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
          { location: regex },
          { tags: regex },
        ],
      });
    }

    if (location) {
      andConditions.push({ location: { $regex: location, $options: "i" } });
    }

    if (category) {
      andConditions.push({ category: { $regex: category, $options: "i" } });
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => new RegExp(tag, "i"));
      andConditions.push({ tags: { $in: tagsArray } });
    }
    if (req.query.price === 'free') {
        andConditions.push({ free: true});
    }

    if (req.query.price === "paid") {
        andConditions.push({ free: false});
    }

    if (minPrice || maxPrice) {
      const priceCondition = {
        $or: [],
      };
      const priceRange = {};
      if (minPrice) priceRange.$gte = Number(minPrice);
      if (maxPrice) priceRange.$lte = Number(maxPrice);

      priceCondition.$or.push({ regular: priceRange }, { vip: priceRange });
      andConditions.push(priceCondition);
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      EVENT.find(filter).skip(skip).limit(Number(limit)).sort({ date: 1 }),
      EVENT.countDocuments(filter),
    ]);

    res.status(200).json({
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching search events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    console.log("Upcoming events request received");

    const today = new Date();
    const events = await EVENT.find({ date: { $gte: today } })
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 25 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const events = await EVENT.find({
    locationCoords: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      $maxDistance: radius * 1000,
    },
  },
});


    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching nearby events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {createEvent, getAllEvents, getHostingEvents, getSearchEvents, getUpcomingEvents, getNearbyEvents}