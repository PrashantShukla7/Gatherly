const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events" }],
});

module.exports = mongoose.model("Users", userSchema);
