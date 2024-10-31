const Ride = require('../models/Ride');
const { isWithinRadius } = require('../utils/geofence');
const admin = require('../firebaseConfig');

const sendPushNotification = async (token, message) => {
    const payload = {
        notification: {
            title: 'Ride Update',
            body: message
        }
    };

    try {
        await admin.messaging().sendToDevice(token, payload);
        console.log('Push notification sent successfully');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};


// Create a new ride
exports.createRide = async (req, res) => {
    const { driver, driverPhone, cabNumber, startLocation, endLocation } = req.body;
    try {
        const ride = new Ride({
            driver,
            traveler: req.user._id,
            driverPhone,
            cabNumber,
            tripId: `TRIP-${Date.now()}`,  // Unique trip ID
            startLocation,
            endLocation,
        });
        await ride.save();
        res.status(201).json(ride);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating ride', error });
    }
};

// Get all rides for an admin or specific rides for a traveler
exports.getRides = async (req, res) => {
    try {
        let rides;
        if (req.user.role === 'Admin') {
            rides = await Ride.find(); // Admin view
        } else {
            rides = await Ride.find({ traveler: req.user._id }); // Traveler view
        }
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rides', error });
    }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
    const { rideId } = req.params;
    const { status } = req.body;
    try {
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        ride.status = status;
        await ride.save();
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ride status', error });
    }
};

exports.updateLocation = async (req, res) => {
    const { rideId } = req.params;
    const { latitude, longitude } = req.body;

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        ride.currentLocation = { latitude, longitude };
        await ride.save();

        // Check if within geofence
        if (isWithinRadius(ride.currentLocation, ride.endLocation)) {
            const geofenceMessage = 'Cab is nearing the destination.';
            
            // Fetch Traveler Companion FCM token (stored previously)
            const companionToken = 'TravelerCompanionFCMToken';  // Replace with actual token

            // Send push notification
            await sendPushNotification(companionToken, geofenceMessage);

            res.json({ message: 'Geofence triggered! Notification sent.' });
        } else {
            res.json({ message: 'Location updated', currentLocation: ride.currentLocation });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
};

exports.getRideByTripId = async (req, res) => {
    const { tripId } = req.body;
    try {
        const ride = await Ride.findOne({ tripId });
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ride', error });
    }
}