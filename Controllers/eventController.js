const EVENT = require("../Models/Event");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({ provider: "openstreetmap" });

const createEvent = async (req, res) => {
  console.log("Incoming create event request");
  const {
    date,
    title,
    host,
    timeStart,
    timeEnd,
    location,
    online,
    description,
    category,
    tags,
    free,
    regularEnabled,
    regular,
    vip,
    vipEnabled,
  } = req.body;

  const isOnline = online === "true";
  const isFree = free === "true";
  const isRegularEnabled = regularEnabled === "true";
  const isVipEnabled = vipEnabled === "true";
  const parsedTags = JSON.parse(tags || "[]");

  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!title || !host || !date || !timeStart || !timeEnd || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isOnline && !location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!isFree) {
      if (isRegularEnabled && (regular === undefined || regular < 0)) {
        return res.status(400).json({ message: "Regular price is required" });
      }
      if (isVipEnabled && (vip === undefined || vip < 0)) {
        return res.status(400).json({ message: "VIP price is required" });
      }
    }

    const photoUrl = req.file?.path;
    if (!photoUrl) {
      return res.status(400).json({ message: "Event photo is required" });
    }

    const newEvent = new EVENT({
      photo: photoUrl,
      title,
      hostName: host,
      date,
      timeStart,
      timeEnd,
      location,
      // location: "Lagos, Nigeria", // human-readable
      locationCoords: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      online: isOnline,
      description,
      category,
      tags: parsedTags,
      free: isFree,
      regular,
      regularEnabled: isRegularEnabled,
      vip,
      vipEnabled: isVipEnabled,
      createdBy: req.user.userId,
      hostedBy: req.user.userId,
    });

    await newEvent.save();
    console.log("Event created:", newEvent._id);

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating an event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    console.log("All events request received");
    const events = await EVENT.find().sort({ date: 1 });
    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching all events:", err);
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

const getHostingEvents = async (req, res) => {
  console.log("Incoming hosting events request");

  try {
    const userId = req.user.userId;
    const events = await EVENT.find({ hostedBy: userId }).sort({ date: 1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching hosting events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendingEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await EVENT.find({ attendees: userId })
      .populate("hostedBy", "fullName email")
      .populate("attendees", "fullName email")
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching attending events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPreviousEvents = async (req, res) => {z
  try {
    const userId = req.user.userId;
    const today = new Date();
    const events = await EVENT.find({
      hostedBy: userId,
      date: { $lt: today },
    }).sort({ date: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching previous events:", error);
    res.status(500).json({ message: "Server error" });
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
    if (req.query.price === "free") {
  andConditions.push({ free: true });
  }
    if (req.query.price === "paid") {
  andConditions.push({ free: false });
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


module.exports = {
  createEvent,
  getUpcomingEvents,
  getNearbyEvents,
  getHostingEvents,
  getAttendingEvents,
  getPreviousEvents,
  getAllEvents,
  getSearchEvents,
};