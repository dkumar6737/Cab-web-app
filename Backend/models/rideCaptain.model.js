const mongoose = require('mongoose');

const rideCaptainSchema = new mongoose.Schema({
    ride: {
        type: Object, // Store the full ride object
        required: true
    },
    captain: {
        type: Object, // Store the full captain object
        required: true
    }
});

module.exports = mongoose.model('rideCaptain', rideCaptainSchema);
