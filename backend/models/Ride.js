const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    driver: { type: String, required: true },
    traveler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverPhone: { type: String, required: true },
    cabNumber: { type: String, required: true },
    tripId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    startLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    endLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    currentLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Ride', RideSchema);
