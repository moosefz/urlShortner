const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    // full URL input
    full: {
        type: String,
        required: true
    },
    // shortned URL
    short: {
        type: String,
        required: true,
        // generates a shortId for the URL
        default: shortId.generate
    },

    // number of clicks
    clicks: {
        type: Number,
        required: true,
        default: 0
    },

    // every short link has an author that it belongs to
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("shortUrl", shortUrlSchema);