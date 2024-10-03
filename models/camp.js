const mongoose = require('mongoose');

// Define the schema correctly
const campSchema = new mongoose.Schema({
    camp_name : { type: String, required: true },
    camp_detail : { type: String, required: true },
    camp_place : { type: String, required: true },
    camp_topic : { type: String, required: true },
    people_count: {type: Number, required : true},
    date : { type: Date, required: true },
    time : { type: String, required: true },
    image: { type: String },
},
    {timestamps : true, versionKey: false}
);
// Export the model with the correct schema
const Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;