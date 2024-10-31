const express = require('express');
const { createRide, getRides, updateRideStatus, updateLocation, getRideByTripId } = require('../controllers/rideController.js');
const router = express.Router();

// Authentication middleware can be added to protect these routes
const { protect } = require('../middlewares/authMiddleware.js');

router.post('/create', protect, createRide);        // Create a new ride
router.get('/', protect, getRides);                 // Get rides based on role
router.put('/:rideId', protect, updateRideStatus);  // Update ride status
router.put('/:rideId/location', protect, updateLocation);
router.post('/', protect, getRideByTripId); // Get trip based on trip id

module.exports = router;