// frontend/src/pages/TravelerCompanion.js
import React, { useEffect, useState } from 'react';

const TravelerCompanion = () => {
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Connect to the WebSocket server
        const ws = new WebSocket('ws://localhost:5000');

        // Listen for messages from the server
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.message) {
                setNotification(message.message);
            }
        };

        // Clean up WebSocket connection on component unmount
        return () => ws.close();
    }, []);

    return (
        <div>
            <h2>Traveler Companion Dashboard</h2>
            {notification && <p>{notification}</p>}
        </div>
    );
};

export default TravelerCompanion;
