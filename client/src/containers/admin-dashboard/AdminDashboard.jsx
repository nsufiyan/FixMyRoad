import { useEffect, useState } from "react";
import MapComponent from "../../components/map-component/MapComponent";
import axiosInstance from "../../util/axiosInstance";
import styles from "./AdminDashboard.module.css";

const { VITE_BASE_URL } = import.meta.env;

const AdminDashboard = (props) => {
  const [complaints, setComplaints] = useState([]);
  const initial = [
    {
      id: "a",
      position: { lat: props?.location?.[0], lng: props?.location?.[1] },
      title: "Live",
      description: <u>My Location</u>,
    },
  ];

  const getComplaints = async () => {
    try {
      let response = await axiosInstance.get(
        `${VITE_BASE_URL}/complaint/get-complaint?status=pending`
      );
      setComplaints(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <div className="bg-info h-100 w-100">
      <MapComponent initialMarkers={complaints} location={props?.location} />

    </div>
  );
};

export default AdminDashboard;
