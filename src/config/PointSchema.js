const mongoose = require('mongoose')

let PointSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['Point'],
        required: true,
    },
    coodinates: {
        type: [Number],
        required: true,
    },
});

module.exports = PointSchema;