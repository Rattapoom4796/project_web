const mongoose = require('mongoose');

// Define the schema correctly
const adminSchema = new mongoose.Schema({
    user_name : { type: String, required: true },
    password : { type: String, required: true },
},
    {timestamps : true, versionKey: false}
);
// Export the model with the correct schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;