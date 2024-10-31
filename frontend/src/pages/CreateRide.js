import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import Radar from "radar-sdk-js";
import axios from "axios";
import emailjs from '@emailjs/browser';

Radar.initialize("prj_live_pk_62bbb2ba7cc089ea9d9f98dfbf0dd3a3830bfedb");
emailjs.init("r1fW0MTiQI23ByQic");

const CreateRide = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [cabNumber, setCabNumber] = useState("");
  const [startLocationName, setStartLocationName] = useState("");
  const [endLocationName, setEndLocationName] = useState("");
  const [message, setMessage] = useState("");

  const fetchCoordinates = async (locationName) => {
    try {
      const loc = await Radar.autocomplete({
        query: locationName,
        limit: 1,
      });
      return {
        latitude: loc.addresses[0].latitude,
        longitude: loc.addresses[0].longitude,
      };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { latitude: "", longitude: "" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startCoords = await fetchCoordinates(startLocationName);
      const endCoords = await fetchCoordinates(endLocationName);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const rideData = {
        driver,
        driverPhone,
        cabNumber,
        startLocation: startCoords,
        endLocation: endCoords,
      };
    

      const { data } = await axios.post(
        "http://localhost:5000/api/rides/create",
        rideData,
        config
      );
      setMessage("Ride created successfully!");
      emailjs
      .send(
        "service_4djdxz9", // Replace with your EmailJS service ID
        "template_wwf3c28", // Replace with your EmailJS template ID
        rideData, // Replace with your
        "r1fW0MTiQI23ByQic" // Replace with your EmailJS user ID
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          setMessage("Ride shared successfully via email!");
        },
        (error) => {
          console.error("Email error:", error.text);
          setMessage("Error sharing ride.");
        }
      );

      navigate("/");
    } catch (error) {
      setMessage("Error creating ride.");
      console.error("Ride creation error:", error);
    }
  };
  // const handleShareRide = (dataparam) => {
    

  //   emailjs
  //     .send(
  //       "service_4djdxz9", // Replace with your EmailJS service ID
  //       "template_wwf3c28", // Replace with your EmailJS template ID
  //       dataparam,
  //       "r1fW0MTiQI23ByQic" // Replace with your EmailJS user ID
  //     )
  //     .then(
  //       (result) => {
  //         console.log("Email sent:", result.text);
  //         setMessage("Ride shared successfully via email!");
  //       },
  //       (error) => {
  //         console.error("Email error:", error.text);
  //         setMessage("Error sharing ride.");
  //       }
  //     );
  // };


  return (
    <div className="create-ride-container">
      <div className="create-ride-card">
        <h2>Create a New Ride</h2>
        <form onSubmit={handleSubmit} >
          <input
            type="text"
            placeholder="Driver Name"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Driver Phone"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            value={cabNumber}
            onChange={(e) => setCabNumber(e.target.value)}
            required
          />

          <h3>Start Location</h3>
          <input
            type="text"
            placeholder="Location Name"
            value={startLocationName}
            onChange={(e) => setStartLocationName(e.target.value)}
            required
          />

          <h3>End Location</h3>
          <input
            type="text"
            placeholder="Location Name"
            value={endLocationName}
            onChange={(e) => setEndLocationName(e.target.value)}
            required
          />

          <div className="submit-button">
          <button type="submit" className="submit-button1">
            Create Ride
          </button>
          <button type="submit" className="submit-button2">
           Share Ride
          </button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>

      <style>{`
        .create-ride-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 96vh;
          background-color: #f9fafb;
          padding: 10px;
        }

        .create-ride-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 100%;
          max-width: 400px;
          padding: 24px;
          text-align: center;
        }

        h2 {
          font-size: 24px;
          color: #111827;
          font-weight: 700;
          margin-bottom: 25px;
        }

        h3 {
          font-size: 16px;
          color: #6b7280;
          margin-top: 10px;
          margin-bottom: 8px;
          text-align: left;
        }

        input {
          min-width: 370px;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          line-height: 20px;
          color: #374151;
          margin-bottom: 16px;
          transition: all 0.15s ease;
        }

        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        input::placeholder {
          color: #9ca3af;
        }

        .submit-button {
          width: 100%;
          display:flex;
          flex-direction: row;
          align-items: center;
          justify-content:space-between;
          //padding: 8px 16px;
          // background-color: #3b82f6;
          // color: white;
          // border: none;
          // border-radius: 6px;
          // font-size: 14px;
          // font-weight: 500;
          // cursor: pointer;
          // transition: background-color 0.15s ease;
        }

        // .submit-button:hover {
        //   background-color: #2563eb;
        // }

        // .submit-button:focus {
        //   outline: none;
        //   box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
        // }
          .submit-button1 {
          width: 30%;
          margin-left:70px;
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

        .submit-button1:hover {
          background-color: #2563eb;
        }

        .submit-button1:focus {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
        }
          .submit-button2 {
          margin-right: 70px;
          width: 30%;
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

        .submit-button2:hover {
          background-color: #2563eb;
        }

        .submit-button2:focus {
          outline: none;
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
        }


        .message {
          margin-top: 16px;
          font-size: 14px;
          color: #10b981;
        }

        @media (max-width: 640px) {
          .create-ride-card {
            margin: 0 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateRide;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Radar from "radar-sdk-js";
// import "radar-sdk-js/dist/radar.css";
// import axios from "axios";
// Radar.initialize("prj_live_pk_62bbb2ba7cc089ea9d9f98dfbf0dd3a3830bfedb");

// const CreateRide = () => {
//   const navigate = useNavigate();
//   const [driver, setDriver] = useState("");
//   const [driverPhone, setDriverPhone] = useState("");
//   const [cabNumber, setCabNumber] = useState("");
//   const [startLocationName, setStartLocationName] = useState("");
//   const [endLocationName, setEndLocationName] = useState("");
//   const [tripId, setTripId] = useState("");
//   const [traveler, setTraveler] = useState(""); // Traveler ID
//   const [startLocation, setStartLocation] = useState({
//     latitude: "",
//     longitude: "",
//   });
//   const [endLocation, setEndLocation] = useState({
//     latitude: "",
//     longitude: "",
//   });
//   const [message, setMessage] = useState("");

//   const fetchCoordinates = async (locationName) => {
//     try {
//       const loc = await Radar.autocomplete({
//         query: locationName,
//         limit: 1,
//       });
//       return {
//         latitude: loc.addresses[0].latitude,
//         longitude: loc.addresses[0].longitude,
//       };
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       return { latitude: "", longitude: "" };
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const startCoords = await fetchCoordinates(startLocationName);
//       const endCoords = await fetchCoordinates(endLocationName);

//       const token = localStorage.getItem("token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const rideData = {
//         driver,
//         driverPhone,
//         cabNumber,
//         startLocation: startCoords,
//         endLocation: endCoords,
//       };

//       const { data } = await axios.post(
//         "http://localhost:5000/api/rides/create",
//         rideData,
//         config
//       );
//       setMessage("Ride created successfully!");

//       Radar.trackOnce()
//         .then(async (result) => {
//           const { location, user, events } = result;

//           console.log(location);
//           if (location) {
//             try {
//               // Post the location to the backend
//               const token = localStorage.getItem("token");
//               const config = {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               };
//               const response = await axios.put(
//                 `http://localhost:5000/api/rides/${data._id}/location`,
//                 location,
//                 config
//               );
//               console.log("Location posted:", response.data);
//             } catch (error) {
//               console.error("Error posting location:", error);
//             }
//           } else {
//             console.error("Geolocation is not supported by this browser.");
//           }
//         })
//         .catch((err) => {
//           // handle error
//         });
//       navigate("/");
//     } catch (error) {
//       setMessage("Error creating ride.");
//       console.error("Ride creation error:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Create a New Ride</h2>
//       <input
//         type="text"
//         placeholder="Driver"
//         value={driver}
//         onChange={(e) => setDriver(e.target.value)}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Driver Phone"
//         value={driverPhone}
//         onChange={(e) => setDriverPhone(e.target.value)}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Cab Number"
//         value={cabNumber}
//         onChange={(e) => setCabNumber(e.target.value)}
//         required
//       />

//       <h3>Start Location</h3>
//       <input
//         type="text"
//         placeholder="Location Name"
//         value={startLocationName}
//         onChange={(e) => setStartLocationName(e.target.value)}
//         required
//       />

//       <h3>End Location</h3>
//       <input
//         type="text"
//         placeholder="Location Name"
//         value={endLocationName}
//         onChange={(e) => setEndLocationName(e.target.value)}
//         required
//       />

//       <button type="submit">Create Ride</button>
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default CreateRide;