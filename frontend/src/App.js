// frontend/src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import CreateRide from "./pages/CreateRide";
import Track from "./pages/TripTracking";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Switch>
        <>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/create-ride" element={<CreateRide />} />
          <Route path="/track" element={<Track />} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
