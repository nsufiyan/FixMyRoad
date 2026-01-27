import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./containers/login/Login";
import Signup from "./containers/signup/Signup";
import Dashbaord from "./containers/dashboard/Dashbaord";
import MainLayout from "./components/main-layout/MainLayout";
import Profile from "./containers/profile/Profile";
import Requests from "./containers/requests/Requests";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import AdminDashboard from "./containers/admin-dashboard/AdminDashboard";
import { ContactUs } from "./containers/contact-us/ContactUs";
import { Guide } from "./containers/guide/Guide";
import RoadSafetyTips from "./containers/roadtip/RoadSafetyTips";
import { FAQ } from "./containers/faq/Faq";

import Errorpage from "./containers/error/Error";
import "./App.css";

function App() {
  const [location, setLocation] = useState([0.0, 0.0]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");

      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation([latitude, longitude]);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");

              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");

              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");

              break;
            default:
              console.log("An unknown error occurred.");

              break;
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Dashbaord />} />
            <Route
              path="/dashboard/admin-dashboard"
              element={<AdminDashboard location={location} />}
            />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route
              path="/dashboard/requests"
              element={<Requests location={location} />}
            />
            <Route path="/dashboard/contactus" element={<ContactUs />} />
            <Route path="/dashboard/FAQ" element={<FAQ />} />
            <Route path="/dashboard/Guide" element={<Guide />} />
            <Route path="/dashboard/roadSafety" element={<RoadSafetyTips />} />
            <Route path="*" element={<Errorpage />}></Route>
          </Route>

        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
