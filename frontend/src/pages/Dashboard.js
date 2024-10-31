import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:5000/api/rides",
          config
        );
        setRides(data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="main-container">
      <button className="signout-button" onClick={handleSignOut}>
        Sign Out
      </button>

      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Your Rides</h2>
            <Link to="/create-ride">
              <button className="create-button">Create New Ride</button>
            </Link>
            <Link to="/track">
              <button className="track-button">Track Ride</button>
            </Link>
          </div>

          <div className="rides-list">
            {rides.length > 0 ? (
              rides.map((ride) => (
                <div key={ride._id} className="ride-card">
                  <p>
                    <strong>Trip ID:</strong> {ride.tripId}
                  </p>
                  <p>
                    <strong>Driver:</strong> {ride.driver}
                  </p>
                  <p>
                    <strong>Cab Number:</strong> {ride.cabNumber}
                  </p>
                  <p>
                    <strong>Status:</strong> {ride.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-rides">No rides available.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`

              .main-container{
                 background-color: #f9fafb;
              }
                .dashboard-container {
                    display: flex;
                    flex-direction:column;
                    align-items: center;
                    // justify-content: center;
                    min-height: 90vh;
                    background-color: #f9fafb;
                    padding: 10px;
                    
                }

                .dashboard-card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    width: 100%;
                    max-width: 600px;
                    padding: 24px;
                    margin-top:50px;
                }

                .card-header {
                    display: flex;
                    // justify-content:space-around;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .card-header h2 {
                    margin: 10px;
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                }

                .create-button {
                    padding: 8px 16px;
                    margin-left:200px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .create-button:hover {
                    background-color: #2563eb;
                }

                .create-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
                }
                .track-button {
                    padding: 8px 22px;
                    margin-left:10px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .track-button:hover {
                    background-color: #2563eb;
                }

                .track-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
                }
                
                .signout-button {
                    padding: 8px 16px;
                    margin-top:10px;
                    margin-bottom:5px;
                    margin-left:1380px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .signout-button:hover {
                    background-color: #2563eb;
                }

                .signout-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #3b82f6;
                }

                .rides-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .ride-card {
                    background-color: #f3f4f6;
                    border-radius: 6px;
                    padding: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .ride-card p {
                    margin: 4px 0;
                    color: #374151;
                    font-size: 15px;
                }

                .ride-card p strong {
                    color: #111827;
                }

                .no-rides {
                    color: #6b7280;
                    font-size: 14px;
                    text-align: center;
                    margin-top: 20px;
                }

                @media (max-width: 640px) {
                    .dashboard-card {
                        margin: 0 16px;
                    }
                }
            `}</style>
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//     const [rides, setRides] = useState([]);

//     useEffect(() => {
//         const fetchRides = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 };
//                 const { data } = await axios.get('http://localhost:5000/api/rides', config);
//                 setRides(data);
//             } catch (error) {
//                 console.error('Error fetching rides:', error);
//             }
//         };
//         fetchRides();
//     }, []);

//     return (
//         <div>
//             <h2>Your Rides</h2>
//             <Link to="/create-ride">
//                 <button>Create New Ride</button>
//             </Link>
//             <ul>
//                 {rides.map((ride) => (
//                     <li key={ride._id}>
//                         <p>Trip ID: {ride.tripId}</p>
//                         <p>Driver: {ride.driver}</p>
//                         <p>Cab Number: {ride.cabNumber}</p>
//                         <p>Status: {ride.status}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Dashboard;
