import { useState } from "react";
import { useNavigate } from "react-router-dom";
import extractFormData from "../../util/formUtil";
import axiosInstance from "../../util/axiosInstance";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
const { VITE_BASE_URL } = import.meta.env;
import './login.css'




export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [shake, setShake] = useState(false); // NEW state for shake animation

  const handleClose = () => {
    setShow(!show);
  };

  const resetPassword = async (e) => {
    try {
      e.preventDefault();
      let data = {};
      let formData = new FormData(e.target);
      for (let [key, values] of formData) {
        data[key] = values;
      }

      const response = await axiosInstance.put(
        `${VITE_BASE_URL}/user/reset-password?email=${data.email}`,
        data
      );

      if (response?.data?.data) {
        setToastMsg(response?.data?.message || "Password reset successful");
        setShowToast(true);
        setShow(false);
      } else {
        setToastMsg("Invalid email");
        setShowToast(true);
      }
    } catch (err) {
      console.log(err);
      setToastMsg("Something went wrong");
      setShowToast(true);
    }
  };

  const onFormSubmit = async (event) => {
    try {
      event.preventDefault();
      let data = extractFormData(event.target);

      let response = await axiosInstance.post(
        `${VITE_BASE_URL}/user/login`,
        data
      );

      if (response?.data?.success) {
        alert(response?.data?.message);

        localStorage.setItem("userData", JSON.stringify(response.data.data));
        if (response.data.data.userType === "admin") {
          navigate("/dashboard/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setToastMsg(response?.data?.message);
        setShowToast(true);

        // Trigger shake
        setShake(true);
        setTimeout(() => setShake(false), 500); // remove shake after animation
      }
    } catch (error) {
      console.log(error);
      setToastMsg("Something went wrong");
      setShowToast(true);

      // Trigger shake
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="background-img d-flex justify-content-center align-items-center vh-100 login-page">
      {/* Bootstrap Toast */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="danger"
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </div>

      <div
        className={`container p-0 shadow-lg rounded-4 overflow-hidden animate-container ${shake ? "shake" : ""
          }`}
        style={{ maxWidth: "900px" }}
      >
        <div className="row g-0">
          {/* LEFT PANEL */}
          <div className="fixmyroad-logo">🛣 FixMyRoad</div>

          <div
            className="col-md-6 d-flex flex-column justify-content-center text-white p-5 left-panel position-relative"
            style={{
              background: "linear-gradient(135deg, #0f2a44, #1e5aa8)",
            }}
          >
            <h2 className="fw-bold mb-3 animate-fade-up">
              Help Improve Our Roads
            </h2>

            <p className="mb-4 animate-fade-up delay-1">
              Spot a pothole? Report it, track it, and make a difference.
            </p>

            <p className="animate-fade-up delay-2 mb-2">New to FixMyRoad?</p>

            <button
              className="btn btn-outline-light px-4 signup-btn animate-pulse"
              onClick={() => navigate("/signup")}
              type="button"
            >
              <i className="bi bi-geo-alt-fill me-2"></i>
              Report Your First Issue
            </button>

            <div className="road-line-login"></div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-md-6 bg-white p-5 right-panel">
            <h3 className="fw-bold mb-4 text-center animate-fade-down">LOGIN</h3>

            <form onSubmit={onFormSubmit} className="animate-fade-in delay-1">
              <div className="form-floating mb-3 animated-input">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="Phone or Email"
                  required
                />
                <label htmlFor="phone">
                  <i className="bi bi-telephone-fill"></i> Registered Mobile
                </label>
              </div>

              <div className="form-floating mb-2 position-relative animated-input">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <label htmlFor="password">
                  <i className="bi bi-lock-fill"></i> Password
                </label>

                <i
                  className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                    } password-eye`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              <div className="d-flex justify-content-end mb-3">
                <a
                  className="text-decoration-none small cursor"
                  role="button"
                  onClick={() => setShow(true)}
                  style={{ color: "grey" }}
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white login-btn"
                style={{ background: "#1e40ff" }}
              >
                LOGIN
              </button>

              <p className="text-center text-muted mt-3 small">
                🔒 Your information is securely protected
              </p>
            </form>
          </div>
        </div>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} animation size="md">
          <Modal.Header closeButton>
            <span className="text-dark h5">Reset Password</span>
          </Modal.Header>

          <form onSubmit={resetPassword}>
            <Modal.Body>
              <div className="form-floating mb-3 animated-input">
                <input
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  required
                />
                <label>
                  <i className="bi bi-envelope-at-fill"></i> Registered Email
                </label>
              </div>

              <div className="form-floating mb-3 position-relative animated-input">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  placeholder="New Password"
                  required
                />
                <label>
                  <i className="bi bi-lock-fill"></i> New Password
                </label>

                <i
                  className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                    } password-eye`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button className="btn btn-primary w-100" type="submit">
                Reset Password
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </div>
  );
}