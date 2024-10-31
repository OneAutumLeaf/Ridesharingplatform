import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MapLibre from "maplibre-gl";
import Radar from "radar-sdk-js";
import axios from "axios";
import { circle } from "@turf/turf";
import "maplibre-gl/dist/maplibre-gl.css";

// Initialize Radar with your API key
Radar.initialize("prj_live_pk_62bbb2ba7cc089ea9d9f98dfbf0dd3a3830bfedb");



function TripTracker() {
  const [tripId, setTripId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [travellerLocation, setTravellerLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [travellerMarker, setTravellerMarker] = useState(null);
  const [once, setOnce] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false); 

  const haversineDistance = (coords1, coords2) => {
    const toRadians = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters

    const lat1 = toRadians(coords1.latitude);
    const lon1 = toRadians(coords1.longitude);
    const lat2 = toRadians(coords2.latitude);
    const lon2 = toRadians(coords2.longitude);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const isWithinRadius = (currentLocation, destination, radius = 500) => {
    const distance = haversineDistance(currentLocation, destination);
    return distance <= radius; // Return true if within the radius
  };

  const calculateProximityToEndLocation = async (location) => {
    
    if (travellerLocation) {
      if (isWithinRadius(location, travellerLocation)) {
        console.log("User is within proximity of the end location.");
        // Trigger push notification or any other action here
        if(!hasShownToast){
          toast.success("🚘 Your Ride is now within proximity of your location!. Want to Share?", {
            autoClose: 4000, // duration in milliseconds
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
          });
          setHasShownToast(true);
        }
      } else {
        console.log("User is outside the end location geofence.");
        setHasShownToast(false);
      }
    } else {
      console.log("End location not found.");
    }
  };

  useEffect(() => {
    if (location) {
      calculateProximityToEndLocation(location); // Check proximity whenever location updates
    }
  }, [location]);

  

  useEffect(() => {
    if (location && !map) {
      const mapInstance = new MapLibre.Map({
        container: "map",
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=zOkg5iNOA7kBJR5nnGF7`,
        center: [location.longitude, location.latitude],
        zoom: 5,
      });

      const newMarker = new MapLibre.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(mapInstance);
      const newTravellerMarker = new MapLibre.Marker({
        color: "yellow",
      })
        .setLngLat([travellerLocation.longitude, travellerLocation.latitude])
        .addTo(mapInstance);

      setMarker(newMarker);
      setTravellerMarker(newTravellerMarker);
      setMap(mapInstance);
    }
  }, [location]);

  useEffect(() => {
    if (tracking) {
      const interval = setInterval(() => {
        Radar.trackOnce()
          .then((result) => {
            const { location } = result;
            if (location) {
              setLocation(location);
              if (marker) {
                marker.setLngLat([location.longitude, location.latitude]);
              }
              if (map && !once) {
                setOnce(true);
                map.flyTo({
                  center: [location.longitude, location.latitude],
                  zoom: 5,
                });
              }
            }
          })
          .catch((err) => console.error("Error tracking location:", err));
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [tracking, map, marker]);

  useEffect(() => {
    if (tracking && tripId && map && travellerLocation) {
      map.on("load", () => {
        const radiusCenter = [
          travellerLocation.longitude,
          travellerLocation.latitude,
        ];
        const radius = 100;
        const options = { steps: 64, units: "kilometers" };
        const circleDrawn = circle(radiusCenter, radius, options);

        if (!map.getSource("location-radius")) {
          map.addSource("location-radius", {
            type: "geojson",
            data: circleDrawn,
          });
          map.addLayer({
            id: "location-radius",
            type: "fill",
            source: "location-radius",
            paint: { "fill-color": "#8CCFFF", "fill-opacity": 0.5 },
          });
          map.addLayer({
            id: "location-radius-outline",
            type: "line",
            source: "location-radius",
            paint: { "line-color": "#0094ff", "line-width": 3 },
          });
        } else {
          map.getSource("location-radius").setData(circleDrawn);
        }
      });
    }
  }, [tracking, tripId, map, travellerLocation]);

  useEffect(() => {
    if (tracking && tripId) {
      try {
        const interval = setInterval(async () => {
          const { data } = await axios.post(
            `http://localhost:5000/api/rides`,
            { tripId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (data) {
            setTravellerLocation(data.endLocation);
            if (travellerMarker) {
              travellerMarker.setLngLat([
                travellerLocation.longitude,
                travellerLocation.latitude,
              ]);
            }
          }
        }, 15000);

        return () => clearInterval(interval);
      } catch (e) {
        console.error(e);
      }
    }
  }, [tracking, map, travellerMarker]);

  const handleStartTracking = () => {
    if (tripId) {
      setTracking(true);
      console.log(`Started tracking for Trip ID: ${tripId}`);
    }

    

  };


  return (
    <div className="trip-tracker-container">
      <div className="trip-tracker-card">
        <h2>Track Your Trip</h2>
        <input
          type="text"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          placeholder="Enter Trip ID"
          className="trip-input"
        />
        <button
          onClick={handleStartTracking}
          disabled={!tripId || tracking}
          className="start-button"
        >
          Start Tracking
        </button>
        <div id="map" className="map-container">
          {location ? (
            <p className="location-info">
              Current Location: {location.latitude.toFixed(5)},{" "}
              {location.longitude.toFixed(5)}
            </p>
          ) : (
            <p className="location-info">Location not available</p>
          )}
        </div>
        <ToastContainer />
      </div>

      <style>{`
                .trip-tracker-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 96vh;
                    background-color: #f9fafb;
                    padding: 10px;
                }

                .trip-tracker-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    width: 100%;
                    max-width: 550px;
                    padding: 24px;
                    text-align: center;
                }

                h2 {
                    font-size: 24px;
                    color: #111827;
                    font-weight: 700;
                    margin-bottom: 16px;
                }

                .trip-input {
                    width: 520px;
                    padding: 8px 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #374151;
                    margin-bottom: 16px;
                    transition: all 0.15s ease;
                }

                .trip-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
                }

                .start-button {
                    width: 100%;
                    padding: 8px 16px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .start-button:hover {
                    background-color: #2563eb;
                }

                .start-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
                }

                .map-container {
                    width: 550px;
                    height: 430px;
                    margin-top: 20px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                }

                .location-info {
                    font-size: 14px;
                    color: #6b7280;
                    margin-top: 8px;
                }
            `}</style>
    </div>
  );
}

export default TripTracker;

// import React, { useState, useEffect } from "react";
// import MapLibre from "maplibre-gl";
// import Radar from "radar-sdk-js";
// import axios from "axios";
// import { circle } from "@turf/turf";
// import "maplibre-gl/dist/maplibre-gl.css";

// // Initialize Radar with your API key
// Radar.initialize("prj_live_pk_62bbb2ba7cc089ea9d9f98dfbf0dd3a3830bfedb");

// function TripTracker() {
//     const [tripId, setTripId] = useState("");
//     const [tracking, setTracking] = useState(false);
//     const [location, setLocation] = useState(null);
//     const [travellerLocation, setTravellerLocation] = useState(null);
//     const [map, setMap] = useState(null);
//     const [marker, setMarker] = useState(null);
//     const [travellerMarker, setTravellerMarker] = useState(null);
//     const [once, setOnce] = useState(false);

//     // Initialize map when location updates
//     useEffect(() => {
//         if (location && !map) {
//             const mapInstance = new MapLibre.Map({
//                 container: "map",
//                 style: `https://api.maptiler.com/maps/streets-v2/style.json?key=zOkg5iNOA7kBJR5nnGF7`, // Use MapLibre style
//                 center: [location.longitude, location.latitude],
//                 zoom: 5,
//             });

//             // Add user location marker
//             const newMarker = new MapLibre.Marker()
//                 .setLngLat([location.longitude, location.latitude])
//                 .addTo(mapInstance);
//             const newTravellerMarker = new MapLibre.Marker({
//                color: "yellow"
//             })
//                 .setLngLat([
//                     travellerLocation.longitude,
//                     travellerLocation.latitude,
//                 ])
//                 .addTo(mapInstance);
//             setMarker(newMarker);
//             setTravellerMarker(newTravellerMarker);
//             setMap(mapInstance);
//         }
//     }, [location]);

//     // Track location once when tracking is enabled
//     useEffect(() => {
//         if (tracking) {
//             const interval = setInterval(() => {
//                 Radar.trackOnce()
//                     .then((result) => {
//                         const { location } = result;
//                         if (location) {
//                             setLocation(location);
//                             // Update marker position
//                             if (marker) {
//                                 marker.setLngLat([
//                                     location.longitude,
//                                     location.latitude,
//                                 ]);
//                             }
//                             // Update map position
//                             if (map && !once) {
//                                 setOnce(true);

//                             }
//                         }
//                     })
//                     .catch((err) =>
//                         console.error("Error tracking location:", err)
//                     );
//             }, 15000); // Poll every 5 seconds

//             return () => clearInterval(interval);
//         }
//     }, [tracking, map, marker]);

//     useEffect(() => {
//         if (tracking && tripId && map && travellerLocation) {
//             // Ensure the circle only gets drawn once on map load
//             map.on("load", () => {
//                 const radiusCenter = [
//                     travellerLocation.longitude,
//                     travellerLocation.latitude,
//                 ];
//                 const radius = 100; // kilometers
//                 const options = { steps: 64, units: "kilometers" };
//                 const circleDrawn = circle(radiusCenter, radius, options);

//                 if (!map.getSource("location-radius")) {
//                     map.addSource("location-radius", {
//                         type: "geojson",
//                         data: circleDrawn,
//                     });
//                     map.addLayer({
//                         id: "location-radius",
//                         type: "fill",
//                         source: "location-radius",
//                         paint: { "fill-color": "#8CCFFF", "fill-opacity": 0.5 },
//                     });
//                     map.addLayer({
//                         id: "location-radius-outline",
//                         type: "line",
//                         source: "location-radius",
//                         paint: { "line-color": "#0094ff", "line-width": 3 },
//                     });
//                 } else {
//                     // Update the source data if it already exists
//                     map.getSource("location-radius").setData(circleDrawn);
//                 }
//             });
//         }
//     }, [tracking, tripId, map, travellerLocation]);

//     // Track the location fetched from the database as well
//     useEffect(() => {
//         if (tracking && tripId) {
//             try {
//                 const interval = setInterval(async () => {
//                     const { data } = await axios.post(
//                         `http://localhost:5000/api/rides`,
//                         {
//                             tripId,
//                         },
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${localStorage.getItem(
//                                     "token"
//                                 )}`,
//                             },
//                         }
//                     );
//                     if (data) {
//                         setTravellerLocation(data.endLocation);
//                         if (travellerMarker) {
//                             travellerMarker.setLngLat([
//                                 travellerLocation.longitude,
//                                 travellerLocation.latitude,
//                             ]);

//                             const radiusCenter = [
//                                 travellerLocation.longitude,
//                                 travellerLocation.latitude,
//                             ];
//                         }
//                     }
//                 }, 15000); // Poll every 5 seconds

//                 return () => clearInterval(interval);
//             } catch (e) {
//                 console.error(e);
//             }
//         }
//     }, [tracking, map, travellerMarker]);

//     // Start tracking on trip ID submission
//     const handleStartTracking = () => {
//         if (tripId) {
//             setTracking(true);
//             console.log(`Started tracking for Trip ID: ${tripId}`);
//         }
//     };

//     return (
//         <div style={{ textAlign: "center" }}>
//             <h2>Track Your Trip</h2>
//             <input
//                 type="text"
//                 value={tripId}
//                 onChange={(e) => setTripId(e.target.value)}
//                 placeholder="Enter Trip ID"
//             />
//             <button
//                 onClick={handleStartTracking}
//                 disabled={!tripId || tracking}
//             >
//                 Start Tracking
//             </button>
//             <div
//                 id="map"
//                 style={{
//                     width: "100%",
//                     height: "400px",
//                     marginTop: "20px",
//                     border: "1px solid #ccc",
//                 }}
//             >
//                 {location ? (
//                     <p>
//                         Current Location: {location.latitude.toFixed(5)},{" "}
//                         {location.longitude.toFixed(5)}
//                     </p>
//                 ) : (
//                     <p>Location not available</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default TripTracker;
