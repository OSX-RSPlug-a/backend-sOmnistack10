const mongoose = require("mongoose");

const PointSchema = require('./../config/PointSchema')

const DevSchema = new mongoose.Schema({
    github_username: String,
    name: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});

module.exports = mongoose.model('Dev', DevSchema);