import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../util/axiosInstance";
import { Chart, registerables } from "chart.js";
import { FooterComponent } from "../../components/footer/Footer";

Chart.register(...registerables);

const { VITE_BASE_URL } = import.meta.env;

const Dashboard = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getComplaints = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await axiosInstance.get(
        `${VITE_BASE_URL}/complaint/get-complaint?user=${userData?._id}`
      );

      if (response?.data?.success) {
        const complaints = response.data.data;

        setTotal(complaints.length);
        setPending(complaints.filter((ele) => ele.status === "pending").length);
        setResolved(complaints.filter((ele) => ele.status === "resolved").length);
        setRejected(complaints.filter((ele) => ele.status === "rejected").length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSessionData = async () => {
    try {
      let response = await axiosInstance.post(
        `${VITE_BASE_URL}/user/validate-session`,
        {}
      );
      if (response.data.data) {
        setUserPoints(response.data.data.points);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComplaints();
    getSessionData();
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Pending", "Resolved", "Rejected"],
          datasets: [
            {
              data: [pending, resolved, rejected],
              backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    }
  }, [pending, resolved, rejected]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Content */}
      <div className="container-fluid mt-4 flex-grow-1">
        <div className="row g-4">
          {/* Cards */}
          <div className="col-xl-3 col-md-6">
            <div className="card text-white h-100 shadow" style={{ background: "linear-gradient(135deg, #17a2b8, #138496)" }}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-subtitle mb-2">Score</h6>
                  <h3 className="card-title">{userPoints}</h3>
                </div>
                <i className="bi bi-star-fill fs-1"></i>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card text-white h-100 shadow" style={{ background: "linear-gradient(135deg, #007bff, #0056b3)" }}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-subtitle mb-2">Total Complaints</h6>
                  <h3 className="card-title">{total}</h3>
                </div>
                <i className="bi bi-list-check fs-1"></i>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card text-white h-100 shadow" style={{ background: "linear-gradient(135deg, #ffc107, #e0a800)" }}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-subtitle mb-2">Pending</h6>
                  <h3 className="card-title">{pending}</h3>
                </div>
                <i className="bi bi-hourglass-split fs-1"></i>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card text-white h-100 shadow" style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-subtitle mb-2">Resolved</h6>
                  <h3 className="card-title">{resolved}</h3>
                </div>
                <i className="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card text-white h-100 shadow" style={{ background: "linear-gradient(135deg, #dc3545, #b02a37)" }}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-subtitle mb-2">Rejected</h6>
                  <h3 className="card-title">{rejected}</h3>
                </div>
                <i className="bi bi-x-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="row mt-5 justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow">
              <div className="card-header bg-white">
                <h6 className="mb-0 text-center">Complaints Status</h6>
              </div>
              <div className="card-body d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
                <canvas ref={chartRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
};

export default Dashboard;
