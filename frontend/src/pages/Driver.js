import React, { useEffect } from 'react';
import axios from 'axios';

const Driver = ({ rideId }) => {
    const updateLocation = async (latitude, longitude) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            await axios.put(`http://localhost:5000/api/rides/${rideId}/location`, { latitude, longitude }, config);
        } catch (error) {
            console.error('Location update failed:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            // Get current location (use navigator.geolocation in a real app)
            const latitude = 6;
            const longitude = 6;
            updateLocation(latitude, longitude);
        }, 5000);  // Update every 5 seconds

        return () => clearInterval(interval);  // Clear interval on component unmount
    }, []);

    return <div>Driver Location Tracking Active</div>;
};

export default Driver;
