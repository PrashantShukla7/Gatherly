const express = require("express");
const router = express.Router();
const Event = require("../Model/event.js");
const auth = require("../checkAuth.js");
const User = require("../Model/user.js");

module.exports = function (io) {
    router.post("/", auth, async (req, res) => {
        try {
            const eventDate = new Date(req.body.date);
            const event = new Event({
                ...req.body,
                date: eventDate,
                organizer: req.user._id,
            });
            await event.save();
            const user = await User.findById(req.user._id);

            user.events.push(event._id);
            await user.save();
            io.emit("newEvent", event);
            res.status(201).json({ event, ok: true });
        } catch (error) {
            res.status(400).json({ error, ok: false });
        }
    });

    router.put("/:id", auth, async (req, res) => {
        try {
            const event = await Event.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            io.emit("newEvent", event);
            res.status(201).json({ event, ok: true });
        } catch (error) {
            res.status(400).json({ error, ok: false });
        }
    });

    router.delete("/:id", auth, async (req, res) => {
        try {
            await Event.findByIdAndDelete(req.params.id);
            io.emit("newEvent");
            res.status(201).json({
                message: "Event deleted Successfully!",
                ok: true,
            });
        } catch (error) {
            res.status(400).json({ error, ok: false });
        }
    });

    router.get("/", async (req, res) => {
        try {
            const { status, startDate, endDate } = req.query; // Get filter type from query parameter
            const currentDateTime = new Date();

            currentDateTime.setUTCHours(0, 0, 0, 0);

            let filter = {};

            if (status === "upcoming") {
                filter.date = {$gte: currentDateTime };
            } else if (status === "past") {
                filter.date = { $lt: currentDateTime };
            } 

            if (startDate) {
                filter.date = { ...filter.date, $gte: new Date(startDate) };
            }
            if (endDate) {
                filter.date = { ...filter.date, $lte: new Date(endDate) };
            }


            const events = await Event.find(filter)
                .sort({_id: -1})
                .populate("organizer", "name email");

            if (!events) {
                return res.status(404).json({
                    ok: false,
                    message: "No events found",
                });
            }

            res.status(200).json({
                ok: true,
                events,
            });
        } catch (error) {
            console.error("Error fetching events:", error); // Add this for debugging
            res.status(500).json({
                ok: false,
                message: "Error fetching events",
                error: error.message,
            });
        }
    });

    router.post("/:id/attend", auth, async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).send();

            if (!event.attendees.includes(req.user._id)) {
                event.attendees.push(req.user._id);
                await event.save();
                io.emit("eventUpdated", event);
            }
            res.json({ event, ok: true });
        } catch (error) {
            res.status(400).json(error);
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const event = await Event.findById(req.params.id).populate(
                "organizer",
                "name email"
            );

            if (!event) return res.status(404).send();
            res.status(200).json({ event, ok: true });
        } catch (error) {
            console.error("Error fetching event:", error);
            res.status(500).json({
                ok: false,
                message: "Error fetching event",
                error: error.message,
            });
        }
    });

    router.get("/user/:id", auth, async (req, res) => {
        try {
            const events = await User.findById(req.params.id).populate(
                "events"
            );

            if (!events) {
                return res.status(404).json({
                    ok: false,
                    message: "No events found",
                });
            }

            res.status(200).json({
                ok: true,
                events,
            });
        } catch (error) {
            console.error("Error fetching events:", error); // Add this for debugging
            res.status(500).json({
                ok: false,
                message: "Error fetching events",
                error: error.message,
            });
        }
    });

    return router;
};
