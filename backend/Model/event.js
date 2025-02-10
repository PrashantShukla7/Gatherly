const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: {type: String},
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Events", eventSchema);
