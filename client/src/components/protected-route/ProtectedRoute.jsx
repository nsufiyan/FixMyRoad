import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../util/axiosInstance";

const { VITE_BASE_URL } = import.meta.env;

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkSession = async () => {
    try {
      let response = await axiosInstance.post(
        `${VITE_BASE_URL}/user/validate-session`,
        {}
      );
      if (!response?.data?.success) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkSession();
  }, [location.pathname]);
  return <Outlet />;
};

export default ProtectedRoute;
